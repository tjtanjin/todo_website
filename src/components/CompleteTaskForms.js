import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Error, Success } from "./AuthForms";
import { decode } from 'jsonwebtoken'

function CompleteTask(data) {

  // declare stateful values to be used 
  const [submitResult, setSubmitResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  /*
  The function putCompleteTask makes a PUT request to the API endpoint to mark the task as complete.
  Args:
      None     
  */
  function putCompleteTask() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.put(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks/" + data.id, {
      "priority": "Completed"
    }, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setIsSuccess(true);
        data.getTasks();
        data.showToast("Task successfully completed.")
        data.onCloseModal();
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.")
        setIsError(true)
      }
    }).catch(e => {
      setSubmitResult(e.response.data.error);
      setIsError(true);
    });
  }

  // listen for enter key input to submit form
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

  // render complete task confirmation modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">
      <p className="prompt"> Are you sure you want to mark the task <span className="trackedcontent">{data.task_name}</span> as complete?</p>
      <br/>
      <button className="btn btn-dark btn-block" type="button" onClick={putCompleteTask}>Complete Task</button>
      <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
      { isSuccess &&<Success>Task completed!</Success> }
      { isError &&<Error>{submitResult}</Error> }
    </div>
  );
}

export default CompleteTask