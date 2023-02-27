import axios from "axios";
import Sound from "react-sound";
import useSound from "use-sound";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, } from "@mui/material";

import "./RecentPlays.scss";
// import * as process.env from "../../../private";
import useGameStore from "../../../GameStore";

import nug from "../../../assets/images/nugget.png"
import gemImg from "../../../assets/images/gem.png"
import sol from "../../../assets/images/sol.png"
import coin from "../../../assets/images/coin.png"
import double from "../../../assets/images/double.svg";
import speaker from "../../../assets/images/speaker.png";
import minesrush from "../../../assets/images/minesrush.svg";
import speaker_mute from "../../../assets/images/speaker_mute.png";
import playgame_sound from "../../../assets/audios/MinesClickSound.mp3";
import speaker_blacktheme from "../../../assets/images/speaker_blacktheme.png";
import lootImg1 from "../../../assets/images/Chest/lootBox1.png";
import lootImg2 from "../../../assets/images/Chest/lootBox2.png";
import lootImg3 from "../../../assets/images/Chest/lootBox3.png";
import lootImg4 from "../../../assets/images/Chest/lootBox4.png";
import lootImg5 from "../../../assets/images/Chest/lootBox5.png";

import speaker_mute_blacktheme from "../../../assets/images/speaker_mute_blacktheme.png";


const RecentPlays = ({ /*socket*/ }) => {

  const isDesktop = useMediaQuery("(min-width:800px)");
  const [playgamesoundplay] = useSound(playgame_sound);

  const { setAlerts } = useGameStore();
  const { isMuted, setIsMuted } = useGameStore();
  const { themeBlack, setThemeBlack } = useGameStore();
  const { gameHistory, setGameHistory } = useGameStore();

  const [is_playgame_sound, setIs_playgame_sound] = useState(false);

  const emitHistory = () => {
    // socket.on("historyChanged", (msg) => {
    //   getHistory();
    // });
  };

  const getHistory = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/history/get`)
        .then((res) => {
          const newGameHistory = res.data;
          setGameHistory(newGameHistory);
        });
    } catch (err) {
      console.log("Error while getting history: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  };

  useEffect(() => {
    getHistory();
    emitHistory();
  }, []);

  const getShortName = (fullName) => {
    if (fullName.length < 10) return fullName;
    return (
      fullName.slice(0, 5) +
      "..." +
      fullName.slice(fullName.length - 6, fullName.length - 1)
    );
  };

  const onVolumeClick = () => {
    playgamesoundplay();
    setIsMuted(!isMuted);
  };

  const handleClick = () => {
    setThemeBlack(!themeBlack);
    setIs_playgame_sound(true);
  };

  const handleSongFinishedPlaying = () => {
    setIs_playgame_sound(false);
  };

  const historyList = gameHistory.map((item, key) => {
    if (item.game !== "Turtle") {
      let payout = item.payout;
      let earn = true;
      let player = item.player;
      const avatar = item.avatar
      if (item.payout === 0) {
        payout = "-" + item.wager;
        earn = false;
      }
      let multiplier = parseFloat(payout / item.wager).toFixed(3);

      let lootImg;
      if ((item.currencyMode === "mainNug" && item.wager === "0.05") || (item.currencyMode === "bonusNug" && item.wager === "50" || (item.currencyMode === "gem" && item.wager === "50"))) {
        lootImg = lootImg1
      } else if ((item.currencyMode === "mainNug" && item.wager === "0.1") || (item.currencyMode === "bonusNug" && item.wager === "100" || (item.currencyMode === "gem" && item.wager === "100"))) {
        lootImg = lootImg2
      } else if ((item.currencyMode === "mainNug" && item.wager === "0.25") || (item.currencyMode === "bonusNug" && item.wager === "250" || (item.currencyMode === "gem" && item.wager === "250"))) {
        lootImg = lootImg3
      } else if ((item.currencyMode === "mainNug" && item.wager === "0.5") || (item.currencyMode === "bonusNug" && item.wager === "500" || (item.currencyMode === "gem" && item.wager === "500"))) {
        lootImg = lootImg4
      } else if ((item.currencyMode === "mainNug" && item.wager === "1") || (item.currencyMode === "bonusNug" && item.wager === "1000" || (item.currencyMode === "gem" && item.wager === "1000"))) {
        lootImg = lootImg5
      }

      if (multiplier < 0) multiplier = parseFloat(0).toFixed(3);
      if (String(item.player).length > 20) player = getShortName(item.player);
      return (
        <TableRow key={key} className="table-row">
          <TableCell align="center" className="player" style={{ width: "100%" }}>
            <Box style={{ display: "flex", width: "100%", height: "2.5vw", alignItems: "center", width: "100%", marginTop: isDesktop && (themeBlack ? '8px' : '5px') }}>
              {avatar ? <img src={avatar} alt="Avatar" className="recentplays-point" style={{ width: '2.5vw', height: '2.5vw', border: "1px solid grey", borderRadius: "50%", padding: "3px" }} /> : <img src={coin} alt="Avatar" className="recentplays-point" style={{ width: '2.5vw', height: '2.5vw', border: "1px solid grey", borderRadius: "50%", padding: "3px" }} />}
              <Typography style={{ paddingLeft: "15px", color: "white", fontWeight: "600" }}>{player}</Typography>
            </Box>
          </TableCell>
          {isDesktop && <TableCell align="center" className="rest">
            <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              {item.wager}&nbsp;
              {!item.currencyMode || item.currencyMode === "mainNug" &&
                <img src={sol} style={{ width: "20px", height: "20px" }} alt="SOL" />
              }
              {!item.currencyMode || item.currencyMode === "bonusNug" &&
                <img src={nug} style={{ width: "20px", height: "20px" }} alt="NUG" />
              }
              {!item.currencyMode || item.currencyMode === "gem" &&
                <img src={gemImg} style={{ width: "20px", height: "20px" }} alt="GEM" />
              }
            </Box>
          </TableCell>}
          <TableCell
            className="rest"
            align="center"
            style={earn ? { color: "#b8e986" } : { color: "#CE461B" }}
          >
            <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              {item.currencyMode && item.currencyMode !== "mainNug" ?
                parseInt(payout) :
                parseFloat(payout).toFixed(3)
              }
              &nbsp;
              {item.currencyMode && item.currencyMode === "bonusNug" &&
                <img src={nug} alt="NUG" className="recentplays-point" />
              }
              {item.currencyMode && item.currencyMode === "mainNug" &&
                <img src={sol} alt="SOL" className="recentplays-point" />
              }
              {item.currencyMode && item.currencyMode === "gem" &&
                <img src={gemImg} alt="GEM" className="recentplays-point" />
              }
            </Box>
          </TableCell>
          {isDesktop && <TableCell align="center" className="rest" style={{ color: themeBlack ? "white" : "black" }}>x{multiplier}</TableCell>}
          {isDesktop && item.game === "Minesrush" && <TableCell className="rest img" align="center" style={{ paddingTop: "8px" }}><img src={minesrush} style={{ width: "3vw" }} alt="Minesrush" /></TableCell>}
          {isDesktop && item.game === "double" && <TableCell align="center" className="rest img" style={{ paddingTop: "8px" }}><img src={double} alt="50/50" style={{ width: "3vw" }} /></TableCell>}
          {isDesktop && item.game === "ArbiCasino" && <TableCell align="center" className="rest img" style={{ paddingTop: "8px" }}><img src={lootImg} alt="ArbiCasino" style={{ width: "50px", height: "50px", background: "#101014", border: "3px solid #3a3a3a", borderRadius: "50%" }} /></TableCell>}
        </TableRow>
      );
    }
  });

  return (
    <Grid
      className="recentplays-container"
      container
      style={isDesktop ? {} : { marginBottom: "40px" }}
    >
      {/* <Grid item xs={0.5} sm={1} md={2} lg={2.5} /> */}
      <Grid item xs={12} sm={11} md={9} lg={8} style={{ margin: isDesktop ? "0 20%" : "0 5%" }}>
        <p
          className={
            isDesktop
              ? "recentplays-title"
              : themeBlack
                ? "recentplays-title"
                : "recentplays-title-mobile"
          }
          id="Recent"
        >
          RECENT PLAYS
        </p>
        <Box
          className={themeBlack ? "recentplays-grid-black" : "recentplays-grid"}
        >
          <TableContainer className="table-container">
            <Table className="table-grid" aria-label="customized table">
              <TableHead className="table-header">
                <TableRow className="table-row">
                  <TableCell align="center" className="player" style={{ width: "100%", marginLeft: "0" }}>PLAYER</TableCell>
                  {isDesktop && <TableCell align="center" className="rest" style={{ margintRight: "0" }}>WAGER</TableCell>}
                  <TableCell align="center" className="rest" style={{ margintRight: "0" }}>PAYOUT</TableCell>
                  {isDesktop && <TableCell align="center" className="rest" style={{ margintRight: "0" }}>MULTIPLIER</TableCell>}
                  {isDesktop && <TableCell align="center" className="rest" style={{ margintRight: "0" }}>GAME</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody className="table-body">{historyList}</TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Grid>
      <Sound
        url={playgame_sound}
        playStatus={
          isMuted && is_playgame_sound
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        playFromPosition={0}
        onFinishedPlaying={handleSongFinishedPlaying}
      />

      {!isDesktop && (
        <>
          <Grid item xs={3} style={{ marginTop: "30px" }} />
          <Grid item xs={3} style={{ marginTop: "30px" }}>
            <Button
              className={themeBlack ? "footer-item-black" : "footer-item"}
              style={{ borderRadius: "10px" }}
              onClick={handleClick}
            >
              LIGHT
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              className={themeBlack ? "footer-item-black" : "footer-item"}
              style={{ marginTop: "30px", borderRadius: "10px" }}
              onClick={onVolumeClick}
            >
              {isMuted ? (
                <img
                  alt="speaker"
                  className="control-option-image"
                  src={themeBlack ? speaker_blacktheme : speaker}
                />
              ) : (
                <img
                  alt="speaker-mute"
                  className="control-option-image"
                  src={themeBlack ? speaker_mute_blacktheme : speaker_mute}
                />
              )}
            </Button>
          </Grid>
          <Grid item xs={3} />
        </>
      )}
    </Grid>
  );
};

export default RecentPlays;