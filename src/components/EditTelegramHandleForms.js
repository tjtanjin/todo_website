import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Error, Success } from "./AuthForms";
import { decode } from 'jsonwebtoken'
import { Loading } from './Utils';

function EditTelegramHandle(data) {

  // declare stateful values to be used 
  const [submitResult, setSubmitResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState(data.telegram_handle);

  /*
  The function putCompleteTask makes a PUT request to the API endpoint to mark the task as complete.
  Args:
      None     
  */
  function putEditTelegramHandle() {
    setIsLoading(true);
    const token = JSON.parse(localStorage.getItem('todo_data')).auth_token;
    const user_id = decode(token).user_id;
    axios.put(process.env.REACT_APP_API_LINK + "/users/" + user_id + "/settelegramhandle", {
      "id": user_id,
      "telegram_handle": telegramHandle
    }, {
      headers: { Authorization: token }
    }).then(result => {
      setIsLoading(false);
      if (result.status === 200) {
        setIsSuccess(true);
        data.showToast("Telegram handle successfully completed.")
        data.onCloseModal();
        data.getSelf();
      } else {
        setSubmitResult("An error has occurred, please contact an administrator.")
        setIsError(true)
      }
    }).catch(e => {
      alert(e)
      setIsLoading(false);
      setSubmitResult(e.response.data.error);
      setIsError(true);
    });
  }

  // listen for enter key input to submit form
  useEffect(() => {
    const handleEnter = (event) => {
      if (event.keyCode === 13) {
        document.getElementById("submitButton").click()
      }
    };
    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, []);

  // render complete task confirmation modal
  return (
    <div className="auth-inner col-xl-10 col-md-10 col-sm-12 col-xs-12">
      <Form>
        <p className="text-success">To link your todo manager account with your telegram account, enter your telegram handle below (without @) and send <span className="text-danger font-weight-bold">/link {data.email}</span> to our telegram bot <span className="text-danger font-weight-bold">(@todomanager_bot)</span>. To unlink your account, simply remove your telegram handle.</p>
        <div className="form-group">
          <label>Telegram Handle</label>
          <input
            type="telgram_handle"
            value={telegramHandle}
            className="form-control" 
            onChange={e => {
              setTelegramHandle(e.target.value);
            }}
            placeholder=""
          />
        </div>

        <button id="submitButton" type="button" className="btn btn-dark btn-block" onClick={putEditTelegramHandle}>Update</button>
        <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Back</button>
        <br/>
        { isLoading&&<Loading></Loading> }
        { isSuccess &&<Success>Telegram handle updated!</Success> }
        { isError &&<Error>{submitResult}</Error> }
      </Form>
    </div>
  );
}

export default EditTelegramHandle