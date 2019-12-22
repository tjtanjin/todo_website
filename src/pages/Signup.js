import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Error } from "../components/AuthForms";
import { Loading } from "../components/Loading";
import { useAuth } from "../context/auth";

function Signup() {
  const [apiResult, setApiResult] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const { setAuthTokens } = useAuth();

  function postSignup() {
    setIsLoading(true);
    setIsError(false);
    axios.post(process.env.REACT_APP_API_LINK + "/api/v1/users/", {"user": {
      name,
      email,
      password,
      password_confirmation
    }}).then(result => {
      setIsLoading(false);
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsLoading(false);
      setApiResult(e.response.data.error)
      setIsError(true)
    });
  }

  useEffect(() => {
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
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-inner">
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <Link className="navbar-brand nav-link navbar-nav text-uppercase" to={"/"}>Todo_Manager</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav text-uppercase ml-auto">
              <li className="nav-item">
                <Link className="nav-link nav-text" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-text" to={"/signup"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Form>
        <h3>Sign Up</h3>

        <div className="form-group">
          <label>Username</label>
          <input
            type="username"
            value={name}
            className="form-control" 
            onChange={e => {
              setUserName(e.target.value);
            }}
            placeholder="Enter username"
            autoFocus
          />
        </div>

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
          <label>Confirm Password</label>
          <input
            type="password"
            value={password_confirmation}
            className="form-control" 
            onChange={e => {
              setPasswordConfirmation(e.target.value);
            }}
            placeholder="Confirm password"
          />
        </div>

        <button id="submitButton" className="btn btn-dark btn-block" onClick={postSignup}>Sign Up</button>
        <Link className="link" to="/login">Already have an account?</Link>
        { isLoading&&<Loading></Loading> }
        { isError &&<Error>{apiResult}</Error> }
      </Form>
    </div>
  );
}

export default Signup;
