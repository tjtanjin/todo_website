import React, { useState, useEffect } from "react";
import axios from 'axios';
import UserTasks from '../components/UserTasksForms'
import DetailsUser from '../components/DetailsUserForms'
import AdminEditUser from '../components/AdminEditUserForms'
import AdminDeleteUser from '../components/AdminDeleteUserForms'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Form } from "../components/AuthForms";
import { renderTooltip, Loading } from '../components/Utils'
import { useAuth } from "../context/auth"
import { Modal, Dropdown, OverlayTrigger, Toast } from 'react-bootstrap'
import { Navbar } from "../components/Navbar";

function Users(props) {

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();
  const [searchType, setSearchType] = useState("name");
  const [searchWord, setSearchWord] = useState("");
  const [users, setUsers] = useState([]);
  const [showLoading, setLoadingShow] = useState(false);
  const [showUserTasks, setUserTasksShow] = useState(false);
  const [showDetailsUser, setDetailsUserShow] = useState(false);
  const [showAdminEditUser, setAdminEditUserShow] = useState(false);
  const [showAdminDeleteUser, setAdminDeleteUserShow] = useState(false);
  const [trackedUser, setTrackedUser] = useState({});
  const [toast, showToast] = useState(false);
  const [toastText, setToastText] = useState("");

  // declare controllers for showing and hiding modals
  const handleLoadingClose = () => setLoadingShow(false);
  const handleLoadingShow = () => setLoadingShow(true);
  const handleUserTasksClose = () => setUserTasksShow(false);
  const handleUserTasksShow = () => setUserTasksShow(true);
  const handleDetailsUserClose = () => setDetailsUserShow(false);
  const handleDetailsUserShow = () => setDetailsUserShow(true);
  const handleAdminEditUserClose = () => setAdminEditUserShow(false);
  const handleAdminEditUserShow = () => setAdminEditUserShow(true);
  const handleAdminDeleteUserClose = () => setAdminDeleteUserShow(false);
  const handleAdminDeleteUserShow = () => setAdminDeleteUserShow(true);

  // get all users at the start
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  The function renderTableHeader generates the header for the users table.
  Args:
      None     
  */
  function renderTableHeader() {
    let header = ["INDEX", "USERNAME", "EMAIL", "VERIFIED", "ACTIONS/TOOLS"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
  }

  /*
  The function renderTableData generates the users table containing the relevant information as specified by the admin.
  Args:
      None     
  */
  function renderTableData() {

    // template to create button with tooltip
    const action_button = (click_action, user, icon, text) => (
      <OverlayTrigger overlay={renderTooltip(text)}>
        <button type="button" onClick={() => {click_action(); setTrackedUser(user)}}><i className={icon}></i></button>
      </OverlayTrigger>
    );

    // sort users by name
    users.sort((a, b) => a.name.localeCompare(b.name))

    // generate the rows of the table
    const table = users.map((user, index) => {
      if (searchWord === "" || user[searchType].toUpperCase().includes(searchWord.toUpperCase())) {
        let { id, name, email, verification_token } = user
        if (verification_token === "1") {
          verification_token = "Yes";
        } else {
          verification_token = "No";
        }
        const details_button = action_button(handleDetailsUserShow, user, "fa fa-info-circle", "View user's details")
        const info_button = action_button(handleUserTasksShow, user, "fa fa-tasks", "View user's task")
        const edit_button = action_button(handleAdminEditUserShow, user, "fa fa-wrench", "Edit user")
        const delete_button = action_button(handleAdminDeleteUserShow, user, "fa fa-remove", "Delete user")
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td className={verification_token}>{verification_token}</td>
            <td>{details_button}{info_button}{edit_button}{delete_button}</td>
          </tr>
        )
      } else {}
      return null;
    })

    // checks if table is empty
    if (!table.every(e => e === null)) {
      return (
        <table id="user-table">
          <tbody>
            <tr>{renderTableHeader()}</tr>
            {table}
          </tbody>
        </table>
      )
    } else {
      return <div class="card-body"><br/><br/><h3 className="prompt">Insufficient Permissions!</h3></div>
    }
  }

  /*
  The function getUsers makes a GET request to the API endpoint to get users.
  Args:
      None     
  */
  function getUsers() {
    handleLoadingShow();
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    axios.get(process.env.REACT_APP_API_LINK + "/users/", {
      headers: { Authorization: token }
    }).then(result => {
      handleLoadingClose();
      if (result.status === 200) {
        setUsers(result.data);
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

  // render users page
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
        <div class="tabledisplay">
          {renderTableData()}
        </div>
        <br/>

        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn btn-dark btn-block"
          table="user-table"
          filename="users"
          sheet="users-sheet"
          buttonText="Download Users"/>

        <Modal show={showLoading}>
          <Modal.Body>
            <h5 className="prompt">Loading</h5><br/>
            <Form><Loading></Loading></Form></Modal.Body>
        </Modal>

        <Modal size="lg" show={showUserTasks} onHide={handleUserTasksClose}>
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
          <Modal.Body><AdminEditUser user={trackedUser} onCloseModal={handleAdminEditUserClose} showToast={(e) => {showToast(true); setToastText(e)}} getUsers={getUsers}></AdminEditUser></Modal.Body>
        </Modal>

        <Modal show={showAdminDeleteUser} onHide={handleAdminDeleteUserClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body><AdminDeleteUser id={trackedUser.id} name={trackedUser.name} onCloseModal={handleAdminDeleteUserClose} showToast={(e) => {showToast(true); setToastText(e)}} getUsers={getUsers}></AdminDeleteUser></Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default Users