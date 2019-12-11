import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Error } from "../components/AuthForms";
import { useAuth } from "../context/auth";

function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, rememberMe] = useState("");
  const { setAuthTokens } = useAuth();
  let referer = '';
  if (typeof(props.location.state) == 'undefined') {
    referer = '/';
  } else {
    referer = props.location.state.referer
  }

  function postLogin() {
    axios.post("http://localhost:3000/authenticate", {
      email,
      password
    }).then(result => {
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  useEffect(() => {
    setAuthTokens("undefined");
    const handleEnter = (event) => {
      if (event.keyCode === 13) {
        document.getElementById("submitButton").click()
      }
    };
    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, []);

  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  return (
    <div className="auth-inner">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Todo_Manager</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/signup"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Form>
        <h3>Sign In</h3>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            value={email}
            className="form-control" 
            onChange={e => {
              setEmail(e.target.value);
            }}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            className="form-control" 
            onChange={e => {
              setPassword(e.target.value);
            }}
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="customCheck1" />
              <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
          </div>
        </div>

        <button id="submitButton" className="btn btn-primary btn-block" onClick={postLogin}>Sign In</button>
        <Link to="/signup">Do not have an account?</Link>
        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
        { isError &&<Error>The email or password provided were incorrect!</Error> }
      </Form>
    </div>
  );
}

export default Login;
