import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box } from "@mui/material";

import "./GamePlay.scss";
import useGameStore from "../GameStore";
import Sidebar from "../components/GamePlay/Sidebar";
import Header from "../components/GamePlay/Header";
import Footer from "../components/GamePlay/Footer";
import Splash from "../components/GamePlay/Splash";
import background from "../assets/images/hero.png";
import Content from "../components/GamePlay/Content";
import background_blacktheme from "../assets/images/piraterushback2new-min2-min.jpg";

const GamePlay = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { themeBlack } = useGameStore();

  const [loading, setLoading] = useState(true);
  const [depositText, setDepositText] = useState(false);


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
          <Box className="gamePlay" id="gamePlay">
            <Sidebar />
            <Box className="main" style={{ paddingLeft: isDesktop ? "60px" : "0", width: "100vw" }}>
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

export default GamePlay;
