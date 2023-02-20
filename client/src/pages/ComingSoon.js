import React from "react";
import { useTheme } from "@mui/material/styles";
import {Grid,  Box, useMediaQuery } from "@mui/material";
import minesticker from "../assets/images/piraterush.png";

const ComingSoon = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Grid style={{background: "#0e0e0e", height: "100vh"}}>
      <img className="logo-image" style={{ marginTop: "35vh", width: isDesktop ? "35vw" : "65vw" }} alt="minesrush" src={minesticker} />
      <Box style={{ fontSize: isDesktop ? "2vw" : "3vw", fontWeight: "600", color: "white", fontFamily: "Arial" }}>
        Ahoy Pirates! We be under construction... Check back shortly!
      </Box>
    </Grid>
  );
};

export default ComingSoon;