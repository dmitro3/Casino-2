import useSound from "use-sound";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Grid, Box } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import useGameStore from "../GameStore";
import Home from "../components/AdminPanel/Home/Home";
import Sidebar from "../components/AdminPanel/SideBar/Sidebar";
import User from "../components/AdminPanel/User/User";
import Setting from "../components/AdminPanel/Settings/Setting";
import Popup from "../components/AdminPanel/Popup/Popup";
import Password from "../components/AdminPanel/Password/Password";
// import * as process.env from "../private";
import minesticker from "../assets/images/piraterush.png";

import "./AdminDashboard.scss";

const AdminDashboard = ({ }) => {

  const { publicKey, connected, signTransaction } = useWallet();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { themeBlack } = useGameStore();
  const { isAdmin } = useGameStore();
  const { doubleCheck } = useGameStore();
  const { adminView } = useGameStore();
  const { alerts } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [depositText, setDepositText] = useState(false);


  return (
    <>
      {isAdmin ?
        (doubleCheck ?
          <Grid>
            <Box className="alert">
              {alerts.content && <Box className={alerts.type}>{alerts.content.toString()}</Box>}
            </Box>
            <Sidebar />
            {adminView === "home" &&
              <Home />
            }
            {adminView === "users" &&
              <User />
            }
            {adminView === "settings" &&
              <Setting />
            }
            {adminView === "popup" &&
              <Popup />
            }
          </Grid> :
          <Grid>
            <Password />
          </Grid>) :
        <Grid style={{ background: "#0e0e0e", height: "100vh" }}>
          <img className="logo-image" style={{ marginTop: "35vh", width: "35vw" }} alt="minesrush" src={minesticker} />
          <Box style={{ fontSize: "2vw", fontWeight: "600", color: "white" }}>
            Page Not Found
          </Box>
        </Grid>
      }
    </>
  );
};

export default AdminDashboard;
