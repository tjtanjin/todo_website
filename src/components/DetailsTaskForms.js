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

function DetailsTask(data) {
  const onCloseModal = data.onCloseModal
  const getTasks = data.getTasks
  data = data.task

  return ( 
    <div className="details-inner">
      <div class="row">
        <div class="col-md-6">
          <label>Task Name</label>
        </div>
        <div class="col-md-6">
        <p>{data.task_name}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Task Description</label>
        </div>
        <div class="col-md-6">
            <p>{data.task_description}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Category</label>
        </div>
        <div class="col-md-6">
            <p>{data.category}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Priority</label>
        </div>
        <div class="col-md-6">
            <p>{data.priority}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
            <label>Deadline</label>
        </div>
        <div class="col-md-6">
            <p>{data.deadline}</p>
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

export default DetailsTask;
