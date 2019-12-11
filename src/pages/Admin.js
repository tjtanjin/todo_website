import React, { useState, useEffect } from "react";
import axios from 'axios';
import { decode } from 'jsonwebtoken'
import { useAuth } from "../context/auth";

function Admin(props) {
  const [tasks, setTasks] = useState([]);
  const { setAuthTokens } = useAuth();

  useEffect(() => {
    getTasks();
  }, []);

  function logOut() {
    setAuthTokens();
  }

  function renderTableHeader() {
      let header = ["id", "job_name", "job_desc", "category", "tag", "due", "created_at", "updated_at"]
      return header.map((key, index) => {
         return <th key={index}>{key.toUpperCase()}</th>
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
      <h3>Tasks</h3>
      <table id='students'>
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
      <button className="btn btn-primary btn-block" onClick={logOut}>Log out</button>
    </div>
  )
}

export default Admin