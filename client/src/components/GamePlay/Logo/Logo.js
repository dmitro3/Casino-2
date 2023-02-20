import axios from "axios";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import minesticker from "../../../assets/images/pirateOctor.png";
// import minesticker from "../../../assets/images/minesticker.png";
import { Box } from "@mui/material";
import "./Logo.scss";
import useGameStore from '../../../GameStore';
// import * as env from "../../../private";
import { useEffect } from 'react';

const Logo = () => {

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const isSmall = useMediaQuery("(max-width:750px)");
  const { raffleMode } = useGameStore();

  // useEffect(() => {
  //   getNfts();
  // }, []);

  // const getNfts = async () => {
  //   const res = await axios.get(
  //     `${env.REACT_APP_BACKEND_URL}/api/admin/getNfts`);
  //   setNfts(res.data);
  // }
  // const images = nfts.map((nft, key) => {
  //   return (
  //     <img src={process.env.PUBLIC_URL+"/"+nft.path} key={key} alt={key} style={{width: "70px", height: "70px", border: "1px solid black"}} />
  //   )
  // })
  return (
    <Box className="logo-container" style={{ marginBottom: "0px", alignItems: "center"}}>
      {/* {raffleMode &&
        <Box className="balances">
          &nbsp;
        </Box>
      }
      <img className="logo-image" alt="minesrush" src={minesticker}/> */}
      {/* {raffleMode &&
        <Box className="balances" style={{marginRight: "3vw"}}>
          {images};
        </Box>
      } */}
      
    </Box>
  );
};

export default Logo;
