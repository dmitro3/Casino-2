import { useState, useEffect } from "react";
// import * as solanaWeb3 from "@solana/web3.js";
import { useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/GamePlay/Header";
import Footer from "../components/GamePlay/Footer";
import Splash from "../components/GamePlay/Splash";
import background from "../assets/images/hero.png";
// import background_blacktheme from "../assets/images/MinesRushHeader.jpg";
import background_blacktheme from "../assets/images/mintNFT.png";

import useGameStore from "../GameStore";
import useSound from "use-sound";
import backgroundmusic from "../assets/audios/backgroundmusic.mp3";
import publicDir from "../assets/images/axe.png";

import "./Turtle.scss";
import Sidebar from "../components/GamePlay/Sidebar";
import PirateDepositComponent from "../components/GamePlay/PirateDeposit/PirateDeposit";
import MintNFTsComponent from "../components/GamePlay/MintNFT/MintNFT";

const MintNFTs = ({ }) => {
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
          backgroundSize: "cover"
        }}
      >
        <Box className={themeBlack ? "overlay" : ""} style={{background: "linear-gradient(0deg, #05070ee6, #05070e66)"}}>
          <Box className="gamePlay" id="gamePlay">
            {/* <Sidebar /> */}
            <Box className="main" style={{ width: "100vw"}}>
              {/* <Header /> */}
              <MintNFTsComponent />
              <Footer />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MintNFTs;