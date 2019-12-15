import React from "react";
import axios from 'axios';
import { decode } from 'jsonwebtoken'
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth();

  function verify() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    if (decode(token) === null) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <Route
      {...rest}
      render={props =>
        verify() ? (
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
