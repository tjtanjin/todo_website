import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'
import { useAuth } from "../context/auth";
import { Sleep } from "../components/Utils"

function NewTask() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [job_name, setJobName] = useState("");
  const [job_desc, setJobDesc] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [due, setDue] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const { setAuthTokens } = useAuth();
  let history = useHistory();

  function postNewTask() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    const user_id = decode(token).user_id;
    axios.post("http://localhost:3000/api/v1/users/" + user_id + "/tasks", {
      job_name,
      job_desc,
      category,
      tag,
      due,
      user_id
    }, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setIsSuccess(true);
        Sleep(1000).then(() => {
          history.goBack();
        })
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
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
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Todo_Manager</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/signup"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Form>
        <h3>Create New Task</h3>

        <div className="form-group">
          <label>Task Name</label>
          <input
            type="job_name"
            value={job_name}
            className="form-control" 
            onChange={e => {
              setJobName(e.target.value);
            }}
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label>Task Description</label>
          <input
            type="job_desc"
            value={job_desc}
            className="form-control" 
            onChange={e => {
              setJobDesc(e.target.value);
            }}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="category"
            value={category}
            className="form-control" 
            onChange={e => {
              setCategory(e.target.value);
            }}
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label>Tag</label>
          <input
            type="tag"
            value={tag}
            className="form-control" 
            onChange={e => {
              setTag(e.target.value);
            }}
            placeholder="Confirm password"
          />
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input
            type="due"
            value={due}
            className="form-control" 
            onChange={e => {
              setDue(e.target.value);
            }}
            placeholder="Confirm password"
          />
        </div>

        <button id="submitButton" className="btn btn-primary btn-block" onClick={postNewTask}>Create</button>
        { isSuccess &&<Success>Task created!</Success> }
        { isError &&<Error>Please check the format of your information.</Error> }
      </Form>
    </div>
  );
}

export default NewTask;
