import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { APIKEY,AUTHDOMAIN,DATABASEURL,PROJECTID,STORAGEBUCKET,MESSAGESENDERID,APPID } from '@env';

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    databaseURL:DATABASEURL,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGESENDERID,
    appId: APPID
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  const firestore = getFirestore(app); // Initialize Firestore
  
  export { auth, database, firestore };