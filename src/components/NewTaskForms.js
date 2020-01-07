import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "./AuthForms";
import { decode } from 'jsonwebtoken'
import { Loading, validateTask } from './Utils';

function NewTask(data) {

  // declare stateful values to be used
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [task_name, setTaskName] = useState("");
  const [task_description, setTaskDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  /*
  The function postNewTask makes a POST request to the API endpoint to create a new task.
  Args:
      None     
  */
  function postNewTask() {
    const validateInput = validateTask(task_name, task_description, category, priority, deadline);
    if (validateInput !== true) {
      setSubmitResult(validateInput);
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.post(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks", {
      task_name,
      task_description,
      category,
      priority,
      deadline,
      user_id
    }, {
      headers: { Authorization: token }
    }).then(result => {
      setIsLoading(false);
      if (result.status === 200) {
        setIsSuccess(true);
        data.getTasks();
        data.showToast("Task successfully created.")
        data.onCloseModal();
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.")
        setIsError(true);
      }
    }).catch(e => {
      setIsLoading(false);
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

  // render new task modal
  return (
    <div className="auth-inner">
      <Form>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="task_name"
            value={task_name}
            className="form-control" 
            onChange={e => {
              setTaskName(e.target.value);
            }}
            placeholder="Enter task name"
          />
        </div>

        <div className="form-group">
          <label>Task Description</label>
          <input
            type="task_description"
            value={task_description}
            className="form-control" 
            onChange={e => {
              setTaskDescription(e.target.value);
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
            type="priority"
            value={priority}
            className="form-control" 
            onChange={e => {
              setPriority(e.target.value);
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
            value={deadline}
            className="form-control" 
            onChange={e => {
              setDeadline(e.target.value);
            }}
            placeholder="Enter deadline"
          />
        </div>

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={postNewTask}>Create</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Task created!</Success> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>
    </div>
  );
}

export default NewTask;
