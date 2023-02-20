import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import "./Mine.scss";
import coin from "../../../assets/images/coin.png";
import question from "../../../assets/images/question.png";
import bomb from "../../../assets/images/bomb.png";
import useGameStore from "../../../GameStore";

const Mine = ({ type }) => {
  const [animation, setAnimation] = useState(false);
  const { themeBlack } = useGameStore();

  const [mineClassName, setMineClassName] = useState(
    type === 2
      ? animation
        ? `${themeBlack ? "mine-black" : "mine"} mine-bomb animation`
        : `${themeBlack ? "mine-black" : "mine"} mine-bomb`
      : animation
      ? `${themeBlack ? "mine-black" : "mine"} animation`
      : `${themeBlack ? "mine-black" : "mine"}`
  );

  useEffect(() => {
    let anim = false;
    if (1 * type !== 0) {
      anim = true;
      setAnimation(true);
    }
    if (type === 2)
      if (anim)
        setMineClassName(
          `${themeBlack ? "mine-black" : "mine"} mine-bomb animation`
        );
      else setMineClassName(`${themeBlack ? "mine-black" : "mine"} mine-bomb`);
    else if (anim)
      setMineClassName(`${themeBlack ? "mine-black" : "mine"} animation`);
    else setMineClassName(`${themeBlack ? "mine-black" : "mine"}`);
    if (type === 3) {
      setMineClassName(mineClassName + " revealed ");
    }
    if (type === 4) {
      setMineClassName(mineClassName + " revealed bgred mine-bomb");
    }
  }, [type, themeBlack]);

  useEffect(() => {}, [animation]);

  useEffect(() => {
    getMineClass();
  }, []);

  const getMineClass = () => {
    setMineClassName(
      type === 2
        ? animation
          ? `${themeBlack ? "mine-black" : "mine"} mine-bomb animation`
          : `${themeBlack ? "mine-black" : "mine"} mine-bomb`
        : animation
        ? `${themeBlack ? "mine-black" : "mine"} animation`
        : `${themeBlack ? "mine-black" : "mine"}`
    );
  };

  const switchType = () => {
    switch (type) {
      case 0:
        return <img className="mine-image " alt="ques" src={question} />;
      case 1:
        return <img className="mine-image " alt="coin" src={coin} />;
      case 2:
        return <img className="mine-image " src={bomb} alt="mine" />;
      case 3:
        return <img className="mine-image " src={coin} alt="coin" />;
      case 4:
        return <img className="mine-image " src={bomb} alt="mine" />;
      default:
        return <img className="mine-image " src={question} alt="ques"/>;
    }
  };

  return (
    <Box
      className={mineClassName}
      onAnimationEnd={() => {
        setAnimation(false);
      }}
    >
      {switchType()}
    </Box>
  );
};

export default Mine;
