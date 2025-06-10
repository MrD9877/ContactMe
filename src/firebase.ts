// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA3aF0TQD0TdTn_8wiJj7vt4xZjofVdwMU",
  authDomain: "contact-me-7d413.firebaseapp.com",
  projectId: "contact-me-7d413",
  storageBucket: "contact-me-7d413.firebasestorage.app",
  messagingSenderId: "660052736552",
  appId: "1:660052736552:web:afb9f0749095d2ee57531d",
  measurementId: "G-EJ6M47CSRE",
};

export default function useFirebase() {
  const [auth, setauth] = useState<Auth>();
  const [fireStoreDB, setFireStoreDB] = useState<Firestore>();
  const [fireBaseApp, setFireBaseApp] = useState<FirebaseApp>();

  useEffect(() => {
    const fireBaseApp = initializeApp(firebaseConfig);
    setFireBaseApp(fireBaseApp);
    setFireStoreDB(getFirestore(fireBaseApp));
    const auth = getAuth(fireBaseApp);
    auth.languageCode = "it";
    setPersistence(auth, browserLocalPersistence);
    setauth(auth);
  }, []);

  return { auth, fireStoreDB, fireBaseApp };
}
