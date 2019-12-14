import React, { useState } from "react";
import axios from 'axios';
import { Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'
import { Sleep } from "../components/Utils"

function NewTask(data) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [job_name, setJobName] = useState("");
  const [job_desc, setJobDesc] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [due, setDue] = useState("");

  function validateInput() {
    if (job_name !== "" && job_desc !== "" && category !== "") {
      postNewTask();
      return setIsError(false)
    } else {
      return setIsError(true)
    }
  }

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
          window.location.assign("/tasks");
        })
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  return (
    <div className="auth-inner">
      <form>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="job_name"
            value={job_name}
            className="form-control" 
            onChange={e => {
              setJobName(e.target.value);
            }}
            placeholder="Enter task name"
            required
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
            placeholder="Enter description"
            required
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
            placeholder="Enter category"
            required
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
            placeholder="Choose a tag"
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
            placeholder="Enter deadline"
          />
        </div>

        <button id="submitButton" type="submit" className="btn btn-dark btn-block" onClick={validateInput}>Create</button>
        <button type="button" className="btn btn-dark btn-block" onClick={event => window.location.href='/tasks'}>Back</button>
        <br/>
        { isSuccess &&<Success>Task created!</Success> }
        { isError &&<Error>Please check the format of your information.</Error> }
      </form>
    </div>
  );
}

export default NewTask;
