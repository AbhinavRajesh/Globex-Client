import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const LoggedInRoute = ({ component: RouteComponent, ...rest }) => {
  const user = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        user !== null ? (
          <Redirect to={"/dashboard"} />
        ) : (
          <RouteComponent {...routeProps} />
        )
      }
    />
  );
};

export default LoggedInRoute;
