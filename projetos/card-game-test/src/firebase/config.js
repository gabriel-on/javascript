import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDCi2o-HJvGFZumgmOiZX2BJRHC3DhI0Uc",
    authDomain: "card-game-d5489.firebaseapp.com",
    projectId: "card-game-d5489",
    storageBucket: "card-game-d5489.appspot.com",
    messagingSenderId: "849676445719",
    appId: "1:849676445719:web:f75c98f577edd406f31452"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, database }
export default app;