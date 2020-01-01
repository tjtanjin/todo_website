import React from "react";
import HttpsRedirect from 'react-https-redirect'
import logoImg from "../img/logo.png";
import { VerifyAuth, logOut } from "../components/Utils";
import { useAuth } from "../context/auth";
import { Link } from 'react-router-dom';

function Home(props) {

  // declare stateful values to be used
  const { setAuthTokens } = useAuth();

  // declare variables that will change depending on whether user is authenticated
  let primary_text = "to Todo Manager"
  let secondary_text = "Plan and organize your tasks today!"
  let btn_text1 = "Login"
  let btn_link1 = "/login"
  let btn_text2 = "Sign Up"
  let btn_link2 = "/signup"

  // check if user is authenticated and adjust variables accordingly
  if (VerifyAuth()) {
  	primary_text = JSON.parse(localStorage.getItem('todo_data')).userName;
  	secondary_text = "What would you like to do today?"
  	btn_text1 = "Go to Dashboard"
  	btn_link1 = "/dashboard"
  	btn_text2 = "Logout"
    btn_link2 = "/"
  }

  // render homepage
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
		    <Link class="btn btn-dark btn-home" to={btn_link2} onClick={() => logOut(setAuthTokens)}>{btn_text2}</Link>
		    </div>
		  <div class="overlay"></div>
		</header>
    </HttpsRedirect>
  )
}

export default Home;
