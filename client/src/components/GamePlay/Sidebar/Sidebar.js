import useSound from "use-sound";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Modal, Typography, Grid } from "@mui/material";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import game from "../../../assets/images/game.png";
import bonuses from "../../../assets/images/bonus.png";
import leaderboard from "../../../assets/images/leaderboard.png";
import howto from "../../../assets/images/howto.png";
import minesrushImg from "../../../assets/images/minesrush.svg";
import doubleImg from "../../../assets/images/double.svg";
import turtle from "../../../assets/images/turtle.svg";
import discord from "../../../assets/images/discord.png";
import twitter from "../../../assets/images/twitter.png";
import home from "../../../assets/images/home.png";
import magiceden from "../../../assets/images/MELogo.png";
import getSupport from "../../../assets/images/getSupport.png";
import lootyBoxImg from "../../../assets/images/Chest/lootBox1.png";
import FAQsImage from "../../../assets/images/FAQs.png";
import spinImg from "../../../assets/images/spin.gif";
import bonusGroup from "../../../assets/images/bonusGroup.webp";
import playgame_sound from "../../../assets/audios/MinesClickSound.mp3";
import speaker_blacktheme from "../../../assets/images/speaker_blacktheme.png";
import speaker_mute_blacktheme from "../../../assets/images/speaker_mute_blacktheme.png";

import "./Sidebar.scss";
import useGameStore from "../../../GameStore";
import { Dehaze, Launch, People } from "@mui/icons-material";

library.add(fas);

const Sidebar = () => {

  const theme = useTheme();
  const { connection } = useConnection();
  const [playgamesoundplay] = useSound(playgame_sound);
  const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isDesktop = useMediaQuery("(min-width:1300px)");
  const { isAdmin } = useGameStore();
  const { isReward } = useGameStore();
  const { isMuted, setIsMuted } = useGameStore();
  const { remain, setRemain } = useGameStore();
  const { userName, setUserName } = useGameStore();
  const { gameMode, setGameMode } = useGameStore();
  const { mineAmount, setMineAmount } = useGameStore();
  const { gameState, setGameState } = useGameStore();
  const { themeBlack, setThemeBlack } = useGameStore();
  const { showSidebar, setShowSidebar } = useGameStore();
  const { boardState, setBoardState } = useGameStore();
  const { boardClickedState, setBoardClickedState } = useGameStore();

  const [extend, setExtend] = useState(false);
  const [ruleModal, setRuleModal] = useState(false);
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [gameClick, setGameClick] = useState(false);

  useEffect(() => {
    if (window.location.href.includes("game/mines") || window.location.href.includes("game/coins") || window.location.href.includes("game/loot")) {
      setGameClick(true);
    } else setGameClick(false);
  }, [])
  const style = themeBlack
    ? {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: matchUpSm ? "40vw" : "60vw",
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
      width: matchUpSm ? "40vw" : "60vw",
      bgcolor: "#fff",
      color: "black",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    };

  const changeGameMode = (gm) => {
    if (isMuted) playgamesoundplay();
    if (gameState) return;
    setGameMode(gm);
    if (gm === "double") {
      setMineAmount(1);
    }
    else setMineAmount(5);
    const cboardState = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    setBoardClickedState(cboardState);
    setBoardState(cboardState);
    clickDetails();
  }

  const gameClickEvent = () => {
    if (isMuted) playgamesoundplay();
    setGameClick(!gameClick);
  }

  const onVolumeClick = () => {
    playgamesoundplay();
    setIsMuted(!isMuted);
  };

  const handleConnectWalletModalClose = () => {
    if (isMuted) playgamesoundplay();
    setConnectWalletModalOpen(false);
  };

  const onClickStats = () => {
    if (isMuted) playgamesoundplay();
    const cboardState = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    setBoardClickedState(cboardState);
    setBoardState(cboardState);
    clickDetails();
  };

  const clickDetails = () => {
    if (isMuted) playgamesoundplay();
    if (!matchUpSm) {
      if (!showSidebar) setExtend(true)
      else setExtend(false)
      setShowSidebar(!showSidebar);
    } else {
      setExtend(!extend);
    }
  }

  return (
    <Grid
      className={extend ? "side_extend side" : "side"}
      id="side"
      style={{ background: !matchUpSm ? (extend ? "#16191f" : "#1010202f") : "#16191fd1", bottom: matchUpSm && 0, overflowY: !matchUpSm && extend ? "scroll" : "clip", width: !extend && "65px", paddingTop: !matchUpSm && "10px" }}
    >
      <Box className="buttons dehaze" onClick={clickDetails}>
        <Dehaze style={{ marginLeft: "7.5px", width: "30px", height: "30px" }} />
        <Typography className="description">MENU</Typography>
      </Box>
      {(showSidebar || matchUpSm) &&
        <Box className="iconGroup" style={{ marginTop: matchUpSm ? "5vh" : "1vh" }}>
          <Box>
            <NavLink onClick={clickDetails} className="buttons" to={!gameState && "/"} style={{ color: "white", textDecoration: "none" }}>
              <img className="icon" src={home} alt="HOME" />
              <Typography className="description">HOME</Typography>
            </NavLink>
            <Box className={gameClick ? "buttons game_clicked" : "buttons game"} style={{ flexDirection: "column" }}>
              <Box style={{ display: "flex", alignItems: "center", width: "100%" }} onClick={gameClickEvent}>
                <img className="icon" src={game} alt="Game" />
                <Typography className="description">GAMES</Typography>
              </Box>
              {matchUpSm ?
                <Box className="gameModes">
                  <NavLink className={gameMode === "minesrush" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("minesrush")} to={!gameState && "/mines"}>
                    <img className="icon" src={minesrushImg} alt="Minesrush" />
                    <Typography className="description">MINES</Typography>
                  </NavLink>
                  <NavLink className={gameMode === "double" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("double")} to={!gameState && "/coins"}>
                    <img className="icon" src={doubleImg} alt="50/50" />
                    <Typography className="description">PIRATE COIN</Typography>
                  </NavLink>
                  <NavLink className={gameMode === "double" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("loot")} to={!gameState && "/loot"}>
                    <Box className="icon" style={{ width: 44, height: 44, background: "#101014", maginLeft: 5, border: "3px solid #3a3a3a", borderRadius: "50%" }}>
                      <img src={lootyBoxImg} alt="LOOT" style={{ width: 50, height: 50, margin: 0, padding: 0, position: "relative", left: -3, top: -3 }} />
                    </Box>
                    <Typography className="description">PIRATE LOOT</Typography>
                  </NavLink>
                  <NavLink className={gameMode === "" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("turtle")} to={!gameState && "/beta-turtles"}>
                    <img className="icon" src={turtle} alt="Turtle" />
                    <Box className="description" style={{ display: "block" }}>
                      <Typography style={{ marginBottom: 0, fontWeight: "bold", fontFamily: "Mada" }}>TURTLES OF</Typography>
                      <Typography style={{ fontWeight: "bold", fontFamily: "Mada" }}>TORTUGA</Typography>
                    </Box>
                  </NavLink>
                </Box> :
                <Box className="gameModes_mobile">
                  <NavLink className={gameMode === "minesrush" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("minesrush")} to={!gameState && "/mines"}>
                    <img className="icon" src={minesrushImg} alt="Minesrush" />
                  </NavLink>
                  <NavLink className={gameMode === "double" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("double")} to={!gameState && "/coins"}>
                    <img className="icon" src={doubleImg} alt="50/50" />
                  </NavLink>
                  <NavLink className={gameMode === "loot" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("loot")} to={!gameState && "/loot"}>
                    <Box className="icon" style={{ width: 44, height: 44, background: "#101014", maginLeft: 5, border: "3px solid #3a3a3a", borderRadius: "50%" }}>
                      <img src={lootyBoxImg} alt="LOOT" style={{ width: 50, height: 50, margin: 0, padding: 0, position: "relative", left: -3, top: -3 }} />
                    </Box>
                  </NavLink>
                  <NavLink className={gameMode === "" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("turtle")} to={!gameState && "/beta-turtles"}>
                    <img className="icon" src={turtle} alt="Turtle" />
                  </NavLink>
                </Box>}
            </Box>
            <NavLink onClick={clickDetails} className="buttons bonus" to="/bonuses" >
              {remain > 0 && <Typography className="badge"></Typography>}
              <img src={bonuses} alt="Bonus" />
              <Typography className="description">BONUSES</Typography>
            </NavLink>
            <Box className="bonusGroup" style={{ backgroundImage: `url(${bonusGroup})` }}>
              <Box className="contain">
                <Tooltip
                  title="FREE SPIN"
                  placement="bottom-start"
                  className = "tooltip"
                >
                  <NavLink onClick={clickDetails} className="container" to="/bonuses" >
                    {!isReward && <Typography className="badge"></Typography>}
                    <img src={spinImg} alt="SPIN" />
                  </NavLink>
                </Tooltip>
              </Box>
            </Box>
            <NavLink className="buttons leaderboards" onClick={onClickStats} to={!gameState && `/leaderboard`}>
              <img src={leaderboard} alt="Leaderboard" />
              <Typography className="description">LEADERBOARD</Typography>
            </NavLink>
            <Box className="buttons" onClick={() => {setRuleModal(true); setExtend(false); setShowSidebar(false)}}>
              <img src={howto} alt="Fairness" />
              <Typography className="description">HOW TO PLAY</Typography>
            </Box>
            <NavLink onClick={clickDetails} className="buttons" to={`/FAQs`}>
              <img src={FAQsImage} alt="FAQs" />
              <Typography className="description">FAQs</Typography>
            </NavLink>
            <hr style={{ width: "30px" }} />
          </Box>
          <Box>
            <a className="buttons" href="https://magiceden.io/marketplace/mines_rush" target="_blank">
              <img src={magiceden} alt="NFT Collection" />
              <Typography className="description">NFT COLLECTION &nbsp;<Launch style={{ width: "15px", height: "15px" }} /></Typography>
            </a>
            <a className="buttons" href="https://twitter.com/PlayPirateRush" target="_blank" style={{ color: "white", textDecoration: "none" }}>
              <img src={twitter} alt="TWITTER" />
              <Typography className="description">FOLLOW ON TWITTER &nbsp;<Launch style={{ width: "15px", height: "15px" }} /></Typography>
            </a>
            <a className="buttons" href="https://discord.gg/tAsmMTaPrf" target="_blank" style={{ color: "white", textDecoration: "none" }}>
              <img src={discord} alt="DISCORD" />
              <Typography className="description">JOIN OUR DISCORD &nbsp;<Launch style={{ width: "15px", height: "15px" }} /></Typography>
            </a>

            {isAdmin && <NavLink className="buttons" onClick={() => { setIsMuted(false) }} to={!gameState && `/admindashboard`}>
              <People style={{ marginLeft: "7.5px", width: "30px", height: "30px" }} />
              <Typography className="description">ADMIN PANEL &nbsp;<Launch style={{ width: "15px", height: "15px" }} /></Typography>
            </NavLink>}
            <a className="buttons" href="https://discord.gg/YZStkjJtQM" target="_blank">
              <img src={getSupport} alt="NFT Collection" />
              <Typography className="description">GET SUPPORT &nbsp;<Launch style={{ width: "15px", height: "15px" }} /></Typography>
            </a>
            <Box className="buttons" onClick={onVolumeClick}>
              {isMuted ? (
                <>
                  <img
                    alt="Speaker"
                    src={speaker_blacktheme}
                  />
                  <Typography className="description">MUSIC ON</Typography>
                </>
              ) : (
                <>
                  <img
                    alt="Mute"
                    src={speaker_mute_blacktheme}
                  />
                  <Typography className="description">MUSIC OFF</Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      }


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
        open={ruleModal}
        onClose={() => setRuleModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={profileModal} className="howTo" style={{
          width: (isDesktop ? "35%" : (matchUpSm ? "50%" : "80%")),
          top: "54%",
        }}>
          <Typography
            variant="h3"
            component="h2"
            color="#F7BE44"
            fontSize="32px"
            fontFamily="Mada"
            marginTop="20px"
          >
            How to Play
          </Typography>
          <Grid container style={{ textAlign: "left" }}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10} className="content">
              <Box style={{ marginTop: "35px", color: "#fff", fontSize: "16px", fontFamily: "Mada" }}>
                <div>1. Connect your Ethereum Wallet (Get Phantom @ phantom.app)</div>
                <div>2. Deposit ETH to play the games.</div>
                <div>3. Choose between our Pirate themed games.</div>
                <div>4. Click "Play" and cashout your winnings</div>
                <div>5. You can instantly withdraw your ETH .</div>
                <br />
                <div>What is a Ethereum Wallet?</div>
                <br />
                <div>Ethereum wallet is a browser extension to manage your digital assets on the Arbitrum network. Add the Ethereum wallet to chrome, and follow the instructions to create a wallet.</div>
                <br />
                <div>How Do I fund my Phantom Wallet?</div>
                <br />
                <div>Use a central exchange such as Coinbase or Binance to fund your wallet. Purchase Ethereum using fiat currency. Then withdraw Eth to your Ethereum wallet.</div>
                <br />
                <div>Open a ticket in our <a href="https://discord.gg/SpD9PjfGwR" target="_blank" style={{ color: "white", textDecoration: "underline" }}>Discord</a> to get further help.</div>
                <br />
                <div>Click ' GOT IT' Button to close</div>
              </Box>
              <button onClick={() => setRuleModal(false)}>GOT IT</button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Grid >
  )
};

const profileModal = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "270px",
  height: "400px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  p: 4,
  padding: "0px",
};


export default Sidebar;
