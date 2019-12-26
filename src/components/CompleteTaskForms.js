import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Error, Success } from "../components/AuthForms";
import { decode } from 'jsonwebtoken'

function CompleteTask(data) {
  function putCompleteTask() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.put(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks/" + data.id, {
      "priority": "Completed"
    }, {
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
      <p className="prompt"> Are you sure you want to complete the task <span className="trackedcontent">{data.task_name}</span>?</p>
      <br/>
      <button className="btn btn-dark btn-block" type="button" onClick={putCompleteTask}>Complete Task</button>
      <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
    </div>
  );
}

export default CompleteTask