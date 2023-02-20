import { useState, useEffect } from "react";
// import * as solanaWeb3 from "@solana/web3.js";
import { useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/GamePlay/Header";
import Footer from "../components/GamePlay/Footer";
import Splash from "../components/GamePlay/Splash";
import background from "../assets/images/hero.png";
// import background_blacktheme from "../assets/images/MinesRushHeader.jpg";
import background_blacktheme from "../assets/images/piraterushback.png";

import useGameStore from "../GameStore";
import useSound from "use-sound";
import backgroundmusic from "../assets/audios/backgroundmusic.mp3";
import publicDir from "../assets/images/axe.png";

import "./Turtle.scss";
import Sidebar from "../components/GamePlay/Sidebar";
import TurtleComponent from "../components/GamePlay/Turtle/Turtles";
const Turtle = ({ }) => {
  const [loading, setLoading] = useState(true);
  const [depositText, setDepositText] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { isMuted } = useGameStore();
  const { themeBlack } = useGameStore();
  const [bgmusic] = useSound(backgroundmusic, { volume: isMuted ? 1 : 0, loop: true });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      bgmusic();
    }, 3000);
  }, []);

  return (
    <>
      <Box
        className={
          isDesktop
            ? "background"
            : themeBlack
              ? "background-mobile-black"
              : "background-mobile"
        }
        sx={{
          height: loading ? "100vh" : "initial",
          overflowY: "scroll",
          overflowX: "hidden",
          backgroundImage: isDesktop
            ? themeBlack
              ? `url(${background_blacktheme})`
              : `url(${background})`
            : "none",
          backgroundSize: "cover",
          height: "100vh"
        }}
      >
        <Box className={themeBlack ? "overlay" : ""}>
          <Box className="gamePlay" id="gamePlay">
            <Sidebar />
            <Box className="main" style={{paddingLeft: isDesktop ? "65px" : "0", width: "100vw"}}>
              <Header />
              <TurtleComponent />
              <Footer />
            </Box>
          </Box>
        </Box>
      </Box>
      <Splash loading={loading} depositText={depositText} />
    </>
  );
};

export default Turtle;