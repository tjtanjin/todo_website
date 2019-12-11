import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import { decode } from 'jsonwebtoken'
import { useAuth } from "../context/auth";

function Tasks(props) {
  const [totasks, setToTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { setAuthTokens } = useAuth();

  useEffect(() => {
    getTasks();
  }, []);

  function goNewTask() {
    return <Redirect to="/login/" />
  }

  function logOut() {
    setAuthTokens();
  }

  function renderTableHeader() {
      let header = ["ID", "TASK NAME", "DESCRIPTION", "CATEGORY", "TAG", "DEADLINE", "CREATED AT", "UPDATED AT"]
      return header.map((key, index) => {
         return <th key={index}>{key}</th>
      })
   }

  function renderTableData() {
    return tasks.map((task, index) => {
      const { id, job_name, job_desc, category, tag, due, created_at, updated_at } = task
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
                <Link className="nav-link" to={"/"} onClick={logOut}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <h3>Tasks</h3>
      <table id='students'>
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
      <button className="btn btn-primary btn-block" onClick={event => window.location.href='/new'}>Create New Task</button>
    </div>
  )
}

export default Tasks