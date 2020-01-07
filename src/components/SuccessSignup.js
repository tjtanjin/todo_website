import React from "react";
import { Form } from "./AuthForms"

function SuccessSignup(data) {

  // render success signup modal
  return (
    <div className="auth-inner">
      <Form>
        <p className="prompt"> Your registration is successful. A verification email has been sent to your account at:  <span className="trackedcontent">{data.email}</span></p>
        <br/>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Close</button>
      </Form>
    </div>
  );
}

export default SuccessSignup