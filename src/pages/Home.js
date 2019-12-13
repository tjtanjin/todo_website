import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../img/logo.png";
import { Logo } from '../components/AuthForms';

function Home(props) {
  return (
  	<div className="home-inner">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Todo_Manager</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/signup"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Logo src={logoImg} />
    </div>
  )
}

export default Home;