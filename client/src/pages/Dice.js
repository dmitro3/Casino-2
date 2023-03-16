import { useState, useEffect } from "react";
import { useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/GamePlay/Header";
import Content from "../components/GamePlay/Limbo/Limbo";
import Footer from "../components/GamePlay/Footer";
import Splash from "../components/GamePlay/Splash";
import background from "../assets/images/hero.png";
import background_blacktheme from "../assets/images/piraterushback2new-min2-min.jpg";
import useGameStore from "../GameStore";
import useSound from "use-sound";
import backgroundmusic from "../assets/audios/backgroundmusic.mp3";

import "./Dice.scss";
import Sidebar from "../components/GamePlay/Sidebar";
const DoubleGame = ({ /*socket*/ }) => {
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
        }}
      >
        <Box className={themeBlack ? "overlay" : ""}>
          <Box className="gamePlay">
            <Sidebar />
            <Box className="main" style={{paddingLeft: isDesktop ? "60px" : "0", width: "100vw"}}>
              <Header />
              <Content
                loading={loading}
                setLoading={setLoading}
                depositText={depositText}
                setDepositText={setDepositText}
              />
              <Footer />
            </Box>
          </Box>
        </Box>
      </Box>
      <Splash loading={loading} depositText={depositText} />
    </>
  );
};

export default DoubleGame;
