import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "./AuthForms";
import { decode } from 'jsonwebtoken'
import { Loading, validateUser } from "./Utils";

function EditUser(data) {

  // prepared passed in data
  const onCloseModal = data.onCloseModal;
  const getSelf = data.getSelf;
  const showToast = data.showToast;
  data = data.user

  // declare stateful values to be used
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [name, setUsername] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState("");

  /*
  The function putEditUser makes a PUT request to the API endpoint to edit the specified user.
  Args:
      None     
  */
  function putEditUser() {
    const validateInput = validateUser(name, email);
    if (validateInput !== true) {
      setSubmitResult(validateInput);
      setIsError(true);
      return;
    }
    function postAuthenticate() {
      setIsLoading(true);
      setIsError(false);
      axios.post(process.env.REACT_APP_API_LINK + "/authenticate", {
        "email": data.email,
        password
      }).then(result => {
        if (result.status === 200) {
          const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
          const user_id = decode(token).user_id;
          axios.put(process.env.REACT_APP_API_LINK + "/users/" + user_id, { "user": {
            name,
            email,
            password
          }}, {
            headers: { Authorization: token }
          }).then(result => {
            setIsLoading(false);
            if (result.status === 200) {
              setIsSuccess(true);
              getSelf();
              showToast("Profile successfully updated.")
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

  // render edit user modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">

      <Form>
        <div className="form-group">
          <label>Username</label>
          <input
            type="name"
            defaultValue={data.name}
            className="form-control" 
            onChange={e => {
              setUsername(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            defaultValue={data.email}
            className="form-control" 
            onChange={e => {
              setEmail(e.target.value);
            }}
            placeholder=""
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
            placeholder="Enter password to save changes"
          />
        </div>

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={putEditUser}>Update</button>
        <button type="button" className="btn btn-dark btn-block" onClick={onCloseModal}>Back</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Profile updated!</Success> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>
    </div>
  );
}

export default EditUser