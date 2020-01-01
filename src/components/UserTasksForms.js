import React, { useState, useEffect } from "react";
import axios from 'axios';
import DetailsTask from './DetailsTaskForms'
import EditTask from './EditTaskForms'
import DeleteTask from './DeleteTaskForms'
import { Modal, Dropdown, OverlayTrigger } from 'react-bootstrap'
import { renderTooltip } from './Utils'

function UserTasks(data) {

  // prepared pass in data
  const onCloseModal = data.onCloseModal
  data = data.user

  // declare stateful values to be used
  const [taskChoice, setTaskChoice] = useState("In-progress");
  const [searchType, setSearchType] = useState("category");
  const [searchWord, setSearchWord] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showDetailsTask, setDetailsTaskShow] = useState(false);
  const [showEditTask, setEditTaskShow] = useState(false);
  const [showDeleteTask, setDeleteTaskShow] = useState(false);
  const [trackedTask, setTrackedTask] = useState({});

  // declare controllers for showing and hiding modals
  const handleDetailsTaskClose = () => setDetailsTaskShow(false);
  const handleDetailsTaskShow = () => setDetailsTaskShow(true);
  const handleEditTaskClose = () => setEditTaskShow(false);
  const handleEditTaskShow = () => setEditTaskShow(true);
  const handleDeleteTaskClose = () => setDeleteTaskShow(false);
  const handleDeleteTaskShow = () => setDeleteTaskShow(true);

  // get all tasks belonging to specified user at the start
  useEffect(() => {
    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  The function renderTableHeader generates the header for the tasks table.
  Args:
      None     
  */
  function renderTableHeader() {
    let header = ["INDEX", "TASK NAME", "CATEGORY", "PRIORITY", "DEADLINE", "ACTIONS/TOOLS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  /*
  The function renderTableData generates the tasks table containing the relevant information as specified by the user.
  Args:
      None     
  */
  function renderTableData() {

    const action_button = (click_action, task, icon, text) => (
      <OverlayTrigger overlay={renderTooltip(text)}>
        <button type="button" onClick={() => {click_action(); setTrackedTask(task)}}><i className={icon}></i></button>
      </OverlayTrigger>
    );

    const table = tasks.map((task, index) => {
      if ((searchWord === "" || task[searchType].toUpperCase().includes(searchWord.toUpperCase())) && (taskChoice === "All Tasks" || (taskChoice === "In-progress" && task.priority !== "Completed") || taskChoice === task.priority)) {
        const { id, task_name, category, priority, deadline } = task
        let details_button = action_button(handleDetailsTaskShow, task, "fa fa-info-circle", "View task details")
        let edit_button = action_button(handleEditTaskShow, task, "fa fa-wrench", "Edit task")
        let delete_button = action_button(handleDeleteTaskShow, task, "fa fa-remove", "Delete task")
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{task_name}</td>
            <td>{category}</td>
            <td className={priority}>{priority}</td>
            <td>{deadline}</td>
            <td>{details_button}{edit_button}{delete_button}</td>
          </tr>
        )
      } else {}
      return null;
    })
    if (!table.every(e => e === null)) {
      return (
        <table id="content-table">
          <tbody>
            <tr>{renderTableHeader()}</tr>
            {table}
          </tbody>
        </table>
      )
    } else {
      return <div class="card-body"><br/><br/><h3 className="prompt">{data.name} has no task!</h3></div>
    }
  }

  /*
  The function getTasks makes a GET request to the API endpoint to get all tasks of the specified user.
  Args:
      None     
  */
  function getTasks() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    axios.get(process.env.REACT_APP_API_LINK + "/users/" + data.id + "/tasks", {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setTasks(result.data);
      } else {
        alert("An error has occurred, please contact an administrator.")
      }
    }).catch(e => {
      alert(e)
    });
  }

  // render user tasks modal for admin
  return (
    <div className="content-inner">
      <div className="search">
          <input type="text" value={searchWord}
            className="searchTerm" 
            onChange={e => {
              setSearchWord(e.target.value);
            }} placeholder={"Search by " + searchType}/>
          <Dropdown>
            <Dropdown.Toggle variant="dark">
              <i class="fa fa-search"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchType("task_name")}>Task Name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("category")}>Category</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("priority")}>Priority</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="sort-task"> 
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              {taskChoice}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTaskChoice("In-progress")}>In-progress</Dropdown.Item>
              <Dropdown.Item onClick={() => setTaskChoice("Completed")}>Completed</Dropdown.Item>
              <Dropdown.Item onClick={() => setTaskChoice("All Tasks")}>All Tasks</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      <br/>
      {renderTableData()}
      <br/>
      <button type="button" className="btn btn-dark btn-block" variant="primary" onClick={onCloseModal}>
        Close
      </button>

      <Modal show={showDetailsTask} onHide={handleDetailsTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>{trackedTask.task_name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body><DetailsTask task={trackedTask} onCloseModal={handleDetailsTaskClose} getTasks={getTasks}></DetailsTask></Modal.Body>
      </Modal>

      <Modal show={showEditTask} onHide={handleEditTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><EditTask task={trackedTask} onCloseModal={handleEditTaskClose} getTasks={getTasks}></EditTask></Modal.Body>
      </Modal>

      <Modal show={showDeleteTask} onHide={handleDeleteTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><DeleteTask id={trackedTask.id} task_name={trackedTask.task_name} onCloseModal={handleDeleteTaskClose} getTasks={getTasks}></DeleteTask></Modal.Body>
      </Modal>
    </div>
  );
}

export default UserTasks