import axios from "axios";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Carousel from "react-material-ui-carousel/dist";
import { useMediaQuery, Box, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

import "./Landing.scss";
import Header from "../components/GamePlay/Header";
import Footer from "../components/GamePlay/Footer";
import Sidebar from "../components/GamePlay/Sidebar";

import coin from "../assets/images/coin.png";
import game from "../assets/images/game.png";
import eth from "../assets/images/eth.png";
import nugget from "../assets/images/nugget.png";
import bomb from "../assets/images/original1.png";
import turtle1 from "../assets/images/turtle1.png";
import turtle2 from "../assets/images/turtle2.png";
import slider1 from "../assets/images/slider1.jpg";
import slider2 from "../assets/images/slider2.jpg";
import lootyBox2 from "../assets/images/Chest/lootBox2.png";
import lootyBox1 from "../assets/images/Chest/lootBox1.png";
import useGameStore from "../GameStore";

const Landing = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery("(max-width:1200px)");
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));


  const [totalETHGames, setTotalETHGames] = useState(50200);
  const [totalNugGames, setTotalNugGames] = useState(50200);
  const [totalETHWager, setTotalETHWager] = useState(200005);
  const [totalETHEarning, setTotalETHEarning] = useState(304876.05);
  const [totalNugWager, setTotalNugWager] = useState(200005.008);
  const [totalNugEarning, setTotalNugEarning] = useState(304876.05);
  const [is_backgroundmusic, setIs_backgroundMusic] = useState(false);
  const { setGameMode } = useGameStore();
  const { setBoardState } = useGameStore();
  const { setBoardClickedState } = useGameStore();


  useEffect(() => {
    getStatistics();
    document.addEventListener("click", click);
  }, [])

  const click = () => {
    if (is_backgroundmusic) return;
    setIs_backgroundMusic(true);
  };

  const getStatistics = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/history/statistics`)
      .then((res) => {
        if (res.data.status) {
          setTotalETHGames(res.data.data.totalETHGames)
          setTotalNugGames(res.data.data.totalNugGames)
          setTotalETHWager(parseFloat(res.data.data.totalETHWager).toFixed(3))
          setTotalETHEarning(parseFloat(res.data.data.totalETHEarning).toFixed(3))
          setTotalNugWager(parseFloat(res.data.data.totalNugWager).toFixed(3))
          setTotalNugEarning(parseFloat(res.data.data.totalNugEarning).toFixed(3))
        }
      });
  }

  const clickNavLink = (gameMode) => {
    const cboardState = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    setBoardClickedState(cboardState);
    setBoardState(cboardState);
    setGameMode(gameMode);
  }

  const pirateOriginal = (img1, img2, color1, color2, txt1, txt2) => {
    return (
      <Box className="box" style={{ background: `linear-gradient(${color1}, ${color2})`, width: isDesktop ? "250px" : "300px" }}>
        <Box className="imgs">
          <img src={img1} alt="IMG1" style={{ height: "65px", marginRight: "15px" }} />
          <img src={img2} alt="IMG2" style={{ height: "120px" }} />
        </Box>
        <Box className="txts">
          <Typography className="txt1">{txt1}</Typography>
          <Typography className="txt2">{txt2}</Typography>
        </Box>
      </Box>
    )
  }

  const boxGroup = (txt, img, num) => {
    return (
      <Box className="box" style={{ width: isDesktop ? "250px" : "300px" }}>
        <Typography className="header">{txt}</Typography>
        <Box className="line">
          <img src={img} alt="icon" />
          <Typography>{num}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      className="gamePlay"
      id="gamePlay"
      style={{ backgroundColor: "#12151C", overflow: "hidden" }}
    >
      <Sidebar />
      <Box className="main" style={{ paddingLeft: isDesktop ? "60px" : "0", width: "100vw" }}>
        <Header />
        <Box className="landingContent">
          <Box className="container">
            <Box className="top">
              <Carousel
                interval="5000"
                indicators={false}
                navButtonsAlwaysVisible={true}
                navButtonsProps={{
                  style: {
                    backgroundColor: '#49494900',
                    borderRadius: 0
                  }
                }}
                PrevIcon={<ArrowBackIos />}
                NextIcon={<ArrowForwardIos />}
                className={isDesktop ? "topCarousel" : "topCarousel_mobile"}
              >
                <Box className="content">
                  <img src={slider1} style={{ width: isDesktop && "100%" }} alt="img1" />
                  <Box className="topOver">
                    <Box className="container" style={{ width: !isDesktop && "100%" }}>
                      <Typography style={{ marginBottom: isDesktop ? "10px" : "50px", fontSize: !isDesktop && "30px" }}>READY TO SAIL <span>THE HIGH SEAS?</span></Typography>
                      <NavLink to="/mines" style={{ padding: !isDesktop && "10px 20px" }}>START WINNING</NavLink>
                    </Box>
                  </Box>
                </Box>
                <Box className="content">
                  <img src={slider2} style={{ width: isDesktop && "100%", height: "100%", objectPosition: !isDesktop && "-1360px 0" }} alt="img2" />
                  <Box className="topOver">
                    <Box className="container" style={{ width: !isDesktop && "100%" }}>
                      <Typography style={{ marginBottom: isDesktop ? "10px" : "50px", fontSize: !isDesktop && "30px" }}>GET READY FOR <span style={{ textDecorationColor: "8cbd59" }}>RACES OF TORTUGA!</span></Typography>
                      <a href="https://piraterush.com/turtles-of-tortuga" style={{ padding: !isDesktop && "10px 20px" }}>RELEASING SOON</a>
                    </Box>
                  </Box>
                </Box>
              </Carousel>
            </Box>
            <Box className="bottom">
              <Typography className="title">ArbiCasino ORIGINALS</Typography>
              <Box className="bottomCarousel" style={{ flexWrap: isSmall && "wrap" }}>
                <NavLink to="/mines" onClick={() => clickNavLink("minesrush")}>
                  {pirateOriginal(bomb, bomb, "#2a4f7f", "#141924", "ArbiCasino ORIGINAL", "MINESWEEPER")}
                </NavLink>
                <NavLink to="/loot">
                  {pirateOriginal(lootyBox2, lootyBox1, "#5c4087", "#5c4087", "ArbiCasino ORIGINAL", "HIGH STAKES")}
                </NavLink>
                <NavLink to="/coins" onClick={() => clickNavLink("double")}>
                  {pirateOriginal(coin, coin, "#F8CE3F", "#F7AA01", "ArbiCasino ORIGINAL", "FLIPCOIN")}
                </NavLink>
                <NavLink to="/beta-turtles">
                  {pirateOriginal(turtle1, turtle2, "#187973", "#108059", "LAUNCHING SOON", "RACES OF TORTUGA")}
                </NavLink>
              </Box>
            </Box>
            <Box className="statistics">
              <Typography className="title">ETH STATISTICS</Typography>
              <Box className="boxGroup">
                {boxGroup("TOTAL GAMEs PLAYED", game, totalETHGames)}
                {boxGroup("TOTAL ETHs WAGERED", eth, totalETHWager)}
                {boxGroup("TOTAL ETHs WON", eth, totalETHEarning)}
              </Box>
            </Box>
            <Box className="statistics">
              <Typography className="title">NUGGET STATISTICS</Typography>
              <Box className="boxGroup">
                {boxGroup("TOTAL GAMES PLAYED", game, totalNugGames)}
                {boxGroup("TOTAL NUGGETS WAGERED", nugget, totalNugWager)}
                {boxGroup("TOTAL NUGGETS WON", nugget, totalNugEarning)}
              </Box>
            </Box>
          </Box>
        </Box>
        <Footer style={{ marginTop: "60px" }} />
      </Box>
    </Box>
  );
};

export default Landing;
