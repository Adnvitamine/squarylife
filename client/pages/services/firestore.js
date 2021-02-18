import admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyBkCwwhkZNuKSUBFmLntlEPezVinVz2_zs",
    authDomain: "bubblehub-6f79b.firebaseapp.com",
    databaseURL: "https://bubblehub-6f79b-default-rtdb.firebaseio.com",
    projectId: "bubblehub-6f79b",
    storageBucket: "bubblehub-6f79b.appspot.com",
    messagingSenderId: "350029321684",
    appId: "1:350029321684:web:60e160669e7e58c5a57241",
    measurementId: "G-V765EZ0Z57"
  };

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      firebaseConfig
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();