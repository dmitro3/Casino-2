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
import '../Limbo/limbo.css'

const GameBoard = (props) => {

  const { launch, setLaunch, success, setSuccess } = props;

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
  const {limboWord, diceWord} = useGameStore();

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
              <div className='rocket-container'>
                <div className="transparent"></div>
              <svg id='rocket' className="svg-rocket" style={{display: launch ? 'block' : 'none' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.07909 127.50572">
                <g className="rocket-inner">
                    <g className="rocket-clouds">
                        <g className="rocket-clouds__bubble-group">
                            <path className="rocket-clouds__bubble rocket-clouds__bubble--1" d="M4.91835,105.17388a4.9187,4.9187,0,1,1,4.91895-4.91846A4.92378,4.92378,0,0,1,4.91835,105.17388Zm0-7.79053a2.87183,2.87183,0,1,0,2.87207,2.87207A2.875,2.875,0,0,0,4.91835,97.38335Z"/>
                            <path className="rocket-clouds__bubble rocket-clouds__bubble--2" d="M12.85194,93.10942a2.49194,2.49194,0,1,1,2.49219-2.49219A2.4944,2.4944,0,0,1,12.85194,93.10942Zm0-2.937a.44507.44507,0,1,0,.44531.44482A.44512.44512,0,0,0,12.85194,90.17241Z"/>
                            <path className="rocket-clouds__bubble rocket-clouds__bubble--3" d="M19.66932,92.21489a2.36426,2.36426,0,1,1,2.36426-2.36377A2.36655,2.36655,0,0,1,19.66932,92.21489Zm0-2.68164a.31738.31738,0,1,0,.31738.31787A.31727.31727,0,0,0,19.66932,89.53325Z"/>
                            <path className="rocket-clouds__bubble rocket-clouds__bubble--4" d="M68.19862,90.04448a2.36475,2.36475,0,1,1,2.36426-2.36475A2.36718,2.36718,0,0,1,68.19862,90.04448Zm0-2.68262a.31787.31787,0,1,0,.31738.31787A.31831.31831,0,0,0,68.19862,87.36186Z"/>
                            <path className="rocket-clouds__bubble rocket-clouds__bubble--5" d="M78.73475,93.68462a4.34424,4.34424,0,1,1,4.34473-4.34424A4.34946,4.34946,0,0,1,78.73475,93.68462Zm0-6.6416a2.29736,2.29736,0,1,0,2.29785,2.29736A2.3006,2.3006,0,0,0,78.73475,87.043Z"/>
                          </g>
                        <path className="rocket-clouds__cloud" d="M56.13026,127.50542a11.822,11.822,0,0,1-11.7959-10.48584,11.439,11.439,0,0,1-8.61914-4.64795,6.63761,6.63761,0,0,1-2.00391.79346,9.83371,9.83371,0,0,1-14.46973,9.82031,7.56926,7.56926,0,0,1-4.10645,1.19922,7.67293,7.67293,0,0,1-7.66406-7.66406,7.56854,7.56854,0,0,1,1.2793-4.23437,6.51262,6.51262,0,0,1,10.92383-6.79736,9.69137,9.69137,0,0,1,1.85938-.67627,3.95529,3.95529,0,0,1,5.96094-3.06445,6.74268,6.74268,0,0,1,7.36523-1.43262,11.36822,11.36822,0,0,1,19.72559-.58643,9.89618,9.89618,0,0,1,.94629-.54541,5.49322,5.49322,0,1,1,10.63477,1.1499,9.89586,9.89586,0,0,1,2.77832,3.62549,7.66,7.66,0,0,1,3.50781-.71777,5.61945,5.61945,0,1,1,7.55859,7.55713c.00293.07666.00391.15332.00391.231a7.7932,7.7932,0,0,1-12.15137,6.46A11.89851,11.89851,0,0,1,56.13026,127.50542ZM45.2035,114.97954a1.09452,1.09452,0,0,1,1.10352.98633,9.83054,9.83054,0,0,0,19.65527-.33936l-.00586-.22705a1.05829,1.05829,0,0,1,.65918-1.02344,1.0122,1.0122,0,0,1,1.1543.28223,5.72485,5.72485,0,0,0,10.1416-4.37744,1.02367,1.02367,0,0,1,.6875-1.10352,3.57235,3.57235,0,1,0-4.52539-4.52539,1.02728,1.02728,0,0,1-1.10156.688,5.8067,5.8067,0,0,0-3.98828.94531,1.02326,1.02326,0,0,1-1.55859-.55176,7.82342,7.82342,0,0,0-3.09863-4.22021,1.02317,1.02317,0,0,1-.32227-1.34033,3.44655,3.44655,0,1,0-6.3252-.68262,1.02349,1.02349,0,0,1-.60156,1.23975,7.75063,7.75063,0,0,0-2.16309,1.30518,1.02426,1.02426,0,0,1-1.58984-.34229,9.32269,9.32269,0,0,0-17.04883.4126,1.02317,1.02317,0,0,1-1.49609.47168,4.70254,4.70254,0,0,0-6.33008,1.18408,1.0244,1.0244,0,0,1-.76465.41406,1.0445,1.0445,0,0,1-.80664-.32324,1.897,1.897,0,0,0-1.39941-.61182,1.91612,1.91612,0,0,0-1.91309,1.91455,2.12129,2.12129,0,0,0,.03027.32666,1.02369,1.02369,0,0,1-.85352,1.17236,7.70025,7.70025,0,0,0-2.82715,1.03125,1.0231,1.0231,0,0,1-1.39453-.32568A4.466,4.466,0,0,0,10.83436,111.9a1.02394,1.02394,0,0,1-.09473,1.12988A5.55351,5.55351,0,0,0,9.518,116.52056a5.62344,5.62344,0,0,0,5.61719,5.61719,5.55646,5.55646,0,0,0,3.43164-1.1792,1.02243,1.02243,0,0,1,1.17969-.05225,7.78685,7.78685,0,0,0,11.77441-8.37549,1.02262,1.02262,0,0,1,.94824-1.26074,4.65785,4.65785,0,0,0,2.84668-1.126,1.024,1.024,0,0,1,1.54785.25586,9.369,9.369,0,0,0,8.02832,4.58643l.27734-.00635Z"/>
                      </g>
                    <g className="rocket-inner__rocket-and-lines">
                        <g className="rocket-lines">
                            <path className="rocket-lines__lines rocket-lines__lines--1" d="M42.72108,95.51616a1.02318,1.02318,0,0,1-1.02344-1.02344V73.50493a1.02344,1.02344,0,0,1,2.04688,0V94.49272A1.02318,1.02318,0,0,1,42.72108,95.51616Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--2" d="M30.65272,100.7144A1.02318,1.02318,0,0,1,29.62929,99.691V69.15972a1.02344,1.02344,0,0,1,2.04688,0V99.691A1.02318,1.02318,0,0,1,30.65272,100.7144Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--3" d="M54.66151,100.09136a1.02318,1.02318,0,0,1-1.02344-1.02344V69.15972a1.02344,1.02344,0,0,1,2.04688,0v29.9082A1.02318,1.02318,0,0,1,54.66151,100.09136Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--4" d="M58.23768,95.59136a1.02318,1.02318,0,0,1-1.02344-1.02344V69.15972a1.02344,1.02344,0,0,1,2.04688,0v25.4082A1.02318,1.02318,0,0,1,58.23768,95.59136Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--5" d="M51.08632,97.39116a1.02318,1.02318,0,0,1-1.02344-1.02344v-27.208a1.02344,1.02344,0,0,1,2.04688,0v27.208A1.02318,1.02318,0,0,1,51.08632,97.39116Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--6" d="M46.36073,95.34966a1.02318,1.02318,0,0,1-1.02344-1.02344V73.50493a1.02344,1.02344,0,0,1,2.04688,0V94.32622A1.02318,1.02318,0,0,1,46.36073,95.34966Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--7" d="M39.20839,96.84966a1.02318,1.02318,0,0,1-1.02344-1.02344V73.50493a1.02344,1.02344,0,0,1,2.04688,0V95.82622A1.02318,1.02318,0,0,1,39.20839,96.84966Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--8" d="M27.07655,102.09673a1.02318,1.02318,0,0,1-1.02344-1.02344V69.15972a1.02344,1.02344,0,0,1,2.04688,0v31.91357A1.02318,1.02318,0,0,1,27.07655,102.09673Z"/>
                            <path className="rocket-lines__lines rocket-lines__lines--9" d="M34.22792,100.99126a1.02318,1.02318,0,0,1-1.02344-1.02344V69.15972a1.02344,1.02344,0,0,1,2.04688,0V99.96782A1.02318,1.02318,0,0,1,34.22792,100.99126Z"/>
                          </g>
                          <path className="rocket-rocket" d="M43.62636,74.51519c-1.999,0-4.5293-.01416-7.62207-.05615a1.02257,1.02257,0,0,1-.98242-1.25684c.17578-.75342.51367-2.19385.93262-3.979H24.83729a1.02349,1.02349,0,0,1-.998-1.248c.09863-.439,2.42188-10.7627,2.66016-11.68555.10156-.3877,1.02539-3.81836,2.50781-5.41992a6.61129,6.61129,0,0,1,3.01172-1.8042V21.69731a1.027,1.027,0,0,1-.02832-.24023c0-11.28223,9.50977-20.76514,9.91406-21.16309A1.02492,1.02492,0,0,1,43.33729.29058c.4082.39844,9.89746,9.77588,10.12988,20.75928a1.10456,1.10456,0,0,1,.01074.15137V49.16167a6.557,6.557,0,0,1,2.70117,1.70752c1.48633,1.60645,2.40625,5.03418,2.50586,5.41992.24023.92285,2.56348,11.24707,2.66211,11.686a1.02349,1.02349,0,0,1-.998,1.248H49.53065c.51855,2.18506.8916,3.75635.94434,3.97607a1.02409,1.02409,0,0,1-.96484,1.25928C49.4828,74.45952,47.60682,74.51519,43.62636,74.51519Zm-6.32129-2.08691c5.60449.06641,9.15527.03613,10.88477.00977-.208-.875-.51172-2.15625-.86719-3.64844a1.022,1.022,0,0,1-.18652-.58984,1.08488,1.08488,0,0,1,.01074-.15039c-1.39551-5.86963-3.40234-14.3042-3.55371-14.88867a4.15492,4.15492,0,0,0-.834-1.85205,4.74017,4.74017,0,0,0-.80957,1.72852l-.06934.20313C41.6664,53.90483,39.12929,64.64507,37.30507,72.42827Zm11.91992-5.252h9.84473c-.874-3.87646-2.19922-9.73389-2.36523-10.373a13.167,13.167,0,0,0-2.02734-4.54395,4.29723,4.29723,0,0,0-1.19922-.8833v7.24512A10.72867,10.72867,0,0,1,49.225,67.17632Zm-23.1084,0H36.27284a10.7394,10.7394,0,0,1-4.25391-8.55518V51.23149a4.45406,4.45406,0,0,0-1.50977,1.02832,13.20048,13.20048,0,0,0-2.02832,4.54395C28.29921,57.50884,26.76015,64.32134,26.11659,67.17632ZM42.74843,49.22905c.88477,0,2.09277.59277,2.82617,3.418.13672.52539,1.6582,6.916,2.97168,12.4375A8.68392,8.68392,0,0,0,51.431,58.62114V50.40386a1.01378,1.01378,0,0,1-.10449-.627,1.03184,1.03184,0,0,1,.10449-.3208V22.48052H34.06581V58.62114A8.69014,8.69014,0,0,0,36.932,65.06743c1.3291-5.63623,2.8457-12.01562,3.01465-12.5l.06445-.187C40.38319,51.27935,41.07753,49.22905,42.74843,49.22905Zm-8.665-29.05127h17.293c-.59668-8.09277-6.64258-15.36035-8.75-17.665C40.55507,4.80767,34.65956,12.00786,34.08339,20.17778Zm8.99707,16.98828a6.51489,6.51489,0,1,1,6.51563-6.51514A6.52263,6.52263,0,0,1,43.08046,37.16606Zm0-10.98291a4.468,4.468,0,1,0,4.46875,4.46777A4.47272,4.47272,0,0,0,43.08046,26.18315Z"/>
                      </g>
                  </g>
              </svg>
              </div>
              {global.start && <span className={ !success ? 'limboWord' : 'limboWord_red'}>
                { !launch ?limboWord+`x`:''}
              </span>}
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

  // dice gameboard
  const dice = () => {
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
              
              <div className='rocket-container'>
                <div className="transparent"></div>
                  

              </div>
              {global.start && <span className={ !success ? 'limboWord' : 'limboWord_red'}>
                { !launch ?diceWord+`x`:''}
              </span>}
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
      {gameMode === "dice" && dice()}
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