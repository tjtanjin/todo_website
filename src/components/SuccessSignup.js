import React from "react";
import { Form } from "./AuthForms"

function SuccessSignup(data) {

  // render success signup modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">
      <Form>
        <p className="prompt">Your registration is successful. Please verify your account before logging in. A verification email has been sent to your email at:  <span className="trackedcontent">{data.email}</span></p>
        <br/>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Close</button>
      </Form>
    </div>
  );
}

export default SuccessSignup