import { useState, useEffect } from "react";
import { useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/GamePlay/Header";
import Footer from "../components/GamePlay/Footer";
import background from "../assets/images/hero.png";
import background_blacktheme from "../assets/images/slider1.jpg";

import useGameStore from "../GameStore";
import useSound from "use-sound";
import backgroundmusic from "../assets/audios/backgroundmusic.mp3";

import "./Turtle.scss";
import Sidebar from "../components/GamePlay/Sidebar";
import PirateDepositComponent from "../components/GamePlay/PirateDeposit/PirateDeposit";

const PirateDeposit = ({ }) => {
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
          overflow: "hidden",
          backgroundImage: isDesktop
            ? themeBlack
              ? `url(${background_blacktheme})`
              : `url(${background})`
            : "none",
          backgroundSize: "contain"
        }}
      >
        <Box className={themeBlack ? "overlay" : ""}>
          <Box className="gamePlay" id="gamePlay">
            <Sidebar />
            <Box className="main" style={{paddingLeft: isDesktop ? "65px" : "0", width: "100vw"}}>
              <Header />
              <PirateDepositComponent />
              <Footer />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PirateDeposit;