import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBrA99a6b7Bl2gp15zL9DrldyjiE41cG_g",
    authDomain: "world-book-br.firebaseapp.com",
    projectId: "world-book-br",
    storageBucket: "world-book-br.appspot.com",
    messagingSenderId: "1021905253621",
    appId: "1:1021905253621:web:14e623ff6227cfabd241bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }
export default app;