import { create } from "zustand";
import { BASE_URL } from "../res/api";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase";

interface UserProfile {
  phoneNumber?: string;
  dob?: string | Date | null;
  gender?: string;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (name: string, email: string, password: string, photoURL?: string | null, profile?: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
  updateUserProfile: (displayName: string, photoURL: string | null, profileData: UserProfile) => Promise<void>;
  initializeAuth: () => any;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
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
      let finalPhotoURL = photoURL;
      
      // Initial backend sync for signup handled here... similar to before but utilizing the new structure if needed
      // For now keeping existing logic but ensuring userProfile is set if returned
       try {
        const formData = new FormData();
        formData.append('firebaseUid', userCredential.user.uid);
        formData.append('email', email);
        formData.append('displayName', name);
        if (profile) {
          formData.append('profile', JSON.stringify(profile));
          formData.append('onboardingCompleted', 'true');
        }

        if (photoURL && photoURL.startsWith('file://')) {
          const filename = photoURL.split('/').pop() || 'profile.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append('image', {
            uri: photoURL,
            name: filename,
            type,
          } as any);
        } else if (photoURL) {
          formData.append('photoURL', photoURL);
        }

        const response = await fetch(`${BASE_URL}/users`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.photoURL) {
            finalPhotoURL = data.user.photoURL;
          }
           // Set profile from response if available
          if (data.user && data.user.profile) {
             set({ userProfile: data.user.profile });
          }
        } else {
          console.warn('Failed to sync user to backend:', await response.text());
        }
      } catch (syncError) {
        console.error('Error syncing user to backend:', syncError);
      }

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: finalPhotoURL || null,
      });

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
      try {
        const response = await fetch(`${BASE_URL}/users/${res.user.uid}`);
        if (response.ok) {
          const userData = await response.json();
          // Update local profile state
          if (userData.profile) {
             set({ userProfile: userData.profile });
          }

          if (userData.photoURL && userData.photoURL !== res.user.photoURL) {
            await updateProfile(res.user, {
              photoURL: userData.photoURL,
              displayName: userData.displayName || res.user.displayName
            });
             // Refresh user object after profile update
             if (auth.currentUser) {
                set({ user: auth.currentUser });
             }
          }
        }
      } catch (e) {
        console.warn("Failed to fetch backend user profile", e);
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, userProfile: null }); // Clear profile on logout
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

  updateUserProfile: async (displayName, photoURL, profileData) => {
    try {
        set({ loading: true, error: null });
        const currentUser = get().user;
        if (!currentUser) throw new Error("No user logged in");

        let finalPhotoURL = photoURL;
        if (photoURL && photoURL.startsWith('file://')) {
             try {
                const response = await fetch(photoURL);
                const blob = await response.blob();
                const filename = photoURL.substring(photoURL.lastIndexOf('/') + 1);
                const storageRef = ref(storage, `profile_images/${currentUser.uid}/${filename}`);
                
                await uploadBytes(storageRef, blob);
                finalPhotoURL = await getDownloadURL(storageRef);
            } catch (uploadError) {
                console.error("Image upload failed:", uploadError);
                throw new Error("Failed to upload profile image. Please try again.");
            }
        }

        // 2. Update Firebase Auth Profile
        await updateProfile(currentUser, {
            displayName: displayName,
            photoURL: finalPhotoURL,
        });

        // 3. Sync to Backend
        try {
            const formData = new FormData();
            formData.append('firebaseUid', currentUser.uid);
            formData.append('email', currentUser.email || '');
            formData.append('displayName', displayName);
            formData.append('profile', JSON.stringify(profileData));
            if (finalPhotoURL) {
                 formData.append('photoURL', finalPhotoURL);
            }

            const response = await fetch(`${BASE_URL}/users`, { 
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                 console.warn('Failed to sync user update to backend:', await response.text());
            } else {
                 const data = await response.json();
                 if (data.user && data.user.profile) {
                     set({ userProfile: data.user.profile });
                 }
            }

        } catch (syncError) {
             console.error('Error syncing user update to backend:', syncError);
             // Even if backend sync fails slightly, we updated firebase.
             // But for profile data (gender etc), backend sync is critical.
        }
        
        // 4. Update Local State
        set({ 
            user: auth.currentUser, // Refresh to get new photoURL/displayName
            userProfile: { ...get().userProfile, ...profileData } // Optimistic update or merge
        });

    } catch (error: any) {
        set({ error: error.message });
        throw error;
    } finally {
        set({ loading: false });
    }
  },
  initializeAuth: () => {
    set({ loading: true });
    return onAuthStateChanged(auth, async (user) => {
        set({ user });
        if (user) {
            try {
                const response = await fetch(`${BASE_URL}/users/${user.uid}`);
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.profile) {
                        set({ userProfile: userData.profile });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user profile on init:", error);
            }
        } else {
             set({ userProfile: null });
        }
        set({ loading: false });
    });
  }
}));
