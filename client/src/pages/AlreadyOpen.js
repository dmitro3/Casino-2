import React from "react";
import {Grid,  Box } from "@mui/material";
import minesticker from "../assets/images/minesticker.png";
import { useEffect } from "react";

const AlreadyOpen = () => {

    

  return (
    <Grid style={{background: "grey", height: "100vh"}}>
      <img className="logo-image" style={{ marginTop: "20%", width: "100px" }} alt="minesrush" src={minesticker} />
      <Box style={{ fontSize: "30px", fontWeight: "600" }}>
        WEBSITE IS OPEN IN ANOTHER BROWSER

      </Box>
    </Grid>
  );
};

export default AlreadyOpen;