import { useState } from "react"
import { Box } from "@mui/material"
import { hashString } from "react-hash-string"

import "./Password.scss";
import useGameStore from "../../../GameStore";

const Password = () => {

  const { password } = useGameStore();
  const { setDoubleCheck } = useGameStore();
  const [pwd, setPwd] = useState("");
  const setPassword = (e) => {
    setPwd(e.target.value);
  }

  const checkPassword = () => {
    if (hashString(pwd) === parseFloat(password)) {
      setDoubleCheck(true);
    }
  }

  return (
    <Box className="password">
      <label htmlFor="password">Password</label>
      <Box className="inputGroup">
        <input id="password" type="password" onChange={setPassword} value={pwd} />
        <button onClick={checkPassword}>Log In</button>
      </Box>
    </Box>
  );
}

export default Password;