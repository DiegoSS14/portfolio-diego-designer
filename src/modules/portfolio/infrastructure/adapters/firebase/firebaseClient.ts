import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasMissingFirebaseConfiguration(): boolean {
  return Object.values(firebaseConfig).some((configValue) => !configValue);
}

export function getFirestoreDatabase() {
  if (hasMissingFirebaseConfiguration()) {
    throw new Error("Firebase nao configurado. Defina as variaveis NEXT_PUBLIC_FIREBASE_*");
  }

  const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(firebaseApp);
}

function getFirebaseAppInstance() {
  if (hasMissingFirebaseConfiguration()) {
    throw new Error("Firebase nao configurado. Defina as variaveis NEXT_PUBLIC_FIREBASE_*");
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuthClient() {
  return getAuth(getFirebaseAppInstance());
}

export function getFirebaseStorageClient() {
  return getStorage(getFirebaseAppInstance());
}
