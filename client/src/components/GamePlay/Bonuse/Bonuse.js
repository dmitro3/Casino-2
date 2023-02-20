import axios from "axios";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Modal, Typography, Grid } from "@mui/material";
import useSound from "use-sound";

import spinImg from "../../../assets/images/spin.gif";
import bonusPirate from "../../../assets/images/bonusPirate.png";
import bonusGroup from "../../../assets/images/bonusGroup.webp";
import nugget from "../../../assets/images/nugget.png";
import sol from "../../../assets/images/sol.png";
import cashoutsound from "../../../assets/audios/CashoutSound.mp3";
import playgame_sound from "../../../assets/audios/MinesClickSound.mp3";

import "./Bonuse.scss";
import useGameStore from "../../../GameStore";
import getNum from "../Tools/Calculate";
import Wheel from "../Tools/Wheel";
import { NavLink } from "react-router-dom";

library.add(fas);

const Sidebar = () => {

  const theme = useTheme();
  const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const { publicKey, connected } = useWallet();
  const [playgamesoundplay] = useSound(playgame_sound);
  const [cashoutsoundplay] = useSound(cashoutsound);

  const { isMuted } = useGameStore();
  const { spinnerItems } = useGameStore();
  const isSmall = useMediaQuery("(min-width:900px)");
  const { setAlerts } = useGameStore();
  const { setNugAmount, setBonusNugAmount } = useGameStore();
  const { loading, setLoading } = useGameStore();
  const { isReward, setIsReward } = useGameStore();
  const { spinDate, setSpinDate } = useGameStore();
  const { remain, setRemain } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { themeBlack } = useGameStore();
  const { timer, setTimer } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [spinOpen, setSpinOpen] = useState(false);
  const [isHolder, setIsHolder] = useState(true);
  const [prize, setPrize] = useState(0);
  const [count, setCount] = useState(false);
  const [wheelSize, setWheelSize] = useState(0);
  const [claimAlert, setClaimAlert] = useState(false);
  // const [ isFinished, setIsFinished] = useState(false);


  const style = themeBlack
    ? {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: matchUpSm ? "40vw" : "80vw",
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
      width: matchUpSm ? "40vw" : "80vw",
      bgcolor: "#fff",
      color: "black",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    };

  useEffect(() => {
    if (connected) {
      getSpinDate();
      getHolders();
    }
  }, [connected]);
  useEffect(() => {
    if (!remain) {
      spinCount(remain)
    }
  }, [remain]);



  // Spining functions
  const segments = spinnerItems;
  const segColors = [
    "#171716",
  ];

  useEffect(() => {
    if (prize > 0) {
      setClaimAlert(true);
      setTimeout(() => {
        setClaimAlert(false)
      }, 5000)
    }
  }, [prize])

  const onFinished = async (prize) => {
    if (isMuted) cashoutsoundplay();
    if (isReward) {
      setLoading(false)
      return
    }
    setLoading(false);
    setPrize(prize);
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4);
    if (num) {
      const body = {
        walletAddress: publicKey?.toBase58(),
        num: num,
        reward: prize,
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/play/giveReward`, body);
      if (res.data.content.status) {
        setRemain(res.data.content.spinNum);
        if (prize > 1) {
          setBonusNugAmount(parseFloat(res.data.content.rewards).toFixed(3));
        } else {
          setNugAmount(parseFloat(res.data.content.rewards).toFixed(3));
        }
        setSpinDate(res.data.content.spinDate);
        if (spinOpen) {
          setSpinOpen(false)
          setTimeout(() => {
            setSpinOpen(true)
          }, 10)
        }
      } else {
        setAlerts({
          type: "error",
          content: res.data.content.content
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  };

  const spinCount = (remain) => {
    if (!isReward && !count && remain === 0) {
      const time = setInterval(() => {

        if (spinDate === new Date().getDate()) {
          setIsReward(true);
          setCount(true);
          let hour = formatter(parseInt(23 - new Date().getHours()));
          let mins = formatter(parseInt(59 - new Date().getMinutes()));
          let secs = formatter(parseInt((59 - new Date().getSeconds())));
          setTimer(
            <Box className="clockGroup">
              <Typography className="title">
                Time Left
              </Typography>
              <Box className="timerGroup">
                <Box className="clock">
                  <Typography className="pointer" style={{ fontSize: isSmall ? "25px" : "15px" }}>{hour}: </Typography>
                  <Typography className="desc">H</Typography>
                </Box>
                <Box className="clock">
                  <Typography className="pointer" style={{ fontSize: isSmall ? "25px" : "15px" }}>{mins}: </Typography>
                  <Typography className="desc">M</Typography>
                </Box>
                <Box className="clock">
                  <Typography className="pointer" style={{ fontSize: isSmall ? "25px" : "15px" }}>{secs} </Typography>
                  <Typography className="desc">S</Typography>
                </Box>
              </Box>
            </Box>
          )
          setIsReward(true);

        } else {
          setIsReward(false);
          setCount(false);
          getSpinDate();
          setRemain(2);
          clearInterval(time);
        }
      }, 1000);
      const formatter = (d) => {
        if (d < 10)
          d = "0" + d;
        return d;
      }
    }
  }

  const onReward = async () => {
    if (isMuted) playgamesoundplay();
    // if (!number) return;
    if (!loading) {
      if (!isHolder) return
      if (!connected) {
        setConnectWalletModalOpen(true);
      } else {
        setSpinOpen(true)
      }
    }
  }

  // const getRaffleWinners = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_BACKEND_URL}/api/admin/getRaffleWinners`);
  //   setWinnerList(res.data);
  // }
  const getHolders = async () => {
    setLoading(true);
    if (publicKey?.toBase58()) {
      const body = {
        walletAddress: publicKey.toBase58()
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/play/getHolders`, body);
      if (res.data.status) {
        if (res.data.content) {
          setIsHolder(true);
        } else {
          setIsHolder(false);
        }
      } else {
        setAlerts({
          type: "error",
          content: "Fetch Holder list failed"
        })
      }
    }
    setLoading(false)
  }

  const getSpinDate = async () => {
    setLoading(true)
    if (publicKey?.toBase58()) {
      const body = {
        walletAddress: publicKey.toBase58()
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/play/getSpinDate`, body);
      if (res.data.status) {
        setRemain(res.data.content.spinNum);
        setSpinDate(res.data.content.spinDate);
        // spinCount(res.data.content);
      } else {
        console.log("err");
      }
    }
    setLoading(false)
  }


  const handleConnectWalletModalClose = () => {
    setConnectWalletModalOpen(false);
  };

  const size = document.getElementById("gamePlay")?.offsetWidth / 8


  useEffect(() => {
    function handleResize() {
      const size = document.getElementById("gamePlay")?.offsetWidth / 8
      setWheelSize(size)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (spinOpen) {
      setSpinOpen(false)
      setTimeout(() => {
        setSpinOpen(true)
      }, 0)
    }
  }, [size])


  return (
    <Grid
      className="bonuseContainer"
    >
      {claimAlert &&
        <Box className="claimAlert">
          <Box onClick={() => setClaimAlert(false)} className="close">
            X
          </Box>
          <Box className="parg title">
            <img style={{ width: 20, height: 20, borderRadius: "50%", padding: 5, background: "grey" }} src={prize > 1 ? nugget : sol} alt="SOL" />
            <Typography fontSize="1.2rem">&nbsp;Claimed</Typography>
          </Box>
          <Box className="parg">
            Credit to your <span style={{ fontWeight: "bold", color: "#F5B14A" }}>&nbsp;{prize > 1 ? "NUG" : "SOL"}&nbsp;</span> account
          </Box>
          <Box className="parg">
            Amount:
            <img style={{ width: 20, height: 20 }} src={prize > 1 ? nugget : sol} alt={prize > 1 ? "NUGGET" : "SOL"} />
            {prize}
          </Box>
        </Box>}
      <Box sx={style} className="spin" id="spin" style={{ top: matchUpSm ? "40%" : "45%" }}>
        <img src={bonusPirate} alt="GOOD LUCK!" style={{ position: "absolute", zIndex: "3", width: matchUpSm ? "25vw" : "60vw", height: matchUpSm ? "15vw" : "35vw", top: matchUpSm ? "-13vw" : "-33vw", left: "11vw" }} />
        <Box className="spinContainer">
          <Box className="header">
            <img src={spinImg} alt="Spin" />
            <Box color={themeBlack ? "white" : "black"} style={{ display: "flex", fontSize: matchUpSm ? "1.5vw" : "3vw", marginLeft: "10px", fontWeight: "bold" }}>
              FREE SPIN
              {/* -
              <Typography color="#F5B14A" fontSize={matchUpSm ? "1.5vw" : "3vw"}  >
                WIN SOLS
              </Typography> */}
            </Box>

          </Box>
          <Box style={{ fontSize: 15, fontFamily: "Mada" }}>
            For PirateRush NFT Holders
            <sup>
              <NavLink to="/FAQs" className="question" >?</NavLink>
            </sup>
          </Box>
          <Box className="available">
            <Typography className="spinNum" fontSize={matchUpSm ? "1.5vw" : "3vw"} fontFamily="Mada" >
              {remain}
            </Typography>
            <Typography fontFamily="Mada">
              Available Spins
            </Typography>
          </Box>
          <button className="spinNow" onClick={onReward} fontSize={matchUpSm ? "1.5vw" : "3vw"}>
            SPIN NOW
          </button>
        </Box>
      </Box>

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
        open={spinOpen}
        onClose={() => {
          if (loading) return
          setSpinOpen(false)
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >

        <Box sx={style} className="spin" id="spin" style={{ backgroundImage: `url(${bonusGroup})`, padding: 0, marginTop: 35 }}>
          <Box onClick={() => setSpinOpen(false)} className="close" style={{ position: "absolute", top: 10, right: 10 }}>
            X
          </Box>

          <Box style={{ backgroundColor: "rgb(28 31 38 / 85%)", padding: 32 }}>
            <Box className="spinContainer">

              <Box className="header">
                <img src={spinImg} style={{ border: "3px solid #494646", borderRadius: "50%" }} alt="Spin" />
                <Box color={themeBlack ? "white" : "black"} style={{ display: "flex", alignItems: "center", fontFamily: "Mada", fontSize: matchUpSm ? "1.5vw" : "3vw", marginLeft: "10px", fontWeight: "bold" }}>
                  FREE SPIN &nbsp;
                  {/* <Typography color="#F5B14A" fontFamily="Mada" fontSize={matchUpSm ? "1.5vw" : "3vw"} >
                    WIN SOLS
                  </Typography> */}
                </Box>

              </Box>
              <Box className="sub">
                <Typography fontSize={matchUpSm ? "1vw" : "2.5vw"} fontFamily="Mada">YOUR WINNINGS</Typography>
                <Box className="prize">
                  <img src={prize > 1 ? nugget : sol} alt="NUG" style={{ width: matchUpSm ? "1.5vw" : "3vw", height: matchUpSm ? "1.5vw" : "3vw" }} />
                  <Typography fontSize={matchUpSm ? "1.5vw" : "3vw"} fontFamily="Mada" style={{ marginLeft: "5px" }}>{prize}</Typography>
                </Box>
              </Box>
              <Box className="wheels" style={{
                filter: isReward && "blur(10px)",
                // left: isDesktop ? "5vw" : isSmall ? "3vw" : matchUpSm ? "0vw" : "-5vw"
              }}>
                <Wheel
                  segments={segments}
                  segColors={segColors}
                  // winningSegment={5.00}
                  onFinished={(prize) => onFinished(prize)}
                  // primaryColor="black"
                  // contrastColor="white"
                  buttonText="SPIN!"
                  isOnlyOnce={false}
                  size={matchUpSm ? size : 2 * size}
                  upDuration={300}
                  downDuration={400}
                  fontFamily="Mada"
                  className="wheel"
                  img={sol}
                />
              </Box>
              {remain ?
                <Box className="free" style={{ fontSize: matchUpSm ? "1.5vw" : "3vw", fontFamily: "Mada" }}>
                  FREE SPINS
                  <Typography id="remain" fontFamily="Mada" name={remain} style={{ fontSize: matchUpSm ? "1.5vw" : "3vw" }}>
                    {remain}
                  </Typography>
                </Box> :
                <Typography fontFamily="Mada">YOU ARE OUT OF SPINS</Typography>
              }
              {isReward && <Box className="clocks">
                {timer}
              </Box>}
              {/* { isFinished && 
              <Box>
                <Typography>Congratulation!</Typography>
                <Typography>{`You won ${prize}`}</Typography>
                <button onClick={onFinished}>Gain Prize</button>
              </Box>
            } */}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  )
};

export default Sidebar;