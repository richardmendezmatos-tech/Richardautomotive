import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlj3o08kSJrEhKJjU2Xb1LMNeXD2hxWhY",
  authDomain: "richard-automotive.firebaseapp.com",
  projectId: "richard-automotive",
  storageBucket: "richard-automotive.firebasestorage.app",
  messagingSenderId: "197990063384",
  appId: "1:197990063384:web:2e797f109bda021e2e926d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
