import React from "react";
import logoImg from "../img/logo.png";
import { Navbar } from "../components/Navbar"

function Aboutus(props) {

  // render aboutus page
  return (
    <div>
      <Navbar></Navbar>
      <div className="profile-inner col-xl-5 col-md-5 col-sm-8">
        
        <h3>About Us [To Be Updated]</h3>
        <br/>
        <div class="text-center my-auto">
        <img src={logoImg} alt="Todo-Manager Logo"></img>
        </div>
        <br/>
        <p>Todo Manager is a simple web application that allows users to track and organize their tasks. Designed with simplicity and efficiency in mind, we strive to provide users with relevant information so as to aid them in their planning.</p>
        <p>As we continuously seek to improve ourselves, suggestions and feedback are greatly welcomed.</p>
        <p>Contact: cjtanjin@gmail.com</p>
        <p>This page content is a placeholder and will be updated soon.</p>
        <div class="tab-content profile-tab" id="myTabContent">
        </div>
      </div>
    </div>
  )
}

export default Aboutus;
