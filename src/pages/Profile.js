import React, { useState, useEffect } from "react";
import axios from 'axios';
import EditUser from "../components/EditUserForms";
import DeleteUser from "../components/DeleteUserForms"
import ChangePassword from "../components/ChangePasswordForms";
import { Form } from "../components/AuthForms";
import { Modal, OverlayTrigger, Toast } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";
import { formatDate, Loading, renderTooltip } from "../components/Utils";
import { useAuth } from "../context/auth"

function Profile(props) {

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();
  const [showLoading, setLoadingShow] = useState(false);
  const [showEditUser, setEditUserShow] = useState(false);
  const [showChangePassword, setChangePasswordShow] = useState(false);
  const [showDeleteUser, setDeleteUserShow] = useState(false);
  const [userid, setUserID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [createdate, setCreateDate] = useState("");
  const [modifydate, setModifyDate] = useState("");
  const [notifications, setNotifications] = useState("");
  const [trackedUser, setTrackedUser] = useState("");
  const [toast, showToast] = useState(false);
  const [toastText, setToastText] = useState("");

  // declare controllers for showing and hiding modals
  const handleLoadingClose = () => setLoadingShow(false);
  const handleLoadingShow = () => setLoadingShow(true);
  const handleEditUserClose = () => setEditUserShow(false);
  const handleEditUserShow = () => setEditUserShow(true);
  const handleChangePasswordClose = () => setChangePasswordShow(false);
  const handleChangePasswordShow = () => setChangePasswordShow(true);
  const handleDeleteUserClose = () => setDeleteUserShow(false);
  const handleDeleteUserShow = () => setDeleteUserShow(true);

  // get user at the start
  useEffect(() => {
    getSelf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  The function getSelf makes a GET request to the API endpoint to get information belonging to the current user.
  Args:
      None     
  */
  function getSelf() {
    handleLoadingShow();
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.get(process.env.REACT_APP_API_LINK + "/users/" + user_id, {
      headers: { Authorization: token }
    }).then(result => {
      handleLoadingClose();
      if (result.status === 200) {
        setTrackedUser(result.data);
        setUserID(result.data.id);
        setName(result.data.name);
        setEmail(result.data.email);
        setRole(result.data.role);
        setCreateDate(formatDate(result.data.created_at));
        setModifyDate(formatDate(result.data.updated_at));
        if (result.data.notifications === "1") {
          setNotifications(true);
        } else {
          setNotifications(false);
        }
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

  function putNotifications() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    let notificationsSettings = "";
    if (notifications === true) {
      notificationsSettings = "0"
    } else {
      notificationsSettings = "1"
    }
    axios.put(process.env.REACT_APP_API_LINK + "/users/" + userid + "/setnotifications", {
      "id": userid,
      "notifications": notificationsSettings
    }, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        showToast(true);
        setToastText("Notification settings successfully updated.")
      } else {
      }
    }).catch(e => {
    });
  }

  // render profile page
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
            background: '#D4EDDA',
          }}
        >
          <Toast.Header style={{ background: '#D4EDDA' }}>
            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body style={{ textAlign: 'center', fontWeight: 'bold' }}>{toastText}</Toast.Body>
        </Toast>
      </div>
      <div className="profile-inner col-xl-5 col-md-5 col-sm-8">
        
        <h3>{name}'s Profile</h3>
        <br/>
        <div class="tab-content profile-tab" id="myTabContent">
          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div class="row">
              <div class="col-md-6">
                <label>User ID</label>
              </div>
              <div class="col-md-6">
              <p>{userid}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <label>Name</label>
              </div>
              <div class="col-md-6">
                  <p>{name}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <label>Email</label>
              </div>
              <div class="col-md-6">
                  <p>{email}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <label>Role</label>
              </div>
              <div class="col-md-6">
                  <p>{role}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <label>Created at</label>
              </div>
              <div class="col-md-6">
                  <p>{createdate}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <label>Last modified</label>
              </div>
              <div class="col-md-6">
                  <p>{modifydate}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                  <label>Email Task Notifications/Reminders:</label>
              </div>
              <div class="col-md-6">
                <div class="custom-control custom-switch">
                  <input 
                    data-on-text="on"
                    type="checkbox"
                    checked={notifications}
                    class="custom-control-input" 
                    id="customSwitch2" 
                    onChange={() => {setNotifications(!notifications); putNotifications()
                  }}
                  />
                  <OverlayTrigger overlay={renderTooltip("Task reminder emails will be sent out daily for tasks with a remaining deadline of 3 days and less.")}>
                    <label class="custom-control-label" for="customSwitch2"></label>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
            <br/>
            <button className="btn btn-dark btn-block" onClick={() => {handleEditUserShow()}}>Edit Profile</button>
            <button className="btn btn-dark btn-block" onClick={() => {handleChangePasswordShow()}}>Change Password</button>
            <button className="btn btn-danger btn-block" onClick={() => {handleDeleteUserShow()}}>Delete User</button>
          </div>
        </div>

        <Modal show={showLoading}>
          <Modal.Body>
            <h5 className="prompt">Loading</h5><br/>
            <Form><Loading></Loading></Form></Modal.Body>
        </Modal>

        <Modal show={showEditUser} onHide={handleEditUserClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body><EditUser user={trackedUser} onCloseModal={handleEditUserClose} showToast={(e) => {showToast(true); setToastText(e)}} getSelf={getSelf}></EditUser></Modal.Body>
        </Modal>

        <Modal show={showChangePassword} onHide={handleChangePasswordClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body><ChangePassword user={trackedUser} onCloseModal={handleChangePasswordClose} showToast={(e) => {showToast(true); setToastText(e)}} getSelf={getSelf}></ChangePassword></Modal.Body>
        </Modal>

        <Modal show={showDeleteUser} onHide={handleDeleteUserClose}>
          <Modal.Header className="modal_header_bg">
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body><DeleteUser id={trackedUser.id} name={trackedUser.name} email={trackedUser.email} onCloseModal={handleDeleteUserClose}></DeleteUser></Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
