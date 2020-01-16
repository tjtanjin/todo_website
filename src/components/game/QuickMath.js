import React, { useState, useEffect } from "react";
import { CountDown } from "./CountDown";

function QuickMath(data) {
  const [ ans, setAns ] = useState("");
  const [ score, setScore ] = useState(0);
  const [ play, setPlay ] = useState("0");
  const [ num1, setNum1 ] = useState(Math.floor(Math.random() * 100));
  const [ num2, setNum2 ] = useState(Math.floor(Math.random() * 100));

  /*
  The function verify checks if the user entered the correct answer.
  Args:
      None 
  */
  function verify() {
    let correctAns = num1 + num2;
    if (ans === correctAns.toString()) {
      setScore(prev => prev + 1);
    } else {
      setScore(prev => prev - 1);
    }
    setNum1(Math.floor(Math.random() * 100));
    setNum2(Math.floor(Math.random() * 100));
    setAns("");
  }

  // listen for enter key input to submit answer
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render quickmath modal
  return ( 
    <div className="prompt">
      <CountDown minutes={1} setScore={setScore} setPlay={setPlay} play={play}></CountDown>
      <p>Score: {score}</p>
      <p>{num1} + {num2}</p>
      <div className="form-group">
        <label>Answer</label>
          <input
            type="number"
            value={ans}
            className="form-control" 
            onChange={e => {
              setAns(e.target.value);
            }}
            placeholder="Enter answer"
            disabled={play === "0"}
          />
      </div>
      <button id="submitButton" type="submit" className="btn btn-dark btn-block" onClick={verify}>Submit</button>
      <button type="button" className="btn btn-dark btn-block" onClick={data.onCloseModal}>Quit</button>
    </div>
  );
}

export default QuickMath;
