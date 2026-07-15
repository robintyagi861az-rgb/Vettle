// FirebaseConfig.js
// Central Firebase bootstrap for Vettle Panel. All other flat files import
// `auth` and `db` from here — there is intentionally only one initializeApp call.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC03_AZphPHt1FLG5a3iaSmkP0Ktvqb0jE",
  authDomain: "vettle-panel.firebaseapp.com",
  projectId: "vettle-panel",
  storageBucket: "vettle-panel.firebasestorage.app",
  messagingSenderId: "992809167447",
  appId: "1:992809167447:web:78c16e42701054e60b1112",
  measurementId: "G-XBKK48RY35",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// ---------------------------------------------------------------------------
// Firestore layout this app expects (see firestore.rules for matching security
// rules — client-side permission checks in the UI are cosmetic, the rules are
// what actually enforce access):
//
// system_settings/config        { isLocked, isMaintenance, activeAiModel, mathPresetFormat }
// api_credentials/{serviceId}   { providerName, apiKey, isActive, apiEndpoint }
// users/{uid}                   { username, email, role, isApproved, isBanned, permissions }
// announcements/{autoId}        { title, content, createdAt }
// ---------------------------------------------------------------------------
