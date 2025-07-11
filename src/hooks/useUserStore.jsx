import { create } from "zustand";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";


export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    // error: null,
    fetchUserInfo: async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                set({ user: userDoc.data(), loading: false });
            } else {
                set({ user: null, loading: false });
                throw new Error("User not found");
            }
        } catch (error) {
            console.error(error);
            set({ user: null, loading: false });
            throw error;
        }
    },  
    signup: async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
         
        } catch (error) {
            console.error(error);
            // set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    login: async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
          
        } catch (error) {
            console.error(error);
            // set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null, loading: false });
        } catch (error) {
            console.error(error);
            // set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    init: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            if (user) {
                get().fetchUserInfo(user.uid);
            } else {
                set({ user: null, loading: false });
            }
        });
        return () => unsubscribe();
    },
    reset: () => {
        set({ user: null, loading: false });
    }
}));

useUserStore.getState().init();