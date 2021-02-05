import { useState, useEffect, createContext, useContext } from "react";
import firebase from "firebase";

import { firestore } from "../services/firebase";

import { UserContext } from "./UserProvider";

export const WebsiteContext = createContext({ user: null });

export default (props) => {
  const user = useContext(UserContext);
  const [websites, setWebsites] = useState(null);

  const updateWebsites = async (url, wordCount) => {
    const userRef = firestore.collection("users").doc(user.uid);
    await userRef.update({
      websites: firebase.firestore.FieldValue.arrayUnion({
        url: url,
        wordCount: wordCount,
      }),
    });
    const snapShot = await userRef.get();
    if (snapShot.exists) {
      const data = snapShot.data();
      setWebsites(data.websites.reverse());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userRef = firestore.collection("users").doc(user.uid);
      const snapShot = await userRef.get();
      if (snapShot.exists) {
        const data = snapShot.data();
        setWebsites(data.websites.reverse());
      }
    };
    if (user) fetchData();
  }, [user]);
  return (
    <WebsiteContext.Provider value={{ websites, updateWebsites }}>
      {props.children}
    </WebsiteContext.Provider>
  );
};
