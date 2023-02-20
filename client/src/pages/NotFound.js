import React from "react";
import {Grid,  Box } from "@mui/material";
import minesticker from "../assets/images/piraterush.png";

const NotFound = () => {

  return (
    <Grid style={{background: "#101014", height: "100vh"}}>
      <img className="logo-image" style={{ marginTop: "35vh", width: "35vw" }} alt="minesrush" src={minesticker} />
      <Box style={{ fontSize: "2vw", fontWeight: "600", color: "white" }}>
        Page Not Found
      </Box>
    </Grid>
  );
};

export default NotFound;
