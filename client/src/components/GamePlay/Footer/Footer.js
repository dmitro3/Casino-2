import { Box, Grid, Divider } from "@mui/material";
import twitter from "../../../assets/images/twitter.png";
import discord from "../../../assets/images/discord.png";
import magiceden from "../../../assets/images/magiceden.png";
import bomb from "../../../assets/images/bomb.png";
import axe from "../../../assets/images/axe.png";
import logo from "../../../assets/images/PirateRushLogo-min.png"
import "./Footer.scss";
import { useEffect } from "react";
import * as web3 from "@solana/web3.js";
import useGameStore from "../../../GameStore";
// import * as env from "../../../private";
import useMediaQuery from "@mui/material/useMediaQuery";

const Footer = () => {
  const { solanaTps, setSolanaTps } = useGameStore();
  const { gameHistory } = useGameStore();

  useEffect(() => {
    getSolTPS();
  }, []);

  const getSolTPS = async () => {
    const solana = new web3.Connection(process.env.REACT_APP_QUICK_NODE);
    const perfSample = await solana.getRecentPerformanceSamples(1);
    setSolanaTps(
      parseInt(perfSample[0].numTransactions / perfSample[0].samplePeriodSecs)
    );
  };

  const isDesktop = useMediaQuery("(min-width:1200px)");
  return (
    <Grid className="footer-container" container>
      {isDesktop && <Divider className="footer-divider" />}
      <Grid item xs={2} />
      <Grid item xs={8} className="footer-grid">
        {isDesktop && (
          <Box style={{marginBottom: 37}}>
            <p className="recentplays-text">
              The #1 most trusted gaming on Arbitrum
            </p>
            <img src={logo} className="pirate" alt="logo" />
          </Box>
        )}
        <Box>
          <Grid container spacing={isDesktop ? 4 : 2} className="itemGroup">
            <Grid item className="footer-items" xs={isDesktop ? 4 : 12}>
              {isDesktop && (
                <a href="https://piraterush.com/game/mines" rel="noreferrer" target="_blank">
                  <img className="footer-icons" alt="bomb" src={bomb} />
                </a>
              )}
              <a href="https://discord.com/invite/C84Udhnv4j" rel="noreferrer" target="_blank">
                <img className="footer-icons" alt="footer" src={discord} />
              </a>
              <a href="https://twitter.com/PlayPirateRush" rel="noreferrer" target="_blank">
                <img className="footer-icons" alt="footer" src={twitter} />
              </a>
              <a
                href="https://magiceden.io/marketplace/mines_rush"
                rel="noreferrer"
                target="_blank"
              >
                <img className="footer-icons" alt="footer" src={magiceden} />
              </a>
            </Grid>
            <Grid item className="footer-items" xs={isDesktop ? 4 : 12}>
              <span
                className={isDesktop ? "solana-speed" : "solana-speed-mobile"}
              >
                Arbitrum Network: <span style={{ color: "#b8e986" }}> &nbsp;{solanaTps}</span>&nbsp; TPS
                <img src={axe} alt="axe" />
              </span>
            </Grid>
            <Grid className="footer-items" item xs={isDesktop ? 4 : 12} style={{ color: " white" }}>
              18+ to play &nbsp;<span className="playNum">18+</span>
            </Grid>
          </Grid>
          {isDesktop && (
            <Grid item className="footer-items" xs={4} style={{ textAlign: "center", margin: "auto", marginTop: "22px", marginBottom: "22px" }}>
              <span className={isDesktop ? "copyright" : "copyright-mobile"}>
                Copyright © 2022 MinesRush
              </span>
            </Grid>
          )}
        </Box>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
};

export default Footer;
