import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { Form, Error, Success } from "./AuthForms";
import { Loading } from "./Utils";

function ResetPassword(data) {

  // declare stateful values to be used
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  /*
  The function putEditUser makes a PUT request to the API endpoint to edit the specified user.
  Args:
      None     
  */
  function postResetPassword() {
    setIsLoading(true);
    setIsError(false);
    axios.post(process.env.REACT_APP_API_LINK + "/password/reset", {
      "email": data.email,
      token,
      password
    }).then(result => {
      setIsLoading(false);
      if (result.status === 200) {
        setIsSuccess(true);
        data.onCloseModal();
        alert("Password Reset Successful!")
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.")
        setIsError(true);
      }
    }).catch(e => {
      setIsLoading(false);
      setSubmitResult(e.response.data.error);
      setIsError(true);
    });
  }

  // listen for enter key input to submit form
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

  if (isSuccess) {
    return <Redirect to="/" />;
  }

  // render edit user modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">
      <Form>
        <p className="text-success">A password reset token has been sent to your email (may take up to 5 minutes). Please enter the token below to reset your password. The token will expire in <span className="text-danger font-weight-bold">4 hours</span>.</p>
        <div className="form-group">
          <label>Password Reset Token</label>
          <input
            type="token"
            className="form-control" 
            onChange={e => {
              setToken(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            className="form-control" 
            onChange={e => {
              setPassword(e.target.value);
            }}
            placeholder="Enter new password"
          />
        </div>

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={postResetPassword}>Reset Password</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Close</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Password Reset Successful!</Success> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>
    </div>
  );
}

export default ResetPassword