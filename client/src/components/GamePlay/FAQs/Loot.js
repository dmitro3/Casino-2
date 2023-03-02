import { useState } from "react";
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";

import useGameStore from "../../../GameStore";
import minestickerPoster from "../../../assets/images/pirateOctor.png";
import minesticker from "../../../assets/images/octopus.webm";
import lootBox from "../../../assets/audios/lootBox1.mp3";
import "./Loot.scss";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useRef } from "react";

const Loot = () => {
  const octoV = useRef(null);
  const isDesktop = useMediaQuery("(min-width:700px)");
  const { themeBlack } = useGameStore();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const playOcto = () => {
    const random = Math.floor(Math.random() * 10) + 5;
    setTimeout(() => {
      octoV.current.play();
    }, random * 1000)
  }

  return (
    <Grid className="loot-container" container>
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
              <Box>What are the ArbiCasino odds?</Box>
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