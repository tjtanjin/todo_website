import React from "react";
import axios from 'axios';
import { decode } from 'jsonwebtoken'

function DeleteTask(data) {
  function delTask() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    const user_id = decode(token).user_id;
    axios.delete("http://localhost:3000/api/v1/users/" + user_id + "/tasks/" + data.id, {
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
      <p className="prompt"> Are you sure you want to delete the task <span className="trackedtask">{data.job_name}</span>?</p>
      <br/>
      <button className="btn btn-dark btn-block" onClick={e => delTask()}>Delete</button>
      <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
    </div>
  );
}

export default DeleteTask