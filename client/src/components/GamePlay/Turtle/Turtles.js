// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
// import { KeyboardArrowDown, KeyboardDoubleArrowDown, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, KeyboardDoubleArrowUp } from "@mui/icons-material";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// import getNum from "../Tools/Calculate";
// import useGameStore from "../../../GameStore";
// import "./Turtles.scss"
// import turtle1 from "../../../assets/images/turtle/turtle1.png";
// import turtle2 from "../../../assets/images/turtle/turtle2.png";
// import turtle3 from "../../../assets/images/turtle/turtle3.png";
// import turtle4 from "../../../assets/images/turtle/turtle4.png";
// import turtle5 from "../../../assets/images/turtle/turtle5.png";
// import turtle6 from "../../../assets/images/turtle/turtle6.png";
// import rate1 from "../../../assets/images/turtle/rate1.svg";
// import rate2 from "../../../assets/images/turtle/rate2.svg";
// import rate3 from "../../../assets/images/turtle/rate3.svg";
// import rate4 from "../../../assets/images/turtle/rate4.svg";
// import rate5 from "../../../assets/images/turtle/rate5.svg";
// import betCount from "../../../assets/images/turtle/betCount.svg";
// import pirateCaptain from "../../../assets/images/turtle/pirateCaptain.svg";
// import pirateSkel from "../../../assets/images/turtle/pirateSkel.png";
// import nugget from "../../../assets/images/nugget.png";
// import ETHImg from "../../../assets/images/eth.png";
// import gemImg from "../../../assets/images/gem.png";
// import cup1 from "../../../assets/images/turtle/cup1.png";
// import cup1_big from "../../../assets/images/turtle/cup1_big.png";
// import cup2 from "../../../assets/images/turtle/cup2.png";
// import cup2_big from "../../../assets/images/turtle/cup2_big.png";
// import turtle12 from "../../../assets/videos/1_2.mp4";
// import turtle13 from "../../../assets/videos/1_3.mp4";
// import turtle14 from "../../../assets/videos/1_4.mp4";
// import turtle15 from "../../../assets/videos/1_5.mp4";
// import turtle16 from "../../../assets/videos/1_6.mp4";
// import turtle21 from "../../../assets/videos/2_1.mp4";
// import turtle23 from "../../../assets/videos/2_3.mp4";
// import turtle24 from "../../../assets/videos/2_4.mp4";
// import turtle25 from "../../../assets/videos/2_5.mp4";
// import turtle26 from "../../../assets/videos/2_6.mp4";
// import turtle31 from "../../../assets/videos/3_1.mp4";
// import turtle32 from "../../../assets/videos/3_2.mp4";
// import turtle34 from "../../../assets/videos/3_4.mp4";
// import turtle35 from "../../../assets/videos/3_5.mp4";
// import turtle36 from "../../../assets/videos/3_6.mp4";
// import turtle41 from "../../../assets/videos/4_1.mp4";
// import turtle43 from "../../../assets/videos/4_3.mp4";
// import turtle42 from "../../../assets/videos/4_2.mp4";
// import turtle45 from "../../../assets/videos/4_5.mp4";
// import turtle46 from "../../../assets/videos/4_6.mp4";
// import turtle51 from "../../../assets/videos/5_1.mp4";
// import turtle53 from "../../../assets/videos/5_3.mp4";
// import turtle54 from "../../../assets/videos/5_4.mp4";
// import turtle52 from "../../../assets/videos/5_2.mp4";
// import turtle56 from "../../../assets/videos/5_6.mp4";
// import turtle61 from "../../../assets/videos/6_1.mp4";
// import turtle63 from "../../../assets/videos/6_3.mp4";
// import turtle64 from "../../../assets/videos/6_4.mp4";
// import turtle65 from "../../../assets/videos/6_5.mp4";
// import turtle62 from "../../../assets/videos/6_2.mp4";

const TurtleComponent = () => {
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
//   const { publicKey, connected, signTransaction } = useWallet();

//   const { number, setNumber } = useGameStore();
//   const { alerts, setAlerts } = useGameStore();
//   const { factor1, factor2, factor3, factor4 } = useGameStore();
//   const { currencyMode, setCurrencyMode } = useGameStore();
//   const { nugAmount, setNugAmount } = useGameStore();
//   const { bonusNugAmount, setBonusNugAmount } = useGameStore();
//   const { gemAmount, setGemAmount } = useGameStore();

//   const [multipliers, setMultipliers] = useState([
//     [],
//     [178],
//     [111, 13],
//     [102, 8, 8],
//     [66, 7, 7, 3],
//     [421, 29, 31, 15, 13]
//   ]);
//   const [turtleMulti, setTurtleMulti] = useState([]);
//   const [quinellaHouseEdge, setQuinellaHouseEdge] = useState();
//   const [time, setTime] = useState(30);
//   const rates = [25, 50, 100, 250, 500];
//   const [betAmount, setBetAmount] = useState(rates[0]);
//   const [selectedTurtle, setSelectedTurtle] = useState([]);
//   const [selectedQuinella, setSelectedQuinella] = useState([]);
//   const [playScene, setPlayScene] = useState(0);
//   const [turtleFirst, setTurtleFirst] = useState(0);
//   const [turtleSecond, setTurtleSecond] = useState(0);
//   const [earning, setEarning] = useState(0);
//   const [previousBet, setPreviousBet] = useState();
//   const [totalBetAmount, setTotalBetAmount] = useState(0);
//   const [turtleHistory, setTurtleHistory] = useState([]);
//   const [winTurtle, setWinTurtle] = useState(turtle1);
//   const [secondTurtle, setSecondTurtle] = useState(turtle1);
//   const [lose1Turtle, setLose1Turtle] = useState(turtle2);
//   const [lose2Turtle, setLose2Turtle] = useState(turtle2);
//   const [winAmount, setWinAmount] = useState(0);
//   const [turtleVideo, setTurtleVideo] = useState();
//   const [videos, setVideos] = useState(
//     [
//       ["", turtle12, turtle13, turtle14, turtle15, turtle16],
//       [turtle21, "", turtle23, turtle24, turtle25, turtle26],
//       [turtle31, turtle32, "", turtle34, turtle35, turtle36],
//       [turtle41, turtle42, turtle43, "", turtle45, turtle46],
//       [turtle51, turtle52, turtle53, turtle54, "", turtle56],
//       [turtle61, turtle62, turtle63, turtle64, turtle65, ""],
//     ]
//   )
//   const [betState, setBetState] = useState([]);
//   const [betMode, setBetMode] = useState(0);

//   useEffect(() => {
//     getTurtleMultiplier();
//     getTurtleHistory();
//   }, [])

//   useEffect(() => {
//     if (!time) {
//       playGame();
//       getTurtleMultiplier();
//     }
//   }, [time])

//   useEffect(() => {
//     if (connected) {
//       getPreviousBet();
//     }
//   }, [connected])

//   // Functions
//   const getTurtleMultiplier = async () => {
//     await axios
//       .get(`${process.env.REACT_APP_BACKEND_URL}/api/play/getTurtleMultiplier`)
//       .then((res) => {
//         timer(res.data.turtleTime)
//         let data = []
//         res.data.multiData.map((mData) => {
//           data.push(mData.multiplier)
//         })
//         setTurtleMulti(data)
//         setQuinellaHouseEdge(res.data.qHouseEdge)
//         let qData = [[]];
//         for (let i = 1; i < 6; i++) {
//           qData.push([])
//           for (let j = 0; j < i; j++) {
//             qData[i].push(parseFloat(res.data.multiData[i].multiplier * res.data.multiData[j].multiplier * res.data.qHouseEdge).toFixed(1))
//           }
//         }
//         setMultipliers(qData);
//       });
//   }

//   const getTurtleHistory = async () => {
//     await axios
//       .get(`${process.env.REACT_APP_BACKEND_URL}/api/play/getTurtleHistory`)
//       .then((res) => {
//         if (res.data.status) {
//           let history = [];
//           history = res.data.content.map((h) => {
//             // return History(h.first, h.second, h.winMultiplier, h.quinellaMultiplier, false)
//             return (
//               <Box className="history">
//                 {Card(parseInt(h.first) + 1)}
//                 {Card(parseInt(h.second) + 1)}
//                 <Typography className="winColor" fontSize="13px">{parseFloat(h.winMultiplier).toFixed(1)}x</Typography>
//                 <Typography className="quinellaColor" fontSize="13px">{parseFloat(h.quinellaMultiplier).toFixed(1)}x</Typography>
//               </Box>
//             )
//           })
//           const winner = chooseTurtleImg(res.data.content[0].first)
//           const second = chooseTurtleImg(res.data.content[0].second)
//           setWinTurtle(winner);
//           setSecondTurtle(second);
//           setTurtleHistory(history)
//         } else {
//           setAlerts({
//             type: "error",
//             content: "Sorry, please try again."
//           })
//         }
//       })
//   }

//   const getPreviousBet = async () => {
//     const body = {
//       walletAddress: localStorage.walletLocalStorageKey
//     }
//     await axios
//       .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/getPreviousBet`, body)
//       .then((res) => {
//         if (res.data.status) {
//           setPreviousBet(res.data.content)
//         } else {
//           console.log("Error on Backend")
//         }
//       })
//       .catch((err) => {
//         console.log("error", err)
//       })
//   }

//   const timer = async (remainedTime) => {
//     const datas = remainedTime;
//     let remain = datas;
//     let interval
//     interval = setInterval(() => {
//       remain--;

//       if (remain >= 0) {
//         setTime(remain);
//       }
//     }, 1000)
//     setTimeout(() => {
//       clearInterval(interval)
//     }, datas * 1000)
//     const formatter = (d) => {
//       if (d < 10)
//         d = "0" + d;
//       return d;
//     }
//   }

//   const selectTurtle = async (id) => {
//     if (!connected) return
//     let selectList = [...selectedTurtle];
//     let exist = false;
//     let totalAmount = totalBetAmount;
//     const bets = betState;
//     for (let i = 0; i < selectList.length; i++) {
//       if (selectList[i].id === id) {
//         totalAmount -= selectList[i].betAmount
//         selectList.splice(i, 1)
//         exist = true;
//         break;
//       }
//     }
//     if (exist) {
//       bets.map((bet, key) => {
//         if (bet.card1 === id && bet.card2 === -1) {
//           bets.splice(key, 1)
//         }
//       })
//     }
//     let amount = betAmount
//     if (!exist) {
//       selectList.push({
//         id: id,
//         betAmount: amount
//       });
//       const bet = {
//         card1: id,
//         card2: -1,
//         multi: turtleMulti[id - 1],
//         betAmount: betAmount
//       }
//       bets.push(bet);
//       totalAmount += betAmount
//     }
//     if ((currencyMode === "bonusNug" && totalAmount > bonusNugAmount) || (currencyMode === "gem" && totalAmount > gemAmount)) return

//     setBetState(bets);
//     setSelectedTurtle(selectList);
//     setTotalBetAmount(totalAmount);
//   }

//   const selectQuinella = async (id1, id2, multi) => {
//     if (!connected) return
//     const quinellaList = [...selectedQuinella];
//     let exist = false;
//     let totalAmount = totalBetAmount;
//     const bets = betState;
//     for (let i = 0; i < quinellaList.length; i++) {
//       if (quinellaList[i].id1 === id1 && quinellaList[i].id2 === id2) {
//         totalAmount -= quinellaList[i].betAmount
//         quinellaList.splice(i, 1);
//         exist = true;
//         break;
//       }
//     }
//     if (exist) {
//       bets.map((bet, key) => {
//         if (bet.card1 === id1 && bet.card2 === id2) {
//           bets.splice(key, 1)
//         }
//       })
//     }
//     if (!exist) {
//       quinellaList.push({
//         id1: id1,
//         id2: id2,
//         betAmount: betAmount
//       })
//       totalAmount += betAmount
//       const bet = {
//         card1: id1,
//         card2: id2,
//         multi: multi,
//         betAmount: betAmount
//       }
//       bets.push(bet);
//     }
//     if ((currencyMode === "bonusNug" && totalAmount > bonusNugAmount) || (currencyMode === "gem" && totalAmount > gemAmount)) return

//     setBetState(bets);
//     setSelectedQuinella(quinellaList)
//     setTotalBetAmount(totalAmount)
//   }

//   const clickIndicator = async (id) => {
//     if (!connected) return
//     if ((currencyMode === "bonusNug" && betAmount * 5 > bonusNugAmount) || (currencyMode === "gem" && betAmount * 5 > gemAmount)) return
//     let quinellaList = [];
//     let totalAmount = 0;
//     const bets = [];
//     for (let i = 1; i < 7; i++) {
//       if (i < id) {
//         quinellaList.push({
//           id1: i,
//           id2: id,
//           betAmount: betAmount
//         })
//         totalAmount += betAmount
//         bets.push({
//           card1: i,
//           card2: id,
//           multi: multipliers[id - 1][i - 1],
//           betAmount: betAmount
//         })
//       } else if (i > id) {
//         quinellaList.push({
//           id1: id,
//           id2: i,
//           betAmount: betAmount
//         })
//         totalAmount += betAmount
//         bets.push({
//           card1: id,
//           card2: i,
//           multi: multipliers[i - 1][id - 1],
//           betAmount: betAmount
//         })
//       }
//     }
//     setBetState(bets);
//     setSelectedQuinella(quinellaList)
//     setTotalBetAmount(totalAmount)
//   }

//   const playGame = async () => {
//     if (connected && (selectedTurtle.length || selectedQuinella.length)) {
//       if ((currencyMode === "bonusNug" || currencyMode === "mainNug" && totalBetAmount <= bonusNugAmount) || (currencyMode === "gem" && totalBetAmount <= gemAmount)) {
//         const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
//         if (num) {

//           const body = {
//             singleGame: selectedTurtle,
//             quinellaGame: selectedQuinella,
//             walletAddress: localStorage.walletLocalStorageKey,
//             currencyMode: currencyMode === "gem" ? "gem" : "bonusNug",
//             num: num
//           }
//           const res = await axios.post(
//             `${process.env.REACT_APP_BACKEND_URL}/api/play/playTurtle`, body);
//           clear();
//           if (res.data.status) {
//             const video = videos[res.data.content.first][res.data.content.second];
//             setTurtleVideo(video);
//             setTurtleFirst(res.data.content.first);
//             setTurtleSecond(res.data.content.second);
//             setEarning(parseInt(res.data.content.earning));
//             setPlayScene(1);
//           } else {
//             setAlerts({
//               type: "error",
//               content: "Sorry, please try again."
//             })
//           }
//           getPreviousBet();
//         } else {
//           setAlerts({
//             type: "error",
//             content: "Please try again."
//           })
//         }
//       } else {
//         setAlerts({
//           type: "error",
//           content: "Insufficient fund"
//         })
//       }
//     } else {
//       getTurtleHistory();
//     }
//   }

//   const videoEneded = () => {
//     getTurtleHistory();
//     let amount
//     if (currencyMode === "gem") {
//       amount = parseFloat(parseFloat(gemAmount) + parseFloat(earning) - parseFloat(totalBetAmount)).toFixed(2);
//       setGemAmount(amount)
//     } else {
//       amount = parseInt(parseInt(bonusNugAmount) + parseInt(earning) - parseInt(totalBetAmount))
//       setBonusNugAmount(amount)
//     }
//     setTotalBetAmount(0);
//     setWinAmount(earning);
//     if (earning > 0) {
//       setPlayScene(2)
//     } else {
//       setPlayScene(3);
//     }
//   }

//   const chooseTurtleImg = (id) => {
//     let img
//     switch (id) {
//       case 0:
//         img = turtle1;
//         break;
//       case 1:
//         img = turtle2;
//         break;
//       case 2:
//         img = turtle3;
//         break;
//       case 3:
//         img = turtle4;
//         break;
//       case 4:
//         img = turtle5;
//         break;
//       default:
//         img = turtle6;
//         break;
//     }
//     return img
//   }

//   const repeatBet = () => {
//     if (!connected) return
//     if (playScene) return
//     let amount = 0;
//     const bets = betState;
//     const quinellaGame = previousBet.quinellaGame.map((qg) => {
//       amount += qg.betAmount
//       bets.push({
//         card1: qg.id1,
//         card2: qg.id2,
//         multi: multipliers[qg.id2 - 1][qg.id1 - 1],
//         betAmount: qg.betAmount
//       })
//       return {
//         betAmount: qg.betAmount,
//         id1: qg.id1,
//         id2: qg.id2
//       }
//     })
//     const singleGame = previousBet.singleGame.map((sg) => {
//       amount += sg.betAmount
//       bets.push({
//         card1: sg.id,
//         card2: -1,
//         multi: turtleMulti[sg.id - 1],
//         betAmount: sg.betAmount
//       })
//       return {
//         id: sg.id,
//         betAmount: sg.betAmount
//       }
//     })
//     setSelectedQuinella(quinellaGame);
//     setSelectedTurtle(singleGame);
//     setTotalBetAmount(amount)
//   }

//   const clear = () => {
//     setSelectedQuinella([]);
//     setSelectedTurtle([]);
//     setBetAmount(rates[0]);
//     setBetMode(0);
//   }

//   const clearBet = () => {
//     if (playScene) return
//     clear();
//     setTotalBetAmount(0);
//     setBetState([]);
//   }

//   const changeBetMode = (mode) => {
//     setBetMode(mode);
//   }

//   // Components
//   const Card = (num) => {
//     let bgColor = "#0260F9";
//     let fontColor = "white";
//     switch (num) {
//       case 1:
//         bgColor = "#D30202";
//         break;
//       case 2:
//         bgColor = "#FF9800"
//         break;
//       case 3:
//         bgColor = "#381877"
//         break;
//       case 4:
//         bgColor = "#239B47"
//         break;
//       case 5:
//         bgColor = "#F8F603"
//         fontColor = "black"
//         break;
//     }
//     return (
//       <Box className="card" style={{ backgroundColor: bgColor }}>
//         <Typography color={fontColor} fontSize="13px">{num}</Typography>
//       </Box>
//     )
//   }
//   const History = (card1, card2, win, quinella, isNow) => {
//     return (
//       <Box className="history">
//         {Card(card1)}
//         {Card(card2)}
//         <Typography className="winColor" fontSize="13px">{parseFloat(win).toFixed(1)}x</Typography>
//         <Typography className="quinellaColor" fontSize="13px">{parseFloat(quinella).toFixed(1)}x</Typography>
//       </Box>
//     )
//   }


//   const Turtle = (id, img) => {
//     let selected = false;
//     let amount
//     selectedTurtle.map((data) => {
//       if (data.id === id) {
//         selected = true
//         amount = data.betAmount
//       }
//     })

//     return (
//       <Box className="turtle" onClick={() => selectTurtle(id)}>
//         <Box className="img">
//           <img src={img} alt={`turtle${id}`} />
//           <Typography>{`Turtle FLIP ${id}`}</Typography>
//         </Box>
//         <Box className="desc">
//           {Card(id)}
//           <Typography className="multiColor">{turtleMulti[id - 1]}x</Typography>
//           {selected &&
//             <Box className="bet">
//               <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} alt="SOL" width="20px" height="20px" />
//               <Typography>{amount}</Typography>
//             </Box>
//           }
//         </Box>
//       </Box>
//     )
//   }

//   const Quinella = (id1, id2, multi) => {
//     let selected = false;
//     let amount
//     selectedQuinella.map((qData) => {
//       if (qData.id1 === id1 && qData.id2 === id2) {
//         selected = true;
//         amount = qData.betAmount
//       }
//     })
//     return (
//       <Box className="quinella" key={id1} onClick={() => selectQuinella(id1, id2, multi)}>
//         <Box className="ids">
//           {Card(id1)}
//           {Card(id2)}
//         </Box>
//         <Typography className="multiColor">{`${multi}x`}</Typography>
//         {selected &&
//           <Box className="bet">
//             <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} alt="SOL" width="20px" height="20px" />
//             <Typography>{amount}</Typography>
//           </Box>
//         }
//       </Box>
//     )
//   }

//   const QuinellaIndicator = (id) => {
//     let color = "#045BE8";
//     switch (id) {
//       case 1:
//         color = "#C62525";
//         break;
//       case 2:
//         color = "#FDA524"
//         break;
//       case 3:
//         color = "#513393"
//         break;
//       case 4:
//         color = "#269848"
//         break;
//       case 5:
//         color = "#E4E50B"
//         break;
//     }
//     return (
//       <Box className="indicator" key={id} style={{ borderColor: color, background: `linear-gradient(180deg, ${color}, transparent)` }} onClick={() => clickIndicator(id)}>
//         {Card(id)}
//         {id !== 1 && <KeyboardDoubleArrowLeft style={{ left: 0 }} />}
//         {id !== 6 && <KeyboardArrowDown style={{ bottom: 0 }} />}
//       </Box>
//     )
//   }

//   const BetBoard = (id, img, multipliers) => {
//     let Board = [];
//     for (let i = 1; i < id + 1; i++) {
//       if (i === id) {
//         Board.push(QuinellaIndicator(id));
//       } else {
//         Board.push(Quinella(i, id, multipliers[i - 1]));
//       }
//     }
//     return (
//       <Box className="betBoard">
//         {isDesktop && Turtle(id, img)}
//         <Box className="boardContainer">
//           {Board}
//         </Box>
//       </Box>
//     )
//   }

//   const playCard = (txt, num) => {
//     return (
//       <Box className="playCard my-4">
//         <Typography className="txt">{txt}</Typography>
//         <Box className="sol">
//           <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} alt="SOL" />
//           <Typography>{num}</Typography>
//         </Box>
//       </Box>
//     )
//   }

//   const betPanel = () => {
//     const bets = betState;
//     const betBoards = bets.map((bet, key) => {
//       const coin = currencyMode === "gem" ? gemImg : nugget
//       return (
//         <Box className="bet">
//           <Box className="cards">
//             {Card(bet.card1)}
//             {bet.card2 > 0 && Card(bet.card2)}
//             <Typography>{bet.multi}x</Typography>
//           </Box>
//           <Box className="betAmount">
//             <img src={coin} alt="COIN" width="20px" height="20px" />
//             <Typography fontWeight="bold">{bet.betAmount}</Typography>
//           </Box>
//         </Box>
//       )
//     })
//     return betBoards
//   }

//   const playerBetMobile = () => {
//     return (
//       <Box className="playerBet">
//         <Box className="bets">
//           {betPanel()}
//         </Box>
//       </Box>
//     )
//   }

//   const playerBet = () => {
//     return (
//       <Box className="playerBet">
//         <Box className="halfRoundButtonLeft">
//           <KeyboardDoubleArrowLeft />
//         </Box>
//         <Box className="bets">
//           {betPanel()}
//         </Box>
//         <Box className="halfRoundButtonRight">
//           <KeyboardDoubleArrowRight />
//         </Box>
//       </Box>
//     )
//   }

  return (
    <></>
    // <Grid className="turtleContainer">
//       {isDesktop ?
//         <Grid container className="desktop">
//           <Box className="alert">
//             {alerts.content && <Box className={alerts.type}>{alerts.content.toString()}</Box>}
//           </Box>
//           <img src={pirateSkel} className="pirateSkel" alt="SkelKing" />
//           <img src={pirateCaptain} className="pirateCaptain" alt="Captain" />
//           <Box className="betHistory">
//             <Box className="halfRoundButtonLeft">
//               <KeyboardDoubleArrowLeft />
//             </Box>
//             <Box className="title">
//               <Typography color="white" fontWeight={700} fontSize="13px" style={{ height: 22, padding: "0", margin: "2px 0" }}>1st</Typography>
//               <Typography color="white" fontWeight={700} fontSize="13px" style={{ height: 22, padding: "0", margin: "2px 0" }}>2nd</Typography>
//               <Typography className="winColor" fontSize="13px">WIN</Typography>
//               <Typography className="quinellaColor" fontSize="13px">QUINELLA</Typography>
//             </Box>
//             <Box className="histories">
//               {turtleHistory}
//             </Box>
//           </Box>
//           <Grid item xs={0} sm={1} md={2} lg={2} />
//           <Grid item xs={12} sm={10} md={8} lg={8}>
//             {playScene !== 0 && <Box className="betShow">
//               <Typography style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>YOUR BET:</Typography>
//               {playerBet()}
//             </Box>}
//             {playScene === 0 &&
//               <Box className="game">
//                 <Box className="turtles">
//                   {BetBoard(1, turtle1, multipliers[0])}
//                   {BetBoard(2, turtle2, multipliers[1])}
//                   {BetBoard(3, turtle3, multipliers[2])}
//                   {BetBoard(4, turtle4, multipliers[3])}
//                   {BetBoard(5, turtle5, multipliers[4])}
//                   {BetBoard(6, turtle6, multipliers[5])}
//                 </Box>
//                 <Box className="bottomTxt">
//                   <Typography className="maxBet">MAX BET OF 500 NUGGETS PER WINNER BET</Typography>
//                   <Typography className="quinella">QUINELLA: <span>MAX QUINELLA BET PER PLACEMENT IS 100 NUGGETS</span></Typography>
//                 </Box>
//                 <Box className="betCounts">
//                   <Box className="num">
//                     <img src={betCount} alt="" />
//                     <Typography>{time}</Typography>
//                   </Box>
//                   <Box className="placeBet">
//                     <Typography>PLACE YOUR BETS</Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             }
//             {playScene === 1 &&
//               <Box className="race">
//                 <video width="80%" height="100%" autoPlay playsInline onEnded={videoEneded}>
//                   <source src={turtleVideo} type="video/mp4" />
//                   No supported
//                 </video>
//               </Box>
//             }
//             {playScene === 2 &&
//               <Box className="win">
//                 <Box className="winBox">
//                   <Box className="cups">
//                     <img src={cup1} alt="Cup" />
//                     <img src={cup1_big} alt="Cup" />
//                     <img src={cup1} alt="Cup" />
//                   </Box>
//                   <Box className="typos">
//                     <Typography className="congrat">CONGRATULATIONS YOU WIN!</Typography>
//                     <Typography className="phrase">Shiver me timbers ye plundered the bank again!</Typography>
//                   </Box>
//                   <Box className="turtles">
//                     <Box className="turtle">
//                       <Typography color="#FCD401">1st Place</Typography>
//                       <img src={winTurtle} alt="1st" />
//                     </Box>
//                     <Box className="turtle">
//                       <Typography color="white">2nd Place</Typography>
//                       <img src={secondTurtle} alt="2st" />
//                     </Box>
//                   </Box>
//                   <Box className="earning">
//                     <Typography>YOU WIN-{earning}</Typography>
//                     <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} width="25px" alt="SOL" />
//                   </Box>
//                 </Box>
//                 <Box className="betCounts">
//                   <Box className="num">
//                     <img src={betCount} alt="" />
//                     <Typography>{time}</Typography>
//                   </Box>
//                   <Box className="placeBet">
//                     <Typography>The next race starts in...</Typography>
//                   </Box>
//                   <button onClick={() => { setPlayScene(0); setBetState([]) }}>Go Back to Race</button>
//                 </Box>
//               </Box>
//             }
//             {playScene === 3 &&
//               <Box className="lose">
//                 <Box className="loseBox">
//                   <Box className="cups">
//                     <img src={cup2} alt="Cup" />
//                     <img src={cup2_big} alt="Cup" />
//                     <img src={cup2} alt="Cup" />
//                   </Box>
//                   <Box className="typos">
//                     <Typography className="congrat">YOU SUCK - YOU LOST</Typography>
//                     <Typography className="phrase">Arg! We appreciate your contribution to the coffer matey!</Typography>
//                   </Box>
//                   <Box className="turtles">
//                     <Box className="turtle">
//                       <Typography color="white">1st Place</Typography>
//                       <img src={winTurtle} alt="1st" />
//                     </Box>
//                     <Box className="turtle">
//                       <Typography color="white">2nd Place</Typography>
//                       <img src={secondTurtle} alt="2st" />
//                     </Box>
//                   </Box>
//                 </Box>
//                 <Box className="betCounts">
//                   <Box className="num">
//                     <img src={betCount} alt="" />
//                     <Typography>{time}</Typography>
//                   </Box>
//                   <Box className="placeBet">
//                     <Typography>The next race starts in...</Typography>
//                   </Box>
//                   <button onClick={() => { setPlayScene(0); setBetState([]) }}>Go Back to Race</button>
//                 </Box>
//               </Box>
//             }
//             <Box className="playBoard">
//               <Box className="playCards">
//                 {playCard("Bet", totalBetAmount)}
//                 {playCard("Last Rounds Win/Loses", winAmount)}
//               </Box>
//               <Box className="rate">
//                 <Typography>Bet Amount</Typography>
//                 <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} width="25px" alt="SOL" />
//                 <Box className={betAmount === rates[0] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[0])}>
//                   <img src={rate1} alt="rate" />
//                   <Typography color="#D30202">{rates[0]}</Typography>
//                 </Box>
//                 <Box className={betAmount === rates[1] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[1])}>
//                   <img src={rate2} alt="rate" />
//                   <Typography color="#FF9800">{rates[1]}</Typography>
//                 </Box>
//                 <Box className={betAmount === rates[2] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[2])}>
//                   <img src={rate3} alt="rate" />
//                   <Typography color="#239B47">{rates[2]}</Typography>
//                 </Box>
//                 <Box className={betAmount === rates[3] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[3])}>
//                   <img src={rate4} alt="rate" />
//                   <Typography color="#2F64CC">{rates[3]}</Typography>
//                 </Box>
//                 <Box className={betAmount === rates[4] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[4])}>
//                   <img src={rate5} alt="rate" />
//                   <Typography color="#A529B4">{rates[4]}</Typography>
//                 </Box>
//               </Box>
//               <Box className="buttons">
//                 <button className="repeat" onClick={repeatBet}>REPEAT</button>
//                 <button className="repeat" onClick={clearBet}>CLEAR</button>
//               </Box>
//             </Box>

//           </Grid>
//         </Grid>
//         :
//         <Grid className="mobile">
//           <Box className="playCards">
//             {playCard("Bet", totalBetAmount)}
//             {playCard("Win", winAmount)}
//           </Box>
//           {playScene === 0 && <Box className="scene1">
//             <Box className="betCounts">
//               <Box className="num">
//                 <img src={betCount} alt="" />
//                 <Typography>{time}</Typography>
//               </Box>
//               <Box className="placeBet">
//                 <Typography>PLACE YOUR BETS</Typography>
//               </Box>
//             </Box>
//             <Box className="buttons">
//               <button className="repeat" onClick={repeatBet}>REPEAT</button>
//               <button className="repeat" onClick={clearBet}>CLEAR</button>
//             </Box>
//             <Box className="rate">
//               <Typography fontSize="15px">Bet Amount</Typography>
//               <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} width="25px" alt="SOL" />
//               <Box className={betAmount === rates[0] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[0])}>
//                 <img src={rate1} alt="rate" />
//                 <Typography color="#D30202">{rates[0]}</Typography>
//               </Box>
//               <Box className={betAmount === rates[1] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[1])}>
//                 <img src={rate2} alt="rate" />
//                 <Typography color="#FF9800">{rates[1]}</Typography>
//               </Box>
//               <Box className={betAmount === rates[2] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[2])}>
//                 <img src={rate3} alt="rate" />
//                 <Typography color="#239B47">{rates[2]}</Typography>
//               </Box>
//               <Box className={betAmount === rates[3] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[3])}>
//                 <img src={rate4} alt="rate" />
//                 <Typography color="#2F64CC">{rates[3]}</Typography>
//               </Box>
//               <Box className={betAmount === rates[4] ? "selected betAmount" : "betAmount"} onClick={() => setBetAmount(rates[4])}>
//                 <img src={rate5} alt="rate" />
//                 <Typography color="#A529B4">{rates[4]}</Typography>
//               </Box>
//             </Box>
//             <Box className="betMode">
//               <Box className={betMode === 0 ? "selected mode" : "mode"} onClick={() => changeBetMode(0)}>
//                 <Typography>WIN</Typography>
//                 <Box className="coin">
//                   <img src={nugget} alt="coin" width="20px" height="20px" />
//                   <Typography>0</Typography>
//                 </Box>
//               </Box>
//               <Box className={betMode === 1 ? "selected mode" : "mode"} onClick={() => changeBetMode(1)}>
//                 <Typography>QUINELLA</Typography>
//                 <Box className="coin">
//                   <img src={nugget} alt="coin" width="20px" height="20px" />
//                   <Typography>500</Typography>
//                 </Box>
//               </Box>
//             </Box>
//             <Box className="betBoard">
//               {!betMode ?
//                 <Box className="single">
//                   <Typography color="white">MAX BET OF 500 NUGGETS PER WINNER BET</Typography>
//                   <Box className="turtles">
//                     {Turtle(1, turtle1)}
//                     {Turtle(2, turtle2)}
//                     {Turtle(3, turtle3)}
//                     {Turtle(4, turtle4)}
//                     {Turtle(5, turtle5)}
//                     {Turtle(6, turtle6)}
//                   </Box>
//                 </Box> :
//                 <Box className="quinella">
//                   <Typography color="white">QUINELLA: MAX QUINELLA BET PER PLACEMENT IS 100 NUGGETS</Typography>
//                   <Box className="turtles" style={{ flexDirection: "column" }}>
//                     {BetBoard(1, turtle1, multipliers[0])}
//                     {BetBoard(2, turtle2, multipliers[1])}
//                     {BetBoard(3, turtle3, multipliers[2])}
//                     {BetBoard(4, turtle4, multipliers[3])}
//                     {BetBoard(5, turtle5, multipliers[4])}
//                     {BetBoard(6, turtle6, multipliers[5])}
//                   </Box>
//                   <img src={pirateCaptain} className="pirateCaptain" alt="Captain" style={{ width: 240, bottom: 20 }} />
//                 </Box>
//               }
//             </Box>
//           </Box>}
//           {playScene === 1 &&
//             <Box className="race">
//               <video width="100%" height="100%" autoPlay playsInline onEnded={videoEneded}>
//                 <source src={turtleVideo} type="video/mp4" />
//                 No supported
//               </video>
//             </Box>
//           }
//           {playScene === 2 &&
//             <Box className="win">
//               <Box className="betCounts">
//                 <Box className="num">
//                   <img src={betCount} alt="" />
//                   <Typography>{time}</Typography>
//                 </Box>
//                 <Box className="placeBet">
//                   <Typography>The next race starts in...</Typography>
//                 </Box>
//                 <button onClick={() => { setPlayScene(0); setBetState([]) }}>Go Back to Race</button>
//               </Box>
//               <Box className="winBox">
//                 <Box className="cups">
//                   <img src={cup1} alt="Cup" />
//                   <img src={cup1_big} alt="Cup" />
//                   <img src={cup1} alt="Cup" />
//                 </Box>
//                 <Box className="typos">
//                   <Typography className="congrat">CONGRATULATIONS YOU WIN!</Typography>
//                   <Typography className="phrase">Shiver me timbers ye plundered the bank again!</Typography>
//                 </Box>
//                 <Box className="turtles">
//                   <Box className="turtle">
//                     <Typography color="#FCD401">1st Place</Typography>
//                     <img src={winTurtle} alt="1st" />
//                   </Box>
//                   <Box className="turtle">
//                     <Typography color="white">2nd Place</Typography>
//                     <img src={secondTurtle} alt="2st" />
//                   </Box>
//                 </Box>
//                 <Box className="earning">
//                   <Typography>YOU WIN-{earning}</Typography>
//                   <img src={currencyMode === "mainNug" ? ETHImg : (currencyMode === "bonusNug" ? nugget : gemImg)} width="25px" alt="SOL" />
//                 </Box>
//               </Box>
//             </Box>
//           }
//           {playScene === 3 &&
//             <Box className="lose">
//               <Box className="betCounts">
//                 <Box className="num">
//                   <img src={betCount} alt="" />
//                   <Typography>{time}</Typography>
//                 </Box>
//                 <Box className="placeBet">
//                   <Typography>The next race starts in...</Typography>
//                 </Box>
//                 <button onClick={() => { setPlayScene(0); setBetState([]) }}>Go Back to Race</button>
//               </Box>
//               <Box className="loseBox">
//                 <Box className="cups">
//                   <img src={cup2} alt="Cup" />
//                   <img src={cup2_big} alt="Cup" />
//                   <img src={cup2} alt="Cup" />
//                 </Box>
//                 <Box className="typos">
//                   <Typography className="congrat">YOU SUCK - YOU LOST</Typography>
//                   <Typography className="phrase">Arg! We appreciate your contribution to the coffer matey!</Typography>
//                 </Box>
//                 <Box className="turtles">
//                   <Box className="turtle">
//                     <Typography color="white">1st Place</Typography>
//                     <img src={winTurtle} alt="1st" />
//                   </Box>
//                   <Box className="turtle">
//                     <Typography color="white">2nd Place</Typography>
//                     <img src={secondTurtle} alt="2st" />
//                   </Box>
//                 </Box>
//               </Box>
//             </Box>
//           }
//           {playScene !== 0 && <Box className="betShow">
//             <Typography style={{ color: "white", fontSize: "20px", fontWeight: "bold", textAlign: "left" }}>YOUR BET:</Typography>
//             {playerBetMobile()}
//           </Box>}
//         </Grid>
//       }

//     </Grid>
  )
}

export default TurtleComponent;