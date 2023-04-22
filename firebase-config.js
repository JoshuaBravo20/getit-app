// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC857nl6B4y2_eqKSeKm4BX-zyXpTy59n8",
  authDomain: "getit-cbcc7.firebaseapp.com",
  databaseURL: "https://getit-cbcc7-default-rtdb.firebaseio.com",
  projectId: "getit-cbcc7",
  storageBucket: "getit-cbcc7.appspot.com",
  messagingSenderId: "603224426306",
  appId: "1:603224426306:web:8a651d20fff2d023bceadb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);