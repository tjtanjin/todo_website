import React from 'react'
import { Tooltip } from 'react-bootstrap'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function formatDate(string){
  var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date(string).toLocaleDateString([],options);
}

function checkDyno(isDynoAwake, setDynoMessage) {
  if (!isDynoAwake) {
    return setDynoMessage(true);
  } else {}
}

function VerifyAuth() {
  const check_exist_data = JSON.parse(localStorage.getItem('todo_data'));
  if (check_exist_data === null) {
  	return false;
  }
  else {
    return check_exist_data.isLoggedIn === true;
  }
}

function VerifyAdmin() {
  const check_exist_data = JSON.parse(localStorage.getItem('todo_data'));
  if (check_exist_data === null) {
    return false;
  }
  else {
    return check_exist_data.isAdmin === true;
  }
}

function logOut(setAuthTokens) {
  setAuthTokens("undefined");
}

function renderTooltip(text) {
  return <Tooltip delay={{ show: 250, hide: 400 }}>{text}</Tooltip>;
}

function Loading() {
  return (
    <div class="spinner-border load" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  )
}

function compareDate(date) {
  if (date === null) {
    return -1;
  } else {
    let currentDate = new Date();
    let dateparts = date.split('-');
    let deadline = new Date(dateparts[0], dateparts[1] - 1, dateparts[2]);
    return Math.ceil((deadline - currentDate) / (1000 * 3600 * 24))
  }
}

function validateUser(name, email) {
  if (name === "" || name.length < 2) {
    return "Username is too short (minimum 2 characters)"
  }
  if (email === "" || !email.includes("@")) {
    return "Please enter a valid email"
  }
  return true
}

function validateTask(task_name, task_description, category, priority, date) {
  if (task_name === "") {
    return "Please give your task a name"
  }
  if (task_description === "") {
    return "Please enter a task description" 
  }
  if (category === "") {
    return "Please enter a category"
  }
  if (priority !== "Low" && priority !== "Medium" && priority !== "High" && priority !== "Completed") {
    return "Please enter a valid priority"
  }
  if (date === "") {
    return "Please enter a valid deadline"
  }
  return true;
}

export { sleep, formatDate, checkDyno, VerifyAuth, VerifyAdmin, logOut, renderTooltip, Loading, compareDate, validateUser, validateTask };
