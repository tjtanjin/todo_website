import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../img/logo.png";
import { Logo } from '../components/AuthForms';

function Home(props) {
  return (
  	<div className="home-inner">
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <Link className="navbar-brand nav-link navbar-nav text-uppercase" to={"/"}>Todo_Manager</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav text-uppercase ml-auto">
              <li className="nav-item">
                <Link className="nav-link nav-text" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-text" to={"/signup"}>Sign up</Link>
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