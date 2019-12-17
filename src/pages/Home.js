import React from "react";
import logoImg from "../img/logo.png";
import { Logo } from "../components/AuthForms";
import { Navbar } from "../components/Navbar";

function Home(props) {
  return (
  	<div className="home-inner">
      <Navbar></Navbar>
      <Logo src={logoImg} />
    </div>
  )
}

export default Home;