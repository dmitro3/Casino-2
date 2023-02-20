import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import useGameStore from "../../../GameStore";
import playgame_sound from "../../../assets/audios/spinClick.wav";
import spinBtn from "../../../assets/images/spinBtn.png";
import spinNeedle from "../../../assets/images/spinNeedle.png";
import nug from "../../../assets/images/nugget.png"
import "./Wheel.scss"
import { speedDialIconClasses } from "@mui/material";

const Wheel = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  onRotate,
  onRotatefinish,
  primaryColor,
  primaryColoraround,
  contrastColor,
  buttonText,
  isOnlyOnce,
  size = document.getElementById("gamePlay")?.offsetWidth / 8,
  upDuration,
  downDuration,
  fontFamily,
  width = size / 2,
  height = size / 2,
  img
}) => {

  const { isMuted } = useGameStore();
  const { number } = useGameStore();
  const { loading, setLoading } = useGameStore();
  const { isReward, setIsReward } = useGameStore();
  const [playgamesoundplay] = useSound(playgame_sound);

  let currentSegment = "";
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = Math.PI;
  let angleDelta = 0;
  let canvasContext = null;
  let maxSpeed = Math.PI / `${segments.length}`;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = size + 20;
  const centerY = size + 20;
  const borderColors = [
    "#5da85a",
    "#463d9b",
    "#006dd9",
    "#c8694e",
    "#efaa4d",
    "#00ffff",
  ]
  // const centerX = 500;
  // const centerY = 500;
  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  // useEffect(() => {
  //   initCanvas();
  //   draw();
  // }, [size])
  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let wheelCanvas = document.getElementById("canvas");
    const context = wheelCanvas.getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    let spinBtn = document.getElementById("spinButton");
    if (navigator.appVersion.indexOf("MSIE") !== -1) {
      wheelCanvas = document.createElement("canvas");
      wheelCanvas.setAttribute("width", width);
      wheelCanvas.setAttribute("height", height);
      wheelCanvas.setAttribute("id", "canvas");
      document.getElementById("wheel").appendChild(wheelCanvas);
    }
    spinBtn.addEventListener("click", spin, false);
    canvasContext = wheelCanvas.getContext("2d");
  };

  const spin = () => {
    // setTimeout(() => {
      setFinished(false);
    let remain = document.getElementById("remain").textContent;

    if (remain > 0) {
      isStarted = true;
      setLoading(true);
      setIsReward();
      // onRotate();
      if (timerHandle === 0) {
        spinStart = new Date().getTime();
        // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
        maxSpeed = Math.PI / segments.length;
        frames = 0;
        timerHandle = setInterval(onTimerTick, timerDelay);
      }
    }
    // }, 500)

  };
  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        if (progress >= 0.8) {
          angleDelta =
            (maxSpeed / 1.2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        } else if (progress >= 0.98) {
          angleDelta =
            (maxSpeed / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        } else
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key, lastAngle, angle) => {
    const ctx = canvasContext;
    // const PI2 = Math.PI * 2;
    // const len = segments.length;
    const value = parseFloat(segments[key]).toFixed(3);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key];
    ctx.fill();
    ctx.stroke();



    const image = new Image();
    image.onload = () => {
      ctx.translate(centerX, centerY);
      ctx.rotate((lastAngle + angle) / 2);
      ctx.rotate(Math.PI)
      ctx.drawImage(image, -size * 7.5 / 9, -size / 11, size / 7, size / 7);
      ctx.restore()
    }

    image.src = value > 1 ? nug : img

    ctx.save();


    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.rotate(Math.PI)
    ctx.fillStyle = contrastColor || "white";
    ctx.font = `bold ${size / 10}px Arial`;
    ctx.fillText(value, -size * 5 / 9, 0);

    // ctx.fillText(value, -size / 2 - 20, 0);
    ctx.restore();



    // ctx.beginPath();
    // ctx.arc(centerX, centerY, size, delta * key, delta * (key + 1), false);
    // ctx.lineWidth = size / 32;
    // ctx.strokeStyle = borderColors[key];
    // ctx.stroke();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    const delta = PI2 / len;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || "#353535";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em " + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }
    // Draw a center outline circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.27, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "transparent";
    ctx.lineWidth = size / 30;
    ctx.strokeStyle = "#353535";
    ctx.fill();
    ctx.stroke();
    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.25, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor || "#1D2A33";
    ctx.lineWidth = size * 0.05;
    ctx.strokeStyle = contrastColor || "#1D2A33";
    ctx.fill();
    // ctx.font = `bold ${size * 0.15}px Arial`;
    // ctx.fillStyle = contrastColor || "black";
    // ctx.textAlign = "center";
    // ctx.fillText(buttonText || "SPIN!", centerX, centerY + 3);
    ctx.stroke();
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = size / 32;
    ctx.strokeStyle = primaryColoraround || "#353535";
    ctx.stroke();

    for (let i = 0; i < len; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, size + size / 16, angleCurrent + delta * i + 0.015, angleCurrent + delta * (i + 1) - 0.015, false);
      ctx.lineWidth = size / 32;
      ctx.strokeStyle = borderColors[i];
      ctx.stroke();
    }
    // for (i = 0; i <= len; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 18 / 16, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = primaryColoraround || "#353535";
    ctx.stroke();
    // }
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    ctx.lineWidth = size * 0.05;
    ctx.strokeStyle = "#F5B14A";
    ctx.fillStyle = "#F5B14A";
    ctx.beginPath();

    // ctx.moveTo(centerX - size-size*0.1+15, centerY - size*0.15);
    // ctx.lineTo(centerX - size-size*0.1+15, centerY + size*0.15);
    // ctx.lineTo(centerX - size+size*0.15+10, centerY);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();

    // ctx.moveTo(centerX - size - size * 0.1 - size / 10 + 15, centerY - size * 0.25 + 2.9);
    // ctx.arc(centerX - size - size * 0.1 - size / 10 + 13, centerY - size * 0.25 + 5.2, 3, -Math.PI / 3, -Math.PI, true);
    // ctx.lineTo(centerX - size - size * 0.1 - size / 10+10, centerY + size * 0.25 - 5.2);
    // ctx.arc(centerX - size - size * 0.1 - size / 10 + 13, centerY + size * 0.25 - 4, 3, -Math.PI, -Math.PI * 5 / 3, true)
    // ctx.lineTo(centerX - size + size * 0.15 - size / 10 - 4.5, centerY + 6);
    // ctx.arc(centerX - size + size * 0.15 - size / 10 - 3, centerY, 3, Math.PI / 3, -Math.PI / 3, true)
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    const change = angleCurrent + Math.PI;//needle pointer
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "transparent";
    ctx.font = "bold 1.5em " + fontFamily;
    currentSegment = segments[i];
    isStarted &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };
  const clear = () => {
    let wheelCanvas = document.getElementById("canvas");
    const ctx = canvasContext;
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.beginPath()
  };
  return (
    <div
      id="wheel"
      style={{
        width: size * 2 + 40,
        height: size * 2 + 40,
        margin: "auto"
      }}
    >
      <canvas
        id="canvas"
        width={size * 2 + 40}
        height={size * 2 + 40}
        // width="2000"
        // height="2000"
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto"
        }}
      />
      <div
        id="spinButtonGroup"
      >
        <div style={{width: size/2, height: size/2}} id="spinButton" onClick = {() => {if(isMuted) playgamesoundplay();}}>
          <img
            src={spinBtn}
            width= "100%"
            className="spinButton"
          />
          <p style={{fontSize: `${size/9}px`}}>SPIN!</p>
        </div>
        <img
          src={spinNeedle}
          width={size / 4}
          className={isFinished? "spinNeedle move" : "spinNeedle"}
          style={{ right: size * 2 }}
        />
      </div>
    </div>
  );
};
export default Wheel;



// import React from 'react';
// import { useState } from 'react';
// import useGameStore from '../../../GameStore';

// import './Wheel.css';

// const Wheel = () => {
//   //   constructor(props) {
//   //     super(props);
//   //     this.state = {
//   //       selectedItem: null,
//   //     };
//   //     this.selectItem = this.selectItem.bind(this);
//   //   }
//   //   const spinnerItems = [
//   //   10, 20, 30, 40, 50, 60, 70, 80, 90
//   // ]

//   const { spinnerItems } = useGameStore();
//   const [selectedItem, setSelectedItem] = useState();
//   const onSelectItem = () => {
//   }

//   const selectItem = () => {
//     if (selectedItem === null) {
//       const selectedItem = Math.floor(Math.random() * spinnerItems.length);
//       if (onSelectItem) {
//         onSelectItem(selectedItem);
//       }
//       setSelectedItem(selectedItem);
//     } else {
//       // setSelectedItem(null);
//       // setTimeout(selectItem, 5000);
//     }
//   }

//   const wheelVars = {
//     '--nb-item': spinnerItems.length,
//     '--selected-item': selectedItem,
//   };
//   const spinning = selectedItem !== null ? 'spinning' : '';
//   return (
//     <div className="wheel-container">
//       <div className={`wheel ${spinning}`} style={wheelVars} onClick={selectItem}>
//         {spinnerItems.map((item, index) => (
//           <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
//             {item}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Wheel