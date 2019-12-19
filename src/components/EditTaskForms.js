import React, { useState } from "react";
import axios from 'axios';
import { Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'

function EditTask(data) {
  const onCloseModal = data.onCloseModal
  data = data.task
  const [apiResult, setApiResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [job_name, setJobName] = useState(data.job_name);
  const [job_desc, setJobDesc] = useState(data.job_desc);
  const [category, setCategory] = useState(data.category);
  const [tag, setTag] = useState("");
  const [due, setDue] = useState("");

  function putEditTask() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    const user_id = decode(token).user_id;
    axios.put(process.env.REACT_APP_API_LINK + "/api/v1/users/" + user_id + "/tasks/" + data.id, {
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
        setIsSuccess(true)
        window.location.assign("/tasks");
        onCloseModal()
      } else {
        setIsError(true)
      }
    }).catch(e => {
      setApiResult(e.response.data.error);
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
            defaultValue={data.job_name}
            className="form-control" 
            onChange={e => {
              setJobName(e.target.value);
            }}
            placeholder=""
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

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={putEditTask}>Update</button>
        <button type="button" className="btn btn-dark btn-block" onClick={onCloseModal}>Back</button>
        <br/>
        { isSuccess &&<Success>Task updated!</Success> }
        { isError &&<Error>{apiResult}</Error> }
      </form>
    </div>
  );
}

export default EditTask