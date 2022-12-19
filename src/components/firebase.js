import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDkkIpn3FN83vCyxkZaaA6SYsODR59xK_8",
    authDomain: "menu-9e7e7.firebaseapp.com",
    projectId: "menu-9e7e7",
    storageBucket: "menu-9e7e7.appspot.com",
    messagingSenderId: "579999706376",
    appId: "1:579999706376:web:1c86cbf5e46278daa750bd",
    measurementId: "G-NSV3Q8GBDM"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
