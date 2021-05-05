import firebase from "firebase";

const { firebaseConfig } = require("./firebaseConfig");

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const getCurrentTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const GoogleProvider = new firebase.auth.GoogleAuthProvider();

export { db, auth, GoogleProvider, getCurrentTimestamp };
