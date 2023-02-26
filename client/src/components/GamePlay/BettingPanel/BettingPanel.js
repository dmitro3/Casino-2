import axios from "axios";
import useSound from "use-sound";
import { useState, useEffect, useContext } from "react";

import { useTheme } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Grid, Button, Modal, Typography, Slider, useMediaQuery, } from "@mui/material";

import nug from "../../../assets/images/nugget.png"
import eth from "../../../assets/images/eth.png"
import gemImg from "../../../assets/images/gem.png"
import cashLoader from "../../../assets/images/ecb.gif";
import options from "../../../assets/images/setting.png";
import messaging from "../../../assets/images/messaging.png";
import cashoutsound from "../../../assets/audios/CashoutSound.mp3";
import claimEmotion from "../../../assets/images/claimEmotion.png";
import playgame_sound from "../../../assets/audios/MinesClickSound.mp3";
import yellowRectangle from "../../../assets/images/yellowrectangle.png";
import mineamountsetting from "../../../assets/images/mineamountsetting.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { StoreContext } from "../../../store";

import "./BettingPanel.scss";
import useGameStore from "../../../GameStore";
import getNum from "../Tools/Calculate";

const BettingPanel = ({
  setLoading,
  setDepositText,
}) => {

  const global = useContext(StoreContext);
  const theme = useTheme();
  const { isMuted } = useGameStore();
  const [cashoutsoundplay] = useSound(cashoutsound);
  const { publicKey } = useWallet();
  const [playgamesoundplay] = useSound(playgame_sound);
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { userName, bNugRatio } = useGameStore();
  const { setAlerts } = useGameStore();
  const { themeBlack } = useGameStore();
  const { mineHouseEdge } = useGameStore();
  const { setGameHistory } = useGameStore();
  const { doubleHouseEdge } = useGameStore();
  const { setWalletAddress } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { setRaffles } = useGameStore();
  const { minMine } = useGameStore();
  const { maxMine } = useGameStore();
  const { clicked, setClicked } = useGameStore();
  const { gameStep, setGameStep } = useGameStore();
  const { winPhrase } = useGameStore();
  const { gameMode } = useGameStore();
  const { nugAmount, setNugAmount } = useGameStore();
  const { gemAmount, setGemAmount } = useGameStore();
  const { gameState, setGameState } = useGameStore();
  const { currencyMode } = useGameStore();
  const { bonusNugAmount, setBonusNugAmount } = useGameStore();
  const { raffleMode } = useGameStore();
  const { boardState, setBoardState } = useGameStore();
  const { mineAmount, setMineAmount } = useGameStore();
  const { winNum, setWinNum } = useGameStore();
  const { mineGameWin, setMineGameWin } = useGameStore();
  const { mineGameLose, setMineGameLose } = useGameStore();
  const { doubleGameWin, setDoubleGameWin } = useGameStore();
  const { doubleGameLose, setDoubleGameLose } = useGameStore();
  const { bettingAmount, setBettingAmount } = useGameStore();
  const { nextMultiplier, setNextMultiplier } = useGameStore();
  const { boardClickedState, setBoardClickedState } = useGameStore();
  const { previousMultiplier, setPreviousMultiplier } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [showDiscord, setShowDiscord] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [discordModalOpen, setDiscordModalOpen] = useState(false);
  const [mineSliderAmount, setMineSliderAmount] = useState(mineAmount);
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);

  useEffect(() => {
    if (raffleMode && currencyMode === "mainNug") {
      if (mineGameWin > 0) {
        setMineGameWin(0);
        getRaffle("Mine Win");
      } else if (mineGameLose > 2) {
        setMineGameLose(0);
        getRaffle("Mine Lose");
      } else if (doubleGameWin > 2) {
        setDoubleGameWin(0);
        getRaffle("Double Win");
      } else if (doubleGameLose > 2) {
        setDoubleGameLose(0);
        getRaffle("Double Lose");
      }
    }
  }, [mineGameWin, mineGameLose, doubleGameLose, doubleGameWin]);

  const getRaffle = async (type) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: publicKey.toBase58(),
        num: num,
        type: type
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/getRaffle`, body);
      if (res.data.status === "success") {
        setRaffles(res.data.count);
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const getHistory = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/history/get`)
      .then((res) => {
        const newGameHistory = res.data;
        setGameHistory(newGameHistory);
      });
  };

  const changeNextMultiplier = () => {
    if (clicked) return;
    if (gameMode === "minesrush") {
      if (gameStep === 0) {
        setPreviousMultiplier(1 * mineHouseEdge);
      } else {
        let tempMultiplier = 1;
        for (let i = 0; i < gameStep - 1; i++) {
          tempMultiplier *= 25 / (25 - mineSliderAmount);
        }
        tempMultiplier *= mineHouseEdge;
        setPreviousMultiplier(tempMultiplier);
      }

      let tempMultiplier = 1;
      for (let i = 0; i < gameStep + 1; i++) {
        tempMultiplier *= 25 / (25 - mineSliderAmount);
      }
      tempMultiplier *= mineHouseEdge;
      setNextMultiplier(tempMultiplier);
    } else {
      if (gameStep === 0)
        setNextMultiplier(1 * doubleHouseEdge);
      else setNextMultiplier(2 * doubleHouseEdge);
    }
  };

  const checkAlreadyDeposit = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      if ((currencyMode === "mainNug" && bettingAmount * 1.135 < nugAmount) || (currencyMode === "bonusNug" && bettingAmount * 1.135 < bonusNugAmount) || (currencyMode === "gem" && bettingAmount * 1.135 < gemAmount)) {
        const body = {
          walletAddress: publicKey.toBase58(),
          mineAmount: mineAmount,
          bettingAmount: bettingAmount,
          num: num,
          currencyMode: currencyMode
        };
        let result;
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/checkAlreadyDeposit`, body)
          .then((res) => {
            result = res.data;
          })
          .catch((err) => {
            console.log("There was an error and this is it. ", err);
            setAlerts({ type: "error", content: err.message });
          });
        return result;
      } else {
        const result = {
          status: "error",
          content: "Not enough funds - Where’s yer money?!"
        }
        return result;
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  };

  const onPlay = async () => {
    if (isMuted) playgamesoundplay();
    if (clicked) return;
    setClicked(true);
    if (!global.walletConnected) {
      setConnectWalletModalOpen(true);
      setClicked(false)
      return;
    }
    if (gameMode === "minesrush") {
      let depositResult;
      setWalletAddress(publicKey.toBase58());
      if (gameState === 1) {
        if (gameStep > 0) {
          setStopModalOpen(true);
          setClicked(false);
          return;
        } else {
          setClicked(false);
          return;
        }
      }
      let random;
      const depoResult = await checkAlreadyDeposit();
      if (depoResult.status === "success") {
        if (depoResult.content === "checked") {
          setNumber(depoResult.data);
          random = depoResult.data;
          setBettingAmount(depoResult.bettingAmount);
          setGameState(1);
        } else {
          depositResult = await deposit(depoResult.data);
          random = depositResult.content;
          if (!depositResult.status) {
            setNumber(random)
            setClicked(false);
            return;
          }
        }

        const postRes = await postPlay(random);
        if (postRes.status) {
          const cboardState = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ];
          setClicked(false);
          setGameStep(0);
          changeNextMultiplier();
          setBoardState(cboardState);
          setBoardClickedState(cboardState);
        } else {
          setAlerts({
            type: "error",
            content: postRes.content
          })
          setClicked(false)
        }
      } else {
        setAlerts({
          type: "error",
          content: depoResult.content
        })
        setClicked(false);
        return;
      }
    }
    else {
      let depositResult;
      setWalletAddress(publicKey.toBase58());
      if (gameState === 1) {
        if (gameStep > 0) {
          setStopModalOpen(true);
          setClicked(false);
          return;
        } else {
          setClicked(false);
          return;
        }
      }
      let random
      const depoResult = await checkAlreadyDeposit();
      if (depoResult.status === "success") {
        if (depoResult.content === "checked") {
          setNumber(depoResult.data)
          random = depoResult.data
          setBettingAmount(depoResult.bettingAmount);
          setGameState(1);
        } else {
          depositResult = await deposit(depoResult.data);
          random = depositResult.content;
          if (!depositResult.status) {
            setNumber(random)
            setClicked(false);
            return;
          }
        }
        const postRes = await postPlay(random);
        if (postRes.status) {
          const cboardState = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ];
          setClicked(false);
          setGameStep(0);
          changeNextMultiplier();
          setBoardState(cboardState);
          setBoardClickedState(cboardState);
        } else {
          setAlerts({
            type: "error",
            content: postRes.content
          })
          setClicked(false)
        }
      } else {
        setAlerts({
          type: "error",
          content: depoResult.content
        })
        setClicked(false);
        return;
      }
    }
  };
  const deposit = async (number) => {
    try {
      setDepositText(true);
      setLoading(true);
      const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          walletAddress: publicKey.toBase58(),
          bettingAmount,
          mineAmount,
          gameMode,
          num,
          currencyMode: currencyMode
        };
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/play/verifyDeposit`,
          body
        );
        if (res.data.status === "success") {
          if (currencyMode === "mainNug")
            setNugAmount((nugAmount - bettingAmount * 1.035).toFixed(3));
          else if (currencyMode === "bonusNug")
            setBonusNugAmount(parseFloat(bonusNugAmount - bettingAmount * 1.035).toFixed(3));
          else if (currencyMode === "gem")
            setGemAmount(parseFloat(gemAmount - bettingAmount).toFixed(3));
          setGameState(1);
          setDepositText(false);
          setLoading(false);
          setAlerts({
            type: "success",
            content: "Deposit Success - Goodluck Matey!"
          });
          return { status: true, content: res.data.data };
        } else {
          setLoading(false);
          setAlerts({
            type: "error",
            content: "Deposit Failed - Try again soon!"
          })
          return { status: false, content: res.data.data };
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    } catch (err) {
      console.log("Error while getting balance", err);
      setLoading(false);
      return false;
    }
  };

  const handleStopModalClose = () => {
    setStopModalOpen(false);
  };

  const handleConnectWalletModalClose = () => {
    setConnectWalletModalOpen(false);
  };

  var confetti = {
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
      var now = Date.now();
      var delta = now - lastFrameTime;
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
    var width = window.innerWidth;
    var height = window.innerHeight;
    window.requestAnimationFrame = (function () {
      return window.requestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, confetti.frameInterval);
        };
    })();
    var canvas = document.getElementById("confetti-canvas");
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
    var count = confetti.maxCount;
    if (min) {
      if (max) {
        if (min === max)
          count = particles.length + max;
        else {
          if (min > max) {
            var temp = min;
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
    var particle;
    var x, x2, y2;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 = particle.x + particle.tilt;
      x = x2 + particle.diameter / 2;
      y2 = particle.y + particle.tilt + particle.diameter / 2;
      if (confetti.gradient) {
        var gradient = context.createLinearGradient(x, particle.y, x2, y2);
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
    var width = window.innerWidth;
    var height = window.innerHeight;
    var particle;
    waveAngle += 0.01;
    for (var i = 0; i < particles.length; i++) {
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


  const onClickStopGame = async () => {
    if (isMuted) cashoutsoundplay();
    if (clicked === true) return;
    // if (!hack) {
    setCashLoading(true);
    setClicked(true);
    const phrase = Math.floor(Math.random() * 20);
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      let payout = 0;
      if (gameMode === "minesrush") {
        payout = (gameStep + mineAmount > 24 ? nextMultiplier : previousMultiplier) * bettingAmount
        const body = {
          walletAddress: publicKey.toBase58(),
          game: "Minesrush",
          player: userName === "MinesRush" ? publicKey : userName,
          wager: bettingAmount,
          payout: payout,
          coin: gameStep,
          mine: mineAmount,
          num: num
        };
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/stop`, body)
          .then(async (res) => {
            if (res.data.status === "success") {
              setWinNum(winNum + 1);
              getHistory();
              setClicked(false);
              // socket.emit("history", "historyChanged");
              setGameState(0);
              if (winNum > 1) {
                setTimeout(() => {
                  startConfetti();
                }, 1000)
                setTimeout(() => {
                  stopConfetti();
                }, 3000)
              }
              const allBoardState = JSON.parse(res.data.board.boardString);
              allBoardState.forEach((item, key) => {
                if (item === 0) allBoardState[key] = 1;
                else allBoardState[key] = 2;
              });
              if (currencyMode === "mainNug")
                setNugAmount((parseFloat(nugAmount) + parseFloat(body.payout)).toFixed(3));
              else if (currencyMode === "bonusNug")
                setBonusNugAmount((parseFloat(bonusNugAmount) + parseFloat(body.payout)).toFixed(3));
              else if (currencyMode === "gem")
                setGemAmount((parseFloat(gemAmount) + parseFloat(body.payout)).toFixed(3));
              revealBoardState(allBoardState);
            } else {
              setAlerts({
                type: "error",
                content: res.data.content
              })
              return;
            }
          });
        if (gameStep > 0 && previousMultiplier >= 2) {
          setMineGameWin(1);
          setMineGameLose(0);
        }
        if (mineGameWin > 0) {
          setTimeout(() => {
            startConfetti();
          }, 1000)
          setTimeout(() => {
            stopConfetti();
          }, 3000)
        }
        if (currencyMode === "mainNug")
          setNugAmount((parseFloat(nugAmount) + parseFloat(body.payout)).toFixed(3));
        else if (currencyMode === "bonusNug")
          setBonusNugAmount((parseFloat(bonusNugAmount) + parseFloat(body.payout)).toFixed(3));
        else if (currencyMode === "gem")
          setGemAmount((parseFloat(gemAmount) + parseFloat(body.payout)).toFixed(3));
        setCashLoading(false);
        setGameStep(0);
        setPreviousMultiplier(1 * mineHouseEdge);
        setNextMultiplier(1 * mineHouseEdge);
        setStopModalOpen(false);
        setAlerts({
          type: "success",
          content: winPhrase[phrase]
        });
      }
      else {
        payout = nextMultiplier * bettingAmount;
        const body = {
          walletAddress: publicKey.toBase58(),
          game: "double",
          player: userName === "MinesRush" ? publicKey : userName,
          wager: bettingAmount,
          payout: payout,
          coin: gameStep,
          mine: mineAmount,
          num: num
        };
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/stop`, body)
          .then(async (res) => {
            if (res.data.status === "success") {
              getHistory();
              setClicked(false);
              // socket.emit("history", "historyChanged");
              setGameState(0);
              const allBoardState = JSON.parse(res.data.board.boardString);
              allBoardState.forEach((item, key) => {
                if (item === 0) allBoardState[key] = 1;
                else allBoardState[key] = 2;
              });
              if (currencyMode === "mainNug")
                setNugAmount((parseFloat(nugAmount) + parseFloat(body.payout)).toFixed(3));
              else if (currencyMode === "bonusNug")
                setBonusNugAmount((parseFloat(bonusNugAmount) + parseFloat(body.payout)).toFixed(3));
              else if (currencyMode === "gem")
                setGemAmount((parseFloat(gemAmount) + parseFloat(body.payout)).toFixed(3));
              revealBoardState(allBoardState);
            } else {
              setAlerts({
                type: "error",
                content: res.data.content
              })
              return;
            }
          });

        setCashLoading(false);
        setGameStep(0);
        setPreviousMultiplier(1 * doubleHouseEdge);
        setDoubleGameLose(0);
        setDoubleGameWin(doubleGameWin + 1);
        setNextMultiplier(1 * doubleHouseEdge);
        setStopModalOpen(false);
        setAlerts({
          type: "success",
          content: winPhrase[phrase]
        });
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  };

  const revealBoardState = (allBoardState) => {
    for (let key = 0; key < boardState.length; key++) {
      if (boardClickedState[key] === 0)
        if (allBoardState[key] === 1) allBoardState[key] = 3;
        else allBoardState[key] = 4;
    };
    setBoardState(allBoardState);
  };

  const onClickCloseButton = () => {
    if (isMuted) playgamesoundplay();
    if ((mineAmount > 24) | (mineAmount < 1)) return;
    setMineAmount(mineSliderAmount);
    changeNextMultiplier();
    setModalOpen(false);
  };

  const onBNumberClick = (e, number) => {
    if (number > 24) {
      setModalOpen(true);
      return;
    }
    setMineAmount(number);
    const bNumbers = document.getElementsByClassName("bomb-amounts");

    for (const bNumber of bNumbers) {
      bNumber.classList.remove("active");
    }
    e.target.classList.add("active");
  };

  const onBettingClick = async (val) => {
    if (isMuted) playgamesoundplay();
    if (clicked) return;
    if (val === "plus") {

      if (bettingAmount === 0.02 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.05 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.05 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.10 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.25 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.25 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.5 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.5 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 1) return;
    } else if (val === "minus") {
      if (bettingAmount === 0.02 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) return;
      else if (bettingAmount === 0.05 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.02 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.05 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.25 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 0.5 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.25 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
      else if (bettingAmount === 1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)) setBettingAmount(0.5 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
    } else {
      setBettingAmount(val * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio));
    }
  };

  const onOpen = () => {
    if (isMuted) playgamesoundplay();
    if (clicked) return;
    if (gameMode === "double") return;
    setModalOpen(true);
    setMineSliderAmount(mineAmount);
  };

  const postPlay = async (number) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if(num) {
    let houseEdge
    let mineAmounts
    if (gameMode === "minesrush") {
      houseEdge = mineHouseEdge;
      mineAmounts = mineAmount;
    }
    else {
      houseEdge = doubleHouseEdge;
      mineAmounts = 1;
    }


    const body = {
      walletAddress: publicKey.toBase58(),
      mineAmount: mineAmounts,
      bettingAmount,
      houseEdge,
      num,
      currencyMode: currencyMode,
      gameMode: gameMode
    };
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/play`,
      body
    );
    return res.data
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  };

  const handleSliderChange = (event, newVal) => {
    setMineSliderAmount(newVal);
  };

  const onClickDiscordMsg = () => {

  }

  const handleDiscordModalClose = () => {
    setDiscordModalOpen(false);
  };

  const style = themeBlack
    ? {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 250,
      bgcolor: "#1C1F26",
      color: "#fff",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    }
    : {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 250,
      bgcolor: "#fff",
      color: "black",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    };

  const stylemobile = themeBlack
    ? {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 200,
      bgcolor: "#1C1F26",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    }
    : {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 200,
      bgcolor: "#fff",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    };

  const styleStop = themeBlack
    ? {
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
    }
    : {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "246px",
      height: "auto",
      bgcolor: "#fff",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
      padding: "0px",
    };

  const styleDiscord = {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "350",
    height: "500px",
    bgcolor: "#101112",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  return (
    <Grid className="bettingpanel-container" container>
      {isDesktop && <Grid item xs={1} sm={2} md={3} lg={4} />}
      <Grid
        className="bettingpanel-box"
        item
        xs={10}
        sm={8}
        md={6}
        lg={4}
        style={
          isDesktop
            ? {}
            : themeBlack
              ? { backgroundColor: "#101112", padding: "5px", flexBasis: "100%", maxWidth: "100%" }
              : { backgroundColor: "#f5f5f5", padding: "5px", flexBasis: "100%", maxWidth: "100%" }
        }
      >
        <Box
          className="settings-text"
          style={{ marginTop: "0px", marginBottom: "5px" }}
        >
          <span
            className={
              isDesktop
                ? "setting-amount"
                : themeBlack
                  ? "setting-amount"
                  : "setting-amount-mobile"
            }
            style={{ textTransform: "uppercase" }}
          >
            Bet Amount
          </span>
          <div style={{ display: "flex", justifyContent: "center", margin: "5px" }} id="start">
            <Typography
              className="multiplier"
              alignItems="center"
              style={{ textTransform: "uppercase" }}
            >
              Next Multiplier
              <Typography
                component="span"
                className="multiplier-value"
                sx={{ diplay: "flex", alignItems: "center" }}
              >
                &nbsp; X
                {gameMode === "minesrush" ?
                  (gameState === 0
                    ? 1
                    : parseFloat((nextMultiplier).toFixed(3))) :
                  2}
              </Typography>
            </Typography>
          </div>
          {isDesktop && gameMode === "minesrush" && !gameStep && (
            <span className="minmax-values" style={{ textTransform: "uppercase" }}>
              Min. Mine: <span className="betsetting-value">{minMine}</span> Max. Mine:{" "}
              <span className="betsetting-value">{maxMine}</span>
            </span>
          )}
          {isDesktop && gameStep > 0 && gameMode === "minesrush" && (
            <span className="payout-values" style={{ textTransform: "uppercase" }}>
              Payout:{" "}
              <span className="payout-value-num">
                {parseFloat(((gameStep + mineAmount > 24 ? nextMultiplier : previousMultiplier) * bettingAmount).toFixed(3))}
              </span>{" "}
            </span>
          )}
        </Box>
        <Box
          className={themeBlack ? "betting-buttons-black" : "betting-buttons"}
          style={
            isDesktop
              ? { marginTop: "0px" }
              : { marginTop: 0, justifyContent: "space-between", padding: "0px" }
          }
        >
          <Box className="betting-amount" style={{ margin: !isDesktop && "auto" }}>
            <Box className="betting-amount-value">
              {currencyMode === "mainNug" &&
                <img className="solana-image" alt="ETH" src={eth} />}
              {currencyMode === "bonusNug" &&
                <img className="solana-image" alt="NUG" src={nug} />
              }
              {currencyMode === "gem" &&
                <img className="solana-image" alt="GEM" src={gemImg} />
              }
              <span className="betting-value-text">{bettingAmount}</span>
            </Box>
            <Box
              className="betting-amount-control"
              style={isDesktop ? {} : { display: "none" }}
            >
              <Button
                className="betting-amount-addition"
                onClick={() => onBettingClick("plus")}
                disabled={gameState === 0 ? false : true}
              >
                +
              </Button>
              <Button
                className="betting-amount-addition"
                onClick={() => onBettingClick("minus")}
                disabled={gameState === 0 ? false : true}
              >
                -
              </Button>
            </Box>
          </Box>
          <Button
            className="betting-play"
            onClick={onPlay}
            style={{ textTransform: "uppercase" }}
          >
            <PlayArrowIcon />

            {gameState === 0 ? "Play Game" : "Cash Out"}
          </Button>
          {gameMode === "minesrush" ?
            <Button
              className="betting-options"
              onClick={onOpen}
              disabled={gameState === 0 ? false : true}
              style={isDesktop ? {} : { display: "none" }}
            >
              <div className="options-image " image={options}>
                {gameMode === "minesrush" ? mineAmount : 1}
              </div>
            </Button> :
            <Box style={{ width: "60px" }}>&nbsp;</Box>
          }
        </Box>
        <Box
          justifyContent="space-between"
          className={
            themeBlack ? "betting-values-group-black" : "betting-values-group"
          }
          sx={{
            display: isDesktop ? "flex" : "grid !important",
            gridTemplateRows: "repeat(2, auto)",
            gridTemplateColumns: "repeat(3, auto)",
            rowGap: 2,
          }}
          style={isDesktop ? {} : { background: "none" }}
        >
          <Button
            className="betting-values"
            onClick={() => onBettingClick(0.02)}
            disabled={gameState === 0 ? false : true}
            style={isDesktop ? {} : { width: "90px", height: "35px" }}
          >
            {0.02 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          <Button
            className="betting-values"
            onClick={() => onBettingClick(0.05)}
            disabled={gameState === 0 ? false : true}
            style={isDesktop ? {} : { width: "90px", height: "35px" }}
          >
            {0.05 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          <Button
            className="betting-values"
            onClick={() => onBettingClick(0.1)}
            disabled={gameState === 0 ? false : true}
            style={isDesktop ? {} : { width: "90px", height: "35px" }}
          >
            {0.1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          <Button
            className="betting-values"
            onClick={() => onBettingClick(0.25)}
            disabled={gameState === 0 ? false : true}
            style={isDesktop ? {} : { width: "90px", height: "35px" }}
          >
            {0.25 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          <Button
            className="betting-values"
            onClick={() => onBettingClick(0.5)}
            disabled={gameState === 0 ? false : true}
            style={isDesktop ? {} : { width: "90px", height: "35px" }}
          >
            {0.5 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          <Button
            className="betting-values"
            onClick={() => onBettingClick(1)}
            disabled={gameState === 0 ? false : true}
            style={isDesktop ? {} : { width: "90px", height: "35px" }}
          >
            {1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          {/* <Button
            className="betting-values"
            disabled={gameState === 0 ? false : true}
            style={
              isDesktop
                ? { background: "#413F3C" }
                : { background: "#413F3C", width: "90px", height: "35px" }
            }
          >
            {1 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button>
          <Button
            className="betting-values"
            disabled={gameState === 0 ? false : true}
            style={
              isDesktop
                ? { background: "#413F3C" }
                : { background: "#413F3C", width: "90px", height: "35px" }
            }
          >
            {2 * process.env.REACT_APP_NUGGET_RATIO * (currencyMode === "mainNug" ? 1 : bNugRatio)}
          </Button> */}
        </Box>
        {!isDesktop && gameMode === "minesrush" && (
          <>
            <Box
              className="settings-text"
              style={{ marginTop: "20px", marginBottom: "5px" }}
            >
              <span
                className={
                  themeBlack ? "setting-amount" : "setting-amount-mobile"
                }
              >
                Number of bombs : {mineAmount}
              </span>
              <span>&nbsp;</span>
            </Box>
            <Box
              justifyContent="space-between"
              className="betting-values-group-mobile"
              sx={{
                display: isDesktop ? "flex" : "grid !important",
                gridTemplateRows: "repeat(1, auto)",
                gridTemplateColumns: "repeat(4, auto)",
                rowGap: 1,
              }}
            >
              <Button
                className="bomb-amounts"
                onClick={(e) => onBNumberClick(e, 5)}
                disabled={gameState === 0 ? false : true}
                style={isDesktop ? {} : { width: "70px", height: "25px" }}
              >
                5
              </Button>
              <Button
                className="bomb-amounts"
                onClick={(e) => onBNumberClick(e, 10)}
                disabled={gameState === 0 ? false : true}
                style={isDesktop ? {} : { width: "70px", height: "25px" }}
              >
                10
              </Button>
              <Button
                className="bomb-amounts"
                onClick={(e) => onBNumberClick(e, 15)}
                disabled={gameState === 0 ? false : true}
                style={isDesktop ? {} : { width: "70px", height: "25px" }}
              >
                15
              </Button>
              <Button
                className="bomb-amounts"
                onClick={onOpen}
                disabled={gameState === 0 ? false : true}
                style={
                  isDesktop
                    ? {}
                    : {
                      width: "70px",
                      height: "25px",
                      textTransform: "capitalize",
                    }
                }
              >
                <img className="control-option-image" alt="ctrl" src={mineamountsetting} />
              </Button>
            </Box>
          </>
        )}
      </Grid>
      <Grid
        item
        className="messaging-container"
        xs={1}
        sm={2}
        md={3}
        lg={4}
        sx={{ display: isDesktop ? "block" : "none!important" }}
        onClick={() => setShowDiscord(true)}
      >
        <img
          className="message-link"
          src={messaging}
          alt="msg"
          onClick={onClickDiscordMsg}
        />
      </Grid>
      <Modal
        open={showDiscord}
        onClose={() => setShowDiscord(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="iframe"
      >
        <iframe className="iframe" title="Discord Chat" src="https://e.widgetbot.io/channels/1001809381446393886/1001811649415626752/?preset=crate&api=e3128267-dd62-4343-b921-6622a4877302&avatar=https%3A%2F%2Fi.imgur.com%2FWtWzHUL.png"
          width="410" height="600" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
        </iframe>
      </Modal>

      <Modal
        disableEnforceFocus
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} sm={stylemobile} lg={stylemobile} md={stylemobile}>
          <Grid>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={themeBlack ? { color: "#fff" } : { color: "#000" }}
            >
              Number of Mines : {mineSliderAmount}
            </Typography>
          </Grid>
          <Grid>
            <Slider
              defaultValue={mineAmount}
              min={minMine}
              max={maxMine}
              aria-label="Default"
              valueLabelDisplay="auto"
              style={{ color: "#F7BE44" }}
              onChange={handleSliderChange}
            />
          </Grid>
          <Button
            variant="contained"
            style={{
              marginTop: "10px",
              color: "#000",
              backgroundColor: "#F7BE44",
            }}
            onClick={onClickCloseButton}
          >
            OK
          </Button>
        </Box>
      </Modal>
      <Modal
        open={connectWalletModalOpen}
        onClose={handleConnectWalletModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title">
            Please connect your Wallet
          </h2>
        </Box>
      </Modal>
      <Modal
        open={stopModalOpen}
        onClose={handleStopModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="stopModal"
      >
        <Box sx={styleStop} style={{ backgroundColor: "#191c23", border: "6px solid #22262f" }}>
          <Typography color="#F7BE44" fontSize="70px" fontFamily="Mada">
            x{gameMode === "minesrush" ? parseFloat((gameStep + mineAmount > 24 ? nextMultiplier : previousMultiplier).toFixed(3)) :
              parseFloat(nextMultiplier).toFixed(3)}
          </Typography>

          <Grid container style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <img className="claimEmotion" alt="claim" src={claimEmotion} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: themeBlack ? "#fff" : "#000", textTransform: "uppercase" }}>
                You Won{" "} &nbsp;
              </span>
              <span style={{ color: "#F7BE44" }}>
                {currencyMode === "mainNug" &&
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {parseFloat((gameMode === "minesrush" ? (gameStep + mineAmount > 24 ? nextMultiplier : previousMultiplier) : nextMultiplier) * bettingAmount).toFixed(3)}
                    <img src={eth} alt="ETH" style={{ width: "20px", height: "20px" }} />
                  </span>}
                {currencyMode === "bonusNug" &&
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {parseFloat((gameMode === "minesrush" ? (gameStep + mineAmount > 24 ? nextMultiplier : previousMultiplier) : nextMultiplier) * bettingAmount).toFixed(3)}
                    <img src={nug} alt="NUG" style={{ width: "20px", height: "20px" }} /> &nbsp;
                  </span>
                }
                {currencyMode === "gem" &&
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {parseFloat((gameMode === "minesrush" ? (gameStep + mineAmount > 24 ? nextMultiplier : previousMultiplier) : nextMultiplier) * bettingAmount).toFixed(3)}
                    <img src={gemImg} alt="NUG" style={{ width: "20px", height: "20px" }} /> &nbsp;
                  </span>
                }
              </span>
            </Grid>
            {!cashLoading ? <Button
              variant="contained"
              style={{
                marginTop: "10px",
                color: "#000",
                backgroundColor: "#F7BE44",
                textTransform: "uppercase",
                boxShadow: "rgb(247 190 68) 0px 0px 10px"
              }}
              onClick={onClickStopGame}
              fontSize="10px"
            >
              Claim Reward
            </Button> :
              <Box>
                <img src={cashLoader} style={{ width: "50px", marginTop: "10px" }} alt="Loading..." />
                <Typography color="white" fontSize="15px" fontFamily="Mada" style={{ textTransform: "uppercase" }}>
                  Processing Cashout...
                </Typography>
              </Box>}
            <img className="yellow-image-claim" alt="yClaim" src={yellowRectangle} />
          </Grid>
        </Box>
      </Modal>
      {cashLoading && <div style={{ width: "100vw", height: "100vh", zIndex: "11111", position: "fixed", top: "0", left: "0" }} alt="back" />}
      <Modal
        open={discordModalOpen}
        onClose={handleDiscordModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={styleDiscord}>
          <iframe
            src="https://discord.com/widget?id=1001809381446393886&theme=dark"
            width="350"
            title="discord"
            height="500"
            allowtransparency="true"
            frameborder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          ></iframe>
        </Box>
      </Modal>
    </Grid>
  );
};

export default BettingPanel;
