import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'
import { Loading } from "./Loading";

function EditUser(data) {
  const onCloseModal = data.onCloseModal
  const getSelf = data.getSelf;
  data = data.user
  const [apiResult, setApiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [name, setUsername] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState("");

  function putEditUser() {
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
              onCloseModal();
            } else {
              setIsError(true);
            }
          }).catch(e => {
            setIsLoading(false);
            setApiResult(e.response.data.error);
            setIsError(true);
          });
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      }).catch(e => {
        setIsLoading(false);
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
        { isError &&<Error>{apiResult}</Error> }
      </Form>
    </div>
  );
}

export default EditUser