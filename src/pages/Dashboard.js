import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Form } from "../components/AuthForms";
import { Modal, Dropdown, OverlayTrigger } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";
import { renderTooltip, calculateExpiry, compareDate, Loading, retrieveTaskCategories, scoreMessage, noticeMessage } from "../components/Utils";
import { useAuth } from "../context/auth"
import ReactStoreIndicator from 'react-score-indicator'

function Dashboard(props) {

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();
  const [showLoading, setLoadingShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [countExpiry, setCountExpiry] = useState(3);
  const [countExpiryText, setCountExpiryText] = useState("3 Days");
  const [countTasks, setCountTasks] = useState(0);
  const [countOverdue, setCountOverdue] = useState(0);
  const [countCompleted, setCountCompleted] = useState(0);
  const [countLow, setCountLow] = useState(0);
  const [countMedium, setCountMedium] = useState(0);
  const [countHigh, setCountHigh] = useState(0);
  const [countCompletionScore, setCountCompletionScore] = useState(100);
  const [shortestTime, setShortestTime] = useState("NA");
  const [longestTime, setLongestTime] = useState("NA");
  const [arrCat, setArrCat] = useState([]);

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
      let expirydate = calculateExpiry(task.deadline);
      if ((expirydate >= 0 && expirydate <= countExpiry) && task.priority !== "Completed" && task.priority !== "Overdue") {
        if (expirydate === 0) {
          expirydate = "Today";
        }
        const { id, task_name, category, priority } = task
        return (
          <tr key={id}>
            <td>{task_name}</td>
            <td>{category}</td>
            <td className={priority}>{priority}</td>
            <td className="text-danger">{expirydate}</td>
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
      return <h4 className="prompt">You have no tasks due within the next {countExpiryText}!</h4>
    }
  }

  /*
  The function renderTaskCategories generates unique task categories of the user and expresses them as a percentage of the total tasks.
  Args:
      None     
  */
  function renderTaskCategories() {
    const table = arrCat.map((task, index) => {
      return (
        <div>
          <h4 class="small font-weight-bold">{arrCat[index][0]}<span class="float-right">{Math.ceil(arrCat[index][1]*100/countTasks) + "%"}</span></h4>
          <div class="progress mb-4">
            <div class="progress-bar bg-success" role="progressbar" style={{ width: arrCat[index][1]*100/countTasks + "%" }} aria-valuemin="0" aria-valuemax="100"></div>
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
    if (data.length === 0) {
      return;
    }
    let overdue = 0;
    let completed = 0;
    let low = 0;
    let medium = 0;
    let high = 0;
    let category_arr = [];
    let shortest = 999999999999;
    let longest = -1;
    data.forEach(task => {
      if (task.priority === "Overdue") {
        overdue += 1;
      }
      if (task.priority === "Completed") { 
        completed += 1;
        const completiontime = compareDate(task.created_at.slice(0, 10), task.updated_at.slice(0, 10));
        if (completiontime < shortest) {
          shortest = completiontime;
        }
        if (completiontime > longest) {
          longest = completiontime;
        }
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
    if (shortest === 999999999999 && longest === -1) {
      shortest = "NA";
      longest = "NA";
    }
    setArrCat(retrieveTaskCategories(category_arr));
    setCountOverdue(overdue);
    setCountCompleted(completed);
    setCountLow(low);
    setCountMedium(medium);
    setCountHigh(high);
    setCountTasks(overdue + completed + low + medium + high);
    setCountCompletionScore((100 - overdue/(overdue + completed + low + medium + high) * 100).toFixed(1));
    setShortestTime(shortest);
    setLongestTime(longest);
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
              <OverlayTrigger overlay={renderTooltip("Expiring tasks shows tasks that are expiring within a period chosen from the dropdown on the right")}>
                <h6 class="m-0 font-weight-bold text-danger">Expiring Tasks ({countExpiryText})</h6>
              </OverlayTrigger>
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    Select Period
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {setCountExpiry(1); setCountExpiryText("1 Day")}}>1 Day</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setCountExpiry(3); setCountExpiryText("3 Days")}}>3 Days</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setCountExpiry(7); setCountExpiryText("1 Week")}}>1 Week</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setCountExpiry(30); setCountExpiryText("1 Month")}}>1 Month</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
              <OverlayTrigger overlay={renderTooltip("Task completion score is calculated based on your percentage of tasks overdue")}>
                <h6 class="m-0 font-weight-bold text-success">Task Completion Score</h6>
              </OverlayTrigger>
            </div>
            <div class="card-body">
              <ReactStoreIndicator
                value={countCompletionScore}
                maxValue={100}
              />
              {scoreMessage(countCompletionScore)}
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card shadow mb-4 dashboard-card">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <OverlayTrigger overlay={renderTooltip("Task categories breakdown shows you the percentage of your unique task categories")}>
                <h6 class="m-0 font-weight-bold text-info">Task Categories Breakdown</h6>
              </OverlayTrigger>
            </div>
            <div class="card-body dashboard-body">
              {renderTaskCategories()}
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="card shadow mb-4 dashboard-card">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <OverlayTrigger overlay={renderTooltip("Statistics shows you facts about your usage of our app")}>
                <h6 class="m-0 font-weight-bold text-info">User Information</h6>
              </OverlayTrigger>
            </div>
            <div class="card-body dashboard-body">
              <h6 class="font-weight-bold prompt">Notice:</h6>
              <p class="font-weight-bold text-info prompt">{noticeMessage(arrCat)}</p>
              <h6 class="font-weight-bold prompt">Statistics:</h6>
              <p class="font-weight-bold">Shortest time to complete a task: <span class="text-info">{shortestTime}</span> Day(s)</p>
              <p class="font-weight-bold">Longest time to complete a task: <span class="text-info">{longestTime}</span> Day(s)</p>
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
