import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Form } from "../components/AuthForms";
import { Modal } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";
import { compareDate, Loading, top5 } from "../components/Utils";
import { useAuth } from "../context/auth"
import ReactStoreIndicator from 'react-score-indicator'

function Dashboard(props) {

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();
  const [showLoading, setLoadingShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [countTasks, setCountTasks] = useState(0);
  const [countCompleted, setCountCompleted] = useState(0);
  const [countLow, setCountLow] = useState(0);
  const [countMedium, setCountMedium] = useState(0);
  const [countHigh, setCountHigh] = useState(0);
  const [arrTop, setArrTop] = useState([[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]);

  // declare controllers for showing and hiding modals
  const handleLoadingClose = () => setLoadingShow(false);
  const handleLoadingShow = () => setLoadingShow(true);

  // get tasks at the start
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
    let header = ["TASK NAME", "CATEGORY", "PRIORITY", "DAYS LEFT"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  /*
  The function renderTableData generates the tasks table containing the relevant information as specified by the admin.
  Args:
      None     
  */
  function renderTableData() {

    const table = tasks.map((task, index) => {
      const expirydate = compareDate(task.deadline);
      if (expirydate >= 0 && expirydate <= 3) {
        const { id, task_name, category, priority, deadline } = task
        return (
          <tr key={id}>
            <td>{task_name}</td>
            <td>{category}</td>
            <td className={priority}>{priority}</td>
            <td className="text-danger">{compareDate(deadline)}</td>
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
      return <h4 className="prompt">You have no tasks due within the next 3 days!</h4>
    }
  }

  /*
  The function rendertop5 generates the top 5 task categories of the user and expresses them as a percentage of the total tasks.
  Args:
      None     
  */
  function rendertop5() {
    const table = arrTop.map((task, index) => {
      return (
        <div>
          <h4 class="small font-weight-bold">{arrTop[index][0]}<span class="float-right">{Math.ceil(arrTop[index][1]*100/countTasks) + "%"}</span></h4>
          <div class="progress mb-4">
            <div class="progress-bar bg-success" role="progressbar" style={{ width: arrTop[index][1]*100/countTasks + "%" }} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      )
    })
    if (!table.every(e => e === null)) {
      return <div>{table}</div>
    } else {
      return <h4 className="prompt">You do not have any task!</h4>
    }
  }

  /*
  The function display_data takes tasks data and renders values to the dashboard accordingly.
  Args:
      data: tasks data returned from the API
  */
  function display_data(data) {
    let completed = 0;
    let low = 0;
    let medium = 0;
    let high = 0;
    let category_arr = [];
    data.forEach(task => {
      if (task.priority === "Completed") { 
        completed += 1;
      }
      if (task.priority === "Low") {
        low += 1;
      }
      if (task.priority === "Medium") {
        medium += 1;
      }
      if (task.priority === "High") {
        high += 1;
      }
      category_arr.push(task.category.toUpperCase());
    })
    setArrTop(top5(category_arr));
    setCountCompleted(completed);
    setCountLow(low);
    setCountMedium(medium);
    setCountHigh(high);
    setCountTasks(completed + low + medium + high);
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
        display_data(result.data);
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

  // render dashboard page
  return (
    <div class="container-fluid dashboard-inner">
    <Navbar></Navbar>

      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Completed Tasks</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{countCompleted}</div>
                </div>
              </div>
              <Link class="d-none d-sm-inline-block btn btn-sm btn-info pull-right shadow-sm" to={{
                pathname: '/tasks',
                state: { defaultTaskChoice: "Completed" }
              }}>View Completed</Link>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">High Priority Tasks</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{countHigh}</div>
                </div>
              </div>
              <Link class="d-none d-sm-inline-block btn btn-sm btn-danger pull-right shadow-sm" to={{
                pathname: '/tasks',
                state: { defaultSearchWord: "High", defaultSearchType: "priority" }
              }}>View High Priority</Link>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Medium Priority Tasks</div>
                  <div class="row no-gutters align-items-center">
                    <div class="col-auto">
                      <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">{countMedium}</div>
                    </div>
                  </div>
                  <Link class="d-none d-sm-inline-block btn btn-sm btn-warning pull-right shadow-sm" to={{
                    pathname: '/tasks',
                    state: { defaultSearchWord: "Medium", defaultSearchType: "priority" }
                  }}>View Medium Priority</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Low Priority Tasks</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{countLow}</div>
                </div>
              </div>
              <Link class="d-none d-sm-inline-block btn btn-sm btn-success pull-right shadow-sm" to={{
                pathname: '/tasks',
                state: { defaultSearchWord: "Low", defaultSearchType: "priority" }
              }}>View Low Priority</Link>
            </div>
          </div>
        </div>
      </div>


      <div class="row">
        <div class="col-xl-8 col-lg-7">
          <div class="card shadow mb-4 dashboard-card">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-danger">Expiring Tasks</h6>
            </div>
            <div class="card-body dashboard-body">
              <div class="list-group">
                {renderTableData()}
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-lg-5">
          <div class="card shadow mb-4 dashboard-card">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-success">Task Completion Score</h6>
            </div>
            <div class="card-body">
              <ReactStoreIndicator
                value={100}
                maxValue={100}
              />
              <h4 className="prompt">Coming soon</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-dark">Top 5 Task Categories</h6>
            </div>
            <div class="card-body">
              {rendertop5()}
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Statistics</h6>
            </div>
            <div class="card-body">
              <h4 className="prompt">Coming soon</h4>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showLoading}>
        <Modal.Body>
          <h5 className="prompt">Loading</h5><br/>
          <Form><Loading></Loading></Form></Modal.Body>
      </Modal>

    </div>
  );
}

export default Dashboard;
