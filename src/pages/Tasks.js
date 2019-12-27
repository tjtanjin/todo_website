import React, { useState, useEffect } from "react";
import axios from 'axios';
import NewTask from '../components/NewTaskForms'
import DetailsTask from '../components/DetailsTaskForms'
import EditTask from '../components/EditTaskForms'
import DeleteTask from '../components/DeleteTaskForms'
import CompleteTask from '../components/CompleteTaskForms'
import { Modal, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";

function Tasks(props) {
  const [taskChoice, setTaskChoice] = useState("In-progress");
  const [searchWord, setSearchWord] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setNewTaskShow] = useState(false);
  const [showDetailsTask, setDetailsTaskShow] = useState(false);
  const [showEditTask, setEditTaskShow] = useState(false);
  const [showDeleteTask, setDeleteTaskShow] = useState(false);
  const [showCompleteTask, setCompleteTaskShow] = useState(false);
  const [trackedTask, setTrackedTask] = useState({});

  const handleNewTaskClose = () => setNewTaskShow(false);
  const handleNewTaskShow = () => setNewTaskShow(true);
  const handleDetailsTaskClose = () => setDetailsTaskShow(false);
  const handleDetailsTaskShow = () => setDetailsTaskShow(true);
  const handleEditTaskClose = () => setEditTaskShow(false);
  const handleEditTaskShow = () => setEditTaskShow(true);
  const handleDeleteTaskClose = () => setDeleteTaskShow(false);
  const handleDeleteTaskShow = () => setDeleteTaskShow(true);
  const handleCompleteTaskClose = () => setCompleteTaskShow(false);
  const handleCompleteTaskShow = () => setCompleteTaskShow(true);

  useEffect(() => {
    getTasks();
  }, []);

  function renderTableHeader() {
    let header = ["INDEX", "TASK NAME", "CATEGORY", "PRIORITY", "DEADLINE", "ACTIONS/TOOLS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  function renderTableData() {

    const action_button = (click_action, task, icon, text) => (
      <OverlayTrigger overlay={renderTooltip(text)}>
        <button type="button" onClick={() => {click_action(); setTrackedTask(task)}}><i className={icon}></i></button>
      </OverlayTrigger>
    );

    return tasks.map((task, index) => {

      if ((searchWord === "" || task.category.toUpperCase().includes(searchWord.toUpperCase())) && (taskChoice === "All Tasks" || (taskChoice === "In-progress" && task.priority !== "Completed") || taskChoice === task.priority)) {
        const { id, task_name, category, priority, deadline } = task
        let details_button = action_button(handleDetailsTaskShow, task, "fa fa-info-circle", "View task details")
        let edit_button = action_button(handleEditTaskShow, task, "fa fa-wrench", "Edit task")
        let delete_button = action_button(handleDeleteTaskShow, task, "fa fa-remove", "Delete task")
        let complete_button = action_button(handleCompleteTaskShow, task, "fa fa-check", "Mark as complete")
        if (task.priority === "Completed") {
          edit_button = "";
          complete_button = "";
        }
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{task_name}</td>
            <td>{category}</td>
            <td className={priority}>{priority}</td>
            <td>{deadline}</td>
            <td>{details_button}{edit_button}{delete_button}{complete_button}</td>
          </tr>
        )
      } else {}
    })
  }

  function renderTooltip(text) {
    return <Tooltip delay={{ show: 250, hide: 400 }}>{text}</Tooltip>;
  }

  function getTasks() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.get(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks", {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setTasks(result.data);
      } else {

      }
    }).catch(e => {

    });
  }

  return (
    <div className="content-inner">
      <Navbar></Navbar>

      <h3>Tasks</h3>
        <div className="search">
          <input type="text" value={searchWord}
            className="searchTerm" 
            onChange={e => {
              setSearchWord(e.target.value);
            }} placeholder="Search by Category"/>
          <button type="submit" className="searchButton">
            <i class="fa fa-search"></i>
          </button>
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
      <table id="content-table">
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
      <br/>
      <button type="button" className="btn btn-dark btn-block" variant="primary" onClick={handleNewTaskShow}>
        Create New Task
      </button>

      <Modal show={showNewTask} onHide={handleNewTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><NewTask onCloseModal={handleNewTaskClose} getTasks={getTasks}></NewTask></Modal.Body>
      </Modal>

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

      <Modal show={showCompleteTask} onHide={handleCompleteTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Complete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><CompleteTask id={trackedTask.id} task_name={trackedTask.task_name} onCloseModal={handleCompleteTaskClose} getTasks={getTasks}></CompleteTask></Modal.Body>
      </Modal>
    </div>
  )
}

export default Tasks