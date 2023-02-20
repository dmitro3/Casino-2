import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Grid, Typography } from "@mui/material"
import { NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import useGameStore from "../../../GameStore";
import minesticker from "../../../assets/images/minesticker.png";
import doubleImage from "../../../assets/images/double.svg";
import "./GameInfo.scss"
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";

const GameInfo = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery("(min-width:800px)");
    const isMedium = useMediaQuery("(min-width:1160px)");
    const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
    const { themeBlack } = useGameStore();
    const { gameMode } = useGameStore();

    const [showMore1, setShowMore1] = useState(false);
    const [showMore2, setShowMore2] = useState(false);
    const [infoSize, setInfoSize] = useState();

    const size = document.getElementById("gameInfo-container")?.offsetWidth

    useEffect(() => {
        function handleResize() {
            const size = document.getElementById("gameInfo-container")?.offsetWidth
            setInfoSize(size)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <Grid
            className="gameInfo-container"
            id="gameInfo-container"
            container
            style={isSmall ? {} : { marginBottom: "40px" }}
        >
            <Grid item xs={12} sm={11} md={9} lg={8} style={{ margin: isSmall ? "0 20%" : "0 5%" }}>
                {gameMode === "minesrush" &&
                    <Box
                        className={themeBlack ? "gameInfo-grid-black" : "gameInfo-grid"}
                    >
                        <Box className="title">
                            <Box className="title1">
                                <Box className="left" style={{ background: "linear-gradient(#131b32, #21272d)" }}>
                                    <img src={minesticker} alt="MineGame" />
                                </Box>
                                <Box className="right">
                                    <Typography fontSize="20px" style={{ color: themeBlack ? "white" : "black", textAlign: "left" }}>Mines</Typography>
                                    <Typography fontSize="14px" style={{ color: "grey", textAlign: "left" }}>By <span style={{ color: themeBlack ? "white" : "black" }} >PirateRush</span></Typography>
                                    <Typography fontSize="14px" style={{ color: "grey" }}>Release: 09/10/2022</Typography>
                                </Box>
                            </Box>
                            {matchUpSm && <Box className="title2">
                                <NavLink to="#" >
                                    More Info
                                </NavLink>
                            </Box>}
                        </Box>
                        <Box className="showMore" onClick={() => setShowMore1(true)}>
                            <Typography>Show More</Typography>
                            <ExpandMore />
                        </Box>
                        <Box className={showMore1 ? "show1" : "hidden1"}>
                            <Box className="main" style={{ flexWrap: !isMedium && "wrap" }}>
                                <Box className="gameInfo" style={{ margin: !isMedium && "auto", width: !isMedium && "100%" }}>
                                    <Typography className="title" id="gameInfo">
                                        Game Info
                                    </Typography>
                                    <Box className="info">
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">RTP(Return to Player)</Typography>
                                                <Typography className="right" style={{ color: "#b8e986" }}>100%</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Provider</Typography>
                                                <Typography className="right">PirateRush</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Max Win</Typography>
                                                <Typography className="right" style={{ color: "#b8e986" }}>9,846x</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Mobile</Typography>
                                                <Typography className="right">YES</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15, color: "white" }}>
                                                <Typography className="left">Variations</Typography>
                                                <Typography className="right">3 Mines - 24 Mines</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Type</Typography>
                                                <Typography className="right">Mines</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className="about" style={{ width: !isMedium && "100%" }}>
                                    <Typography className="title">Game Description</Typography>
                                    <Box style={{ overflowY: "scroll", height: 200 }}>
                                        <Typography fontSize="14px" style={{ marginBottom: 10 }}>Mines at PirateRush is our original flagship game. The first game we brought to our platform. Mines is a thrilling game that allows player to set their wager amount and set the number of bombs they want to play with. Players can choose from 3 bombs to 24 bombs. Maximise your odds of winning by playing 13 bombs and trying to uncover all 12 remaining coins! </Typography>
                                        <Typography fontSize="14px" style={{ marginBottom: 10 }}>Mines is a thrilling take on the classic Minesweeper game. Cautiously explore the grid for your chance to grow your earnings and take home the treasure!</Typography>
                                        <Typography fontSize="14px" style={{ marginBottom: 10 }}>Among several games built on the blockchain, Mines at Pirate Rush is unrivaled. Players in Mines, a thrilling update on the classic Minesweeper game, must cautiously explore a grid for multiplier coins while dodging explosives</Typography>
                                        <Typography fontSize="14px" style={{ marginBottom: 10 }}>Ready to embark on a game tip? Try Mines now!</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="showMore" onClick={() => setShowMore1(false)}>
                                <Typography>Show Less</Typography>
                                <ExpandLess />
                            </Box>
                        </Box>
                    </Box>
                }
                {gameMode === "double" &&
                    <Box
                        className={themeBlack ? "gameInfo-grid-black" : "gameInfo-grid"}
                    >
                        <Box className="title">
                            <Box className="title1">
                                <Box className="left" style={{ background: "linear-gradient(#F7BE44, #E37F1B)" }}>
                                    <img src={doubleImage} alt="MineGame" />
                                    <Typography style={{ color: "white", fontWeight: "bold" }}>PirateCoin</Typography>
                                </Box>
                                <Box className="right">
                                    <Typography fontSize="20px" style={{ color: themeBlack ? "white" : "black", textAlign: "left" }}>Pirate Coin</Typography>
                                    <Typography fontSize="14px" style={{ color: "grey", textAlign: "left" }}>By <span style={{ color: themeBlack ? "white" : "black" }} >PirateRush</span></Typography>
                                    <Typography fontSize="14px" style={{ color: "grey" }}>Release: 10/15/2022</Typography>
                                </Box>
                            </Box>
                            {matchUpSm && <Box className="title2">
                                <NavLink to="#" >
                                    More Info
                                </NavLink>
                            </Box>}
                        </Box>
                        <Box className="showMore" onClick={() => setShowMore2(true)}>
                            <Typography>Show More</Typography>
                            <ExpandMore />
                        </Box>
                        <Box className={showMore2 ? "show2" : "hidden2"}>
                            <Box className="main" style={{ flexWrap: !isMedium && "wrap" }}>
                                <Box className="gameInfo" style={{ margin: !isMedium && "auto", width: !isMedium && "100%" }}>
                                    <Typography className="title">
                                        Game Info
                                    </Typography>
                                    <Box className="info">
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">RTP(Return to Player)</Typography>
                                                <Typography className="right" style={{ color: "#b8e986" }}>100%</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Provider</Typography>
                                                <Typography className="right">PirateRush</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Max Win</Typography>
                                                <Typography className="right" style={{ color: "#b8e986" }}>-</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Mobile</Typography>
                                                <Typography className="right">YES</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15, color: "grey" }}>
                                                <Typography className="left">Variations</Typography>
                                                <Typography className="right">--</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Type</Typography>
                                                <Typography className="right">Pirate Coin</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className="about" style={{ width: !isMedium && "100%" }}>
                                    <Typography className="title">Game Description</Typography>
                                    <Box style={{ overflowY: "scroll", height: "200px" }}>
                                        <Typography fontSize="14px" style={{ marginBottom: 10 }}>Will it be a coin or a bomb? Only those who wager will know! Pirate Coin is a game of 50% chance! How many wins can you get in a row before you hit the mine? Play this 50-50 game of luck for a shot to double it or lose it all.</Typography>
                                        <Typography fontSize="14px">Pick the left side or the right side and risk yer booty for a chance to double it!</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="showMore" onClick={() => setShowMore2(false)}>
                                <Typography>Show Less</Typography>
                                <ExpandLess />
                            </Box>
                        </Box>
                    </Box>
                }
                {gameMode === "loot" &&
                    <Box
                        className={themeBlack ? "gameInfo-grid-black" : "gameInfo-grid"}
                    >
                        <Box className="title">
                            <Box className="title1">
                                <Box className="left" style={{ background: "linear-gradient(#9844F7, #3A174D)" }}>
                                    <img src={doubleImage} alt="MineGame" />
                                    <Typography style={{ color: "white", fontWeight: "bold" }}>PirateLoot</Typography>
                                </Box>
                                <Box className="right">
                                    <Typography fontSize="20px" style={{ color: themeBlack ? "white" : "black", textAlign: "left" }}>PirateLoot</Typography>
                                    <Typography fontSize="14px" style={{ color: "grey", textAlign: "left" }}>By <span style={{ color: themeBlack ? "white" : "black" }} >PirateRush</span></Typography>
                                    <Typography fontSize="14px" style={{ color: "grey" }}>Release: 12/08/2022</Typography>
                                </Box>
                            </Box>
                            {matchUpSm && <Box className="title2">
                                <NavLink to="#" >
                                    More Info
                                </NavLink>
                            </Box>}
                        </Box>
                        <Box className="showMore" onClick={() => setShowMore2(true)}>
                            <Typography>Show More</Typography>
                            <ExpandMore />
                        </Box>
                        <Box className={showMore2 ? "show2" : "hidden2"}>
                            <Box className="main" style={{ flexWrap: !isMedium && "wrap" }}>
                                <Box className="gameInfo" style={{ margin: !isMedium && "auto", width: !isMedium && "100%" }}>
                                    <Typography className="title">
                                        Game Info
                                    </Typography>
                                    <Box className="info">
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">RTP(Return to Player)</Typography>
                                                <Typography className="right" style={{ color: "#b8e986" }}>100%</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Provider</Typography>
                                                <Typography className="right">PirateRush</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Max Win</Typography>
                                                <Typography className="right" style={{ color: "#b8e986" }}>100x</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Mobile</Typography>
                                                <Typography className="right">YES</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="infoRow" style={{ flexWrap: !matchUpSm && "wrap" }}>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15, color: "white" }}>
                                                <Typography className="left">Variations</Typography>
                                                <Typography className="right">6</Typography>
                                            </Box>
                                            <Box className="infoItem" style={{ width: !isMedium ? "85%" : size * 0.15 }}>
                                                <Typography className="left">Type</Typography>
                                                <Typography className="right">Loot Box</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className="about" style={{ width: !isMedium && "100%" }}>
                                    <Typography className="title">Game Description</Typography>
                                    <Box style={{ overflowY: "scroll", height: "200px" }}>
                                        <Typography fontSize="14px" style={{ marginBottom: 10 }}>PirateLoot boxes allow players to wager their SOLs with a variety of odd tables for the risk tolerant or low-risk players. Will ye go for the safe 5x multiplier or risk it all for the 500x multiplier? Easy to access, master and incredibly fun to indulge in.</Typography>
                                        <Typography fontSize="14px">Not only can you choose from a variety of loot box prices you can also choose from one of six different odds tables to open yer box with. This has become a very popular game in the recent years and for a good reason. Try your luck and open a PirateLoot box!</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="showMore" onClick={() => setShowMore2(false)}>
                                <Typography>Show Less</Typography>
                                <ExpandLess />
                            </Box>
                        </Box>
                    </Box>
                }
            </Grid>
        </Grid >
    )
}

export default GameInfo;