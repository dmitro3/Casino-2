import React, { useState } from 'react';
import Logo from "../Logo";
import GameBoard from "../GameBoard";
import BettingPanel from "../Limbo/BettingPanel";
import RecentPlays from "../RecentPlays";
import GameInfo from "../GameInfo/GameInfo";
import { Grid } from "@mui/material";

const Content = ({
    loading,
    setLoading,
}) => {

    const [launch, setLaunch] = useState(false);
    const [success, setSuccess] = useState(false);

    return (
        <>
            <Logo />
            <Grid container sx={{
                alignItems: 'center !important'
            }} >
                <Grid xs={1} item sm={2} md={3} lg={2} />
                <Grid item xs={3} lg={3} style={{ marginTop:'100px'}}>
                    <BettingPanel
                        loading={loading}
                        setLoading={setLoading}
                        launch={launch}
                        setLaunch={setLaunch}
                        success = {success}
                        setSuccess = { setSuccess}
                    />
                </Grid>
                <Grid item xs={8} lg={7}>
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
