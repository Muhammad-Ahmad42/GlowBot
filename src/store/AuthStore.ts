import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (name: string, email: string, password: string, photoURL?: string | null, profile?: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  signUp: async (name, email, password, photoURL, profile) => {
    try {
      set({ loading: true, error: null });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      // Sync user to backend
      try {
        const response = await fetch('http://192.168.18.225:5501/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseUid: userCredential.user.uid,
            email: email,
            displayName: name,
            photoURL: photoURL || null,
            profile: profile || {},
          }),
        });

        if (!response.ok) {
          console.warn('Failed to sync user to backend:', await response.text());
        }
      } catch (syncError) {
        console.error('Error syncing user to backend:', syncError);
        // Continue even if sync fails, user is created in Firebase
      }

      set({ user: userCredential.user });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const res = await signInWithEmailAndPassword(auth, email, password);
      set({ user: res.user });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
  forgotPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
