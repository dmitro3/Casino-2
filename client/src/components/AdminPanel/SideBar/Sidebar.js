import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home"
import { People, ThreeK } from "@mui/icons-material";
import { Settings } from "@mui/icons-material";

import coin from "../../../assets/images/coin.png"
import useGameStore from "../../../GameStore";

import "./Sidebar.scss"

const Sidebar = () => {

  const {adminView, setAdminView} = useGameStore();
  const {loading, setLoading} = useGameStore();

  const changeViewMode = async (mode) => {
    if(loading) return;
    setAdminView(mode);
  }

  return (
    <Grid className="sidebar">
      <a href="/game" className="items game">
        <img src={coin} alt="coin" style={{width: "30px"}}/>
        <Typography style={{marginTop: "5px"}}>GAME</Typography>
      </a>
      <Box className={adminView === "home" ? "selected items":"items"} onClick={()=>changeViewMode("home")}>
        <HomeIcon />
        <Typography>HOME</Typography>
      </Box>
      <Box className={adminView === "users" ? "selected items":"items"} onClick={()=>changeViewMode("users")}>
        <People />
        <Typography>Users</Typography>
      </Box>
      <Box className={adminView === "settings" ? "selected items":"items"} onClick={()=>changeViewMode("settings")}>
        <Settings />
        <Typography>Settings</Typography>
      </Box>
      <Box className={adminView === "popup" ? "selected items":"items"} onClick={()=>changeViewMode("popup")}>
        <ThreeK />
        <Typography>Edit Popup</Typography>
      </Box>
    </Grid>
  );
}

export default Sidebar