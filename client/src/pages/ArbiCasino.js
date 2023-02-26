import { useState, useEffect } from "react";
import { useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/GamePlay/Header";
import Footer from "../components/GamePlay/Footer";
import Splash from "../components/GamePlay/Splash";
import background from "../assets/images/hero.png";
import background_blacktheme from "../assets/images/piraterushback2new-min2-min.jpg";

import useGameStore from "../GameStore";

import "./ArbiCasino.scss";
import Sidebar from "../components/GamePlay/Sidebar";
import Loot from "../components/GamePlay/Pirates/Loot";
import RecentPlays from "../components/GamePlay/RecentPlays";
import Logo from "../components/GamePlay/Logo";
import GameInfo from "../components/GamePlay/GameInfo/GameInfo";
const ArbiCasino = () => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { themeBlack } = useGameStore();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
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
              <Logo />
              <Loot />
              <GameInfo />
              <RecentPlays />
              <Footer />
            </Box>
          </Box>
        </Box>
      </Box>
      <Splash loading={loading} depositText={false} />
    </>
  );
};

export default ArbiCasino;
