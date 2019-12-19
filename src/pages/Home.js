import React from "react";
import HttpsRedirect from 'react-https-redirect'
import logoImg from "../img/logo.png";
import { Logo } from "../components/AuthForms";
import { Navbar } from "../components/Navbar";

function Home(props) {
  return (
    <HttpsRedirect>
      <div className="home-inner">
        <Navbar></Navbar>
        <Logo src={logoImg} />
      </div>
    </HttpsRedirect>
  )
}

export default Home;
