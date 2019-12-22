import React from "react";
import axios from 'axios';
import { decode } from 'jsonwebtoken'

function DeleteUser(data) {
  function delUser() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    axios.delete(process.env.REACT_APP_API_LINK + "/users/" + data.id, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        data.getUsers();
        data.onCloseModal();
      } else {

      }
    }).catch(e => {
      alert(e)
    });
  }

  return (
    <div className="auth-inner">
      <p className="prompt"> Are you sure you want to delete the user <span className="trackedcontent">{data.name}</span>?</p>
      <br/>
      <button className="btn btn-dark btn-block" type="button" onClick={e => delUser()}>Delete</button>
      <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
    </div>
  );
}

export default DeleteUser