import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();
