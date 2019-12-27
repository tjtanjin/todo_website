import React, { useState, useEffect } from "react";
import axios from 'axios';
import DetailsTask from '../components/DetailsTaskForms'
import EditTask from '../components/EditTaskForms'
import DeleteTask from '../components/DeleteTaskForms'
import { Error, Success } from "../components/AuthForms";
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { decode } from 'jsonwebtoken'

function UserTasks(data) {
  const onCloseModal = data.onCloseModal
  data = data.user
  const [searchWord, setSearchWord] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showDetailsTask, setDetailsTaskShow] = useState(false);
  const [showEditTask, setEditTaskShow] = useState(false);
  const [showDeleteTask, setDeleteTaskShow] = useState(false);
  const [trackedTask, setTrackedTask] = useState({});

  const handleDetailsTaskClose = () => setDetailsTaskShow(false);
  const handleDetailsTaskShow = () => setDetailsTaskShow(true);
  const handleEditTaskClose = () => setEditTaskShow(false);
  const handleEditTaskShow = () => setEditTaskShow(true);
  const handleDeleteTaskClose = () => setDeleteTaskShow(false);
  const handleDeleteTaskShow = () => setDeleteTaskShow(true);

  useEffect(() => {
    getTasks();
  }, []);

  function renderTableHeader() {
    let header = ["ID", "TASK NAME", "CATEGORY", "PRIORITY", "DEADLINE", "ACTIONS/TOOLS"]
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
      if (searchWord === "" || task.category.includes(searchWord)) {
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
    })
  }

  function renderTooltip(text) {
    return <Tooltip delay={{ show: 250, hide: 400 }}>{text}</Tooltip>;
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