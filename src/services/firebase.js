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
      createUserDocument(res.user).then((res) => console.log(res));
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const createUserDocument = async (user) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const { displayName, email } = user;
    try {
      userRef.set({
        displayName,
        email,
        websites: [],
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  }
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
