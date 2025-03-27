import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ✅ First Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaUyHkxAdft1_-JBCCBbUBA7MyiJnbRXs",
  authDomain: "scanner-8780a.firebaseapp.com",
  projectId: "scanner-8780a",
  storageBucket: "scanner-8780a.appspot.com",
  messagingSenderId: "145175979100",
  appId: "1:145175979100:web:6a1a1a85a4bf4adb4fb299",
  measurementId: "G-R1CZKMFLLV",
};

// ✅ Second Firebase Configuration
const firebaseConfig2 = {
  apiKey: "AIzaSyB5kN-6xO1lcVvQeGCsajQaoX-gXo4h9gE",
  authDomain: "medtech-5159e.firebaseapp.com",
  projectId: "medtech-5159e",
  storageBucket: "medtech-5159e.firebasestorage.app",
  messagingSenderId: "309736885540",
  appId: "1:309736885540:web:3f9c12fe2dc901185677b1",
  measurementId: "G-HEYP4K3LTE",
};

// ✅ Check if Firebase is already initialized before initializing
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Initialize Secondary Firebase App (If Not Already Initialized)
const FIREBASE_APP =
  getApps().find((app) => app.name === "secondary") ||
  initializeApp(firebaseConfig2, "secondary");
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const messaging = getMessaging(app);

export { db, FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB,storage,messaging };