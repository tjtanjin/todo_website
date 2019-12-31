import React, { useState, useEffect } from "react";
import axios from 'axios';
import EditUser from "../components/EditUserForms";
import DeleteUser from "../components/DeleteUserForms"
import ChangePassword from "../components/ChangePasswordForms";
import { Modal } from 'react-bootstrap'
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";
import { formatDate } from "../components/Utils";

function Profile(props) {
  const [showEditUser, setEditUserShow] = useState(false);
  const [showChangePassword, setChangePasswordShow] = useState(false);
  const [showDeleteUser, setDeleteUserShow] = useState(false);
  const [userid, setUserID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [createdate, setCreateDate] = useState("");
  const [modifydate, setModifyDate] = useState("");
  const [trackedUser, setTrackedUser] = useState("");

  const handleEditUserClose = () => setEditUserShow(false);
  const handleEditUserShow = () => setEditUserShow(true);
  const handleChangePasswordClose = () => setChangePasswordShow(false);
  const handleChangePasswordShow = () => setChangePasswordShow(true);
  const handleDeleteUserClose = () => setDeleteUserShow(false);
  const handleDeleteUserShow = () => setDeleteUserShow(true);

  function getSelf() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.get(process.env.REACT_APP_API_LINK + "/users/" + user_id, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        setTrackedUser(result.data);
        setUserID(result.data.id);
        setName(result.data.name);
        setEmail(result.data.email);
        setRole(result.data.role);
        setCreateDate(formatDate(result.data.created_at));
        setModifyDate(formatDate(result.data.updated_at));
      } else {

      }
    }).catch(e => {

    });
  }

  useEffect(() => {
    getSelf();
  }, []);

  return (
    <div className="profile-inner">
      <Navbar></Navbar>
      
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
          <button className="btn btn-dark btn-block" onClick={() => {handleEditUserShow()}}>Edit Profile</button>
          <button className="btn btn-dark btn-block" onClick={() => {handleChangePasswordShow()}}>Change Password</button>
          <button className="btn btn-danger btn-block" onClick={() => {handleDeleteUserShow()}}>Delete User</button>
        </div>
      </div>

      <Modal show={showEditUser} onHide={handleEditUserClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body><EditUser user={trackedUser} onCloseModal={handleEditUserClose} getSelf={getSelf}></EditUser></Modal.Body>
      </Modal>

      <Modal show={showChangePassword} onHide={handleChangePasswordClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body><ChangePassword user={trackedUser} onCloseModal={handleChangePasswordClose} getSelf={getSelf}></ChangePassword></Modal.Body>
      </Modal>

      <Modal show={showDeleteUser} onHide={handleDeleteUserClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body><DeleteUser id={trackedUser.id} name={trackedUser.name} email={trackedUser.email} onCloseModal={handleDeleteUserClose}></DeleteUser></Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
