import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "./AuthForms";
import { Loading } from "./Utils";
import { useAuth } from "../context/auth"

function DeleteUser(data) {

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");

  /*
  The function delDeleteUser makes a DELETE request to the API endpoint to delete the specified user.
  Args:
      None     
  */
  function delDeleteUser() {
    function postAuthenticate() {
      setIsLoading(true);
      setIsError(false);
      axios.post(process.env.REACT_APP_API_LINK + "/authenticate", {
        "email": data.email,
        password
      }).then(result => {
        if (result.status === 200) {
          const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
          axios.delete(process.env.REACT_APP_API_LINK + "/users/" + data.id, {
            headers: { Authorization: token }
          }).then(result => {
            setIsLoading(false);
            if (result.status === 200) {
              setAuthTokens("undefined");
              setIsSuccess(true);
              data.onCloseModal();
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

  // render delete user modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">
      <Form>
        <p className="prompt">Enter password to confirm deletion of account <span className="trackedcontent">{data.name}</span>.</p>
        <div className="form-group">
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
        <button id="submitButton" className="btn btn-danger btn-block" type="button" onClick={e => delDeleteUser()}>Delete</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Account deleted!</Success> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>
    </div>
  );
}

export default DeleteUser