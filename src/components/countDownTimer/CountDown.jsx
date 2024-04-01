import React, { useEffect, useState } from 'react'
import "./style.css"

const CountDown = ({seconds}) => {


  const [totalSeconds, setTotalSeconds] = useState(seconds/1000);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTotalSeconds(prevTotalSeconds => {
        if (prevTotalSeconds <= 0) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevTotalSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  const formattedMins = mins.toString().padStart(2, '0')
  const formattedSecs = secs.toString().padStart(2, '0')


  if(totalSeconds == 0){
      // your code heare :)
  }



    return (
      <div className='countDown'>
        <h1>{formattedMins}</h1>
        <span>:</span>
        <h1>{formattedSecs}</h1>





      </div>
    );
}

export default CountDown
