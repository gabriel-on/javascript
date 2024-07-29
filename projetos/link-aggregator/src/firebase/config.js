import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCbLNXH64CSPkoN9XpW6ebkzsieo6Qk11k",
    authDomain: "link-aggregator-brasil.firebaseapp.com",
    projectId: "link-aggregator-brasil",
    storageBucket: "link-aggregator-brasil.appspot.com",
    messagingSenderId: "361047906652",
    appId: "1:361047906652:web:8efc775b8cb565c5104999"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, storage, database }
export default app;