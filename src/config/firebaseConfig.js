import firebase from 'firebase'

export const config = {
  apiKey: "AIzaSyAmptIWZcx33Flh_fTaIwEOFAS2745PGG4",
  authDomain: "alhambra-19f90.firebaseapp.com",
  databaseURL: "https://alhambra-19f90.firebaseio.com",
  projectId: "alhambra-19f90",
  storageBucket: "alhambra-19f90.appspot.com",
  messagingSenderId: "835869347017"
}

let app = firebase.initializeApp(config);
export const db = app.database()


export const customerRef = db.ref('customers');
export const lotRef = db.ref('lots');
export const storeRef = db.ref('store');
export const schoolRef = db.ref('schools');
export const noteRef = db.ref('note');
export const eventRef = db.ref('event');
export const placeRef = db.ref('place');
export const docsRef = db.ref('documents');

export const firebaseAuth = firebase.auth;