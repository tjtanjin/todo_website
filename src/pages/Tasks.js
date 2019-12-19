import React, { useState, useEffect } from "react";
import axios from 'axios';
import NewTask from '../components/NewTaskForms'
import EditTask from '../components/EditTaskForms'
import DeleteTask from '../components/DeleteTaskForms'
import { Modal } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";

function Tasks(props) {
  const [searchWord, setSearchWord] = useState("");
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

  function renderTableHeader() {
    let header = ["ID", "TASK NAME", "DESCRIPTION", "CATEGORY", "TAG", "DEADLINE", "CREATED AT", "UPDATED AT", "ACTIONS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  function renderTableData() {
    return tasks.map((task, index) => {
      if (searchWord === "" || task.category.includes(searchWord)) {
        const { id, job_name, job_desc, category, tag, due, created_at, updated_at } = task
        const edit_button = <button type="button" onClick={() => {handleEditTaskShow(); setTrackedTask(task)}}><i className="fa fa-wrench"></i></button>
        const delete_button = <button type="button" onClick={() => {handleDeleteTaskShow(); setTrackedTask(task)}}><i className="fa fa-remove"></i></button>
        return (
          <tr key={id}>
            <td>{index + 1}</td>
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
      } else {}
    })
  }

  function getTasks() {
    const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
    const user_id = decode(token).user_id;
    axios.get(process.env.REACT_APP_API_LINK + "/api/v1/users/" + user_id + "/tasks", {
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
      <Navbar></Navbar>

      <h3>Tasks</h3>
        <div class="search">
          <input type="text" value={searchWord}
            className="searchTerm" 
            onChange={e => {
              setSearchWord(e.target.value);
            }} placeholder="Search by Category"/>
          <button type="submit" className="searchButton">
            <i class="fa fa-search"></i>
          </button>
        </div>
      <table id="tasks">
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
        <Modal.Body><NewTask onCloseModal={handleNewTaskClose}></NewTask></Modal.Body>
      </Modal>

      <Modal show={showEditTask} onHide={handleEditTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><EditTask task={trackedTask} onCloseModal={handleEditTaskClose}></EditTask></Modal.Body>
      </Modal>

      <Modal show={showDeleteTask} onHide={handleDeleteTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><DeleteTask id={trackedTask.id} job_name={trackedTask.job_name} onCloseModal={handleDeleteTaskClose}></DeleteTask></Modal.Body>
      </Modal>
    </div>
  )
}

export default Tasks