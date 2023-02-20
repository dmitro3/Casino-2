import "./Leaderboard.scss";
import {
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import bomb from "../assets/images/bomb.png";
import link from "../assets/images/link.png";
import sol from "../assets/images/sol.png"
import nugImg from "../assets/images/nugget.png"
import gemImg from "../assets/images/gem.png"
import axios from "axios";
import { useState } from "react";
import useGameStore from "../GameStore";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import * as process.env from "../private";
import { RestartAlt } from "@mui/icons-material";
import Sidebar from "../components/GamePlay/Sidebar/Sidebar";

const Leaderboard = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { walletAddressList, setWalletAddressList } = useGameStore();
  const [solNetGainList, setSolNetGainList] = useState([]);
  const [nuggetNetGainList, setNuggetNetGainList] = useState([]);
  const [gemNetGainList, setGemNetGainList] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  // const [lastplayedlist, setLastplayedlist] = useState([]);
  const [showMode, setDayOrWeek] = useState(0);

  const onClickToday = async () => {
    setDayOrWeek(0);
    getTodayData();
  };

  const onClickWeek = async () => {
    setDayOrWeek(1);
    getWeedkData();
  };

  const onClickTicket = async () => {
    getTicketData();
    setDayOrWeek(2);
  };

  const getWeedkData = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/history/getWeekHighlight`
    );
    let walletAddress = [];
    let solNetGain = [];
    let nuggetNetGain = [];
    let gemNetGain = [];
    let playdate = [];
    result.data.forEach((data, key) => {
      if(!walletAddress.includes(data.walletAddress)) {
        solNetGain.push(0)
        nuggetNetGain.push(0)
        gemNetGain.push(0)
        walletAddress.push(data.walletAddress)
      }
    })
    result.data.forEach((data, key) => {
      let temp = false;
      for (let i = 0; i < walletAddress.length; i++) {
        if (walletAddress[i] === data.walletAddress) {
          temp = true;
          if (data.currencyMode === "mainNug") {
            // if (!solNetGain[i]) solNetGain[i] = 0;
            solNetGain[i] += data.payout;
          } else if (data.currencyMode === "bonusNug") {
            // if (!nuggetNetGain[i]) nuggetNetGain[i] = 0;
            nuggetNetGain[i] += data.payout;
          } else if (data.currencyMode === "gem") {
            // if (!gemNetGain[i]) gemNetGain[i] = 0;
            gemNetGain[i] += data.payout;
          }
          continue;
        }
      }

      // if (temp === false) {
      //   walletAddress.push(data.walletAddress);
      //   // if (data.currencyMode === "mainNug") {
      //   //   solNetGain.push(data.payout);
      //   // } else if (data.currencyMode === "bonusNug") {
      //   //   console.log("bonus", data.payout)
      //   //   nuggetNetGain.push(data.payout);
      //   // }
      // }
    });
    const tempSolNetGain = Array.from(solNetGain);
    const tempnuggetNetGain = Array.from(nuggetNetGain);
    const tempGemNetGain = Array.from(gemNetGain);
    const tempwalletAddress = Array.from(walletAddress);

    tempSolNetGain.sort((a, b) => {
      return b - a;
    });
    // tempnuggetNetGain.sort((a, b) => {
    //   return b - a;
    // });
    // tempGemNetGain.sort((a, b) => {
    //   return b - a;
    // });

    for (let j = 0; j < tempSolNetGain.length; j++) {
      for (let k = 0; k < solNetGain.length; k++) {
        if (tempSolNetGain[j] === solNetGain[k]) {
          tempwalletAddress[j] = walletAddress[k];
          solNetGain[k] = -1;
        }
      }
    }

    // for (let j = 0; j < tempnuggetNetGain.length; j++) {
    //   for (let k = 0; k < nuggetNetGain.length; k++) {
    //     if (tempnuggetNetGain[j] === nuggetNetGain[k]) {
    //       tempwalletAddress[j] = walletAddress[k];
    //       nuggetNetGain[k] = -1;
    //     }
    //   }
    // }
    // for (let j = 0; j < tempGemNetGain.length; j++) {
    //   for (let k = 0; k < gemNetGain.length; k++) {
    //     if (tempGemNetGain[j] === gemNetGain[k]) {
    //       tempwalletAddress[j] = walletAddress[k];
    //       gemNetGain[k] = -1;
    //     }
    //   }
    // }

    let tempDate = Date.parse("01/01/2022");
    for (let l = 0; l < tempwalletAddress.length; l++) {
      let finaldate = Date.parse("01/01/2022");
      result.data.forEach((data, key) => {
        if (data.walletAddress === tempwalletAddress[l]) {
          if (Date.parse(data.date) > tempDate)
            finaldate = Date.parse(data.date);
        }
      });
      playdate.push(finaldate);
    }
    const tempSOLG = Array.from(tempSolNetGain.slice(0, 20));
    const tempNuggetG = Array.from(tempnuggetNetGain.slice(0, 20));
    const tempGemG = Array.from(tempGemNetGain.slice(0, 20));
    const tempW = Array.from(tempwalletAddress.slice(0, 20));
    // setLastplayedlist(playdate);
    setSolNetGainList(tempSOLG);
    setNuggetNetGainList(tempNuggetG);
    setGemNetGainList(tempGemG);
    setWalletAddressList(tempW);
  };

  useEffect(() => {
    getTodayData();
  }, []);

  const getTodayData = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/history/getTodayHighlight`
    );
    let walletAddress = [];
    let solNetGain = [];
    let nuggetNetGain = [];
    let gemNetGain = [];
    result.data.forEach((data, key) => {
      if(!walletAddress.includes(data.walletAddress)){
        walletAddress.push(data.walletAddress)
        solNetGain.push(0)
        nuggetNetGain.push(0)
        gemNetGain.push(0)
      } 
    })
    result.data.forEach((data, key) => {
      // let temp = false;
      for (let i = 0; i < walletAddress.length; i++) {
        if (walletAddress[i] === data.walletAddress) {
          // temp = true;
          if (data.currencyMode === "mainNug") {
            // if (!solNetGain[i]) {
            //   solNetGain[i] = 0;
            //   console.log("newSol", solNetGain[i])
            // }
            solNetGain[i] += data.payout;
          } else if (data.currencyMode === "bonusNug") {
            // if (!nuggetNetGain[i]) {
            //   nuggetNetGain[i] = 0;
            //   console.log("newNug", nuggetNetGain[i]);
            // }
            nuggetNetGain[i] += data.payout;
          } else if (data.currencyMode === "gem") {
            // if (!gemNetGain[i]) {
            //   gemNetGain[i] = 0;
            //   console.log("newGem", gemNetGain[i])
            // }
            gemNetGain[i] += data.payout
          }
          continue;
        }
      }
      // if (temp === false) {
      //   console.log("wallet", data.walletAddress)
      //   walletAddress.push(data.walletAddress);
      //   // if (data.currencyMode === "mainNug") {
      //   //   solNetGain.push(data.payout);
      //   // } else if (data.currencyMode === "bonusNug") {
      //   //   nuggetNetGain.push(data.payout)
      //   // }
      // }
    });

    const tempSolNetGain = Array.from(solNetGain);
    const tempNuggetNetGain = Array.from(nuggetNetGain);
    const tempGemNetGain = Array.from(gemNetGain);
    const tempwalletAddress = Array.from(walletAddress);

    tempSolNetGain.sort((a, b) => {
      return b - a;
    });
    tempNuggetNetGain.sort((a, b) => {
      return b - a;
    });
    tempGemNetGain.sort((a, b) => {
      return b - a;
    });

    for (let j = 0; j < tempSolNetGain.length; j++) {
      for (let k = 0; k < solNetGain.length; k++) {
        if (tempSolNetGain[j] === solNetGain[k]) {
          tempwalletAddress[j] = walletAddress[k];
          solNetGain[k] = -1;
        }
      }
    }
    for (let j = 0; j < tempNuggetNetGain.length; j++) {
      for (let k = 0; k < nuggetNetGain.length; k++) {
        if (tempNuggetNetGain[j] === nuggetNetGain[k]) {
          tempwalletAddress[j] = walletAddress[k];
          nuggetNetGain[k] = -1;
        }
      }
    }
    for (let j = 0; j < tempGemNetGain.length; j++) {
      for (let k = 0; k < gemNetGain.length; k++) {
        if (tempGemNetGain[j] === gemNetGain[k]) {
          tempwalletAddress[j] = walletAddress[k];
          gemNetGain[k] = -1;
        }
      }
    }
    const tempSOLG = Array.from(tempSolNetGain.slice(0, 20));
    const tempNuggetG = Array.from(tempNuggetNetGain.slice(0, 20));
    const tempGemG = Array.from(tempGemNetGain.slice(0, 20));
    const tempW = Array.from(tempwalletAddress.slice(0, 20));
    setSolNetGainList(tempSOLG);
    setNuggetNetGainList(tempNuggetG);
    setGemNetGainList(tempGemG);
    setWalletAddressList(tempW);
  };

  const getTicketData = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/getTicket`
    );
    let data = result.data;
    let big
    for (let i = 0; i < data.length; i++) {
      for (let j = i; j < data.length; j++) {
        if (data[j].number > data[i].number) {
          big = data[j];
          data[j] = data[i];
          data[i] = big;
        }
      }
    }
    setTicketList(result.data);
  }

  const getShortName = (fullName) => {
    if (fullName.length < 10) return fullName;
    return (
      fullName.slice(0, 3) +
      "..." +
      fullName.slice(fullName.length - 4, fullName.length - 1)
    );
  };

  let historyList;
  if (walletAddressList.length) {
    historyList = walletAddressList.map((walletAddress, key) => {
      let solGain = parseFloat(solNetGainList[key]?.toFixed(2));
      let nuggetGain = parseFloat(nuggetNetGainList[key]?.toFixed(2));
      let gemGain = parseFloat(gemNetGainList[key]?.toFixed(2));
      return (
        <TableRow className="table-row" key={key}>
          <TableCell align="center">{`${key + 1}.${getShortName(walletAddress)}`}</TableCell>
          <TableCell align="center"><Box style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>{solGain}&nbsp; <img src={sol} style={{ width: "30px" }} alt="SOL" /></Box></TableCell>
          <TableCell align="center"><Box style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>{nuggetGain}&nbsp; <img src={nugImg} style={{ width: "30px" }} alt="NUG" /></Box></TableCell>
          <TableCell align="center"><Box style={{ color: "white", display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>{gemGain}&nbsp; <img src={gemImg} style={{ width: "30px" }} alt="GEM" /></Box></TableCell>
          <TableCell align="center" style={{ color: "white" }}>{showMode === 1 ? "This Week" : "Today"}</TableCell>
        </TableRow>
      );
    });
  }

  let tickList;
  if (ticketList.length) {
    tickList = ticketList.map((ticket, key) => {
      return (
        <TableRow className="table-row" key={key}>
          <TableCell align="center">{key + 1}</TableCell>
          <TableCell align="center" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{getShortName(ticket.walletAddress)}</TableCell>
          <TableCell align="center">{ticket.number}</TableCell>
        </TableRow>
      )
    })
  }

  return (
    <>
      <Sidebar />
      <Grid className="leaderboard">
        <Grid container className="header">
          <Grid item xs={1}></Grid>
          <Grid item xs={10} className="title">
            <img className="mine-logo" alt="bomb" src={bomb} />
            <div className="mine-link">
              <p className="minerush-text">PirateRush Leaderboard</p>
              <NavLink className="nav-link" to={`/`}>
                {/* <img className="link-img" alt="bomb" src={link} /> */}
                {/* <span className="minerush-link">piraterush.com</span> */}
              </NavLink>
            </div>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
        <Grid container className="body" style={{ paddingLeft: isDesktop ? "65px" : "0px" }}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Box className="date-select">
              <Button
                className={
                  showMode !== 0
                    ? "date-select-button-disabled"
                    : "date-select-button"
                }
              >
                <span className="button-text" onClick={onClickToday}>
                  Today
                </span>
              </Button>
              <Button
                className={
                  showMode !== 1
                    ? "date-select-button-disabled"
                    : "date-select-button"
                }
              >
                <span className="button-text" onClick={onClickWeek}>
                  This Week
                </span>
              </Button>
              <Button
                className={
                  showMode !== 2
                    ? "date-select-button-disabled"
                    : "date-select-button"
                }
              >
                <span className="button-text" onClick={onClickTicket}>
                  Ticket List
                </span>
              </Button>
            </Box>
            {showMode !== 2 ?
              <Box className="history-list">
                <Grid className="list-title">
                  <p className="title-text">Top Degen Pirates</p>
                </Grid>
                <TableContainer className="table-container">
                  <Table className="table-grid" aria-label="customized table">
                    <TableHead className="table-header">
                      <TableRow className="table-row">
                        <TableCell align="center">Miner</TableCell>
                        <TableCell align="center">SOL Net Gain</TableCell>
                        <TableCell align="center">Nugget Net Gain</TableCell>
                        <TableCell align="center">GEM Net Gain</TableCell>
                        <TableCell align="center">Last Played</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="table-body">{walletAddressList.length ? historyList : "none"}</TableBody>
                  </Table>
                </TableContainer>
              </Box> :
              <Box className="history-list">
                <Grid className="list-title">
                  <p className="title-text">Top Miners</p>
                </Grid>
                <TableContainer className="table-container">
                  <Table className="table-grid" aria-label="customized table">
                    <TableHead className="table-header">
                      <TableRow className="table-row">
                        <TableCell align="center">Index</TableCell>
                        <TableCell align="center">Wallet Address</TableCell>
                        <TableCell align="center">Net Gain</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="table-body">{ticketList.length ? tickList : "none"}</TableBody>
                  </Table>
                </TableContainer>
              </Box>
            }
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Leaderboard;