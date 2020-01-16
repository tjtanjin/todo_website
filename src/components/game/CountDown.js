import React, { useState, useEffect } from 'react'

export const CountDown = ({ hours = 0, minutes = 0, seconds = 0, setScore, setPlay, play }) => {
  const [over, setOver] = useState(false);
  const [time, setTime] = useState({
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds)
  });

  // handles timer ticks
  const tick = () => {
    if (play === "1") {
      if (over) {
        setPlay("0");
      }
      if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) setOver(true);
      else if (time.minutes === 0 && time.seconds === 0)
        setTime({
          hours: time.hours - 1,
          minutes: 59,
          seconds: 59
        });
      else if (time.seconds === 0)
        setTime({
          hours: time.hours,
          minutes: time.minutes - 1,
          seconds: 59
        });
      else
        setTime({
          hours: time.hours,
          minutes: time.minutes,
          seconds: time.seconds - 1
        });
    }
  };

  // handles timer reset
  const reset = () => {
    setTime({
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds)
    });
    setOver(false);
  };

  // 1 second per tick
  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  // render timer
  return (
    <div>
    <button type="button" className="btn btn-danger btn-sm" onClick={() => {reset(); setScore(0); setPlay("1");}}>Start/Restart</button>
      <p>{`${time.hours.toString().padStart(2, '0')}:${time.minutes
        .toString()
        .padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`}</p>
      <div>{over ? "Time's up!" : ''}</div>
    </div>
  );
}