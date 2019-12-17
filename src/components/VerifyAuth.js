import { decode } from 'jsonwebtoken'

function VerifyAuth() {
  const token = JSON.parse(localStorage.getItem('tokens')).auth_token;
  if (decode(token) === null) {
    return false;
  } else {
    return true;
  }
}

export { VerifyAuth }