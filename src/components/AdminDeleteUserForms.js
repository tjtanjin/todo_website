import React, { useEffect } from "react";
import axios from 'axios';
import { Form } from "./AuthForms"

function AdminDeleteUser(data) {

  /*
  The function delAdminDeleteUser makes a DELETE request to the API endpoint to delete the specified user.
  Args:
      None     
  */
  function delAdminDeleteUser() {
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    axios.delete(process.env.REACT_APP_API_LINK + "/users/" + data.id, {
      headers: { Authorization: token }
    }).then(result => {
      if (result.status === 200) {
        data.getUsers();
        data.onCloseModal();
      } else {
        alert("An error has occurred, please contact an administrator.")
      }
    }).catch(e => {
      alert(e)
    });
  }

  // listen for enter key input to submit form
  useEffect(() => {
    const handleEnter = (event) => {
      if (event.keyCode === 13) {
        document.getElementById("submitButton").click()
      }
    };
    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, []);

  // render admin delete user modal
  return (
    <div className="auth-inner">
      <Form>
        <p className="prompt"> Are you sure you want to delete the user <span className="trackedcontent">{data.name}</span>?</p>
        <br/>
        <button id="submitButton" className="btn btn-danger btn-block" type="button" onClick={e => delAdminDeleteUser()}>Delete</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
      </Form>
    </div>
  );
}

export default AdminDeleteUser