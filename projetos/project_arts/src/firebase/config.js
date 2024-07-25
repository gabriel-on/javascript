import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBZHW1G5F42iRBYLJ91D2jtLRHlLpUj_gk",
    authDomain: "project-arts-br.firebaseapp.com",
    projectId: "project-arts-br",
    storageBucket: "project-arts-br.appspot.com",
    messagingSenderId: "183183300208",
    appId: "1:183183300208:web:ac2bad2663dbc2555086b5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, storage, database }
export default app;