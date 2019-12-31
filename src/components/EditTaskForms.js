import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Error, Success } from "./AuthForms";
import { decode } from 'jsonwebtoken'

function EditTask(data) {

  // prepared pass in data
  const onCloseModal = data.onCloseModal
  const getTasks = data.getTasks
  data = data.task

  // declare stateful values to be used 
  const [apiResult, setApiResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [task_name, setTaskName] = useState(data.task_name);
  const [task_description, setTaskDescription] = useState(data.task_description);
  const [category, setCategory] = useState(data.category);
  const [priority, setPriority] = useState(data.priority);
  const [deadline, setDeadline] = useState(data.deadline);

  /*
  The function putEditTask makes a PUT request to the API endpoint to edit the specified task.
  Args:
      None     
  */
  function putEditTask() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.put(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks/" + data.id, {
      task_name,
      task_description,
      category,
      priority,
      deadline,
    }, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setIsSuccess(true);
        getTasks();
        onCloseModal();
      } else {
        setApiResult("An error has occurred, please contact an administrator.")
        setIsError(true)
      }
    }).catch(e => {
      setApiResult(e.response.data.error);
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

  // render edit task modal
  return (
    <div className="auth-inner">
      <form>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="task_name"
            defaultValue={data.task_name}
            className="form-control" 
            onChange={e => {
              setTaskName(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label>Task Description</label>
          <input
            type="task_description"
            defaultValue={data.task_description}
            className="form-control" 
            onChange={e => {
              setTaskDescription(e.target.value);
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
          <select 
            type="priority"
            defaultValue={data.priority}
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
            defaultValue={data.deadline}
            className="form-control" 
            onChange={e => {
              setDeadline(e.target.value);
            }}
            placeholder="Enter deadline"
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