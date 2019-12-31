import React from "react";
import { Route, Redirect } from "react-router-dom";
import { VerifyAuth } from "./components/Utils"

function PrivateRoute({ component: Component, ...rest }) {

  return (
    <Route
      {...rest}
      render={props =>
        VerifyAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect 
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
