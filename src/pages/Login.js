import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { useAuth } from "../context/auth";
import { checkDyno, logOut, Loading } from "../components/Utils"

function Login(props) {

  // declare stateful values to be used
  const [submitResult, setSubmitResult] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWakingDyno, setDynoMessage] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetLink, setResetLink] = useState("");
  const { setAuthTokens } = useAuth();
  let referer = '';

  // set location to redirect to upon logging in
  if (typeof(props.location.state) == 'undefined' || props.location.state === null) {
    referer = '/';
  } else {
    referer = props.location.state.referer
  }

  /*
  The function postLogin makes a POST request to the API endpoint to authenticate the user.
  Args:
      None     
  */
  function postLogin() {
    setIsLoading(true);
    setIsError(false);
    let isDynoAwake = false;
    setTimeout(() => checkDyno(isDynoAwake, setDynoMessage), 5000);
    axios.post(process.env.REACT_APP_API_LINK + "/authenticate", {
      email,
      password
    }).then(result => {
      isDynoAwake = true;
      setDynoMessage(false);
      setIsLoading(false);
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.")
        setIsError(true);
      }
    }).catch(e => {
      isDynoAwake = true;
      setDynoMessage(false);
      setIsLoading(false);
      setSubmitResult(e.response.data.error)
      setIsError(true);
      if (e.message.includes("400")) {
        setResetLink(<button type="button" className="btn btn-danger btn-sm" onClick={postSendVerification}>Resend verification link</button>)
      } else {}
    });
  }

  /*
  The function postSendVerification makes a POST request to the API endpoint to send a verification email to the user.
  Args:
      None     
  */
  function postSendVerification() {
    setResetLink("");
    axios.post(process.env.REACT_APP_API_LINK + "/sendverification", {
      email,
    }).then(result => {
      if (result.status === 200) {
        setResetLink(<p class="text-success">A verification link has been sent to your email.</p>)
      } else {
        setResetLink(<p class="text-danger">An error has occurred, please contact an administrator.</p>)
      }
    }).catch(e => {
      alert(e);
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

  // redirect one logged in
  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  // render login page
  return (
    <div className="auth-inner">
      
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
          Forgot <Link className="link" to={"/forgotpassword"}>password?</Link>
        </p>
        { isWakingDyno&&<Success>Waking Heroku Dyno... Please be patient.</Success>}
        { isLoading&&<Loading></Loading> }
        { isError &&<Error>{submitResult}</Error> }
        <br/>
        <div class="prompt">
          {resetLink}
        </div>
      </Form>
    </div>
  );
}

export default Login;
