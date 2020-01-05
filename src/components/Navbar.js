import React from "react";
import logoImg from "../img/logo.png";
import { NavLink } from "react-router-dom";
import { VerifyAdmin, logOut } from "./Utils";
import { useAuth } from "../context/auth"
import { Dropdown } from 'react-bootstrap'

function Navbar() {
  const { setAuthTokens } = useAuth();

  let link1 = "/profile"
  let word1 = "Profile"
  let link2 = "/"
  let word2 = "Logout"
  let link3 = "/tasks"
  let word3 = "Tasks"
  let link4 = "/dashboard"
  let word4 = "Dashboard"
  let link5 = "https://github.com/tjtanjin/todo_website/wiki/User-Guide"
  let word5 = "User Guide"
  let link6 = "/about-us"
  let word6 = "About Us"
  let link7 = ""
  let word7 = ""
  if (VerifyAdmin()) {
    link7 = "/users"
    word7 = "Users"
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <img className="navbar-brand navbar-img" alt="Todo-Manager Logo" src={logoImg}></img>
        <NavLink className="navbar-brand nav-link navbar-nav text-uppercase" to={"/"}>Todo Manager</NavLink>
        <Dropdown alignRight className="navbar-toggler">
          <Dropdown.Toggle variant="dark" id="dropdown-custom-1"><i className="fa fa-bars"></i></Dropdown.Toggle>
          <Dropdown.Menu className="nav-dropdown" >
            <Dropdown.Item className="nav-link nav-text" href={link7}>{word7}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link4}>{word4}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link3}>{word3}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link1}>{word1}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" target="_blank" rel="noopener noreferrer" href={link5}>{word5}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" href={link6}>{word6}</Dropdown.Item>
            <Dropdown.Item className="nav-link nav-text" onClick={() => logOut(setAuthTokens)} href={link2}>{word2}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div id="navbarResponsive" className="collapse navbar-collapse">
          <ul className="navbar-nav text-uppercase ml-auto">
            <li className="nav-item">
              <NavLink activeClassName="nav-selected" className="nav-link nav-text" to={link7}>{word7}</NavLink>
            </li>
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
              <a target="_blank" rel="noopener noreferrer" className="nav-link nav-text" href={link5}>{word5}</a>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="nav-selected" className="nav-link nav-text" to={link6}>{word6}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-text" to={link2} onClick={() => logOut(setAuthTokens)}>{word2}</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }