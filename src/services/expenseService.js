import {
  db,
  isFirebaseConfigured,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from './firebase';
import { INITIAL_SAMPLE_RECORDS } from '../utils/constants';

const COLLECTION_NAME = 'iic_reinvestments';
const LOCAL_STORAGE_KEY = 'iic_reinvestments_local_data';

// Helper to get local data
const getLocalRecords = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local records:', err);
  }
  // Initialize with initial sample records
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RECORDS));
  return INITIAL_SAMPLE_RECORDS;
};

// Helper to save local data
const saveLocalRecords = (records) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving local records:', err);
  }
};

/**
 * Fetch all reinvestment documents
 */
export async function fetchReinvestments() {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('eventDate', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          // Format date or timestamp nicely
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        };
      });

      if (items.length > 0) {
        // Also keep local storage warm as offline fallback
        saveLocalRecords(items);
        return { source: 'firestore', data: items };
      }
    } catch (error) {
      console.warn('Firestore fetch failed, falling back to local storage:', error.message);
    }
  }

  // Fallback to localStorage data
  const local = getLocalRecords();
  return { source: 'local', data: local };
}

/**
 * Add a new reinvestment document
 */
export async function createReinvestment(itemData) {
  const formattedData = {
    reinvestmentNumber: itemData.reinvestmentNumber.trim(),
    eventDate: itemData.eventDate,
    facultyName: itemData.facultyName.trim(),
    resourcePerson: itemData.resourcePerson.trim(),
    eventTitle: itemData.eventTitle.trim(),
    amount: Number(itemData.amount) || 0,
    category: itemData.category,
    createdAt: new Date().toISOString(),
  };

  let firestoreId = null;

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...formattedData,
        createdAt: serverTimestamp(),
      });
      firestoreId = docRef.id;
    } catch (error) {
      console.warn('Firestore addDoc error, saving locally:', error);
    }
  }

  // Also update local storage
  const localList = getLocalRecords();
  const newRecord = {
    ...formattedData,
    id: firestoreId || `local-${Date.now()}`,
  };
  const updatedList = [newRecord, ...localList];
  saveLocalRecords(updatedList);

  return newRecord;
}

/**
 * Update a reinvestment document
 */
export async function updateReinvestment(id, updatedFields) {
  if (isFirebaseConfigured() && db && !id.startsWith('local-') && !id.startsWith('sample-')) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updatedFields);
    } catch (error) {
      console.warn('Firestore updateDoc error:', error);
    }
  }

  // Update local storage
  const localList = getLocalRecords();
  const updatedList = localList.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
  saveLocalRecords(updatedList);
  return true;
}

/**
 * Delete a reinvestment document
 */
export async function deleteReinvestment(id) {
  if (isFirebaseConfigured() && db && !id.startsWith('local-') && !id.startsWith('sample-')) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.warn('Firestore deleteDoc error:', error);
    }
  }

  // Update local storage
  const localList = getLocalRecords();
  const filtered = localList.filter((item) => item.id !== id);
  saveLocalRecords(filtered);
  return true;
}

/**
 * Populate sample data to Firestore
 */
export async function seedSampleDataToFirestore() {
  if (!isFirebaseConfigured() || !db) {
    saveLocalRecords(INITIAL_SAMPLE_RECORDS);
    return { count: INITIAL_SAMPLE_RECORDS.length, target: 'local' };
  }

  let count = 0;
  for (const item of INITIAL_SAMPLE_RECORDS) {
    const { id, ...dataToSave } = item;
    await addDoc(collection(db, COLLECTION_NAME), {
      ...dataToSave,
      createdAt: serverTimestamp(),
    });
    count++;
  }
  return { count, target: 'firestore' };
}

/**
 * Generate next reinvestment code
 */
export function generateNextReinvestmentNumber(records = []) {
  const year = new Date().getFullYear();
  const prefix = `IIC-REV-${year}-`;

  let maxNum = 0;
  records.forEach((r) => {
    if (r.reinvestmentNumber && r.reinvestmentNumber.startsWith(prefix)) {
      const numPart = parseInt(r.reinvestmentNumber.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  });

  const nextNum = (maxNum + 1).toString().padStart(3, '0');
  return `${prefix}${nextNum}`;
}

