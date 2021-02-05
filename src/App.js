import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";

import "./App.css";
import Navbar from "./components/Navbar";
import UserProvider from "./context/UserProvider";

import LoggedInRoute from "./Routes/LoggedInRoute";
import LoggedOutRoute from "./Routes/LoggedOutRoute";
import WebsiteProvider from "./context/WebsiteProvider";

const App = () => {
  return (
    <UserProvider>
      <WebsiteProvider>
        <BrowserRouter>
          <Navbar />
          <Route path={["/"]}>
            <Switch>
              <LoggedOutRoute exact path="/" component={Landing} />
            </Switch>
          </Route>
          <Route path={["/dashboard"]}>
            <Switch>
              <LoggedInRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </Route>
        </BrowserRouter>
      </WebsiteProvider>
    </UserProvider>
  );
};

export default App;

// const [ans, setAns] = useState([]);
// const [url, setUrl] = useState("");
// const noscript = (strCode) => {
//   return strCode.replace(/<script.*?>.*?<\/script>/gim, "");
// };
// const stringToHTML = (str) => {
//   let parser = new DOMParser();
//   let doc = parser.parseFromString(str, "text/html");
//   return doc.body;
// };
// const getPage = () => {
//   fetch(url)
//     .then((res) => {
//       console.log(res);
//       if (res.status == 200) res.text();
//       else return;
//     })
//     .then((text) => {
//       const body = stringToHTML(text);
//       console.log(body);
//       let content = body.textContent;
//       content = noscript(content);
//       console.log(content);
//       alert(content.match(/\S+/g).length);
//     });
// };
