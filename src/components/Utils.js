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

export { sleep, formatDate, checkDyno, VerifyAuth, VerifyAdmin, logOut, renderTooltip, Loading };
