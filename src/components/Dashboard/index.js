import { useState, useEffect, useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../context/UserProvider";
import { WebsiteContext } from "../../context/WebsiteProvider";

import "./index.css";

const Dashboard = () => {
  let selectedRef = useRef();
  const [redirect, setRedirect] = useState(null);
  const [selected, setSelected] = useState(0);
  const [website, setWebsite] = useState("");

  const user = useContext(UserContext);
  const { websites, updateWebsites } = useContext(WebsiteContext);

  const handleSubmit = async (e) => {
    const noscript = (strCode) => {
      return strCode.replace(/<script.*?>.*?<\/script>/gim, "");
    };
    const stringToHTML = (str) => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, "text/html");
      return doc.body;
    };
    e.preventDefault();
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/getwordcount`,
      {
        url: website,
      }
    );
    if (data.htmlText) {
      const body = stringToHTML(data.htmlText);
      console.log(body);
      let content = body.textContent;
      content = noscript(content);
      console.log(content);
      updateWebsites(website, content.match(/\S+/g).length);
      setWebsite("");
    }
    if (data.error) alert(data.error);
  };
  const handleChange = (e) => setWebsite(e.target.value);

  useEffect(() => {
    if (!user) {
      setRedirect("/");
    }
  }, [user]);
  if (redirect) {
    <Redirect to={redirect} />;
  }

  return (
    <div className="dashboard__main">
      <div className="dashboard__getinsight">
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
      {websites && websites.length > 0 ? (
        <div className="dashboard__container">
          <div className="dashboard__selection">
            <select onChange={(e) => setSelected(e.target.value)}>
              {websites.map((website, key) => (
                <option value={key} key={key}>
                  {website.url}
                </option>
              ))}
            </select>
          </div>
          <div className="dashboard__prev">
            <div className="dashboardprev__left">
              <h2>Total Word Count</h2>
              <p>{websites[selected].wordCount}</p>
            </div>
            <div className="dashboardprev__right">
              <p>"WooHoo! You’re doing a good job!"</p>
            </div>
          </div>
          <div className="dashboard__history">
            <table>
              <tr>
                <th>URL</th>
                <th>Word Count</th>
                <th>Actions</th>
              </tr>
              {websites.map((website, key) => (
                <tr key={key}>
                  <td>{website.url}</td>
                  <td>{website.wordCount}</td>
                  <td>
                    <i className="fas fa-trash-alt"></i>
                    {website.favourite ? (
                      <i className="fas fa-star golden"></i>
                    ) : (
                      <i className="far fa-star"></i>
                    )}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      ) : (
        <p>No posts yet</p>
      )}
    </div>
  );
};

export default Dashboard;
