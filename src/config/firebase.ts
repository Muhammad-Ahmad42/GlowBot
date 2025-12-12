import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2IO6CE0Q6EzmdNmYGys2Csdho_flbiDI",
  authDomain: "glowbot-4a9a3.firebaseapp.com",
  projectId: "glowbot-4a9a3",
  storageBucket: "glowbot-4a9a3.firebasestorage.app",
  messagingSenderId: "997256904656",
  appId: "1:997256904656:web:44dcc54a7bdb4bf66443d5",
  measurementId: "G-VC4CEL79MQ",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

import { getStorage } from "firebase/storage";
export const storage = getStorage(app);

import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
