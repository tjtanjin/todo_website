import React from "react";
import { decode } from 'jsonwebtoken'

function VerifyAuth() {
  const check_exist_token = JSON.parse(localStorage.getItem('tokens'));
  if (check_exist_token === null) {
  	return false;
  }
  const token = check_exist_token.auth_token;
  if (decode(token) === null) {
    return false;
  } else {
    return true;
  }
}

export { VerifyAuth }