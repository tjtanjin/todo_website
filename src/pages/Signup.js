import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { useAuth } from "../context/auth";
import { checkDyno, logOut, Loading } from "../components/Utils"

function Signup() {

  // declare stateful values to be used
  const [apiResult, setApiResult] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWakingDyno, setDynoMessage] = useState(false)
  const [name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const { setAuthTokens } = useAuth();

  /*
  The function postSignup makes a POST request to the API endpoint to create a new user.
  Args:
      None     
  */
  function postSignup() {
    setIsLoading(true);
    setIsError(false);
    let isDynoAwake = false;
    setTimeout(() => checkDyno(isDynoAwake, setDynoMessage), 5000);
    axios.post(process.env.REACT_APP_API_LINK + "/users/", {"user": {
      name,
      email,
      password,
      password_confirmation
    }}).then(result => {
      isDynoAwake = true;
      setDynoMessage(false);
      setIsLoading(false);
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setApiResult("An error has occurred, please contact an administrator.")
        setIsError(true);
      }
    }).catch(e => {
      isDynoAwake = true;
      setDynoMessage(false);
      setIsLoading(false);
      setApiResult(e.response.data.error)
      setIsError(true)
    });
  }

  // logout user on visting page and listen for enter key input to submit form
  useEffect(() => {
    logOut(setAuthTokens);
    const handleEnter = (event) => {
      if (event.keyCode === 13) {
        document.getElementById("submitButton").click()
      }
    };
    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redirect to homepage upon successful signup + login
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  // render signup page
  return (
    <div className="auth-inner">
      
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
        { isWakingDyno&&<Success>Waking Heroku Dyno... Please be patient.</Success>}
        { isLoading&&<Loading></Loading> }
        { isError &&<Error>{apiResult}</Error> }
      </Form>
    </div>
  );
}

export default Signup;
