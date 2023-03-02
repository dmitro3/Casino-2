import useSound from "use-sound";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Modal, Typography, Grid, Button } from "@mui/material";
import * as Web3 from 'web3'
import BigNumber from "bignumber.js";
import constants from '../Tools/config'

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
import { StoreContext } from "../../../store";
import cashLoader from "../../../assets/images/frog.gif";
import eth from "../../../assets/images/eth.png";
import nug from "../../../assets/images/nugget.png";
import depositImage from "../../../assets/images/deposit.png";

import "./Sidebar.scss";
import useGameStore from "../../../GameStore";
import { Dehaze, Launch, People } from "@mui/icons-material";

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'

library.add(fas);

const Sidebar = () => {
  const web3 = new Web3(window.ethereum);
  const global = useContext(StoreContext);
  const theme = useTheme();
  const [playgamesoundplay] = useSound(playgame_sound);
  const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isDesktop = useMediaQuery("(min-width:1300px)");
  const { isAdmin } = useGameStore();
  const { isReward } = useGameStore();
  const { isMuted, setIsMuted } = useGameStore();
  const { remain, setRemain } = useGameStore();
  const { gameMode, setGameMode } = useGameStore();
  const { mineAmount, setMineAmount } = useGameStore();
  const { gameState, setGameState } = useGameStore();
  const { themeBlack, setThemeBlack } = useGameStore();
  const { showSidebar, setShowSidebar } = useGameStore();
  const { boardState, setBoardState } = useGameStore();
  const { boardClickedState, setBoardClickedState } = useGameStore();
  const [depositModal, setDepositModal] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatars, setAvatars] = useState('');
  const [walletModal, setWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositNugAmount, setDepositNugAmount] = useState(0);
  const [focused, setFocused] = useState(false);
  const [walletMode, setWalletMode] = useState("deposit");
  const { gameTHistory, setGameTHistory } = useGameStore();

  const [extend, setExtend] = useState(false);
  const [ruleModal, setRuleModal] = useState(false);
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [gameClick, setGameClick] = useState(false);
  const { nugAmount, setNugAmount } = useGameStore();
  const { bonusNugAmount, setBonusNugAmount } = useGameStore();

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

    const tHistory = gameTHistory.map((th, key) => {
      return (
        <Grid className="gameTHistory" key={key}>
          <Box className="key">{key + 1}</Box>
          <Box className={th.type}>{th.type}</Box>
          <Box className="amount">{parseFloat(th.amount).toFixed(3)}</Box>
          <Box className="date">{String(th.date).slice(0, 10)}</Box>
  
        </Grid>
      )
    });

    const changeWalletMode = (mode) => {
      if (loading) return
      setFocused(!focused);
      setWalletMode(mode);
      setDepositAmount(0);
    }

    const avatarModal = {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "270px",
      height: "350px",
      bgcolor: "background.paper",
      borderRadius: "10px",
      p: 4,
      padding: "10px",
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

  const depositHandler = (e) => {
    setDepositAmount(parseFloat(e.target.value));
  }

  const withdrawHandler = (e) => {
    setDepositAmount(parseFloat(e.target.value));
  }

  const withdrawHandlerForNug =(e) => {
    setDepositNugAmount(parseFloat(e.target.value));
  }

  const depositHandlerForNugget = (e) => {
    setDepositNugAmount(parseFloat(e.target.value));
  }

  const handleWalletModalClose = () => {
    if (loading) return;
    setWalletModal(false);
    setDepositAmount(0);
  }

  const onClickDeposit = () => {
    if (!global.walletConnected) {
      setConnectWalletModalOpen(true)
      return
    }
    clickDetails();
    setWalletModal(true);
  }

  // deposit ETH token
  const deposit = async () => {
    if (depositAmount===0 || depositAmount > global.balance) { alert('Please enter the correct amount!'); return; }
    try {
        const res = await new web3.eth.sendTransaction({
          to: process.env.REACT_APP_HOUSE_ADDR,
          from: global.walletAddress, 
          value: BigNumber(depositAmount * 10 ** 18).toFixed().toString()
        });
        if (res) {
          const body = {
            walletAddress: global.walletAddress,
            depositAmount: depositAmount
          }

          const result = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/play/depositNugget`, body
          );

          if(result.data.status) {
            setNugAmount(result.data.content)
          } else {
            console.log("error", result.data.content)
          }
        } else console.log(res)
    } catch (err) {
        console.log(err);
    }
  }
  
  // deposit DAI token
  const depositForNug = async () => {
    if (depositNugAmount === 0 || depositNugAmount > global.daiBalance) { alert('Please enter the correct amount!'); return; }
    try {
        const dai = new web3.eth.Contract(constants.BaseDAI_ABI, constants.BaseDAI_ADDRESS);
        await dai.methods.approve(process.env.REACT_APP_HOUSE_ADDR, BigNumber(depositNugAmount * 10 ** 18).toFixed().toString()).send({ from: global.walletAddress });
        const accounts = await web3.eth.getAccounts();
        const amountToSend = web3.utils.toWei(depositNugAmount.toString(), 'ether'); // the amount of Dai tokens to send
        const tx = await dai.methods.transfer(process.env.REACT_APP_HOUSE_ADDR, amountToSend/10**9).send({ from: accounts[0] });
        if (tx) {
          const body = {
            walletAddress: global.walletAddress,
            depositAmount: depositNugAmount
          }

          const result = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/play/depositDai`, body
          );

          if(result.data.status) {
            setBonusNugAmount(result.data.content)
          } else {
            console.log("error", result.data.content)
          }

        } else console.log(tx)


    } catch (err) {
        console.log(err);
    }
  }

  // withdraw ETH
  const withdraw = async () => {
    if (depositAmount===0 || depositAmount > parseFloat(nugAmount / process.env.REACT_APP_NUGGET_RATIO).toFixed(3)) { alert('Please enter the correct amount!', depositAmount)}
    try {
      const recipient = global.walletAddress; // Replace RECIPIENT_ADDRESS with the address of the recipient
      const amount = web3.utils.toWei(depositAmount.toString(), 'ether'); // Replace 1 with the amount of tokens you want to send

      console.log('recipient', recipient)

      web3.eth.accounts.signTransaction({
        to: recipient,
        value: amount,
        gas: 2000000
      }, process.env.REACT_APP_HOUSE_PRIV_KEY)
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt",async receipt => {
            const body = {
              walletAddress: global.walletAddress,
              depositAmount: depositAmount
            }
    
            const result = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/play/withdrawETH`, body
            );
    
            if(result.data.status) {
              setNugAmount(result.data.content)
            } else {
              console.log("error", result.data.content)
            }
            console.log('sent', receipt)

          });
          sentTx.on("error", err => {
            console.log('error', err)
          });
      });
    } 
    catch (err) {
        console.log(err);
    }
  }

  // withdraw DAI token
  const withdrawForBonus = async () => {
    if (depositNugAmount===0 || depositNugAmount > parseFloat(bonusNugAmount / process.env.REACT_APP_NUGGET_RATIO).toFixed(3)) { alert('Please enter the correct amount!', depositNugAmount)}
    try {
      const amount = web3.utils.toWei('1', 'ether');
      const myContract = new web3.eth.Contract(constants.BaseDAI_ABI,constants.BaseDAI_ADDRESS);
      const txData = {
        from: process.env.REACT_APP_HOUSE_ADDR, 
        to: constants.BaseDAI_ADDRESS,
        gas: 10000000, 
        value: '0x0',
        data: myContract.methods.transfer(global.walletAddress, amount).encodeABI() 
      };

      console.log(txData);
      console.log(global.walletAddress)

      // web3.eth.accounts.signTransaction(tx, process.env.REACT_APP_HOUSE_PRIV_KEY)
      // .then((signedTx) => {
      //   const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
      //    sentTx.on("receipt", async receipt => {
      //     console.log('sent', receipt)
      //     // const body = {
      //     //   walletAddress: global.walletAddress,
      //     //   depositAmount: depositAmount
      //     // }
      //     // const result = await axios.post(
      //     //   `${process.env.REACT_APP_BACKEND_URL}/api/play/withdrawETH`, body
      //     // );
  
      //     // if(result.data.status) {
      //     //   setBonusNugAmount(result.data.content)
      //     // } else console.log(result.data.status)
      //   });
      //   sentTx.on("error", err => {
      //     console.log('error', err)
      //   });      
      // }).catch((err) => {
      //   console.log('error in sending', err)
      // });
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
      const tx = Transaction.fromTxData(txData, { common })
      const signedTx = tx.sign(process.env.REACT_APP_HOUSE_PRIV_KEY)

      const serializedTx = signedTx.serialize()
      web3.eth.sendSignedTransaction(serializedTx).on('transactionHash', function (txHash) {

      }).on('receipt', function (receipt) {
          console.log("receipt:" + receipt);
      }).on('confirmation', function (confirmationNumber, receipt) {
          //console.log("confirmationNumber:" + confirmationNumber + " receipt:" + receipt);
      }).on('error', function (error) {

      });
    } 
    catch(err) {
        console.log(err);
      }
    //   const amount = web3.utils.toWei('0.001', 'ether');
    //   const myContract = new web3.eth.Contract(constants.BaseDAI_ABI,constants.BaseDAI_ADDRESS);
    //   web3.eth.accounts.signTransaction({
    //     to: constants.BaseDAI_ADDRESS,
    //     gas: 20000000,
    //     value: '0x00',
    //     data: myContract.methods.transfer(global.walletAddress, amount).encodeABI() 
    //   }, process.env.REACT_APP_HOUSE_PRIV_KEY)
    //   .then((signedTx) => {
    //     const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    //     sentTx.on("receipt",async receipt => {
    //       console.l0g('receipt', receipt)
    //       });
    //       sentTx.on("error", err => {
    //         console.log('error', err)
    //       });
    //   });
    // } 
    // catch (err) {
    //     console.log(err);
    // }
  }


  const depositNow = async () => {
    
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
            <NavLink className="buttons leaderboards" onClick={onClickDeposit}>
              <img src={depositImage} alt="Leaderboard" />
              <Typography className="description">Deposit/Withdraw</Typography>
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
                    <Typography className="description">MiNESWEEPER</Typography>
                  </NavLink>
                  <NavLink className={gameMode === "double" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("double")} to={!gameState && "/coins"}>
                    <img className="icon" src={doubleImg} alt="50/50" />
                    <Typography className="description">FLIP COIN</Typography>
                  </NavLink>
                  <NavLink className={gameMode === "double" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("loot")} to={!gameState && "/loot"}>
                    <Box className="icon" style={{ width: 44, height: 44, background: "#101014", maginLeft: 5, border: "3px solid #3a3a3a", borderRadius: "50%" }}>
                      <img src={lootyBoxImg} alt="LOOT" style={{ width: 50, height: 50, margin: 0, padding: 0, position: "relative", left: -3, top: -3 }} />
                    </Box>
                    <Typography className="description">HIGH STAKES</Typography>
                  </NavLink>
                  <NavLink className={gameMode === "" ? "gameMode clicked" : "gameMode"} onClick={() => changeGameMode("turtle")} to={!gameState && "/beta-turtles"}>
                    <img className="icon" src={turtle} alt="Turtle" />
                    <Box className="description" style={{ display: "block" }}>
                      <Typography style={{ marginBottom: 0, fontWeight: "bold", fontFamily: "Mada" }}>RACES OF</Typography>
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
                  <NavLink onClick={clickDetails} className="container" to="/bonuses" style={{ textDecoration: 'none' }} >
                    {!isReward && <Typography className="badge"></Typography>}
                    <img src={spinImg} alt="SPIN" />
                    <span style={{ color: "white" }} >FREE SPIN</span>
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
        open={depositModal}
        onClose={() => setDepositModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className="header-profile-box"
          sx={avatarModal}
          style={
            themeBlack
              ? { backgroundColor: "#101112", height: "450px", width:'300px' }
              : { backgroundColor: "#fff", height: "450px", width:'300px' }
          }
        >

          <Box>
            <Typography
              variant="h3"
              component="h2"
              color="#F7BE44"
              fontSize="40px"
              fontFamily="Mada"
              marginTop="20px"
            >
              Select NFTs
            </Typography>
            <Typography
              color="white"
              fontSize="15px"
              fontFamily="Mada"
            >
              Nugget NFTs can take up to 20 seconds to load please wait.
            </Typography>
            {avatarLoading ?
              <Box className="avatar-view">
                <img src={cashLoader} style={{ width: "60px", position: "relative", top: "40px" }} alt="Loading..." />
              </Box> :
              <div className="avatar-view">{avatars}</div>
            }
            <Typography
              color="white"
              fontSize="15px"
              fontFamily="Mada"
            >
              Your ArbiCasino Nugget NFTs will load here.
            </Typography>
            <Typography
              color="white"
              fontSize="15px"
              fontFamily="Mada"
            >
              Please note this is only for Nuggets not for MinesRush NFTs.
            </Typography>
            <Grid style={{ marginBottom: "10px" }}>
              <Button className="btn-change-avatar" onClick={depositNow}>
                Deposit
              </Button>
            </Grid>
            <Grid style={{ margin: "0px" }}>
              <Button
                className="btn-change-avatar"
                onClick={() => setDepositModal(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={connectWalletModalOpen}
        onClose={handleConnectWalletModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} style={{ width:'300px', height:'120px'}}>
          <h2 id="parent-modal-title" >
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
                <div>3. Choose between our FLIP themed games.</div>
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

      <Modal
        open={walletModal}
        onClose={handleWalletModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} className="walletModal">
          <Box className="walletNavGroup">
            <Button onClick={() => changeWalletMode("deposit")} className={walletMode === "deposit" ? "walletNavFocused" : "walletNav"} style={{ color: themeBlack ? "white" : "black" }}>DEPOSIT</Button>
            <Button onClick={() => changeWalletMode("withdraw")} className={walletMode === "withdraw" ? "walletNavFocused" : "walletNav"} style={{ color: themeBlack ? "white" : "black" }}>WITHDRAW</Button>
            <Button onClick={() => changeWalletMode("history")} className={walletMode === "history" ? "walletNavFocused" : "walletNav"} style={{ color: themeBlack ? "white" : "black" }}>HISTORY</Button>
          </Box>
          {walletMode === "deposit" && (!loading ?
            <Box className="walletAction">
              <Typography fontSize="15px" textAlign="left" fontFamily="Mada" className="balance" >ETH Balance:&nbsp;
                <img src={eth} alt="ETH" style={{ width: "20px", height: "20px" }} />
               {global.balance/10**18}
              </Typography>
              <Box className="walletForm">
                <input type='number' className="input-form" onChange={depositHandler} value={depositAmount} />
                <Button className="walletActionButton" onClick={deposit}>Deposit</Button>
              </Box>
              <Typography fontSize="15px" textAlign="left" fontFamily="Mada" className="balance" style={{ marginTop:'20px'}}>DAI Balance:&nbsp;
                <img src={nug} alt="nug" style={{ width: "20px", height: "20px" }} />
               {global.daiBalance}
              </Typography>
              <Box className="walletForm">
                <input type='number' className="input-form" onChange={depositHandlerForNugget} value={depositNugAmount} />
                <Button className="walletActionButton" onClick={depositForNug}>Deposit</Button>
              </Box>
            </Box> :
            <Box>
              <img src={cashLoader} style={{ width: "50px", marginTop: "10px" }} alt="Loading..." />
              <Typography color="white" fontSize="15px" fontFamily="Mada">
                Waiting for deposit...
              </Typography>
            </Box>)}
          {walletMode === "withdraw" && (!loading ?
            <Box className="walletAction">
              <Typography fontSize="15px" textAlign="left" fontFamily="Mada" className="balance" style={{ textTransform: "uppercase" }} >(ETH Balance:&nbsp;
                <img src={eth} alt="ETH" style={{ width: "20px", height: "20px" }} />
                {parseFloat(nugAmount / process.env.REACT_APP_NUGGET_RATIO).toFixed(3)})
              </Typography>
              <Box className="walletForm">
                <input type='number' className="input-form" onChange={withdrawHandler} value={depositAmount} />
                <Button className="walletActionButton" onClick={withdraw}>Withdraw</Button>
              </Box>
              <Typography fontSize="15px" textAlign="left" fontFamily="Mada" className="balance" style={{ textTransform: "uppercase", marginTop:'20px' }} >(NUGGET Balance:&nbsp;
                <img src={nug} alt="nug" style={{ width: "20px", height: "20px" }} />
                {parseFloat(bonusNugAmount / process.env.REACT_APP_NUGGET_RATIO).toFixed(3)})
              </Typography>
              <Box className="walletForm">
                <input type='number' className="input-form" onChange={withdrawHandlerForNug} value={depositNugAmount} />
                <Button className="walletActionButton" onClick={withdrawForBonus}>Withdraw</Button>
              </Box>
              <Typography fontSize="15px" textAlign="center" fontFamily="Mada" style={{ marginTop: "10px", textTransform: "uppercase" }}>
                You may need to leave 1-2% of your ETHs in your wallet to cover ETH transaction fees.
              </Typography>
            </Box> :
            <Box>
              <img src={cashLoader} style={{ width: "50px", marginTop: "10px" }} alt="Loading..." />
              <Typography color="white" fontSize="15px" fontFamily="Mada">
                Waiting for withdraw...
              </Typography>
            </Box>)
          }
          {walletMode === "history" &&
            (gameTHistory.length !== 0 ?
              tHistory :
              <Box className="noResult" 
              >
              <Box className="text">NO RESULTS FOUND</Box>
              </Box>)
          }
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
