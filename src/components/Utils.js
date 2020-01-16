import React from 'react'
import { Tooltip } from 'react-bootstrap'

/*
The function formatDate converts a date in string to a date object in local time.
Args:
  string: date in string
*/
function formatDate(string){
  var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date(string).toLocaleDateString([],options);
}

/*
The function checkDyno checks if a heroku dyno is awake.
Args:
  isDynoAwake: boolean value for if the dyno is awake
  setDynoMessage: function to set dynoMessage to inform users that heroku dyno is being woken up
*/
function checkDyno(isDynoAwake, setDynoMessage) {
  if (!isDynoAwake) {
    return setDynoMessage(true);
  } else {}
}

/*
The function VerifyAuth checks if a user is authenticated.
Args:
  None
*/
function VerifyAuth() {
  const check_exist_data = JSON.parse(localStorage.getItem('todo_data'));
  if (check_exist_data === null) {
  	return false;
  }
  else {
    return check_exist_data.isLoggedIn === true;
  }
}

/*
The function VerifyAuth checks if a user is an admin.
Args:
  None
*/
function VerifyAdmin() {
  const check_exist_data = JSON.parse(localStorage.getItem('todo_data'));
  if (check_exist_data === null) {
    return false;
  }
  else {
    return check_exist_data.isAdmin === true;
  }
}

/*
The function logOut logs the user out.
Args:
  setAuthTokens: function to set todo_data
*/
function logOut(setAuthTokens) {
  setAuthTokens("undefined");
}

/*
The function renderTooltip applies tooltip with the given text.
Args:
  text: text for tooltip to show
*/
function renderTooltip(text) {
  return <Tooltip delay={{ show: 250, hide: 400 }}>{text}</Tooltip>;
}

/*
The function Loading generates a spinner
Args:
  None
*/
function Loading() {
  return (
    <div class="spinner-border load" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  )
}

/*
The function calculateExpiry returns day difference between given date and today.
Args:
  date: date to calculate difference with
*/
function calculateExpiry(date) {
  let currentDate = new Date();
  let dateparts = date.split('-');
  let deadline = new Date(dateparts[0], dateparts[1] - 1, dateparts[2]);
  return Math.ceil((deadline - currentDate) / (1000 * 3600 * 24))
}

/*
The function compareDate compares 2 date and returns the time difference.
Args:
  date1: date to compare with date2
  date2: date to compare with date1
*/
function compareDate(date1, date2) {
  let dateparts1 = date1.split('-');
  let dateparts2 = date2.split('-');
  let newdate1 = new Date(dateparts1[0], dateparts1[1] - 1, dateparts1[2]);
  let newdate2 = new Date(dateparts2[0], dateparts2[1] - 1, dateparts2[2]);
  return Math.ceil((newdate2 - newdate1) / (1000 * 3600 * 24)) + 1;
}

/*
The function validateUser does a simple check on whether a user's username and email are valid. Heavy lifting done by backend.
Args:
  name: name to check
  email: email to check
*/
function validateUser(name, email) {
  if (name === "" || name.length < 2) {
    return "Username is too short (minimum 2 characters)"
  }
  if (email === "" || !email.includes("@")) {
    return "Please enter a valid email"
  }
  return true
}

/*
The function validateTask does a simple check on whether a user's task fields are valid. Heavy lifting done by backend.
Args:
  task_name: task name to check
  task_description: task_description to check
  category: category to check
  priority: priority to check
  date: date to check
*/
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

/*
The function retrieveTaskCategories returns an array of array containing task categories sorted by highest frequency.
Args:
  tasks: tasks to retrieve from
*/
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

/*
The function scoreMessage returns a message to the user depending on their current score.
Args:
  score: current score of the user
*/
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

/*
The function noticeMessage returns a message to the user depending on the profile of their task categories.
Args:
  arrCat: array containing array of sorted task categories
*/
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

/*
The function setDefaultValue sets the default value of page fields.
Args:
  props: data passed in from the page
  key: the key to check for
  value: the default value provided
*/
function setDefaultValue(props, key, value) {
  if (props.location.state === null || props.location.state === undefined || props.location.state[key] === undefined ) {
    return value;
  } else {
    return props.location.state[key];
  }
}

export { formatDate, checkDyno, VerifyAuth, VerifyAdmin, logOut, renderTooltip, Loading, calculateExpiry, compareDate, validateUser, validateTask, retrieveTaskCategories, scoreMessage, noticeMessage, setDefaultValue };
