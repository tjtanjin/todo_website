import React from "react";
import { Link } from "react-router-dom";
import { VerifyAuth } from "../components/VerifyAuth";
import { useAuth } from "../context/auth"

function Navbar() {
  const { setAuthTokens } = useAuth();

  function logOut() {
    setAuthTokens("undefined");
  }

  let link1 = "/login"
  let word1 = "Login"
  let link2 = "/signup"
  let word2 = "Sign Up"
  let link3 = ""
  let word3 = ""
  if (VerifyAuth()) {
    link1 = "/profile"
    word1 = "My Profile"
    link2 = "/"
    word2 = "Logout"
    link3 = "/tasks"
    word3 = "My Tasks"
  } else {}
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand nav-link navbar-nav text-uppercase" to={"/"}>Todo_Manager</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav text-uppercase ml-auto">
            <li className="nav-item">
              <Link className="nav-link nav-text" to={link3}>{word3}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-text" to={link1}>{word1}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-text" to={link2} onClick={logOut}>{word2}</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }