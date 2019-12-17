import React from "react";
import axios from 'axios';
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";
import { VerifyAuth } from "./components/VerifyAuth"

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth();

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
