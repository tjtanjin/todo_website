import React from "react";
import axios from 'axios';
import { decode } from 'jsonwebtoken'

function DeleteTask(data) {
  function delTask() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.delete(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks/" + data.id, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        data.getTasks();
        data.onCloseModal();
      } else {

      }
    }).catch(e => {
      alert(e)
    });
  }

  return (
    <div className="auth-inner">
      <p className="prompt"> Are you sure you want to delete the task <span className="trackedcontent">{data.task_name}</span>?</p>
      <br/>
      <button className="btn btn-danger btn-block" type="button" onClick={e => delTask()}>Delete</button>
      <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
    </div>
  );
}

export default DeleteTask