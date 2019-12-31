import React from "react";
import HttpsRedirect from 'react-https-redirect'
import logoImg from "../img/logo.png";
import { VerifyAuth } from "../components/Utils";
import { Link } from 'react-router-dom'

function Home(props) {
  let primary_text = "to Todo Manager"
  let secondary_text = "Plan and organize your tasks today!"
  let btn_text1 = "Login"
  let btn_link1 = "/login"
  let btn_text2 = "Sign Up"
  let btn_link2 = "/signup"
  if (VerifyAuth()) {
  	primary_text = JSON.parse(localStorage.getItem('todo_data')).userName;
  	secondary_text = "What would you like to do today?"
  	btn_text1 = "My Tasks"
  	btn_link1 = "/tasks"
  	btn_text2 = "My Profile"
    btn_link2 = "/profile"
  }
  return (
    <HttpsRedirect>
        <header class="masthead d-flex">
		  <div class="container text-center my-auto">
        <img src={logoImg} alt="Todo-Manager Logo"></img>
        <br/><br/><br/>
		    <h1 class="mb-1 text-home-primary">Welcome {primary_text}</h1>
		    <h3 class="mb-5 text-home-secondary">
		      <em>{secondary_text}</em>
		    </h3>
		    <Link class="btn btn-dark btn-home" to={btn_link1}>{btn_text1}</Link>
		    <br/><br/>
		    <Link class="btn btn-dark btn-home" to={btn_link2}>{btn_text2}</Link>
		    </div>
		  <div class="overlay"></div>
		</header>
    </HttpsRedirect>
  )
}

export default Home;
