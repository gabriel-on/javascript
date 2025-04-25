import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBoN9bzgpRLm0PgZhg3N9h8_DvETwCE1Fc",
    authDomain: "music-play-br.firebaseapp.com",
    databaseURL: "https://music-play-br-default-rtdb.firebaseio.com",
    projectId: "music-play-br",
    storageBucket: "music-play-br.appspot.com",
    messagingSenderId: "471657567897",
    appId: "1:471657567897:web:9a3e8aa950ba19e01f4a08"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database }
export default app;