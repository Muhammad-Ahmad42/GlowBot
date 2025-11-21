import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);
