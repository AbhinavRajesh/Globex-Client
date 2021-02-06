import dotenv from "dotenv";
import firebase from "firebase";
import "firebase/firestore";
dotenv.config();

firebase.initializeApp({
  apiKey: "AIzaSyDOdVG1R6hteLn2jajY8BJ_NyDBbrEFsE8",
  authDomain: "globex-c62e6.firebaseapp.com",
  projectId: "globex-c62e6",
  storageBucket: "globex-c62e6.appspot.com",
  messagingSenderId: "327449850094",
  appId: "1:327449850094:web:18d5e29c5c82365ef3c3ff",
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const logout = () => {
  auth
    .signOut()
    .then(() => {
      console.log("LOGGED OUT");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
