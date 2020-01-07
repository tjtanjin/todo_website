import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { Loading } from "../components/Utils"

function Verification(props) {

  // declare stateful values to be used
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState("");

  // verify user
  useEffect(() => {
    postCheckVerification();
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

  /*
  The function postCheckVerification makes a POST request to the API endpoint to verify the user account.
  Args:
      None     
  */
  function postCheckVerification() {
    setIsLoading(true);
    setIsError(false);
    axios.post(process.env.REACT_APP_API_LINK + "/verify", {
      "token": JSON.stringify(props.location.search.slice(7)).replace(/"/g, "")
    }).then(result => {
      setIsLoading(false);
      if (result.status === 200) {
        setSubmitResult("Your account has been verified. Please proceed to login.");
        setStatus("Success");
        setIsSuccess(true);
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.");
        setStatus("Error");
        setIsError(true);
      }
    }).catch(e => {
      setIsLoading(false);
      setSubmitResult(e.response.data.error);
      setStatus("Error");
      setIsError(true);
    });
  }

  // render verification page
  return (
    <div className="auth-inner">
      
      <Form>
        <h3>Verification {status}</h3>
        { isLoading&&<Loading></Loading> }
        { isError &&<Error>{submitResult}</Error> }
        { isSuccess &&<Success>{submitResult}</Success> }
        <br/>
        <Link id="submitButton" type="button" className="btn btn-dark btn-block" to={"/login"}>Login</Link>
      </Form>
    </div>
  );
}

export default Verification;
