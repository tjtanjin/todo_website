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

function calculateExpiry(date) {
  let currentDate = new Date();
  let dateparts = date.split('-');
  let deadline = new Date(dateparts[0], dateparts[1] - 1, dateparts[2]);
  return Math.ceil((deadline - currentDate) / (1000 * 3600 * 24))
}

function compareDate(date1, date2) {
  let dateparts1 = date1.split('-');
  let dateparts2 = date2.split('-');
  let newdate1 = new Date(dateparts1[0], dateparts1[1] - 1, dateparts1[2]);
  let newdate2 = new Date(dateparts2[0], dateparts2[1] - 1, dateparts2[2]);
  return Math.ceil((newdate2 - newdate1) / (1000 * 3600 * 24)) + 1;
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

function retrieveTaskCategories(tasks) {
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
  if (score < 10) {
    return <h5 className="prompt text-danger">Take baby steps and build up the habit to complete your tasks!</h5>
  } else if (score < 20) {
    return <h5 className="prompt text-warning">You can do much better than this, don't give up!</h5>
  } else if (score < 30) {
    return <h5 className="prompt text-warning">1/3 tasks completed, you can do more than this!</h5>
  } else if (score < 40) {
    return <h5 className="prompt text-warning">Push yourself harder, you can do it!</h5>
  } else if (score < 50) {
    return <h5 className="prompt text-success">Work towards completing at least half your tasks!</h5>
  } else if (score < 70) {
    return <h5 className="prompt text-success">You are doing well but push your further!</h5>
  } else if (score < 80) {
      return <h5 className="prompt text-success">Great job in completing majority of your tasks! </h5>
  } else if (score < 95) {
    return <h5 className="prompt text-success">Excellent! Keep it up!</h5>
  } else {
    return <h5 className="prompt text-success">Main your fantastic score by completing your tasks!</h5>
  }
}

function noticeMessage(arrCat) {
  if (arrCat.length === 0) {
    const link = <a className="text-danger" href="https://github.com/tjtanjin/todo_website/wiki/User-Guide" target="_blank" rel="noopener noreferrer">here!</a>
    return <div>It's a good day to start on a task! If you are unsure how, look over to our guide {link}</div>
  } else if (arrCat.length === 1) {
    return <div>You only have {arrCat[0][0]} related tasks :( Do try out other stuffs in your free time!</div>
  } else if (arrCat[0][0].toUpperCase().includes("WORK")) {
    return <div>Although you might have a lot of work, do spend some time to rest!</div>
  } else if (arrCat[0][0].toUpperCase().includes("SPORT")) {
    return <div>You have a healthy lifestyle, keep it up!</div>
  } else {
    return <div>Do remember to take breaks every now and then as you strive to complete your tasks!</div>
  }
}

function setDefaultValue(props, key, value) {
  if (props.location.state === null || props.location.state === undefined || props.location.state[key] === undefined ) {
    return value;
  } else {
    return props.location.state[key];
  }
}

export { sleep, formatDate, checkDyno, VerifyAuth, VerifyAdmin, logOut, renderTooltip, Loading, calculateExpiry, compareDate, validateUser, validateTask, retrieveTaskCategories, scoreMessage, noticeMessage, setDefaultValue };
