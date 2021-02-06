import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { auth } from "../services/firebase";
import { Redirect } from "react-router-dom";

export const UserContext = createContext({ user: null });

export default (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/adduser`,
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
          }
        );
        setUser(data.user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};
