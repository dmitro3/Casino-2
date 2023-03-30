import React, { useState } from 'react';
import Logo from "../Logo";
import GameBoard from "../Crash/GameBoard";
import BettingPanel from "../Crash/BettingPanel";
import RecentPlays from "../RecentPlays";
import GameInfo from "../GameInfo/GameInfo";
import { Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Content = ({
    // loading,
    // setLoading,
}) => {

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [launch, setLaunch] = useState(false);
    const [success, setSuccess] = useState(false);

    return (
        <>
            <Logo />
            <Grid container sx={{
                alignItems: 'center !important'
            }}
            style = {{display: !isDesktop && "flex", flexDirection: !isDesktop && "column-reverse", alignContent: !isDesktop &&  "center"}}
            >
                <Grid/>
                    <Grid>
                        <GameBoard 
                            launch={launch}
                            setLaunch={setLaunch}
                            success = {success}
                            setSuccess = { setSuccess} />
                    </Grid>
                </Grid>
            <GameInfo />
            <RecentPlays />
        </>
    );
};

export default Content;
