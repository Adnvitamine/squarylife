import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBrY_dFsjSKIutXgP9vdZyCc89c7agTeHg",
    authDomain: "squarylife.firebaseapp.com",
    projectId: "squarylife",
    storageBucket: "squarylife.appspot.com",
    messagingSenderId: "383443392076",
    appId: "1:383443392076:web:57d783659c73bef0f086e9",
    measurementId: "G-4QMJ713H9V"
  };


export default function initFirebase(){
    if(!firebase.apps.length){ 
        firebase.initializeApp(firebaseConfig);
    }
}
