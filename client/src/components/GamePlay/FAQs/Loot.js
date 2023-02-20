import { useState } from "react";
import axios from "axios";
import useSound from "use-sound";
import { useWallet } from "@solana/wallet-adapter-react";
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";

import useGameStore from "../../../GameStore";
import minestickerPoster from "../../../assets/images/pirateOctor.png";
import minesticker from "../../../assets/images/octopus.webm";
import minesticker_white from "../../../assets/images/pirateOctor_light.png";
import gold from "../../../assets/images/gold.svg";
import lootBox from "../../../assets/audios/lootBox1.mp3";
import "./Loot.scss";
import GetNum from "../Tools/Calculate";
import { AirlineSeatLegroomExtraSharp, KeyboardArrowDown, SettingsPhoneTwoTone } from "@mui/icons-material";
import { useRef } from "react";

const Loot = () => {
  const theme = useTheme();
  const octoV = useRef(null);
  const { publicKey, connected } = useWallet();
  const [lootsoundplay] = useSound(lootBox);
  const isDesktop = useMediaQuery("(min-width:700px)");
  const { isMuted } = useGameStore();
  const { themeBlack } = useGameStore();
  const { setGameHistory } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { alerts, setAlerts } = useGameStore();
  const { nugAmount, setNugAmount } = useGameStore();
  const { bonusNugAmount, setBonusNugAmount } = useGameStore();
  const { currencyMode } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [animation1, setAnimation1] = useState(false);
  const [animation2, setAnimation2] = useState(false);
  const [animation3, setAnimation3] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  // const getHistory = async () => {
  //   await axios
  //     .get(`${process.env.REACT_APP_BACKEND_URL}/api/history/get`)
  //     .then((res) => {
  //       const newGameHistory = res.data;
  //       setGameHistory(newGameHistory);
  //     });
  // };

  // const openBox = async (amount) => {
  //   if (!connected) return
  //   if (amount === 50)
  //     setAnimation1(true);
  //   if (amount === 250)
  //     setAnimation2(true);
  //   if (amount === 500)
  //     setAnimation3(true);
  //   const num = await GetNum(number, factor1, factor2, factor3, factor4)

  //   const body = {
  //     amount: amount,
  //     walletAddress: publicKey.toBase58(),
  //     num: num,
  //     currencyMode: currencyMode,

  //   }
  //   if (isMuted) lootsoundplay();

  //   setTimeout(async () => {
  //     setAnimation1(false);
  //     setAnimation2(false);
  //     setAnimation3(false);
  //     await axios
  //       .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/lootBox`, body)
  //       .then(async (res) => {
  //         setNumber(res.data.data)
  //         if (res.data.status) {
  //           let earning
  //           setNugAmount(parseFloat(res.data.content.nugAmount).toFixed(3));
  //           setBonusNugAmount(parseFloat(res.data.content.bonusNugAmount).toFixed(3));
  //           if (currencyMode === "mainNug") {
  //             earning = res.data.content.nugAmount - nugAmount + amount;
  //           } else {
  //             earning = res.data.content.nugAmount - nugAmount;
  //           }
  //           if (earning > 0) {
  //             if(currencyMode === "mainNug") {
  //               setAlerts({
  //                 type: "success",
  //                 content: `Congrats!, you won ${parseFloat(earning).toFixed(0)} Nuggets`
  //               })
  //             } else {
  //               setAlerts({
  //                 type: "success",
  //                 content: `Congrats!, you won ${parseFloat(earning*4).toFixed(0)} Bonus Nuggets (${parseFloat(earning).toFixed(3)} Nuggets)`
  //               })
  //             }
  //           } else {
  //             setAlerts({
  //               type: "success",
  //               content: `ARRGH, YER BOOTIE WAS STOLEN, YOU WON 0 NUGGETS`
  //             })
  //           }

  //         } else {
  //           setAlerts({
  //             type: "error",
  //             content: "ARRGH, YER BOOTIE WAS STOLEN, YOU WON 0 NUGGETS"
  //           })
  //         }
  //       })
  //   getHistory();
  // }, 5000)
  // }

  const playOcto = () => {
    const random = Math.floor(Math.random() * 10) + 5;
    setTimeout(() => {
      octoV.current.play();
    }, random * 1000)
  }

  return (
    // <Grid className="loot-container" container>
    //   {/* {alerts.content &&
    //     <div className="alerts">
    //       <div className={alerts.type}>{alerts.content.toString()}</div>
    //     </div>
    //   } */}
    //   <Grid
    //     container
    //     spacing={2}
    //     style={{ flexBasis: isDesktop ? "60%" : "100%", margin: "auto" }}
    //   >
    //     <Box className="octo" style={{ width: isDesktop ? "60vw" : "100vw" }}>
    //       <img src={themeBlack ? minesticker : minesticker_white} alt="LOGO" style={{ width: "480px" }} />
    //     </Box>
    <Grid className="loot-container" container>
      {/* {alerts.content &&
        <Box className="alerts">
          <Box className="alertGroup">
            <Box>
              <Box>{alert2.content.toString()}</Box>
              <Box style={{ marginTop: "10px" }}>{alerts.content.toString()}</Box>
            </Box>
          </Box>
        </Box>
      } */}
      {isDesktop &&
        <Grid xs={1} item sm={2} md={3} lg={4} />
      }
      <Grid item xs={10} sm={8} md={6} lg={4} className="mainBoard"
        style={{ flexBasis: !isDesktop && "100%", maxWidth: !isDesktop && "100%" }}
      >
        <Box className="octo">
          <video ref={octoV} autoPlay muted preload="auto" poster={minestickerPoster} width="100%" height="100%" playsInline onEnded={() => playOcto()}>
            <source src={minesticker} type="video/webm" />
            No supported
          </video>
        </Box>
        <Box className={themeBlack ? "gameboard-black" : "gameboard"} style={{ width: isDesktop ? "190%" : "90%" }}>
          <Box className="title">
            <Typography className={themeBlack ? "mainTitle" : "mainTitle-white"}>Frequently asked Questions</Typography>
          </Box>
          <Box className="oddGroup">
            <Box className={themeBlack ? "odds fontWhite backgroundBlack" : "odds fontBlack backgroundWhite"} onClick={() => setShow1(!show1)}>
              <Box>What are the PirateLoot odds?</Box>
              <KeyboardArrowDown />
            </Box>
            <Box className={show1 ? "tables show1" : "tables hidden1"}>
              <Typography className={themeBlack ? "fontWhite" : "fontBlack"} style={{ textAlign: "left" }}>Loot Boxes Has A 100% Return To Player Odds. There Is No House Edge Or Margin. We Charge A 3.5% Transaction Fee On Every Game That Is Distributed To MinesRush Holders.</Typography>
              <TableContainer className="tableContainer" style={{ borderColor: themeBlack ? "white" : "black" }}>
                <Table >
                  <TableHead>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        Multiplier
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        Chance
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        0
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        39.230%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        0.5
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        21.000%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        1
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        20.000%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        2
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        15.000%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        5
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        3.000%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        10
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        1.500%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        25
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        0.200%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        50
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        0.050%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        100
                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        0.020%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>

                      </TableCell>
                      <TableCell className={themeBlack ? "fontWhite" : "fontBlack"}>
                        100.000%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Box className="oddGroup">
            <Box className={themeBlack ? "odds fontWhite backgroundBlack" : "odds fontBlack backgroundWhite"} onClick={() => setShow2(!show2)}>
              <Box>How does the Daily Wheel Spin for MinesRush holders work?</Box>
              <KeyboardArrowDown />
            </Box>
            <Box className={show2 ? "tables show2" : "tables hidden2"}>
              <Typography className={themeBlack ? "fontWhite" : "fontBlack"} style={{ textAlign: "left" }}>
              The Daily Free Wheel Spin gives holders of the MinesRush NFT 2 free spins every 24 hours. You must be a verified holder and have it in your wallet for 24 hours to get the FREE SPINS activated.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Loot;