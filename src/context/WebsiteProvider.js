import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

import { UserContext } from "./UserProvider";

export const WebsiteContext = createContext({ user: null });

export default (props) => {
  const user = useContext(UserContext);
  const [websites, setWebsites] = useState(null);

  const updateWebsites = async (url, wordCount) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/addwebsite`,
      {
        url: url,
        wordCount: wordCount,
      },
      {
        headers: {
          userId: user._id,
        },
      }
    );
    if (data.error) alert(data.error);
    if (data.websites) setWebsites(data.websites);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/getwebsites`,
        {
          headers: {
            userId: user._id,
          },
        }
      );
      if (data.error) alert(data.error);
      if (data.websites) setWebsites(data.websites);
    };
    if (user) fetchData();
  }, [user]);
  return (
    <WebsiteContext.Provider value={{ websites, setWebsites, updateWebsites }}>
      {props.children}
    </WebsiteContext.Provider>
  );
};
