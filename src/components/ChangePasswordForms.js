import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'

function ChangePassword(data) {
  const onCloseModal = data.onCloseModal
  const getSelf = data.getSelf;
  data = data.user
  const [apiResult, setApiResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function putChangePassword() {
    function postAuthenticate() {
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
            if (result.status === 200) {
              setIsSuccess(true)
              getSelf();
              onCloseModal()
            } else {
              setIsError(true)
            }
          }).catch(e => {
            setApiResult(e.response.data.error);
            setIsError(true);
          });
        } else {
          setIsError(true);
        }
      }).catch(e => {
        setApiResult(e.response.data.error);
        setIsError(true);
      });
    }
    postAuthenticate();
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

  return (
    <div className="auth-inner">
      <form>
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
        { isSuccess &&<Success>Task updated!</Success> }
        { isError &&<Error>{apiResult}</Error> }
      </form>
    </div>
  );
}

export default ChangePassword