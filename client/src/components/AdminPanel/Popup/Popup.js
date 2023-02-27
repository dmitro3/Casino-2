import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

import "./popup.scss";
import useGameStore from "../../../GameStore";
import getNum from "../../GamePlay/Tools/Calculate";

const Popup = () => {
  const { publicKey } = useWallet();

  const { setAlerts } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [description, setDescription] = useState("");

  useEffect(() => {
    getDescription();
  }, [])

  const getDescription = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/getDescription`);
    setDescription(res.data.content);
  }

  const submitDescription = async () => {
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        content: description,
        num: num
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/setDescription`, body);
      if (res.data.status) {
        setAlerts({
          type: "success",
          content: "Description Setted."
        })
      } else {
        setAlerts({
          type: "error",
          content: "Setting Description Failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  return (
    <Box className="popup">
      <Box className="inputGroup">
        <label htmlFor="description">Description</label>
        <textarea type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={submitDescription}>Edit Description</button>
      </Box>
    </Box>
  )
}

export default Popup