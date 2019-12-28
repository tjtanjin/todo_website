import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import EditUser from "../components/EditUserForms";
import DeleteUser from "../components/DeleteUserForms"
import ChangePassword from "../components/ChangePasswordForms";
import { Modal } from 'react-bootstrap'
import { Form, Error } from "../components/AuthForms";
import { Loading } from "../components/Loading";
import { useAuth } from "../context/auth";
import { decode } from 'jsonwebtoken';
import { Navbar } from "../components/Navbar";
import { formatDate } from "../components/Utils";

function DetailsUser(data) {
  const onCloseModal = data.onCloseModal
  const getTasks = data.getTasks
  data = data.user

  return ( 
    <div className="details-inner">
      <div class="row">
        <div class="col-md-6">
          <label>User ID</label>
        </div>
        <div class="col-md-6">
        <p>{data.id}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Username</label>
        </div>
        <div class="col-md-6">
            <p>{data.name}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Email</label>
        </div>
        <div class="col-md-6">
            <p>{data.email}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Role</label>
        </div>
        <div class="col-md-6">
            <p>{data.role}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Created at</label>
        </div>
        <div class="col-md-6">
            <p>{formatDate(data.created_at)}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Last modified</label>
        </div>
        <div class="col-md-6">
            <p>{formatDate(data.updated_at)}</p>
        </div>
      </div>
      <button type="button" className="btn btn-dark btn-block" onClick={onCloseModal}>Close</button>
    </div>
  );
}

export default DetailsUser;
