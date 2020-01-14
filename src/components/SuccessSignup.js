import React from "react";
import { Form } from "./AuthForms"

function SuccessSignup(data) {

  // render success signup modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">
      <Form>
        <p className="prompt">Your registration is successful. Please verify your account before logging in. A verification email has been sent to your email at:  <span className="trackedcontent">{data.email}</span> (may take up to 5 minutes). 
        In the meantime, do check out our <a href="https://github.com/tjtanjin/todo_website/wiki/User-Guide" target="_blank" rel="noopener noreferrer">user guide</a> for the full features of our application.</p>
        <br/>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Close</button>
      </Form>
    </div>
  );
}

export default SuccessSignup