import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Error } from "../components/AuthForms";
import { useAuth } from "../context/auth";

function Signup() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const { setAuthTokens } = useAuth();

  function postSignup() {
    axios.post("http://localhost:3000/api/v1/users", {"user": {
      name,
      email,
      password,
      password_confirmation
    }}).then(result => {
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

        <button id="submitButton" className="btn btn-primary btn-block" onClick={postSignup}>Sign Up</button>
        <Link to="/login">Already have an account?</Link>
        { isError &&<Error>Please ensure that your email is valid and that your passwords match.</Error> }
      </Form>
    </div>
  );
}

export default Signup;
