import React, { useState, useEffect } from "react";
import axios from 'axios';
import NewTask from '../components/NewTaskForms'
import EditTask from '../components/EditTaskForms'
import DeleteTask from '../components/DeleteTaskForms'
import { Modal } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { decode } from 'jsonwebtoken'
import { useAuth } from "../context/auth";

function Tasks(props) {
  const { setAuthTokens } = useAuth();
  const [totasks, setToTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setNewTaskShow] = useState(false);
  const [showEditTask, setEditTaskShow] = useState(false);
  const [showDeleteTask, setDeleteTaskShow] = useState(false);
  const [trackedTask, setTrackedTask] = useState({});

  const handleNewTaskClose = () => setNewTaskShow(false);
  const handleNewTaskShow = () => setNewTaskShow(true);
  const handleEditTaskClose = () => setEditTaskShow(false);
  const handleEditTaskShow = () => setEditTaskShow(true);
  const handleDeleteTaskClose = () => setDeleteTaskShow(false);
  const handleDeleteTaskShow = () => setDeleteTaskShow(true);

  useEffect(() => {
    getTasks();
  }, []);

  function logOut() {
    setAuthTokens();
  }

  function renderTableHeader() {
      let header = ["ID", "TASK NAME", "DESCRIPTION", "CATEGORY", "TAG", "DEADLINE", "CREATED AT", "UPDATED AT", "ACTIONS"]
      return header.map((key, index) => {
         return <th key={index}>{key}</th>
      })
   }


  function renderTableData() {
    return tasks.map((task, index) => {
      const { id, job_name, job_desc, category, tag, due, created_at, updated_at } = task
      const edit_button = <button type="button" onClick={() => {handleEditTaskShow(); setTrackedTask(task)}}><i class="fa fa-wrench"></i></button>
      const delete_button = <button type="button" onClick={() => {handleDeleteTaskShow(); setTrackedTask(task)}}><i class="fa fa-remove"></i></button>
        return (
          <tr key={id}>
            <td>{id}</td>
            <td>{job_name}</td>
            <td>{job_desc}</td>
            <td>{category}</td>
            <td>{tag}</td>
            <td>{due}</td>
            <td>{created_at}</td>
            <td>{updated_at}</td>
            <td>{edit_button}{delete_button}</td>
          </tr>
        )
    })
  }

  function getTasks() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    const user_id = decode(token).user_id;
    axios.get("http://localhost:3000/api/v1/users/" + user_id + "/tasks", {
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
    <div className="tasks-inner">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Todo_Manager</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/profile"}>My Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/"} onClick={() => logOut}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <h3>Tasks</h3>
      <table id="students">
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
      <br/>
      <button type="button" className="btn btn-primary btn-block" variant="primary" onClick={handleNewTaskShow}>
        Create New Task
      </button>

      <Modal show={showNewTask} onHide={handleNewTaskClose}>
        <Modal.Header>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><NewTask></NewTask></Modal.Body>
      </Modal>

      <Modal show={showEditTask} onHide={handleEditTaskClose}>
        <Modal.Header>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><EditTask task={trackedTask}></EditTask></Modal.Body>
      </Modal>

      <Modal show={showDeleteTask} onHide={handleDeleteTaskClose}>
        <Modal.Header>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><DeleteTask id={trackedTask.id} job_name={trackedTask.job_name}></DeleteTask></Modal.Body>
      </Modal>
    </div>
  )
}

export default Tasks