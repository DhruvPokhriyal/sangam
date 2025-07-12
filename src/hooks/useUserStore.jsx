import { create } from "zustand";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";


export const useUserStore = create((set, get) => ({
    user: null,
    loading: true,
    isSigningUp: false,
    // error: null,
    fetchUserInfo: async (uid) => {
        set({ loading: true });
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                set({ user: userDoc.data(), loading: false });
            } else {
                
                throw new Error("User not found");
            }
        } catch (error) {
            console.error(error);
            set({ user: null, loading: false });
            throw error;
        }
    },  
    signup: async (email, password, userData) => {
        set({ loading: true, isSigningUp: true });
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                username: userData.username,
                email,
                avatar: userData.avatar,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userChats", res.user.uid), {
                chats: [],
            });

            toast.success("Account created! You can login now!");
            get().fetchUserInfo(res.user.uid);
         
        } catch (error) {
            console.error(error);
            // set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false, isSigningUp: false });
        }
    },
    login: async (email, password) => {
        set({ loading: true });
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
        set({ loading: true });
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

            if (user && !get().isSigningUp) {
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