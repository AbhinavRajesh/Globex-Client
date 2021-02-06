import { useState, useEffect, useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../context/UserProvider";
import { WebsiteContext } from "../../context/WebsiteProvider";

import "./index.css";

const Dashboard = () => {
  const [redirect, setRedirect] = useState(null);
  const [selected, setSelected] = useState(0);
  const [website, setWebsite] = useState("");

  const user = useContext(UserContext);
  const { websites, setWebsites, updateWebsites } = useContext(WebsiteContext);

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
      },
      {
        headers: {
          userId: user._id,
        },
      }
    );
    if (data.htmlText) {
      const body = stringToHTML(data.htmlText);
      let content = body.textContent;
      content = noscript(content);
      updateWebsites(website, content.match(/\S+/g).length);
      setWebsite("");
    }
    if (data.error) alert(data.error);
  };
  const handleChange = (e) => setWebsite(e.target.value);

  const handleDelete = async (id) => {
    console.log("HANDLE DELETE");
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/deletehistory/${id}`,
      {
        headers: {
          userId: user._id,
        },
      }
    );
    console.log(data);
    if (data.error) alert(data.error);
    if (data.websites) setWebsites(data.websites);
  };
  const handleFavourite = async (id) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/favourite/${id}`,
      {
        headers: {
          userId: user._id,
        },
      }
    );
    console.log(data.websites);
    if (data.error) alert(data.error);
    if (data.websites) setWebsites(data.websites);
  };

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
            required
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
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Word Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {websites.map((website) => (
                  <tr key={website._id}>
                    <td>{website.url}</td>
                    <td>{website.wordCount}</td>
                    <td>
                      <i
                        className="fas fa-trash-alt"
                        onClick={() => handleDelete(website._id)}
                      ></i>
                      {website.favourite ? (
                        <i
                          className="fas fa-star golden"
                          onClick={() => handleFavourite(website._id)}
                        ></i>
                      ) : (
                        <i
                          className="far fa-star"
                          onClick={() => handleFavourite(website._id)}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
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
