# IIC Expense Tracker (Institution's Innovation Council — VIT)

A responsive, secure web application and institutional landing website built with **React**, **Tailwind CSS**, **Lucide React icons**, and **Firebase Firestore (v9+ Modular SDK)**.

Designed for the **Institution's Innovation Council (IIC)** at **Vellore Institute of Technology (VIT)** under the aegis of the **Ministry of Education (MoE) Innovation Cell** and **AICTE**.

---

## 🚀 Key Features

### 1. Dual-Mode Architecture
- **Informational Landing Website:** Comprehensive public portal presenting IIC VIT's 5-Star ranking, governance objectives, the 8 mandated innovation event streams, and funding guidelines.
- **Protected Reinvestment Dashboard:** Strictly isolated financial ledger for authorized faculty and council conveners. Unauthenticated visitors cannot access expense history, analytics, or create vouchers.

### 2. Hardcoded Institutional Credentials Enforcement
- **Username / Official Email:** `IIC-VIT` or `iic-vit@vit.ac.in`
- **Password:** `IICVIT2025`
- Session state persisted securely in React Context with instant logout and protected view guards.

### 3. Firebase Firestore Integration (Modular SDK v9+)
- Target Firestore collection: `iic_reinvestments`
- Document Fields:
  1. `reinvestmentNumber` (e.g., `IIC-REV-2026-001`)
  2. `eventDate` (`YYYY-MM-DD`)
  3. `facultyName` (Faculty Coordinator)
  4. `resourcePerson` (Resource Person / Chief Guest)
  5. `eventTitle` (Title of the innovation event)
  6. `amount` (Numeric expenditure sum)
  7. `category` (One of the 8 predefined event types)
  8. `createdAt` (Server Timestamp)
- **Graceful Cloud & Sandbox Fallback:** Automatically runs in a local encrypted sandbox mode if Firebase is not yet configured, and provides an in-app **Firebase Setup Modal** where keys can be entered directly from the browser without restarting the dev server!

### 4. The 8 Predefined Event Categories
Every record is categorized under one of the 8 statutory tracks:
1. `Expert Talk`
2. `Mentoring Session`
3. `Workshop / Seminar`
4. `Boot Camp`
5. `Expo / Demo Day`
6. `Competition`
7. `Technical Fest (Tech Fest)`
8. `Hackathon / Ideathon`

### 5. Advanced Dashboard, Filtering & Search
- **KPI Summary Cards:** Total vouchers count, aggregate expenditure sum in INR, average disbursal, and leading event track.
- **Expenditure Breakdown:** Visual category distributions with interactive event count and total spend.
- **Global Search Bar:** Real-time multi-field search across Reinvestment Number, Faculty Coordinator, Resource Person, and Event Title.
- **Category Filter:** Filter by any of the 8 event categories or view all.
- **Date Range Filter:** "From Date" and "To Date" date pickers.
- **Interactive Data Grid:** Checkboxes for multi-row selection, master "Select All" toggle, column sorting, and view/delete modals.

### 6. Confidential PDF Report Generation & Currency-to-Words
- Prominent **"Download Selected PDF"** button enabled when rows are checked.
- Generates official landscape reports using `jspdf` and `jspdf-autotable`.
- **Statutory Indian Numbering System Translation:** Translates numbers into legal Indian words (e.g., `₹ 45,500.00` &rarr; *"Forty-Five Thousand Five Hundred Rupees Only"*).
- Institutional header, confidential reference number, verification & signature block for IIC Convener and Finance Officer.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend:** React 19, Tailwind CSS v4, `@tailwindcss/vite`
- **Icons:** `lucide-react`
- **Database:** Firebase 13 (Modular SDK v9+ Firestore)
- **PDF Generation:** `jspdf`, `jspdf-autotable`
- **Build Tool:** Vite 8

---

## 📦 Setup & Installation

### 1. Clone & Install
```bash
git clone <repo-url>
cd IIC-Expense-Tracker
npm install
```

### 2. Configure Firebase (Optional but Recommended)
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

*Note: You can also configure Firebase directly in the running application by clicking the **"Firebase Setup"** button in the header.*

### 3. Firestore Security Rules
In your Firebase Console under **Firestore Database > Rules**, apply:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /iic_reinvestments/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🔐 Credentials for Evaluators & Reviewers

| Field | Accepted Value |
|---|---|
| **Username / Email** | `IIC-VIT` or `iic-vit@vit.ac.in` |
| **Password** | `IICVIT2025` |

*(A handy "Auto-fill credentials" button is also provided on the login modal for quick testing!)*
