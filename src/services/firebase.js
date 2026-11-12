import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Default / Environment-based Firebase configuration
const getStoredConfig = () => {
  try {
    const custom = localStorage.getItem('iic_custom_firebase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.projectId) return parsed;
    }
  } catch (e) {
    console.warn('Could not read stored Firebase config', e);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAMgzULvRF-gUBH0mC710y2Ne8Sy4kVh0U',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'iic-expense-tracker.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'iic-expense-tracker',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'iic-expense-tracker.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '47002743440',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:47002743440:web:c9d5e3fe9ff7c321d4de15',
  };
};

let currentConfig = getStoredConfig();

export const isFirebaseConfigured = () => {
  return Boolean(
    currentConfig &&
    currentConfig.projectId &&
    currentConfig.apiKey &&
    currentConfig.projectId !== 'YOUR_PROJECT_ID'
  );
};

// Initialize Firebase App
let app = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = !getApps().length ? initializeApp(currentConfig) : getApp();
    db = getFirestore(app);
    console.info('Firebase Firestore initialized successfully with project:', currentConfig.projectId);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp };

export const getActiveFirebaseConfig = () => currentConfig;

export const saveCustomFirebaseConfig = (newConfig) => {
  try {
    localStorage.setItem('iic_custom_firebase_config', JSON.stringify(newConfig));
    currentConfig = newConfig;
    if (newConfig.projectId && newConfig.apiKey) {
      app = initializeApp(newConfig, `iic-app-${Date.now()}`);
      db = getFirestore(app);
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem('iic_custom_firebase_config');
  currentConfig = getStoredConfig();
};

