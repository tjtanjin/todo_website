import React, { useState, useEffect } from "react";
import axios from 'axios';
import EditTask from '../components/EditTaskForms'
import DeleteTask from '../components/DeleteTaskForms'
import { Error, Success } from "../components/AuthForms";
import { Modal } from 'react-bootstrap'
import { decode } from 'jsonwebtoken'

function UserTasks(data) {
  const onCloseModal = data.onCloseModal
  data = data.user
  const [searchWord, setSearchWord] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showEditTask, setEditTaskShow] = useState(false);
  const [showDeleteTask, setDeleteTaskShow] = useState(false);
  const [trackedTask, setTrackedTask] = useState({});

  const handleEditTaskClose = () => setEditTaskShow(false);
  const handleEditTaskShow = () => setEditTaskShow(true);
  const handleDeleteTaskClose = () => setDeleteTaskShow(false);
  const handleDeleteTaskShow = () => setDeleteTaskShow(true);

  useEffect(() => {
    getTasks();
  }, []);

  function renderTableHeader() {
    let header = ["ID", "TASK NAME", "DESCRIPTION", "CATEGORY", "PRIORITY", "DEADLINE", "ACTIONS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  function renderTableData() {
    return tasks.map((task, index) => {
      if (searchWord === "" || task.category.includes(searchWord)) {
        const { id, job_name, job_desc, category, tag, due } = task
        const edit_button = <button type="button" onClick={() => {handleEditTaskShow(); setTrackedTask(task)}}><i className="fa fa-wrench"></i></button>
        const delete_button = <button type="button" onClick={() => {handleDeleteTaskShow(); setTrackedTask(task)}}><i className="fa fa-remove"></i></button>
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{job_name}</td>
            <td>{job_desc}</td>
            <td>{category}</td>
            <td className={tag}>{tag}</td>
            <td>{due}</td>
            <td>{edit_button}{delete_button}</td>
          </tr>
        )
      } else {}
    })
  }

  function getTasks() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    axios.get(process.env.REACT_APP_API_LINK + "/users/" + data.id + "/tasks", {
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
      <table id="content-table">
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
      <br/>
      <button type="button" className="btn btn-dark btn-block" variant="primary" onClick={onCloseModal}>
        Close
      </button>

      <Modal show={showEditTask} onHide={handleEditTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><EditTask task={trackedTask} onCloseModal={onCloseModal} getTasks={getTasks}></EditTask></Modal.Body>
      </Modal>

      <Modal show={showDeleteTask} onHide={handleDeleteTaskClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body><DeleteTask id={trackedTask.id} job_name={trackedTask.job_name} onCloseModal={handleDeleteTaskClose} getTasks={getTasks}></DeleteTask></Modal.Body>
      </Modal>
    </div>
  );
}

export default UserTasks