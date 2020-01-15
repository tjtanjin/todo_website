import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import ResetPassword from '../components/ResetPasswordForms'
import { Form, Error, Success } from "../components/AuthForms";
import { Modal } from 'react-bootstrap'
import { checkDyno, Loading, setDefaultValue } from "../components/Utils"

function Forgotpassword(props) {

  // prepare passed in data
  let defaultEmail = "";

  // declare stateful values to be used
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWakingDyno, setDynoMessage] = useState(false)
  const [email, setEmail] = useState(setDefaultValue(props, "defaultEmail", defaultEmail));
  const [showResetPassword, setResetPasswordShow] = useState(false);

  // declare controllers for showing and hiding modals
  const handleResetPasswordClose = () => setResetPasswordShow(false);
  const handleResetPasswordShow = () => setResetPasswordShow(true);

  /*
  The function postSignup makes a POST request to the API endpoint to create a new user.
  Args:
      None     
  */
  function postForgotpassword() {
    setIsLoading(true);
    setIsError(false);
    let isDynoAwake = false;
    setTimeout(() => checkDyno(isDynoAwake, setDynoMessage), 5000);
    axios.post(process.env.REACT_APP_API_LINK + "/password/forgot", {"email":
      email
    }).then(result => {
      isDynoAwake = true;
      setDynoMessage(false);
      setIsLoading(false);
      if (result.status === 200) {
        handleResetPasswordShow();
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.")
        setIsError(true);
      }
    }).catch(e => {
      isDynoAwake = true;
      setDynoMessage(false);
      setIsLoading(false);
      //alert(e)
      setSubmitResult(e.response.data.error)
      setIsError(true)
    });
  }

  // render signup page
  return (
    <div className="auth-inner col-xl-3 col-md-5 col-sm-9 col-xs-12">
      
      <Form>
        <h3>Forgot Password</h3>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            className="form-control" 
            onChange={e => {
              setEmail(e.target.value);
            }}
            placeholder="Enter email to receive reset token"
            autoFocus
          />
        </div>

        <button type="button" className="btn btn-dark btn-block" onClick={postForgotpassword}>Send Token</button>
        <Link className="link" to="/login">Back to login</Link>
        { isWakingDyno&&<Success>Waking Heroku Dyno... Please be patient.</Success>}
        { isLoading&&<Loading></Loading> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>

      <Modal show={showResetPassword}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body><ResetPassword onCloseModal={handleResetPasswordClose} email={email}></ResetPassword></Modal.Body>
      </Modal>
    </div>
  );
}

export default Forgotpassword;
