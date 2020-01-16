import React from "react";
import logoImg from "../img/logo.png";
import { NavLink } from "react-router-dom";
import { VerifyAuth, VerifyAdmin, logOut } from "./Utils";
import { useAuth } from "../context/auth"
import { Dropdown } from 'react-bootstrap'

function Navbar() {
  const { setAuthTokens } = useAuth();

  let link1 = "/signup"
  let word1 = "Sign up"
  let link2 = "/login"
  let word2 = "Login"
  let link3 = "/about"
  let word3 = "About"
  let link4 = "/"
  let word4 = "Home"
  let link5 = ""
  let word5 = ""
  let link6 = ""
  let word6 = ""
  if (VerifyAuth()) {
    link1 = "/"
    word1 = "Logout"
    link2 = "/profile"
    word2 = "Profile"
    link4 = "/tasks"
    word4 = "Tasks"
    link5 = "/dashboard"
    word5 = "Dashboard"
  }
  if (VerifyAdmin()) {
    link5 = "/users"
    word5 = "Users"
    link6 = "/dashboard"
    word6 = "Dashboard"
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <img className="navbar-brand navbar-img" alt="Todo-Manager Logo" src={logoImg}></img>
        <NavLink className="navbar-brand nav-link navbar-nav text-uppercase" to={"/"}>Todo Manager</NavLink>
        <Dropdown alignRight className="navbar-toggler">
          <Dropdown.Toggle variant="dark" id="dropdown-custom-1"><i className="fa fa-bars"></i></Dropdown.Toggle>
          <Dropdown.Menu className="nav-dropdown" >
            <Dropdown.Item className="nav-link nav-text" href={link6}>{word6}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link5}>{word5}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link4}>{word4}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link3}>{word3}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link2}>{word2}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" onClick={() => logOut(setAuthTokens)} href={link1}>{word1}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div id="navbarResponsive" className="collapse navbar-collapse">
          <ul className="navbar-nav text-uppercase ml-auto">
            <li className="nav-item">
              <NavLink exact activeClassName="nav-selected" className="nav-link nav-text" to={link6}>{word6}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact activeClassName="nav-selected" className="nav-link nav-text" to={link5}>{word5}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact activeClassName="nav-selected" className="nav-link nav-text" to={link4}>{word4}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact activeClassName="nav-selected" className="nav-link nav-text" to={link3}>{word3}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact activeClassName="nav-selected" className="nav-link nav-text" to={link2}>{word2}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact className="nav-link nav-text" to={link1} onClick={() => logOut(setAuthTokens)}>{word1}</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }