import axios from "axios";
import { useContext, useState } from "react";

import { signInWithGoogle } from "../../services/firebase";
import { UserContext } from "../../context/UserProvider";
import landing from "../../assets/landing.svg";

import "./index.css";
import { WebsiteContext } from "../../context/WebsiteProvider";

const Landing = () => {
  const [website, setWebsite] = useState();
  const user = useContext(UserContext);
  const { updateWebsites } = useContext(WebsiteContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noscript = (strCode) => {
      return strCode.replace(/<script.*?>.*?<\/script>/gim, "");
    };
    const stringToHTML = (str) => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, "text/html");
      return doc.body;
    };
    await signInWithGoogle();
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/getwordcount`,
      {
        url: website,
      }
    );
    if (data.htmlText) {
      const body = stringToHTML(data.htmlText);
      let content = body.textContent;
      content = noscript(content);
      updateWebsites(website, content.match(/\S+/g).length);
    }
    if (data.error) alert(data.error);
  };

  const handleChange = (e) => setWebsite(e.target.value);

  return (
    <div className="landing__container">
      <div className="landing__main">
        <div className="landing__leftContainer">
          <h1>Unable to check your webpage word count?</h1>
          <p>
            No worries! <span>Globex</span> will guide you!
          </p>
        </div>
        <div className="landing__rightContainer">
          <img src={landing} alt="Landing Illustration" />
        </div>
      </div>
      <div className="landing__secondary">
        <p>Check the last time when you checked the webpage word count.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Put your website URL here. Eg. https://www.growth.cx/"
            value={website}
            onChange={handleChange}
          />
          <input type="submit" value="Get Insights" />
        </form>
      </div>
    </div>
  );
};

export default Landing;
