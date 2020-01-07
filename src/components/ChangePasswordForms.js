import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "./AuthForms";
import { decode } from 'jsonwebtoken'
import { Loading } from "./Utils";

function ChangePassword(data) {

  // prepare passed in data
  const onCloseModal = data.onCloseModal
  const getSelf = data.getSelf;
  const showToast = data.showToast;
  data = data.user

  // declare stateful values to be used 
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /*
  The function putChangePassword makes a PUT request to the API endpoint to update the password of the specified user.
  Args:
      None     
  */
  function putChangePassword() {
    function postAuthenticate() {
      setIsLoading(true);
      setIsError(false);
      axios.post(process.env.REACT_APP_API_LINK + "/authenticate", {
        "email": data.email,
        "password": currentPassword
      }).then(result => {
        if (result.status === 200) {
          const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
          const user_id = decode(token).user_id;
          axios.put(process.env.REACT_APP_API_LINK + "/users/" + user_id, { "user": {
            "password": newPassword,
          }}, {
            headers: { Authorization: token }
          }).then(result => {
            setIsLoading(false);
            if (result.status === 200) {
              setIsSuccess(true);
              getSelf();
              showToast("Password successfully updated.")
              onCloseModal();
            } else {
              setSubmitResult("An error has occurred, please contact an administrator.")
              setIsError(true);
            }
          }).catch(e => {
            setIsLoading(false);
            setSubmitResult(e.response.data.error);
            setIsError(true);
          });
        } else {
          setIsLoading(false);
          setSubmitResult("An error has occurred, please contact an administrator.")
          setIsError(true);
        }
      }).catch(e => {
        setIsLoading(false);
        setSubmitResult(e.response.data.error);
        setIsError(true);
      });
    }
    postAuthenticate();
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

  // render change password modal
  return (
    <div className="auth-inner">
      <Form>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            className="form-control" 
            onChange={e => {
              setCurrentPassword(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            className="form-control" 
            onChange={e => {
              setNewPassword(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={putChangePassword}>Update</button>
        <button type="button" className="btn btn-dark btn-block" onClick={onCloseModal}>Back</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Password updated!</Success> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>
    </div>
  );
}

export default ChangePassword