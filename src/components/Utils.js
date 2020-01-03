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

function top5(tasks) {
  let cnts = tasks.reduce( function (obj, val) {
      obj[val] = (obj[val] || 0) + 1;
      return obj;
  }, {} );
  var sortable=[];
  for(var key in cnts)
    if(cnts.hasOwnProperty(key))
      sortable.push([key, cnts[key]]); // each item is an array in format [key, value]
  
  // sort items by value
  sortable.sort(function(a, b)
  {
    return b[1]-a[1]; // compare numbers
  });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function scoreMessage(score) {
  if (score < 30) {
    return <h5 className="prompt text-danger">Please put in more effort to complete your tasks!</h5>
  } else if (score < 40) {
    return <h5 className="prompt text-warning">You can do much better, don't give up!</h5>
  } else if (score < 50) {
    return <h5 className="prompt text-success">Almost there!</h5>
  } else if (score < 70) {
    return <h5 className="prompt text-success">Push yourself harder!</h5>
  } else if (score < 90) {
    return <h5 className="prompt text-success">Nice work! Keep it up!</h5>
  } else {
    return <h5 className="prompt text-success">You are fantastic!</h5>
  }
}

export { sleep, formatDate, checkDyno, VerifyAuth, VerifyAdmin, logOut, renderTooltip, Loading, compareDate, validateUser, validateTask, top5, scoreMessage };
