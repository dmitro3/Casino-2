import { Typography } from "@mui/material";
import { Oval } from "react-loader-spinner";
import frogGif from "../../../assets/images/frog.gif";
import "./Splash.scss";

const GamePlay = ({ loading, depositText }) => {
  return (
    <>
      <div className="splash" style={{ display: loading ? "flex" : "none" }}>
        <Oval
          color="#f7be44"
          secondaryColor="#f7be44"
          height={120}
          width={120}
        />
        <div className="frog-background">
          <img className="frog" alt="frog" src={frogGif}></img>
        </div>
        {depositText && (
          <Typography
            variant="h5"
            component="h3"
            color="white"
            className="text"
            align="center"
          >
            Waiting for deposit ...
          </Typography>
        )}
      </div>
    </>
  );
};

export default GamePlay;