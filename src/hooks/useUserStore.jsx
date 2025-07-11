import { create } from "zustand";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "../lib/firebase";

export const useUserStore = create((set) => ({
    user: null,
    loading: false,
    error: null,
    signup: async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            set({ user: userCredential.user });
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            set({ user: userCredential.user });
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
    init: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ user, loading: false });
        });
        return () => unsubscribe();
    },
    reset: () => {
        set({ user: null, loading: false, error: null });
    }
}));