import React from "react";
import logoImg from "../img/logo.png";
import { NavLink } from "react-router-dom";
import { VerifyAuth } from "../components/VerifyAuth";
import { VerifyAdmin } from "../components/VerifyAdmin";
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
  let link4 = ""
  let word4 = ""
  if (VerifyAuth()) {
    link1 = "/profile"
    word1 = "My Profile"
    link2 = "/"
    word2 = "Logout"
    link3 = "/tasks"
    word3 = "My Tasks"
  } else {}
  if (VerifyAdmin()) {
    link4 = "/users"
    word4 = "View Users"
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <img className="navbar-brand navbar-img" src={logoImg}></img>
        <NavLink className="navbar-brand nav-link navbar-nav text-uppercase" to={"/"}>Todo_Manager</NavLink>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav text-uppercase ml-auto">
            <li className="nav-item">
              <NavLink activeClassName="nav-selected" className="nav-link nav-text" to={link4}>{word4}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="nav-selected" className="nav-link nav-text" to={link3}>{word3}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="nav-selected" className="nav-link nav-text" to={link1}>{word1}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-text" to={link2} onClick={logOut}>{word2}</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }