import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'
import { Loading } from "./Loading";
import { useAuth } from "../context/auth"

function DeleteUser(data) {
  const { setAuthTokens } = useAuth();
  const [apiResult, setApiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [name, setUsername] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState("");

  function logOut() {
    setAuthTokens("undefined");
  }

  function delUser() {
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
            if (result.status === 200) {
              setAuthTokens("undefined")
              data.onCloseModal();
            } else {

            }
          }).catch(e => {
            alert(e)
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
        <button id="submitButton" className="btn btn-danger btn-block" type="button" onClick={e => delUser()}>Delete</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Account deleted!</Success> }
        { isError &&<Error>{apiResult}</Error> }
      </Form>
    </div>
  );
}

export default DeleteUser