import { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  Modal,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Mine from "../Mine";
import "./GameBoard.scss";
import axios from "axios";
import useGameStore from "../../../GameStore";
import rectangleImage from "../../../assets/images/rectangle.png";
import yellowrectangle from "../../../assets/images/yellowrectangle.png";
import claimEmotion from "../../../assets/images/claimEmotion.png";
import cashLoader from "../../../assets/images/ecb.gif";
import yellowRectangle from "../../../assets/images/yellowrectangle.png";
import coinBoard from "../../../assets/images/coinBoard.svg";
import questionBoard from "../../../assets/images/questionBoard.svg";
import minesBoard from "../../../assets/images/minesBoard.svg";
import doubleornothing from "../../../assets/images/doubleornothing.svg";
import minesticker from "../../../assets/images/octopus.webm";
import minestickerPoster from "../../../assets/images/pirateOctor.png";
import { StoreContext } from "../../../store";

import { useWallet } from "@solana/wallet-adapter-react";
import cashoutsound from "../../../assets/audios/CashoutSound.mp3";
import lootBox from "../../../assets/audios/lootBox1clip.mp3";
import coinsound from "../../../assets/audios/CoinSound.mp3";
import mineexplosionsound from "../../../assets/audios/HitBomb.mp3";
import playgame_sound from "../../../assets/audios/MinesClickSound.mp3";
import useSound from "use-sound";
import getNum from "../Tools/Calculate";

const GameBoard = () => {

  const theme = useTheme();
  const global = useContext(StoreContext)

  const { publicKey } = useWallet();
  const [coinsoundplay] = useSound(coinsound);
  const [cashoutsoundplay] = useSound(cashoutsound);
  const [playgamesoundplay] = useSound(playgame_sound);
  const [lootsoundplay] = useSound(lootBox);
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [mineexplosionsoundplay] = useSound(mineexplosionsound);

  const { isMuted } = useGameStore();
  const { userName } = useGameStore();
  const { themeBlack } = useGameStore();
  const { streakNum, setStreakNum } = useGameStore();
  const { setGameWin } = useGameStore();
  const { bettingAmount } = useGameStore();
  const { setGameHistory } = useGameStore();
  const { mineHouseEdge } = useGameStore();
  const { doubleHouseEdge } = useGameStore();
  const { clicked, setClicked } = useGameStore();
  const { alerts, setAlerts } = useGameStore();
  const { previousMultiplier, setPreviousMultiplier } = useGameStore();
  const { gameStep, setGameStep } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { setWinNum } = useGameStore();
  const { winPhrase, losePhrase } = useGameStore();
  const { gameMode } = useGameStore();
  const { gameState, setGameState } = useGameStore();
  const { nugAmount, setNugAmount } = useGameStore();
  const { gemAmount, setGemAmount } = useGameStore();
  const { bonusNugAmount, setBonusNugAmount } = useGameStore();
  const { currencyMode, setCurrencyMode } = useGameStore();
  const { mineAmount } = useGameStore();
  const { boardState, setBoardState } = useGameStore();
  const { setMineGameWin } = useGameStore();
  const { mineGameLose, setMineGameLose } = useGameStore();
  const { setDoubleGameWin } = useGameStore();
  const { doubleGameLose, setDoubleGameLose } = useGameStore();
  const { nextMultiplier, setNextMultiplier } = useGameStore();
  const { boardClickedState, setBoardClickedState } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();
  const {limboWord} = useGameStore();

  const [animation1, setAnimation1] = useState(false);
  const [animation2, setAnimation2] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);
  const [winModalMultiplier, setWinModalMultiplier] = useState(1);
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);
  const [winFinalModalOpen, setWinFinalModalOpen] = useState(false);
  const [doubleWinCount, setDoubleWinCount] = useState(0);
  const [historyCard, setHistoryCard] = useState([]);

  const octoV = useRef(null);

  const playOcto = () => {
    const random = Math.floor(Math.random() * 10) + 5;
    setTimeout(() => {
      if (octoV)
        octoV.current.play();
    }, random * 1000)
  }

  let confetti = {
    maxCount: 150,		//set max confetti count
    speed: 2,			//set the particle animation speed
    frameInterval: 15,	//the confetti animation frame interval in milliseconds
    alpha: 1.0,			//the alpha opacity of the confetti (between 0 and 1, where 1 is opaque and 0 is invisible)
    gradient: false,	//whether to use gradients for the confetti particles
    start: null,		//call to start confetti animation (with optional timeout in milliseconds, and optional min and max random confetti count)
    stop: null,			//call to stop adding confetti
    toggle: null,		//call to start or stop the confetti animation depending on whether it's already running
    pause: null,		//call to freeze confetti animation
    resume: null,		//call to unfreeze confetti animation
    togglePause: null,	//call to toggle whether the confetti animation is paused
    remove: null,		//call to stop the confetti animation and remove all confetti immediately
    isPaused: null,		//call and returns true or false depending on whether the confetti animation is paused
    isRunning: null		//call and returns true or false depending on whether the animation is running
  };

  confetti.start = startConfetti;
  confetti.stop = stopConfetti;
  confetti.toggle = toggleConfetti;
  confetti.pause = pauseConfetti;
  confetti.resume = resumeConfetti;
  confetti.togglePause = toggleConfettiPause;
  confetti.isPaused = isConfettiPaused;
  confetti.remove = removeConfetti;
  confetti.isRunning = isConfettiRunning;
  let supportsAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
  let colors = ["rgba(30,144,255,", "rgba(107,142,35,", "rgba(255,215,0,", "rgba(255,192,203,", "rgba(106,90,205,", "rgba(173,216,230,", "rgba(238,130,238,", "rgba(152,251,152,", "rgba(70,130,180,", "rgba(244,164,96,", "rgba(210,105,30,", "rgba(220,20,60,"];
  let streamingConfetti = false;
  let pause = false;
  let lastFrameTime = Date.now();
  let particles = [];
  let waveAngle = 0;
  let context = null;
  let animationTimer;

  function resetParticle(particle, width, height) {
    particle.color = colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
    particle.color2 = colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = Math.random() * Math.PI;
    return particle;
  }

  function toggleConfettiPause() {
    if (pause)
      resumeConfetti();
    else
      pauseConfetti();
  }

  function isConfettiPaused() {
    return pause;
  }

  function pauseConfetti() {
    pause = true;
  }

  function resumeConfetti() {
    pause = false;
    runAnimation();
  }

  function runAnimation() {
    if (pause)
      return;
    else if (particles.length === 0) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      animationTimer = null;
    } else {
      let now = Date.now();
      let delta = now - lastFrameTime;
      if (!supportsAnimationFrame || delta > confetti.frameInterval) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        updateParticles();
        drawParticles(context);
        lastFrameTime = now - (delta % confetti.frameInterval);
      }
      animationTimer = requestAnimationFrame(runAnimation);
    }
  }

  function startConfetti(timeout, min, max) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    window.requestAnimationFrame = (function () {
      return window.requestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, confetti.frameInterval);
        };
    })();
    let canvas = document.getElementById("confetti-canvas");
    if (canvas === null) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("id", "confetti-canvas");
      canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:fixed;top:0");
      document.body.prepend(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, true);
      context = canvas.getContext("2d");
    } else if (context === null)
      context = canvas.getContext("2d");
    let count = confetti.maxCount;
    if (min) {
      if (max) {
        if (min === max)
          count = particles.length + max;
        else {
          if (min > max) {
            let temp = min;
            min = max;
            max = temp;
          }
          count = particles.length + ((Math.random() * (max - min) + min) | 0);
        }
      } else
        count = particles.length + min;
    } else if (max)
      count = particles.length + max;
    while (particles.length < count)
      particles.push(resetParticle({}, width, height));
    streamingConfetti = true;
    pause = false;
    runAnimation();
    if (timeout) {
      window.setTimeout(stopConfetti, timeout);
    }
  }

  function stopConfetti() {
    streamingConfetti = false;
  }

  function removeConfetti() {
    // stop();
    pause = false;
    particles = [];
  }

  function toggleConfetti() {
    if (streamingConfetti)
      stopConfetti();
    else
      startConfetti();
  }

  function isConfettiRunning() {
    return streamingConfetti;
  }

  function drawParticles(context) {
    let particle;
    let x, x2, y2;
    for (let i = 0; i < particles.length; i++) {
      particle = particles[i];
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 = particle.x + particle.tilt;
      x = x2 + particle.diameter / 2;
      y2 = particle.y + particle.tilt + particle.diameter / 2;
      if (confetti.gradient) {
        let gradient = context.createLinearGradient(x, particle.y, x2, y2);
        gradient.addColorStop("0", particle.color);
        gradient.addColorStop("1.0", particle.color2);
        context.strokeStyle = gradient;
      } else
        context.strokeStyle = particle.color;
      context.moveTo(x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();
    }
  }

  function updateParticles() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particle;
    waveAngle += 0.01;
    for (let i = 0; i < particles.length; i++) {
      particle = particles[i];
      if (!streamingConfetti && particle.y < -15)
        particle.y = height + 100;
      else {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(waveAngle) - 0.5;
        particle.y += (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.5;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        if (streamingConfetti && particles.length <= confetti.maxCount)
          resetParticle(particle, width, height);
        else {
          particles.splice(i, 1);
          i--;
        }
      }
    }
  }

  useEffect(() => {
    changeNextMultiplier();
  }, []);

  const getHistory = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/history/get`)
      .then((res) => {
        const newGameHistory = res.data;
        setGameHistory(newGameHistory);
      });
  };

  const changeNextMultiplier = () => {
    if (gameState === 0) {
      setPreviousMultiplier(1 * mineHouseEdge);
      let tempMultiplier = 1;
      for (let i = 0; i < gameStep + 1; i++) {
        tempMultiplier *= (25) / (25 - mineAmount);
      }
      tempMultiplier *= mineHouseEdge;
      setNextMultiplier(tempMultiplier);
      return;
    } else {
      let tempMultiplier = 1;
      for (let i = 0; i < gameStep + 1; i++) {
        tempMultiplier *= (25) / (25 - mineAmount);
      }
      tempMultiplier *= mineHouseEdge;
      setPreviousMultiplier(tempMultiplier);
    }

    let tempMultiplier = 1;
    for (let i = 0; i < gameStep + 2; i++) {
      tempMultiplier *= (25) / (25 - mineAmount);
    }
    tempMultiplier *= mineHouseEdge;
    setNextMultiplier(tempMultiplier);
    if (gameMode === "double") setNextMultiplier(2 * doubleHouseEdge);
  };

  const clickEvent = async (boardNum) => {
    if (boardClickedState[boardNum] === 1) return;
    if (clicked) return;
    setClicked(true);
    if (gameMode === "minesrush") {
      if (gameState === 0 || gameStep + mineAmount > 24) {
        setClicked(false);
        return;
      }
      const houseEdge = mineHouseEdge;
      const newBoardState = boardState;
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        game: "Minesrush",
        player: userName === "MinesRush" ? publicKey : userName,
        wager: bettingAmount,
        payout: 0,
        boardNum,
        houseEdge,
        mineAmount,
        gameStep,
      };
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/checkMine`, body)
        .then(async (res) => {
          const newBoardClickedState = boardClickedState;
          if (res.data.result === "bomb") {
            const phrase = Math.floor(Math.random() * 20);
            if (isMuted) mineexplosionsoundplay();
            newBoardClickedState[boardNum] = 1;
            setBoardClickedState(newBoardClickedState);
            setGameState(0);
            setWinNum(0);
            const allBoardState = JSON.parse(res.data.board.boardString);
            allBoardState.forEach((item, key) => {
              if (item === 0) allBoardState[key] = 1;
              else allBoardState[key] = 2;
            });
            revealBoardState(allBoardState);
            setGameStep(0);
            setPreviousMultiplier(1 * houseEdge);
            setNextMultiplier(1 * houseEdge);
            if (previousMultiplier >= 2) {
              setMineGameWin(1);
            } else {
              setMineGameWin(0);
            }
            setClicked(false);
            setMineGameLose(mineGameLose + 1);
            getHistory();
            setAlerts({
              type: "error",
              content: losePhrase[phrase]
            });
            return;
          }
          if (isMuted) coinsoundplay();

          newBoardState[boardNum] = 1;

          if (gameStep + mineAmount >= 24) {
            if (isMuted) cashoutsoundplay();
            const phrase = Math.floor(Math.random() * 20);
            const cboardState = [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0,
            ];
            setTimeout(() => {
              startConfetti();
            }, 1000)
            setTimeout(() => {
              stopConfetti();
            }, 3000)
            setBoardClickedState(cboardState);
            setWinModalMultiplier(nextMultiplier);
            setWinFinalModalOpen(true);
            setClicked(false);
            setGameStep(gameStep + 1);
            getHistory();
            setMineGameWin(1);
            setMineGameLose(0);
            setAlerts({
              type: "success",
              content: winPhrase[phrase]
            });
            return;
          }
          if (res.data.result === "coin") {
            setGameStep(gameStep + 1);
            changeNextMultiplier();
            setBoardState(newBoardState);
          }
          setClicked(false);
        })
        .catch((err) => {
          console.log("Error while checking mine.", err);
          setAlerts({ type: "error", content: err });
        });
    } else {
      if (isMuted) playgamesoundplay();
      let streak = streakNum;
      if (gameState === 0 || gameStep > 0) {
        setClicked(false);
        return;
      }
      if (boardNum)
        setAnimation2(true);
      else setAnimation1(true);
      if (isMuted) lootsoundplay();
      setTimeout(async () => {
        setAnimation1(false);
        setAnimation2(false);
        const newBoardState = boardState;
        const houseEdge = doubleHouseEdge;
        const body = {
          walletAddress: localStorage.walletLocalStorageKey,
          game: "double",
          player: userName === "MinesRush" ? publicKey : userName,
          wager: bettingAmount,
          payout: 0,
          boardNum,
          houseEdge
        };
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/checkMine`, body)
          .then(async (res) => {
            const newBoardClickedState = boardClickedState;
            const phrase = Math.floor(Math.random() * 20);
            if (res.data.result === "bomb") {
              if (isMuted) mineexplosionsoundplay();
              let histories = [...historyCard];
              histories.unshift(
                <Box className="fail card">
                  X0.00
                </Box>
              )
              setHistoryCard(histories);
              newBoardClickedState[boardNum] = 1;
              setBoardClickedState(newBoardClickedState);
              setGameState(0);
              const allBoardState = JSON.parse(res.data.board.boardString);
              allBoardState.forEach((item, key) => {
                if (item === 0) allBoardState[key] = 1;
                else allBoardState[key] = 2;
              });
              setGameStep(0);
              setPreviousMultiplier(1 * houseEdge);
              setNextMultiplier(1 * houseEdge);
              revealBoardState(allBoardState);
              getHistory();
              setClicked(false);
              setStreakNum(0);
              setGameWin(false);
              setDoubleWinCount(0);
              setDoubleGameLose(doubleGameLose + 1);
              setDoubleGameWin(0);
              setAlerts({
                type: "error",
                content: losePhrase[phrase]
              });
              return;
            }
            if (isMuted) coinsoundplay();
            let histories = [...historyCard];
            histories.unshift(
              <Box className="doubled card">
                X2.00
              </Box>
            )
            setHistoryCard(histories);
            setDoubleWinCount(doubleWinCount + 1);
            if (doubleWinCount >= 1) {
              setTimeout(() => {
                startConfetti();
              }, 1000)
              setTimeout(() => {
                stopConfetti();
              }, 3000)
            }
            setNextMultiplier(2 * houseEdge);
            newBoardState[boardNum] = 1;
            if (gameStep + mineAmount >= 1) {
              if (isMuted) coinsoundplay();
              const cboardState = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0,
              ];
              setBoardClickedState(cboardState);
              setWinModalMultiplier(nextMultiplier);
              changeNextMultiplier();
              setBoardState(newBoardState);
              setGameStep(gameStep + 1);
              setGameWin(true);
              setStreakNum(++streak);
              revealBoardState(newBoardState);
              setClicked(false);
              setAlerts({
                type: "success",
                content: winPhrase[phrase]
              });
              return;
            }
            setClicked(false);
          })
          .catch((err) => {
            console.log("Error while checking mine.", err);
            setAlerts({ type: "error", content: err });
          });
      }, 1000);
    }
  };

  const revealBoardState = (allBoardState) => {
    for (let key = 0; key < boardState.length; key++) {
      if (boardClickedState[key] === 0)
        if (allBoardState[key] === 1) allBoardState[key] = 3;
        else allBoardState[key] = 4;
    };

    setBoardState(allBoardState);
    const cboardState = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    setBoardClickedState(cboardState);
  };

  const onClickStopGame = async () => {
    if (isMuted) cashoutsoundplay();
    if (clicked === true) return;
    setCashLoading(true);
    setClicked(true);
    let body;
    let houseEdge;
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      if (gameMode === "minesrush") {
        body = {
          walletAddress: localStorage.walletLocalStorageKey,
          game: "Minesrush",
          player: userName === "MinesRush" ? publicKey : userName,
          wager: bettingAmount,
          payout: nextMultiplier * bettingAmount,
          coin: gameStep,
          mine: mineAmount,
          num: num
        };
        houseEdge = mineHouseEdge;
      } else {
        body = {
          walletAddress: localStorage.walletLocalStorageKey,
          game: "double",
          player: userName === "MinesRush" ? publicKey : userName,
          wager: bettingAmount,
          payout: nextMultiplier * bettingAmount,
          coin: 1,
          mine: 1,
          num: num
        }
        houseEdge = doubleHouseEdge
      }
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/stop`, body)
        .then(async (res) => {
          if (res.data.status === "success") {
            getHistory();
            setClicked(false);
            setGameState(0);
            const allBoardState = JSON.parse(res.data.board.boardString);
            allBoardState.forEach((item, key) => {
              if (item === 0) allBoardState[key] = 1;
              else allBoardState[key] = 2;
            });
            setPreviousMultiplier(1 * houseEdge);
            setNextMultiplier(1 * houseEdge);
            if (currencyMode === "mainNug")
              setNugAmount((parseFloat(nugAmount) + parseFloat(body.payout)).toFixed(3));
            else if (currencyMode === "bonusNug")
              setBonusNugAmount((parseFloat(bonusNugAmount) + parseFloat(body.payout)).toFixed(1));
            else if (currencyMode === "gem")
              setGemAmount((parseFloat(gemAmount) + parseFloat(body.gemAmount)).toFixed(1));
            setCashLoading(false);
            setGameState(0);
            setGameStep(0);
            revealBoardState(allBoardState);
            setWinFinalModalOpen(false);
            setAlerts({
              type: "success",
              content: "Cash Out Successful - Ye Plundered it!"
            });
          } else {
            setAlerts({
              type: "error",
              content: res.data.content
            })
          }
        });
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  };

  const handleGameOverModalClose = () => {
    setGameOverModalOpen(false);
  };

  const handleWinFinalModalClose = () => {
    setWinFinalModalOpen(false);
  };

  const rectangle = boardState.map((item, key) => {
    return (
      <>
        {key % 5 === 0 ? <Grid item xs={1}></Grid> : <></>}
        <Grid
          xs={2}
          item
          className="mine-block"
          onClick={() => {
            clickEvent(key);
          }}
        >
          <Mine type={boardState[key]} />
        </Grid>
        {key % 5 === 4 ? <Grid item xs={1}></Grid> : <></>}
      </>
    );
  });


  // minesrush gameboard
  const minesrush = () => {
    return (
      <>
        <Grid className="gameboard-container" container>
          {isDesktop &&
            <Grid xs={1} item sm={2} md={3} lg={4} />
          }
          <Grid xs={10} item sm={8} md={6} lg={4}
            className="mainBoard"
            style={{ flexBasis: !isDesktop && "100%", maxWidth: !isDesktop && "100%" }}
          >
            <Box className="octo">
              <video ref={octoV} autoPlay muted poster={minestickerPoster} preload="yes" style={{ width: "100%" }} playsInline onEnded={() => playOcto()}>
                <source src={minesticker} type="video/webm" />
                No supported
              </video>
            </Box>
            <Grid
              className={themeBlack ? "gameboard-black" : "gameboard"}
              container
              spacing={2}
            >
              {rectangle}
            </Grid>
          </Grid>
          {isDesktop &&
            <Grid xs={1} item sm={2} md={3} lg={4} />
          }
          <Modal
            open={gameOverModalOpen}
            onClose={handleGameOverModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={styleFair} style={{ backgroundColor: "#101112" }}>
              <Typography
                letiant="h3"
                component="h2"
                color="#F7BE44"
                fontSize="40px"
                fontFamily="Mada"
                marginTop="20px"
              >
                Fair
              </Typography>
              <img className="rectangle-image" alt="rect" src={rectangleImage} />
              <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Typography color="#fff" fontSize="18px" fontFamily="Mada">
                    Playing on the website is secure. The fairness of all bets is
                    unquestionable since we use cryptography to make sure every
                    bet is transparently fair and can be checked.
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={12}>
                  <img className="yellow-image" alt="yRect" src={yellowrectangle} />
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Modal
            open={winFinalModalOpen}
            onClose={handleWinFinalModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={styleStop}>
              <Typography color="#F7BE44" fontSize="70px" fontFamily="Mada">
                x{parseFloat((winModalMultiplier).toFixed(3))}
              </Typography>
              <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                  <img className="claimEmotion" alt="claimEmo" src={claimEmotion} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <span style={{ color: "#FFFFFF" }}>You Won </span>
                  <span style={{ color: "#F7BE44" }}>
                    {" "}
                    {parseFloat(
                      (winModalMultiplier * bettingAmount).toFixed(3)
                    )}
                  </span>
                </Grid>
                {!cashLoading ? <Button
                  letiant="contained"
                  style={{
                    marginTop: "10px",
                    color: "#000",
                    backgroundColor: "#F7BE44",
                  }}
                  onClick={onClickStopGame}
                  fontSize="10px"
                >
                  Claim Reward
                </Button> :
                  <Box>
                    <img src={cashLoader} style={{ width: "50px", marginTop: "10px" }} alt="Loading..." />
                    <Typography color="white" fontSize="15px" fontFamily="Mada">
                      Processing Cashout...
                    </Typography>
                  </Box>}
                <img className="yellow-image-claim" alt="yRect" src={yellowRectangle} />
              </Grid>
            </Box>
          </Modal>
        </Grid>
      </>
    )
  }

  // double gameboard
  const double = () => {
    return (
      <>
        <Grid className="gameboard-container" container>
          {isDesktop &&
            <Grid xs={1} item sm={2} md={3} lg={4} />
          }
          <Grid item xs={10} sm={8} md={6} lg={4} className="mainBoard"
            style={{ flexBasis: !isDesktop && "100%", maxWidth: !isDesktop && "100%" }}
          >
            <Box className="octo">
              <video ref={octoV} autoPlay poster={minestickerPoster} muted preload="yes" style={{ width: "100%" }} playsInline onEnded={() => playOcto()}>
                <source src={minesticker} type="video/webm" />
                No supported
              </video>
            </Box>
            <Box className="doubleBoard">
              <Box style={{ textTransform: "uppercase", color: "white", display: streakNum ? "block" : "none", top: "8%", left: "5%", right: "5%", position: "absolute" }}>
                <Box>Congrats!</Box>
                <Box>You are on a {streakNum} win streak</Box>
              </Box>
              <Box className="playHistoryContainer" style={{ paddingTop: streakNum ? 100 : 50 }}>
                <Box className="playHistory">
                  {historyCard.length ? historyCard :
                    <Box className="card question">
                      X.XX
                    </Box>
                  }
                </Box>
              </Box>

              <div className="doubleBoardImgs" style={{ justifyContent: "center" }}>
                {boardState[0] === 0 && <img className={animation1 ? "disappear" : "doueblBoardImg "} src={questionBoard} onClick={() => clickEvent(0)} alt="Question" />}
                {boardState[0] === 1 && <img className={animation1 ? "disappear" : "doueblBoardImg "} src={coinBoard} onClick={() => clickEvent(0)} alt="Coin" />}
                {boardState[0] === 2 && <img className={animation1 ? "disappear" : "doueblBoardImg "} src={minesBoard} onClick={() => clickEvent(0)} alt="Mine" />}
                {boardState[0] === 3 && <img className={animation1 ? "disappear revealed" : "doueblBoardImg revealed"} src={coinBoard} onClick={() => clickEvent(0)} alt="Coin" />}
                {boardState[0] === 4 && <img className={animation1 ? "disappear revealed" : "doueblBoardImg revealed"} src={minesBoard} onClick={() => clickEvent(0)} alt="Mine" />}
                {boardState[1] === 0 && <img className={animation2 ? "disappear" : "doueblBoardImg "} src={questionBoard} onClick={() => clickEvent(1)} alt="Question" />}
                {boardState[1] === 1 && <img className={animation2 ? "disappear" : "doueblBoardImg "} src={coinBoard} onClick={() => clickEvent(1)} alt="Coin" />}
                {boardState[1] === 2 && <img className={animation2 ? "disappear" : "doueblBoardImg"} src={minesBoard} onClick={() => clickEvent(1)} alt="Mine" />}
                {boardState[1] === 3 && <img className={animation2 ? "disappear revealed" : "doueblBoardImg revealed"} src={coinBoard} onClick={() => clickEvent(1)} alt="Coin" />}
                {boardState[1] === 4 && <img className={animation2 ? "disappear revealed" : "doueblBoardImg revealed"} src={minesBoard} onClick={() => clickEvent(1)} alt="Mine" />}
              </div>
              <img src={doubleornothing} className="doubleButton" alt="Double Or Nothing" />
            </Box>
          </Grid>
          {isDesktop &&
            <Grid xs={1} item sm={2} md={3} lg={4} />
          }
          <Modal
            open={gameOverModalOpen}
            onClose={handleGameOverModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={styleFair} style={{ backgroundColor: "#101112" }}>
              <Typography
                letiant="h3"
                component="h2"
                color="#F7BE44"
                fontSize="40px"
                fontFamily="Mada"
                marginTop="20px"
              >
                Fair
              </Typography>
              <img className="rectangle-image" alt="rect" src={rectangleImage} />
              <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Typography color="#fff" fontSize="18px" fontFamily="Mada">
                    Playing on the website is secure. The fairness of all bets is
                    unquestionable since we use cryptography to make sure every
                    bet is transparently fair and can be checked.
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={12}>
                  <img className="yellow-image" alt="yRect" src={yellowrectangle} />
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Modal
            open={winFinalModalOpen}
            onClose={handleWinFinalModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={styleStop}>
              <Typography color="#F7BE44" fontSize="70px" fontFamily="Mada">
                x{parseFloat((nextMultiplier).toFixed(3))}
              </Typography>
              <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                  <img className="claimEmotion" alt="claimEmo" src={claimEmotion} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <span style={{ color: "#FFFFFF" }}>You Won </span>
                  <span style={{ color: "#F7BE44" }}>
                    {" "}
                    {parseFloat(
                      (nextMultiplier * bettingAmount).toFixed(3)
                    )}
                  </span>
                </Grid>
                <Button
                  letiant="contained"
                  style={{
                    marginTop: "10px",
                    color: "#000",
                    backgroundColor: "#F7BE44",
                  }}
                  onClick={onClickStopGame}
                  fontSize="10px"
                >
                  Claim Rewardsssss
                </Button>
                <img className="yellow-image-claim" alt="yRect" src={yellowRectangle} />
              </Grid>
            </Box>
          </Modal>
        </Grid>
      </>
    )
  }

  // limbo gameboard
  const limbo = () => {
    return (
      <>
        <Grid className="gameboard-container" container>
          <Grid item xs={12} sm={8} md={6} lg={6} className="mainBoard"
            style={{ flexBasis: !isDesktop && "100%", maxWidth: !isDesktop && "100%" }}
          >
            <Box className="octo">
              <video ref={octoV} autoPlay poster={minestickerPoster} muted preload="yes" style={{ width: "100%" }} playsInline onEnded={() => playOcto()}>
                <source src={minesticker} type="video/webm" />
                No supported
              </video>
            </Box>
            <Box className="doubleBoard">
              <Box style={{ textTransform: "uppercase", color: "white", display: streakNum ? "block" : "none", top: "8%", left: "5%", right: "5%", position: "absolute" }}>
                <Box>Congrats!</Box>
                <Box>You are on a {streakNum} win streak</Box>
              </Box>
              <Box className="playHistoryContainer" style={{ paddingTop: streakNum ? 100 : 50 }}>
                <Box className="playHistory">
                  {global.limboHistory ? global.limboHistory :
                    <Box className="card question">
                      X.XX
                    </Box>
                  }
                </Box>
              </Box>
              <span className="limboWord">
                {limboWord}<span>x</span>
              </span>
            </Box>
          </Grid>
          <Modal
            open={gameOverModalOpen}
            onClose={handleGameOverModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={styleFair} style={{ backgroundColor: "#101112" }}>
              <Typography
                letiant="h3"
                component="h2"
                color="#F7BE44"
                fontSize="40px"
                fontFamily="Mada"
                marginTop="20px"
              >
                Fair
              </Typography>
              <img className="rectangle-image" alt="rect" src={rectangleImage} />
              <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Typography color="#fff" fontSize="18px" fontFamily="Mada">
                    Playing on the website is secure. The fairness of all bets is
                    unquestionable since we use cryptography to make sure every
                    bet is transparently fair and can be checked.
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={12}>
                  <img className="yellow-image" alt="yRect" src={yellowrectangle} />
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Modal
            open={winFinalModalOpen}
            onClose={handleWinFinalModalClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={styleStop}>
              <Typography color="#F7BE44" fontSize="70px" fontFamily="Mada">
                x{parseFloat((nextMultiplier).toFixed(3))}
              </Typography>
              <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                  <img className="claimEmotion" alt="claimEmo" src={claimEmotion} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <span style={{ color: "#FFFFFF" }}>You Won </span>
                  <span style={{ color: "#F7BE44" }}>
                    {" "}
                    {parseFloat(
                      (nextMultiplier * bettingAmount).toFixed(3)
                    )}
                  </span>
                </Grid>
                <Button
                  letiant="contained"
                  style={{
                    marginTop: "10px",
                    color: "#000",
                    backgroundColor: "#F7BE44",
                  }}
                  onClick={onClickStopGame}
                  fontSize="10px"
                >
                  Claim Rewards
                </Button>
                <img className="yellow-image-claim" alt="yRect" src={yellowRectangle} />
              </Grid>
            </Box>
          </Modal>
        </Grid>
      </>
    )
  }
  return (
    <>
      <div className="alert">
        {alerts.content && <div className={alerts.type}>{alerts.content.toString()}</div>}
      </div>
      {gameMode === "minesrush" && minesrush()}
      {gameMode === "double" && double()}
      {gameMode === "limbo" && limbo()}
    </>
  );
};

const styleStop = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "246px",
  height: "auto",
  bgcolor: "#101112",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  padding: "0px",
};

const styleFair = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "270px",
  height: "316px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  padding: "0px",
};

export default GameBoard;