import React from "react";
import logoImg from "../img/logo.png";
import { Navbar } from "../components/Navbar"

function About(props) {

  // render aboutus page
  return (
    <div>
      <Navbar></Navbar>
      <br/>
      <div className="profile-inner font-weight-bold text-center col-xl-5 col-md-5 col-sm-8">
        <h3>About Todo Manager</h3>
        <div>
        <img src={logoImg} alt="Todo-Manager Logo"></img>
        </div>
        <br/>
        <p>Todo Manager is a simple web application that allows users to track and organize their tasks. Designed with simplicity and efficiency in mind, Todo Manager strives to provide an excellent experience for its users. For a full list of features, please refer to our <a className="text-danger" href="https://github.com/tjtanjin/todo_website/wiki/User-Guide" target="_blank" rel="noopener noreferrer">user guide</a>.</p>
        <p>As the application continuously seeks out areas for improvements, suggestions and feedback are greatly welcomed at the following contact and platforms below:</p>
        <span className="icon-36"><a className="text-danger" href="mailto:cjtanjin@gmail.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-envelope-square fa-lg"></i></a></span>
        &nbsp;
        <span className="icon-36"><a className="text-dark" href="https://github.com/tjtanjin/todo_website" target="_blank" rel="noopener noreferrer"><i className="fa fa-github fa-lg"></i></a></span>
        &nbsp;
        <span className="icon-32"><a className="telegram-color" href="https://t.me/todomanager_bot" target="_blank" rel="noopener noreferrer"><i className="fa fa-telegram fa-lg"></i></a></span>
      </div>
    </div>
  )
}

export default About;
