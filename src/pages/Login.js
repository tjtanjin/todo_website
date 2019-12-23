import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Error } from "../components/AuthForms";
import { Loading } from "../components/Loading";
import { useAuth } from "../context/auth";
import { Navbar } from "../components/Navbar";

function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();
  let referer = '';
  if (typeof(props.location.state) == 'undefined') {
    referer = '/';
  } else {
    referer = props.location.state.referer
  }

  function postLogin() {
    setIsLoading(true);
    setIsError(false);
    axios.post(process.env.REACT_APP_API_LINK + "/authenticate", {
      email,
      password
    }).then(result => {
      setIsLoading(false);
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsLoading(false);
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
      <Navbar></Navbar>
      
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
            autoFocus
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

        <button type="submit" id="submitButton" className="btn btn-dark btn-block" onClick={postLogin}>Sign In</button>
        <Link className="link" to="/signup">Do not have an account?</Link>
        <p className="forgot-password text-right">
          Forgot <a href="#" className="link">password?</a>
        </p>
        { isLoading&&<Loading></Loading> }
        { isError &&<Error>The email or password provided were incorrect!</Error> }
      </Form>
    </div>
  );
}

export default Login;
