import React, { useState, useEffect } from "react";
import axios from 'axios';
import NewTask from '../components/NewTaskForms'
import DetailsTask from '../components/DetailsTaskForms'
import EditTask from '../components/EditTaskForms'
import DeleteTask from '../components/DeleteTaskForms'
import CompleteTask from '../components/CompleteTaskForms'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Form } from "../components/AuthForms";
import { Modal, Dropdown, OverlayTrigger, Toast } from 'react-bootstrap'
import { renderTooltip, Loading } from '../components/Utils'
import { useAuth } from "../context/auth"
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";

function Tasks(props) {

  // prepare passed in data
  let defaultSearchWord = "";
  let defaultSearchType = "category";
  let defaultTaskChoice = "In-progress";

  const priorityOrder = ["High", "Medium", "Low", "Overdue", "Completed"];

  function setDefaultValue(key, value) {
    if (props.location.state === null || props.location.state === undefined || props.location.state[key] === undefined ) {
      return value;
    } else {
      return props.location.state[key];
    }
  }

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();
  const [taskChoice, setTaskChoice] = useState(setDefaultValue("defaultTaskChoice", defaultTaskChoice));
  const [searchType, setSearchType] = useState(setDefaultValue("defaultSearchType", defaultSearchType));
  const [searchWord, setSearchWord] = useState(setDefaultValue("defaultSearchWord", defaultSearchWord));
  const [tasks, setTasks] = useState([]);
  const [showLoading, setLoadingShow] = useState(false);
  const [showNewTask, setNewTaskShow] = useState(false);
  const [showDetailsTask, setDetailsTaskShow] = useState(false);
  const [showEditTask, setEditTaskShow] = useState(false);
  const [showDeleteTask, setDeleteTaskShow] = useState(false);
  const [showCompleteTask, setCompleteTaskShow] = useState(false);
  const [trackedTask, setTrackedTask] = useState({});
  const [toast, showToast] = useState(false);
  const [toastText, setToastText] = useState("");

  // declare controllers for showing and hiding modals
  const handleLoadingClose = () => setLoadingShow(false);
  const handleLoadingShow = () => setLoadingShow(true);
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

  // get all tasks belonging to the user at the start
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

    let count = 0
    tasks.sort(function (a,b){
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    });;
    const table = tasks.map((task, index) => {
      if ((searchWord === "" || task[searchType].toUpperCase().includes(searchWord.toUpperCase())) && (taskChoice === "All Tasks" || (taskChoice === "In-progress" && task.priority !== "Completed" && task.priority !== "Overdue") || taskChoice === task.priority)) {
        const { id, task_name, category, priority, deadline } = task
        let details_button = action_button(handleDetailsTaskShow, task, "fa fa-info-circle", "View task details")
        let edit_button = action_button(handleEditTaskShow, task, "fa fa-wrench", "Edit task")
        let delete_button = action_button(handleDeleteTaskShow, task, "fa fa-remove", "Delete task")
        let complete_button = action_button(handleCompleteTaskShow, task, "fa fa-check", "Mark as complete")
        if (task.priority === "Completed" || task.priority === "Overdue") {
          edit_button = "";
          complete_button = "";
        }
        count += 1;
        return (
          <tr key={id}>
            <td>{count}</td>
            <td>{task_name}</td>
            <td>{category}</td>
            <td className={priority}>{priority}</td>
            <td>{deadline}</td>
            <td>{details_button}{edit_button}{delete_button}{complete_button}</td>
          </tr>
        )
      } else {}
      return null;
    })
    if (!table.every(e => e === null)) {
      return (
        <table id="task-table">
          <tbody>
            <tr>{renderTableHeader()}</tr>
            {table}
          </tbody>
        </table>
      )
    } else {
      return <div class="card-body"><br/><br/><h3 className="prompt">You have no tasks!</h3></div>
    }
  }

  /*
  The function getTasks makes a GET request to the API endpoint to get all tasks of the user.
  Args:
      None     
  */
  function getTasks() {
    handleLoadingShow();
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.get(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/tasks", {
      headers: { Authorization: token }
    }).then(result => {
      handleLoadingClose();
      if (result.status === 200) {
        setTasks(result.data);
      } else {
        alert("An error has occurred, please contact an administrator.")
      }
    }).catch(e => {
      handleLoadingClose();
      if (e.message.includes("401")) {
        alert("Please login again.");
        setAuthTokens("undefined");
      } else {
        alert(e);
      }
    });
  }

  // render tasks page
  return (
    <div>
      <Navbar></Navbar>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'relative',
          minHeight: '25px',
          zIndex: 100,
        }}
      >
        <Toast onClose={() => showToast(false)} show={toast} delay={3000} autohide
          style={{
            position: 'absolute',
            top: 0,
            right: 20,
            width: '300px',
            background: '#ccf8fc',
          }}
        >
          <Toast.Header style={{ background: '#ccf8fc' }}>
            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body style={{ textAlign: 'center', fontWeight: 'bold' }}>{toastText}</Toast.Body>
        </Toast>
      </div>
      <div className="content-inner col-xl-9 col-md-9 col-sm-12">

        <h3>Tasks</h3>
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
                <Dropdown.Item onClick={() => setTaskChoice("Overdue")}>Overdue</Dropdown.Item>
                <Dropdown.Item onClick={() => setTaskChoice("All Tasks")}>All Tasks</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        <br/>
        <div class="tabledisplay">
          {renderTableData()}
        </div>
        <br/>
        <button type="button" className="btn btn-dark btn-block" variant="primary" onClick={handleNewTaskShow}>
          Create New Task
        </button>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn btn-dark btn-block"
          table="task-table"
          filename="tasks"
          sheet="tasks-sheet"
          buttonText="Download Tasks"/>

        <Modal show={showLoading}>
          <Modal.Body>
            <h5 className="prompt">Loading</h5><br/>
            <Form><Loading></Loading></Form></Modal.Body>
        </Modal>

        <Modal show={showNewTask} onHide={handleNewTaskClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body><NewTask onCloseModal={handleNewTaskClose} showToast={(e) => {showToast(true); setToastText(e)}} getTasks={getTasks}></NewTask></Modal.Body>
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
          <Modal.Body><EditTask task={trackedTask} onCloseModal={handleEditTaskClose} showToast={(e) => {showToast(true); setToastText(e)}} getTasks={getTasks}></EditTask></Modal.Body>
        </Modal>

        <Modal show={showDeleteTask} onHide={handleDeleteTaskClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Delete Task</Modal.Title>
          </Modal.Header>
          <Modal.Body><DeleteTask id={trackedTask.id} task_name={trackedTask.task_name} onCloseModal={handleDeleteTaskClose} showToast={(e) => {showToast(true); setToastText(e)}} getTasks={getTasks}></DeleteTask></Modal.Body>
        </Modal>

        <Modal show={showCompleteTask} onHide={handleCompleteTaskClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Complete Task</Modal.Title>
          </Modal.Header>
          <Modal.Body><CompleteTask id={trackedTask.id} task_name={trackedTask.task_name} onCloseModal={handleCompleteTaskClose} showToast={(e) => {showToast(true); setToastText(e)}} getTasks={getTasks}></CompleteTask></Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default Tasks