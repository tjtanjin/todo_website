import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { Form, Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'
import { useAuth } from "../context/auth";
import { Sleep } from "../components/Utils"

function EditTask(data) {
  data = data.task
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [job_name, setJobName] = useState("");
  const [job_desc, setJobDesc] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [due, setDue] = useState("");

  function validateInput() {
    if (job_name !== "" && job_desc !== "" && category !== "") {
      putEditTask();
    } else {
      return false;
    }
  }

  function putEditTask() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    const user_id = decode(token).user_id;
    axios.put("http://localhost:3000/api/v1/users/" + user_id + "/tasks/" + data.id, {
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
        window.location.assign("/tasks");
      } else {

      }
    }).catch(e => {
      alert(e)
    });
  }

  return (
    <div className="auth-inner">
      <form>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="job_name"
            defaultValue={data.job_name}
            className="form-control" 
            onChange={e => {
              setJobName(e.target.value);
            }}
            placeholder=""
            required
          />
        </div>

        <div className="form-group">
          <label>Task Description</label>
          <input
            type="job_desc"
            defaultValue={data.job_desc}
            className="form-control" 
            onChange={e => {
              setJobDesc(e.target.value);
            }}
            placeholder=""
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="category"
            defaultValue={data.category}
            className="form-control" 
            onChange={e => {
              setCategory(e.target.value);
            }}
            placeholder=""
            required
          />
        </div>

        <div className="form-group">
          <label>Tag</label>
          <input
            type="tag"
            defaultValue={data.tag}
            className="form-control" 
            onChange={e => {
              setTag(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input
            type="due"
            defaultValue={data.due}
            className="form-control" 
            onChange={e => {
              setDue(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <button id="submitButton" type="submit" className="btn btn-primary btn-block" onClick={validateInput}>Update</button>
        <button type="button" className="btn btn-primary btn-block" onClick={event => window.location.href='/tasks'}>Back</button>
        <br/>
        { isSuccess &&<Success>Task created!</Success> }
        { isError &&<Error>Please check the format of your information.</Error> }
      </form>
    </div>
  );
}

export default EditTask