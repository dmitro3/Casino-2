import { useState, useContext } from "react";
import axios from "axios";
import useSound from "use-sound";
import { useWallet } from "@solana/wallet-adapter-react";
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";

import useGameStore from "../../../GameStore";
import treasureImg10 from "../../../assets/images/Chest/lootBox_no1.mp4";
import treasureImg11 from "../../../assets/images/Chest/lootBox_yes1.mp4";
import treasureImg20 from "../../../assets/images/Chest/lootBox_no2.mp4";
import treasureImg21 from "../../../assets/images/Chest/lootBox_yes2.mp4";
import treasureImg30 from "../../../assets/images/Chest/lootBox_no3.mp4";
import treasureImg31 from "../../../assets/images/Chest/lootBox_yes3.mp4";
import treasureImg40 from "../../../assets/images/Chest/lootBox_no4.mp4";
import treasureImg41 from "../../../assets/images/Chest/lootBox_yes4.mp4";
import treasureImg50 from "../../../assets/images/Chest/lootBox_no5.mp4";
import treasureImg51 from "../../../assets/images/Chest/lootBox_yes5.mp4";
import treasureImg60 from "../../../assets/images/Chest/lootBox_no6.mp4";
import treasureImg61 from "../../../assets/images/Chest/lootBox_yes6.mp4";
import lootyBox1 from "../../../assets/images/Chest/lootBox1.png";
import lootyBox2 from "../../../assets/images/Chest/lootBox2.png";
import lootyBox3 from "../../../assets/images/Chest/lootBox3.png";
import lootyBox4 from "../../../assets/images/Chest/lootBox4.png";
import lootyBox5 from "../../../assets/images/Chest/lootBox5.png";
import lootyBox6 from "../../../assets/images/Chest/lootBox6.png";
import minesticker from "../../../assets/images/octopus.webm";
import minestickerPoster from "../../../assets/images/pirateOctor.png";
import nugImg from "../../../assets/images/nugget.png";
import eth from "../../../assets/images/eth.png";
import gemImg from "../../../assets/images/gem.png";
import lootBox from "../../../assets/audios/lootBox1.mp3";
import "./Loot.scss";
import GetNum from "../Tools/Calculate";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useRef } from "react";
import { isSafari, isMobileSafari } from "react-device-detect";
import { StoreContext } from "../../../store";

const Loot = () => {
  const global = useContext(StoreContext);
  const [lootsoundplay] = useSound(lootBox);
  const anim10 = useRef(null);
  const anim11 = useRef(null);
  const anim20 = useRef(null);
  const anim21 = useRef(null);
  const anim30 = useRef(null);
  const anim31 = useRef(null);
  const anim40 = useRef(null);
  const anim41 = useRef(null);
  const anim50 = useRef(null);
  const anim51 = useRef(null);
  const anim60 = useRef(null);
  const anim61 = useRef(null);
  const octoV = useRef(null);
  const isDesktop = useMediaQuery("(min-width:800px)");
  const { isMuted } = useGameStore();
  const { bNugRatio } = useGameStore();
  const { themeBlack } = useGameStore();
  const { setGameHistory } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { alerts, setAlerts } = useGameStore();
  const { winPhrase, losePhrase } = useGameStore();
  const { setRaffles } = useGameStore();
  const { nugAmount, setNugAmount } = useGameStore();
  const { gemAmount, setGemAmount } = useGameStore();
  const { bonusNugAmount, setBonusNugAmount } = useGameStore();
  const { currencyMode } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [animation11, setAnimation11] = useState(false);
  const [animation10, setAnimation10] = useState(false);
  const [animation20, setAnimation20] = useState(false);
  const [animation21, setAnimation21] = useState(false);
  const [animation30, setAnimation30] = useState(false);
  const [animation31, setAnimation31] = useState(false);
  const [animation40, setAnimation40] = useState(false);
  const [animation41, setAnimation41] = useState(false);
  const [animation50, setAnimation50] = useState(false);
  const [animation51, setAnimation51] = useState(false);
  const [animation60, setAnimation60] = useState(false);
  const [animation61, setAnimation61] = useState(false);
  const [alert2, setAlert2] = useState({ type: "", content: "" });
  const [oddOption, setOddOption] = useState(0);
  const [showOdd, setShowOdd] = useState(false);
  const [countDown, setCountDown] = useState(6);
  const [earning, setEarning] = useState(0);
  const [newNugAmount, setNewNugAmount] = useState(0);
  const [newBNugAmount, setNewBNugAmount] = useState(0);
  const [newGemAmount, setNewGemAmount] = useState(0);

  const getHistory = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/history/get`)
      .then((res) => {
        const newGameHistory = res.data;
        setGameHistory(newGameHistory);
      });
  };

  let countInterval
  const countDownInterval = () => {
    let tt = 6
    countInterval = setInterval(() => {
      if (tt > -1) {
        tt--;
        setCountDown(tt)
      } else {
        setCountDown(6)
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(countInterval)
      setCountDown(6)
    }, 6000)
  }

  const openBox = async (amount) => {
    if (!global.walletConnected) return
    if ((currencyMode === "mainNug" && amount > nugAmount) || (currencyMode === "bonusNug" && amount > bonusNugAmount) || (currencyMode === "gem" && amount > gemAmount)) {
      setAlerts({
        type: "error",
        content: "Insufficient Funds."
      })
      countDownInterval();
      return;
    }

    const num = await GetNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        amount: amount,
        walletAddress: localStorage.walletLocalStorageKey,
        num: num,
        currencyMode: currencyMode,
        oddOption: oddOption
      }
    console.log('body', body);

      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/lootBox`, body)
        .then(async (res) => {
          // const phrase = Math.floor(Math.random() * 20);
          if (res.data.status) {
            console.log("res", res.data)
            console.log("amount", amount)
            console.log("currncymode", currencyMode)
            console.log("bNugRatio", 50/bNugRatio)
            setNewNugAmount(parseFloat(res.data.content.nugAmount).toFixed(3));
            setNewBNugAmount(parseFloat(res.data.content.bonusNugAmount).toFixed(3));
            setNewGemAmount(parseFloat(res.data.content.gemAmount).toFixed(3));
            if (res.data.content.earning > 0) {
              setEarning(res.data.content.earning);
              if (res.data.content.raffle > 0)
                setRaffles(res.data.content.raffle);
              if (amount === (currencyMode === "mainNug" ? 50 / bNugRatio : 50)) {
                console.log("1")
                anim11.current?.play();
                setAnimation11(true);
              }
              if (amount === (currencyMode === "mainNug" ? 100 / bNugRatio : 100)) {
                anim21.current?.play();
                setAnimation21(true);
              }
              if (amount === (currencyMode === "mainNug" ? 250 / bNugRatio : 250)) {
                anim31.current?.play();
                setAnimation31(true);
              }
              if (amount === (currencyMode === "mainNug" ? 500 / bNugRatio : 500)) {
                anim41.current?.play();
                setAnimation41(true);
              }
              if (amount === (currencyMode === "mainNug" ? 1000 / bNugRatio : 1000)) {
                anim51.current?.play();
                setAnimation51(true);
              }
            } else {
              setEarning(0)
              if (amount === (currencyMode === "mainNug" ? 50 / bNugRatio : 50)) {
                console.log("2")
                anim10.current?.play();
                setAnimation10(true);
              }
              if (amount === (currencyMode === "mainNug" ? 100 / bNugRatio : 100)) {
                anim20.current?.play();
                setAnimation20(true);
              }
              if (amount === (currencyMode === "mainNug" ? 250 / bNugRatio : 250)) {
                anim30.current?.play();
                setAnimation30(true);
              }
              if (amount === (currencyMode === "mainNug" ? 500 / bNugRatio : 500)) {
                anim40.current?.play();
                setAnimation40(true);
              }
              if (amount === (currencyMode === "mainNug" ? 1000 / bNugRatio : 1000)) {
                anim50.current?.play();
                setAnimation50(true);
              }
            }
          } else {
            setAlerts({
              type: "error",
              content: "INSUFFICIENT FUNDS."
            })
          }
        })
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

 
  const onEndedEvent = async (amount) => {
    const phrase = Math.floor(Math.random() * 20);
    setNugAmount(newNugAmount);
    setBonusNugAmount(newBNugAmount);
    setGemAmount(newGemAmount);
    if (earning !== 0) {
      setAlerts({
        type: "success",
        content: `YE WON ${parseFloat(earning).toFixed(3)} ${currencyMode === "mainNug" ? "ETH" : (currencyMode === "bonusNug" ? "NUG" : "GEM")}`
      })
      setAlert2({
        type: "success",
        content: winPhrase[phrase]
      })
      countDownInterval();
    } else {
      setAlerts({
        type: "success",
        content: `YE LOST IT ALL!`
      })
      setAlert2({
        type: "success",
        content: losePhrase[phrase]
      })
      countDownInterval();
    }
    getHistory();
    setAnimation10(false);
    setAnimation11(false);
    setAnimation20(false);
    setAnimation21(false);
    setAnimation30(false);
    setAnimation31(false);
    setAnimation40(false);
    setAnimation41(false);
    setAnimation50(false);
    setAnimation51(false);
    setAnimation60(false);
    setAnimation61(false);
  }

  const playOcto = () => {
    const random = Math.floor(Math.random() * 10) + 5;
    setTimeout(() => {
      octoV.current.play();
    }, random * 1000)
  }

  return (
    <Grid className="loot-container" container>
      {alerts.content &&
        <Box className="alerts">
          <Box className="alertGroup">
            <Box>
              <Box style={{ fontSize: 18 }}>{alerts.content.toString()}</Box>
              <Box style={{ marginTop: "10px", fontSize: 12 }}>{alert2.content.toString()}</Box>
            </Box>
            <button onClick={() => { setAlerts({ type: "", content: "" }); clearInterval(countInterval); setCountDown(6) }}>Dismiss({countDown})</button>
          </Box>
        </Box>
      }
      {isDesktop &&
        <Grid xs={1} item sm={2} md={3} lg={4} />
      }
      <Grid item xs={10} sm={8} md={6} lg={4} className="mainBoard"
        style={{ flexBasis: !isDesktop && "100%", maxWidth: !isDesktop && "100%" }}
      >
        <Box className="octo">
          <video ref={octoV} autoPlay muted preload="auto" poster={minestickerPoster} width="100%" height="100%" playsInline onEnded={() => playOcto()}>
            <source src={minesticker} type="video/webm" />
            No supported
          </video>
        </Box>
        <Box className={themeBlack ? "gameboard-black" : "gameboard"} style={{ width: isDesktop ? "190%" : "90%" }}>
          <Box className="title">
            <Typography className={themeBlack ? "mainTitle" : "mainTitle-white"} style={{ textTransform: "uppercase", lineHeight: isDesktop ? "30px" : "25px" }}>Open ArbiCasino to Win Up</Typography>
            <Typography className={themeBlack ? "mainTitle" : "mainTitle-white"} style={{ textTransform: "uppercase", lineHeight: isDesktop ? "30px" : "25px" }}>
              to &nbsp;
              <span style={{ fontWeight: "900" }}>100X</span>
              &nbsp; in ETH
              <sup>
                <NavLink to="/FAQs" className="question" style={{ color: "yellow", fontSize: "13px", border: "1px solid yellow", borderRadius: "50%" }}>?</NavLink>
              </sup>
            </Typography>
            <Typography className={themeBlack ? "subTitle" : "subTitle-white"} style={{ textTransform: "uppercase" }}>No house edge, with 100% RTP.</Typography>
          </Box>
          <Box className="oddTable">
            <Box className="options">
              <TableRow style={{ flexDirection: !isDesktop && "column" }}>
                <TableCell className={oddOption === 0 ? "option selected" : "option"} onClick={() => setOddOption(0)}>High Stakes 4x</TableCell>
                <TableCell className={oddOption === 1 ? "option selected" : "option"} onClick={() => setOddOption(1)}>Low Risk up to 5x</TableCell>
                <TableCell className={oddOption === 2 ? "option selected" : "option"} onClick={() => setOddOption(2)}>Hybrid up to 25x</TableCell>
                <TableCell className={oddOption === 3 ? "option selected" : "option"} onClick={() => setOddOption(3)}>Standard 100x Odds</TableCell>
                <TableCell className={oddOption === 4 ? "option selected" : "option"} onClick={() => setOddOption(4)}>Jackpot or Bust 500x</TableCell>
                <TableCell className={oddOption === 5 ? "option selected" : "option"} onClick={() => setOddOption(5)}>The Grind 500x</TableCell>
              </TableRow>
            </Box>
            <Box className="descs">
              {oddOption === 0 && <Box className="desc">
                High Stakes odds has a 20% chance to 4x yer money with a 40% chance to only return half of yer wager. The remaining 40% ye lose all your lot to the house. This variation has the highest percentage to 4x your money.
              </Box>}
              {oddOption === 1 && <Box className="desc">
                Win up to 5x on this loot box with no chance to lose all yer wager. This is the yellow belly bet with a 16% chance to double or 5x yer wager. Low Risk = Lower Payout. Not for the FLIP looking for high stakes gambling.
              </Box>}
              {oddOption === 2 && <Box className="desc">
                The perfect blend of risk that allow ye a 2% chance to win up to 25x your original wager. Similar to low risk this one will also never completely drain ye, meaning it always return a portion of your bet.
              </Box>}
              {oddOption === 3 && <Box className="desc">
                These are classic loot box odds that are used throughout the community. There is an even mix of risk and reward to be had with the 100x odds.
              </Box>}
              {oddOption === 4 && <Box className="desc">
                This gamemode is simple, risk your bet for a chance at a major jackpot! Winning get 500x their wager and loosers take home nothing.
              </Box>}
              {oddOption === 5 && <Box className="desc">
                A fun variation of the 500x Jackpot or Bust with a 50% lower chance at the jackpot, but you never lose your full wager. It risk and security at the same time!
              </Box>}
            </Box>
            <Box className="viewOdds">
              <Box className="showOdds" onClick={() => setShowOdd(!showOdd)} >
                <Typography>VIEW ODDS</Typography>
                {!showOdd ? <ExpandMore /> :
                  <ExpandLess />}
              </Box>
              <Box className={showOdd ? "show" : "hidden"}>
                {oddOption === 0 && <TableContainer>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Multiplier
                        </TableCell>
                        <TableCell>
                          Odds
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          0x
                        </TableCell>
                        <TableCell>
                          40%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          0.5x
                        </TableCell>
                        <TableCell>
                          40%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          4x
                        </TableCell>
                        <TableCell>
                          20%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>}
                {oddOption === 1 && <TableContainer>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Multiplier
                        </TableCell>
                        <TableCell>
                          Odds
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          0.5x
                        </TableCell>
                        <TableCell>
                          64%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          1x
                        </TableCell>
                        <TableCell>
                          19%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          2x
                        </TableCell>
                        <TableCell>
                          12%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          5x
                        </TableCell>
                        <TableCell>
                          5%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>}
                {oddOption === 2 && <TableContainer>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Multiplier
                        </TableCell>
                        <TableCell>
                          Odds
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          0.1x
                        </TableCell>
                        <TableCell>
                          53.75%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          0.5x
                        </TableCell>
                        <TableCell>
                          39.25%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          5x
                        </TableCell>
                        <TableCell>
                          5%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          25x
                        </TableCell>
                        <TableCell>
                          1.8%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>}
                {oddOption === 3 && <TableContainer>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Multiplier
                        </TableCell>
                        <TableCell>
                          Odds
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          0x
                        </TableCell>
                        <TableCell>
                          39.23%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          0.5x
                        </TableCell>
                        <TableCell>
                          21%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          1x
                        </TableCell>
                        <TableCell>
                          20%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          2x
                        </TableCell>
                        <TableCell>
                          15%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          5x
                        </TableCell>
                        <TableCell>
                          3%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          10x
                        </TableCell>
                        <TableCell>
                          1.5%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          25x
                        </TableCell>
                        <TableCell>
                          0.2%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          50x
                        </TableCell>
                        <TableCell>
                          0.05%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          100x
                        </TableCell>
                        <TableCell>
                          0.02%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>}
                {oddOption === 4 && <TableContainer>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Multiplier
                        </TableCell>
                        <TableCell>
                          Odds
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          0x
                        </TableCell>
                        <TableCell>
                          99.8%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          500x
                        </TableCell>
                        <TableCell>
                          0.2%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>}
                {oddOption === 5 && <TableContainer>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Multiplier
                        </TableCell>
                        <TableCell>
                          Odds
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          0.5x
                        </TableCell>
                        <TableCell>
                          99.8999%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          500x
                        </TableCell>
                        <TableCell>
                          0.1001%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>}
              </Box>
            </Box>
          </Box>
          <Box className="boxGroups">
            <Box className={!themeBlack ? "boxGroup backgroundWhite" : "boxGroup"} style={{ maxWidth: isDesktop ? "27%" : "90%" }}>
              <Box className="box">
                <img src={lootyBox1} alt="BOX1" />
              </Box>
              <Box className="bottom">
                <Box className="nug">
                  <img src={currencyMode === "mainNug" ? eth : (currencyMode === "bonusNug" ? nugImg : gemImg)} alt="GOLD" />
                  <Typography className={!themeBlack ? "fontBlack" : "fontWhite"}>{currencyMode === "mainNug" ? 0.005 : 0.005 * bNugRatio}</Typography>
                </Box>
                <button className="openBox" style={{ zIndex: 1 }} onClick={() => openBox(currencyMode === "mainNug" ? 0.005 : 0.005 * bNugRatio)}> Open</button>
              </Box>
            </Box>
            <Box className={!themeBlack ? "boxGroup backgroundWhite" : "boxGroup"} style={{ maxWidth: isDesktop ? "27%" : "90%" }}>
              <Box className="box">
                <img src={lootyBox2} alt="BOX2" />
              </Box>
              <Box className="bottom">
                <Box className="nug">
                  <img src={currencyMode === "mainNug" ? eth : (currencyMode === "bonusNug" ? nugImg : gemImg)} alt="GOLD" />
                  <Typography className={!themeBlack ? "fontBlack" : "fontWhite"}>{currencyMode === "mainNug" ? 0.01 : 0.01 * bNugRatio}</Typography>
                </Box>
                <button className="openBox" style={{ zIndex: 1 }} onClick={() => openBox(currencyMode === "mainNug" ? 0.01 : 0.01 * bNugRatio)} >Open</button>
              </Box>
            </Box>
            <Box className={!themeBlack ? "boxGroup backgroundWhite" : "boxGroup"} style={{ maxWidth: isDesktop ? "27%" : "90%" }}>
              <Box className="box">
                <img src={lootyBox3} alt="BOX3" />
              </Box>
              <Box className="bottom">
                <Box className="nug">
                  <img src={currencyMode === "mainNug" ? eth : (currencyMode === "bonusNug" ? nugImg : gemImg)} alt="GOLD" />
                  <Typography className={!themeBlack ? "fontBlack" : "fontWhite"}>{currencyMode === "mainNug" ? 0.025 : 0.025 * bNugRatio}</Typography>
                </Box>
                <button className="openBox" style={{ zIndex: 1 }} onClick={() => openBox(currencyMode === "mainNug" ? 0.025 : 0.025 * bNugRatio)} >Open</button>
              </Box>
            </Box>
            <Box className={!themeBlack ? "boxGroup backgroundWhite" : "boxGroup"} style={{ maxWidth: isDesktop ? "27%" : "90%" }}>
              <Box className="box">
                <img src={lootyBox4} alt="BOX4" />
              </Box>
              <Box className="bottom">
                <Box className="nug">
                  <img src={currencyMode === "mainNug" ? eth : (currencyMode === "bonusNug" ? nugImg : gemImg)} alt="GOLD" />
                  <Typography className={!themeBlack ? "fontBlack" : "fontWhite"}>{currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio}</Typography>
                </Box>
                <button className="openBox" style={{ zIndex: 1 }} onClick={() => openBox(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)} >Open</button>
              </Box>
            </Box>
            <Box className={!themeBlack ? "boxGroup backgroundWhite" : "boxGroup"} style={{ maxWidth: isDesktop ? "27%" : "90%" }}>
              <Box className="box">
                <img src={lootyBox5} alt="BOX5" />
              </Box>
              <Box className="bottom">
                <Box className="nug">
                  <img src={currencyMode === "mainNug" ? eth : (currencyMode === "bonusNug" ? nugImg : gemImg)} alt="GOLD" />
                  <Typography className={!themeBlack ? "fontBlack" : "fontWhite"}>{currencyMode === "mainNug" ? 0.1 : 0.1 * bNugRatio}</Typography>
                </Box>
                <button className="openBox" style={{ zIndex: 1 }} onClick={() => openBox(currencyMode === "mainNug" ? 0.1 : 0.1 * bNugRatio)} >Open</button>
              </Box>
            </Box>
            <Box className={!themeBlack ? "boxGroup backgroundWhite" : "boxGroup"} style={{ maxWidth: isDesktop ? "27%" : "90%", opacity: 0 }}>
              <Box className="box">
                <img src={lootyBox6} alt="BOX6" />
              </Box>
              <Box className="bottom">
                <Box className="nug">
                  <img src={currencyMode === "mainNug" ? eth : (currencyMode === "bonusNug" ? nugImg : gemImg)} alt="GOLD" />
                  <Typography className={!themeBlack ? "fontBlack" : "fontWhite"}>{currencyMode === "mainNug" ? 1 : 1 * bNugRatio}</Typography>
                </Box>
                <button className="openBox" style={{ zIndex: 1 }} >Open</button>
              </Box>
            </Box>
          </Box>

          <Box className={animation10 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim10} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.005 : 0.005 * bNugRatio)}>
                <source src={treasureImg10} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation11 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim11} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.005 : 0.005 * bNugRatio)}>
                <source src={`${treasureImg11}#t=0.1`} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation20 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim20} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.025 : 0.025 * bNugRatio)}>
                <source src={treasureImg20} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation21 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim21} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.025 : 0.025 * bNugRatio)}>
                <source src={treasureImg21} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation30 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim30} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)}>
                <source src={treasureImg30} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation31 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim31} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)}>
                <source src={treasureImg31} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation40 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim40} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)}>
                <source src={treasureImg40} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation41 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim41} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)}>
                <source src={treasureImg41} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation50 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim50} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)}>
                <source src={treasureImg50} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation51 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim51} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.05 : 0.05 * bNugRatio)}>
                <source src={treasureImg51} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation60 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim60} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.1 : 0.1 * bNugRatio)}>
                <source src={treasureImg60} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
          <Box className={animation61 ? "treasure show" : "treasure hidden"} style={{ background: (isSafari || isMobileSafari) ? "black" : "#000000bd" }}>
            <Box className="boxContainer">
              <video ref={anim61} width={isDesktop ? "50%" : "100%"} height={isDesktop ? "50%" : "100%"} playsInline onEnded={() => onEndedEvent(currencyMode === "mainNug" ? 0.1 : 0.1 * bNugRatio)}>
                <source src={treasureImg61} type="video/mp4" />
                No supported
              </video>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Loot;