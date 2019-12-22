import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'

function NewTask(data) {
  const [apiResult, setApiResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [job_name, setJobName] = useState("");
  const [job_desc, setJobDesc] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("Low");
  const [due, setDue] = useState("");

  function postNewTask() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.post(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks", {
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
        data.getTasks();
        data.onCloseModal();
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setApiResult(e.response.data.error);
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
          />
        </div>

        <div className="form-group">
          <label>Tag</label>
          <select 
            type="tag"
            value={tag}
            className="form-control" 
            onChange={e => {
              setTag(e.target.value);
            }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            value={due}
            className="form-control" 
            onChange={e => {
              setDue(e.target.value);
            }}
            placeholder="Enter deadline"
          />
        </div>

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={postNewTask}>Create</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
        <br/>
        { isSuccess &&<Success>Task created!</Success> }
        { isError &&<Error>{apiResult}</Error> }
      </form>
    </div>
  );
}

export default NewTask;
