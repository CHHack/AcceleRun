
import firebase from "firebase/app";
import "firebase/auth";

const config = {
    apiKey: "AIzaSyD_LHG7MT1fmpH3FizdrPr9nDOiV33wIwI",
    authDomain: "accelerun-15c09.firebaseapp.com",
    databaseURL: "https://accelerun-15c09-default-rtdb.firebaseio.com",
    projectId: "accelerun-15c09",
    storageBucket: "accelerun-15c09.appspot.com",
    messagingSenderId: "104288548611",
    appId: "1:104288548611:web:c2f34e750281ccb8105b36",
    measurementId: "G-R2900Z6FZQ"
};

const app = firebase.initializeApp(config);
export default app;