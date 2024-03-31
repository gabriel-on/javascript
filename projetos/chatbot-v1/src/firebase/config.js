import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCGdgG97fUWOMzy7hycZXfWi46ZTSy00zE",
  authDomain: "chat-bot-br.firebaseapp.com",
  projectId: "chat-bot-br",
  storageBucket: "chat-bot-br.appspot.com",
  messagingSenderId: "825333894714",
  appId: "1:825333894714:web:d30ba23f91661eb151ef03"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, database }
export default app;