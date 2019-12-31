import React, { useState, useEffect } from "react";
import axios from 'axios';
import UserTasks from '../components/UserTasksForms'
import DetailsUser from '../components/DetailsUserForms'
import AdminEditUser from '../components/AdminEditUserForms'
import AdminDeleteUser from '../components/AdminDeleteUserForms'
import { Modal, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Navbar } from "../components/Navbar";

function Users(props) {
  const [searchType, setSearchType] = useState("name");
  const [searchWord, setSearchWord] = useState("");
  const [users, setUsers] = useState([]);
  const [showUserTasks, setUserTasksShow] = useState(false);
  const [showDetailsUser, setDetailsUserShow] = useState(false);
  const [showAdminEditUser, setAdminEditUserShow] = useState(false);
  const [showAdminDeleteUser, setAdminDeleteUserShow] = useState(false);
  const [trackedUser, setTrackedUser] = useState({});

  const handleUserTasksClose = () => setUserTasksShow(false);
  const handleUserTasksShow = () => setUserTasksShow(true);
  const handleDetailsUserClose = () => setDetailsUserShow(false);
  const handleDetailsUserShow = () => setDetailsUserShow(true);
  const handleAdminEditUserClose = () => setAdminEditUserShow(false);
  const handleAdminEditUserShow = () => setAdminEditUserShow(true);
  const handleAdminDeleteUserClose = () => setAdminDeleteUserShow(false);
  const handleAdminDeleteUserShow = () => setAdminDeleteUserShow(true);

  useEffect(() => {
    getUsers();
  }, []);

  function renderTableHeader() {
    let header = ["INDEX", "USERNAME", "EMAIL", "ACTIONS/TOOLS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  function renderTableData() {

    const action_button = (click_action, user, icon, text) => (
      <OverlayTrigger overlay={renderTooltip(text)}>
        <button type="button" onClick={() => {click_action(); setTrackedUser(user)}}><i className={icon}></i></button>
      </OverlayTrigger>
    );

    return users.map((user, index) => {
      if (searchWord === "" || user[searchType].toUpperCase().includes(searchWord.toUpperCase())) {
        const { id, name, email } = user
        const details_button = action_button(handleDetailsUserShow, user, "fa fa-info-circle", "View user's details")
        const info_button = action_button(handleUserTasksShow, user, "fa fa-tasks", "View user's task")
        const edit_button = action_button(handleAdminEditUserShow, user, "fa fa-wrench", "Edit user")
        const delete_button = action_button(handleAdminDeleteUserShow, user, "fa fa-remove", "Delete user")
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{details_button}{info_button}{edit_button}{delete_button}</td>
          </tr>
        )
      } else {}
      return null;
    })
  }

  function renderTooltip(text) {
    return <Tooltip delay={{ show: 250, hide: 400 }}>{text}</Tooltip>;
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
            }} placeholder={"Search by " + searchType}/>
          <Dropdown>
            <Dropdown.Toggle variant="dark">
              <i class="fa fa-search"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchType("name")}>Username</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("email")}>Email</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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

      <Modal show={showDetailsUser} onHide={handleDetailsUserClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>{trackedUser.name}'s Details</Modal.Title>
        </Modal.Header>
        <Modal.Body><DetailsUser user={trackedUser} onCloseModal={handleDetailsUserClose} getUsers={getUsers}></DetailsUser></Modal.Body>
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