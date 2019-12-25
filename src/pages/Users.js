import React, { useState, useEffect } from "react";
import axios from 'axios';
import UserTasks from '../components/UserTasksForms'
import AdminEditUser from '../components/AdminEditUserForms'
import AdminDeleteUser from '../components/AdminDeleteUserForms'
import { Modal } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";
import { formatDate } from "../components/Utils"

function Users(props) {
  const [searchWord, setSearchWord] = useState("");
  const [users, setUsers] = useState([]);
  const [showUserTasks, setUserTasksShow] = useState(false);
  const [showAdminEditUser, setAdminEditUserShow] = useState(false);
  const [showAdminDeleteUser, setAdminDeleteUserShow] = useState(false);
  const [trackedUser, setTrackedUser] = useState({});

  const handleUserTasksClose = () => setUserTasksShow(false);
  const handleUserTasksShow = () => setUserTasksShow(true);
  const handleAdminEditUserClose = () => setAdminEditUserShow(false);
  const handleAdminEditUserShow = () => setAdminEditUserShow(true);
  const handleAdminDeleteUserClose = () => setAdminDeleteUserShow(false);
  const handleAdminDeleteUserShow = () => setAdminDeleteUserShow(true);

  useEffect(() => {
    getUsers();
  }, []);

  function renderTableHeader() {
    let header = ["INDEX", "USERID", "USERNAME", "EMAIL", "CREATED_AT", "UPDATED_AT", "ACTIONS/TOOLS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  function renderTableData() {
    return users.map((user, index) => {
      if (searchWord === "" || user.name.includes(searchWord)) {
        const { id, name, email, created_at, updated_at } = user
        const info_button = <button type="button" onClick={() => {handleUserTasksShow(); setTrackedUser(user)}}><i className="fa fa-tasks"></i></button>
        const edit_button = <button type="button" onClick={() => {handleAdminEditUserShow(); setTrackedUser(user)}}><i className="fa fa-wrench"></i></button>
        const delete_button = <button type="button" onClick={() => {handleAdminDeleteUserShow(); setTrackedUser(user)}}><i className="fa fa-remove"></i></button>
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{id}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{formatDate(created_at)}</td>
            <td>{formatDate(updated_at)}</td>
            <td>{info_button}{edit_button}{delete_button}</td>
          </tr>
        )
      } else {}
    })
  }

  function getUsers() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    axios.get(process.env.REACT_APP_API_LINK + "/users/", {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setUsers(result.data);
      } else {

      }
    }).catch(e => {

    });
  }

  return (
    <div className="content-inner">
      <Navbar></Navbar>

      <h3>Users</h3>
        <div class="search">
          <input type="text" value={searchWord}
            className="searchTerm" 
            onChange={e => {
              setSearchWord(e.target.value);
            }} placeholder="Search by Username"/>
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

      <Modal dialogClassName="large-modal" show={showUserTasks} onHide={handleUserTasksClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>{trackedUser.name}'s Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body><UserTasks user={trackedUser} onCloseModal={handleUserTasksClose}></UserTasks></Modal.Body>
      </Modal>

      <Modal show={showAdminEditUser} onHide={handleAdminEditUserClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body><AdminEditUser user={trackedUser} onCloseModal={handleAdminEditUserClose} getUsers={getUsers}></AdminEditUser></Modal.Body>
      </Modal>

      <Modal show={showAdminDeleteUser} onHide={handleAdminDeleteUserClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body><AdminDeleteUser id={trackedUser.id} name={trackedUser.name} onCloseModal={handleAdminDeleteUserClose} getUsers={getUsers}></AdminDeleteUser></Modal.Body>
      </Modal>
    </div>
  )
}

export default Users