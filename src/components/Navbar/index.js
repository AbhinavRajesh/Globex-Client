import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../context/UserProvider";
import logo from "../../assets/logo.png";
import { signInWithGoogle, logout } from "../../services/firebase";
import "./index.css";

const Navbar = () => {
  const user = useContext(UserContext);

  return (
    <div className="navbar__container">
      <div className="navbar__logo">
        <img src={logo} alt="Globex" />
      </div>
      <div className="navbar__links">
        <ul>
          {user ? (
            <Link onClick={logout}>Logout</Link>
          ) : (
            <>
              {window.innerWidth > 500 && (
                <Link onClick={signInWithGoogle}>
                  <li>Login</li>
                </Link>
              )}
              <Link onClick={signInWithGoogle}>
                <li>Sign up</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
