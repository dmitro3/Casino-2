import axios from "axios";
import {
  Box,
  Typography,
  Modal
} from "@mui/material";
import { CSVLink } from 'react-csv';
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import "./Setting.scss";
import useGameStore from "../../../GameStore";
import getNum from "../../GamePlay/Tools/Calculate";
import { connected } from "process";

const Setting = () => {

  const { publicKey } = useWallet();
  const { setAlerts } = useGameStore();
  const { loading, setLoading } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { enableMines, setEnableMines } = useGameStore();
  const { enableDouble, setEnableDouble } = useGameStore();
  const { enableLoot, setEnableLoot } = useGameStore();
  const { enableTurtle, setEnableTurtle } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [_mineHouseEdge, set_MineHouseEdge] = useState();
  const [_minMine, set_MinMine] = useState();
  const [_maxMine, set_MaxMine] = useState();
  const [_doubleHouseEdge, set_DoubleHouseEdge] = useState();
  const [resetDBModalOpen, setResetDBModalOpen] = useState(false);
  const [autoPayMode, setAutoPayMode] = useState("");
  const [ticketDats, setTicketsDatas] = useState();
  const [raffleMode, setRaffleMode] = useState(false);
  const [startTurtle, setStartTurtle] = useState(false);
  const [imgs, setImgs] = useState("");
  const [date, setDate] = useState(0);
  const [imageComponent, setImageComponent] = useState();
  const [distributeAmount, setDistributeAmount] = useState(0);
  const [mintInterval, setMintInterval] = useState(0);
  const [remainedNFT, setRemainedNFT] = useState(0);
  const [enableMine, setEnableMine] = useState(true);
  const [enableDoubles, setEnableDoubles] = useState(true);
  const [enableLoots, setEnableLoots] = useState(true);
  const [enableTurtles, setEnableTurtles] = useState(true);
  const [gemTargetBalances, setGemTargetBalances] = useState(0);
  const [nugTargetBalances, setNugTargetBalances] = useState(0);

  let images = [];

  let imgArray;

  useEffect(() => {
    getHouseEdge();
    getImages();
  }, [])

  useEffect(() => {
    if (connected)
      downloadTickets();
  }, [connected])

  const getHouseEdge = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/getHouseEdge`);
    // console.log('result', res.data);
    set_MineHouseEdge(res.data.mineHouseEdge);
    set_DoubleHouseEdge(res.data.doubleHouseEdge);
    set_MaxMine(res.data.maxMine);
    set_MinMine(res.data.minMine);
    setAutoPayMode(res.data.autoPayout);
    setRaffleMode(res.data.raffleOn);
    setDate(String(res.data.raffleDate).slice(0, 10));
    setMintInterval(res.data.remainedTime1 * 1000);
    setRemainedNFT(res.data.remainedNFT);
    setStartTurtle(res.data.startTurtle);
    setEnableMine(res.data.enableMines);
    setEnableDoubles(res.data.enableDouble);
    setEnableLoots(res.data.enableLoot);
    setEnableTurtles(res.data.enableTurtle);
  }
  const getImages = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/getImages`);

    if (res.data.status) {
      setImgs(res.data.content);
      setImageData(res.data.content);
    } else {
      setAlerts({
        type: "error",
        content: "Error while gettimg images"
      })
    }
  }

  const setImageData = (data) => {
    if (data.length) {
      images = data.map((img, key) => {
        return (
          <Box className="images">
            <img src={img} alt={key} className="upImg" />
            <Box className="buttonGroup">
              <Box className="update" display={loading}>
                <label htmlFor={img}>
                  <Typography className="Input_addhome Button_addhome" style={{ fontSize: "10px" }}>
                    UPDATE
                  </Typography>
                </label>
                <input className="Input_addhome"
                  type="file"
                  accept="image/*"
                  id={img}
                  style={{ display: "none" }}
                  onChange={(e) => updateImages(e.target.files, img)}
                />
              </Box>
              <button className="delete" disabled={loading} onClick={() => deleteImages(img)}>DELETE</button>
            </Box>
          </Box>
        )
      })
      setImageComponent(images);
    }
  }
  const deleteImages = async (data) => {
    const body = {
      walletAddress: localStorage.walletLocalStorageKey,
      img: data
    }
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/delImgs`, body);
    if (result.data.status) {
      setAlerts({
        type: "success",
        content: "Delete Image Succeed."
      })
    } else {
      setAlerts({
        type: "error",
        content: "Delete Image Failed."
      })
    }
    getImages();
  }

  const setHouseEdges = async () => {
    try {
      if (loading) return
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          walletAddress: localStorage.walletLocalStorageKey,
          mineHouseEdge: _mineHouseEdge,
          doubleHouseEdge: _doubleHouseEdge,
          minMine: _minMine,
          maxMine: _maxMine,
          num: num,
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setHouseEdges`, body);
        if (res.data.status) {
          setAlerts({
            type: "success",
            content: "Settings changed"
          })
        } else {
          setAlerts({
            type: "error",
            content: "Setting failed."
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    } catch (err) {
      console.log("Error while set houseedge", err);
    }
  }

  const resetDB = async () => {
    try {
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/resetDBs`, body);
        if (res.data.status) {
          setAlerts({
            type: "success",
            content: "DB Reset"
          })
        } else {
          setAlerts({
            type: "error",
            content: "DB Reset failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
      setResetDBModalOpen(false);
    } catch (err) {
      console.log("Error while reset DB", err)
      setAlerts({
        type: "error",
        content: err
      })
    }
  }

  const resetRaffle = async () => {
    if (loading) return
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        num: num
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/resetRaffle`, body);
      if (res.data.status) {
        setAlerts({
          type: "success",
          content: "Reset Tickets finished"
        })
      } else {
        setAlerts({
          type: "error",
          content: "Reset Tickets failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  const downloadTickets = async () => {
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        num: num
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/downloadTickets`, body);

      if (res.data.status) {
        setTicketsDatas(res.data.data);
      } else {
        setAlerts({
          type: "error",
          content: "Download Tickets failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  const payoutHandler = async (e) => {
    if (!loading) {
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          value: e.target.value,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setPayoutData`, body);
        if (res.data.status) {
          setAutoPayMode(e.target.value)
        } else {
          setAlerts({
            type: "error",
            content: "Setting payoutData failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const raffleAction = async (e) => {
    if (!loading) {
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          value: e.target.checked,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setRaffleMode`, body);
        if (res.data.status) {
          setRaffleMode(res.data.content);
        } else {
          setAlerts({
            type: "error",
            content: "Set Raffle Mode Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const turtleAction = async (e) => {
    if (!loading) {
      let value = e.target.checked;
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          value: value,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setStartTurtle`, body);
        if (res.data.status) {
          setStartTurtle(res.data.content);
        } else {
          setAlerts({
            type: "error",
            content: "Set Start Turtle Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const minesAction = async (e) => {
    if (!loading) {
      let value = e.target.checked;
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      setEnableMine(value)
      if (num) {
        const body = {
          type: "mines",
          value: value,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setEnableGames`, body);
        if (res.data.status) {
          setEnableMines(res.data.content.enableMines);
        } else {
          setAlerts({
            type: "error",
            content: "Set Enable Mines Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const doubleAction = async (e) => {
    if (!loading) {
      let value = e.target.checked;
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      setEnableDoubles(value)
      if (num) {
        const body = {
          type: "double",
          value: value,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setEnableGames`, body);
        if (res.data.status) {
          setEnableDouble(res.data.content.enableDouble);
        } else {
          setAlerts({
            type: "error",
            content: "Set Enable Double Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const lootAction = async (e) => {
    if (!loading) {
      let value = e.target.checked;
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      setEnableLoots(value)
      if (num) {
        const body = {
          type: "loot",
          value: value,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setEnableGames`, body);
        if (res.data.status) {
          setEnableLoot(res.data.content.enableLoot);
        } else {
          setAlerts({
            type: "error",
            content: "Set Enable Loot Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const turtlesAction = async (e) => {
    if (!loading) {
      let value = e.target.checked;
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      setEnableTurtles(value)
      if (num) {
        const body = {
          type: "turtle",
          value: value,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setEnableGames`, body);
        if (res.data.status) {
          setEnableTurtle(res.data.content.enableTurtle);
        } else {
          setAlerts({
            type: "error",
            content: "Set Enable Turtle Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }
  const changeInterval = async (e) => {
    if (!loading) {
      setMintInterval(e.target.value)
    }
  }
  const updateInterval = async (e) => {
    if (!loading) {
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          interval: mintInterval,
          remainedNFT: remainedNFT,
          walletAddress: localStorage.walletLocalStorageKey,
          num: num
        }
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/setMintInterval`, body);
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    }
  }

  const changeGemValue = (e) => {
    setGemTargetBalances(e.target.value)
  }
  const changeNugValue = (e) => {
    setNugTargetBalances(e.target.value)
  }

  const setGemValue = async () => {
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        value: gemTargetBalances,
        num: num
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/setGemValue`, body);
      if (res.data.status) {
        setAlerts({
          type: "success",
          content: "Set Gem Value succeed"
        })
      } else {
        setAlerts({
          type: "error",
          content: "Set Gem Value Failed"
        })
      }
    }
  }

  // const setNugValue = async () => {
  //   const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
  //   if (num) {
  //     const body = {
  //       walletAddress: localStorage.walletLocalStorageKey,
  //       value: nugTargetBalances,
  //       num: num
  //     }
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/admin/setNugValue`, body);
  //     if (res.data.status) {
  //       setAlerts({
  //         type: "success",
  //         content: "Set Nugget Value succeed"
  //       })
  //     } else {
  //       setAlerts({
  //         type: "error",
  //         content: "Set Nugget Value Failed"
  //       })
  //     }

  //   }
  // }

  const payoutAction = async () => {
    setLoading(true);
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        amount: distributeAmount,
        num: num
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/payout`, body);
      if (res.data.status) {
        setAlerts({
          type: "success",
          content: "Payout Succeed"
        })
        setLoading(false);
      } else {
        setAlerts({
          type: "error",
          content: "Error while Payout"
        })
        setLoading(false);
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  const csvData = [
    ['firstname', 'lastname', 'email'],
    ['John', 'Doe', 'john.doe@xyz.com'],
    ['Jane', 'Doe', 'jane.doe@xyz.com']
  ];

  const inputFile = (file) => {
    if (loading) return
    handleSubmit(file);
  }

  const handleSubmit = async (files) => {
    if (loading) return
    if (imgs.length + files.length > 3) {
      setAlerts({
        type: "error",
        content: "There are already 3 NFTs."
      })
      setLoading(false);
      return
    }
    imgArray = await uploadFileHandler(files);
    if (imgArray) {
      setAlerts({
        type: "success",
        content: "Uploading images succeed"
      })
    } else {
      setAlerts({
        type: "error",
        content: "Error while uploading images."
      })
    }
    setLoading(false);
  };

  const uploadFileHandler = async (files) => {
    if (loading) return
    try {
      setLoading(true);
      const formData = new FormData();
      let upImgs = [];
      for (const [key, value] of Object.entries(files)) {
        formData.append("image", value);
        formData.set("key", process.env.REACT_APP_API_KEY);
        const ddd = await axios({
          method: "post",
          url: "https://api.imgbb.com/1/upload",
          data: formData
        })
        upImgs.push(ddd.data.data.thumb.url)
      }
      const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          walletAddress: localStorage.walletLocalStorageKey,
          num: num,
          imgs: upImgs
        }
        const result = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/uploadImgs`, body);
        if (result.data.status) {
          setImgs(upImgs);
          setLoading(false);
          getImages();
          return true;
        } else {
          return false
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      setAlerts({
        type: "error",
        content: "Error while uploading images."
      })
    }
  }

  const updateImages = async (files, imgs) => {
    if (loading) return
    try {
      setLoading(true);
      const formData = new FormData();
      let upImgs
      for (const [key, value] of Object.entries(files)) {
        formData.append("image", value);
        formData.set("key", process.env.REACT_APP_API_KEY);
        const ddd = await axios({
          method: "post",
          url: "https://api.imgbb.com/1/upload",
          data: formData
        })
        upImgs = ddd.data.data.thumb.url
      }
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        new: upImgs,
        prev: imgs
      }
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/updateImgs`, body);
      if (result.data.status) {
        setImgs(upImgs);
        setLoading(false);
        getImages();
        return true;
      } else {
        return false
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      setAlerts({
        type: "error",
        content: "Error while uploading images."
      })
    }
  }

  const uploadRaffleDate = async (date) => {
    if (loading) return;
    setLoading(true);
    const num = await getNum(localStorage.walletLocalStorageKey, factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: localStorage.walletLocalStorageKey,
        num: num,
        date: date,
      }
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/uploadDate`, body);
      if (result.data.status) {
        setDate(date);
        setAlerts({
          type: "success",
          content: "Raffle Date Set."
        })
      } else {
        setAlerts({
          type: "error",
          content: "Error while setting raffle date."
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
    setLoading(false);
  }

  return (
    <Box className="settings">
      <Box className="houseEdgeSetting setting">
        <Typography className="title">HouseEdge Settings</Typography>
        <Box className="setGroup">
          <label htmlFor="minesrush">Minesrush House Edge: </label>
          <Box className="inputGroup">
            <input id="minesrush" value={_mineHouseEdge} onChange={e => set_MineHouseEdge(e.target.value)} />
            <button onClick={setHouseEdges}>SET</button>
          </Box>
        </Box>
        <Box className="setGroup">
          <label htmlFor="double">FLIP Coin House Edge: </label>
          <Box className="inputGroup">
            <input id="double" value={_doubleHouseEdge} onChange={e => set_DoubleHouseEdge(e.target.value)} />
            <button onClick={setHouseEdges}>SET</button>
          </Box>
        </Box>
      </Box>
      <Box className="mineNumberSetting setting">
        <Typography className="title">Min/Max Mine Settings</Typography>
        <Box className="setGroup">
          <label htmlFor="minesrush">Min Mine: </label>
          <Box className="inputGroup">
            <input id="minesrush" checked={true} value={_minMine} onChange={e => set_MinMine(e.target.value)} />
            <button onClick={setHouseEdges}>SET</button>
          </Box>
        </Box>
        <Box className="setGroup">
          <label htmlFor="double">Max Mine: </label>
          <Box className="inputGroup">
            <input id="double" value={_maxMine} onChange={e => set_MaxMine(e.target.value)} />
            <button onClick={setHouseEdges}>SET</button>
          </Box>
        </Box>
      </Box>
      <Box className="setting payout">
        <Typography className="title">Payout to NFT Holders</Typography>
        <Box className="inputGroup">
          <label htmlFor="auto">Auto Payout</label>
          <input type="radio" id="auto" name="payout" onChange={payoutHandler} checked={autoPayMode === "auto"} value="auto" />
        </Box>
        <Box className="inputGroup">
          <label htmlFor="manual">Manually Payout</label>
          <input type="radio" id="manual" name="payout" onChange={payoutHandler} checked={autoPayMode === "manual"} value="manual" />
        </Box>
        <input type="number" value={distributeAmount} onChange={(e) => setDistributeAmount(e.target.value)} style={{ height: "30px", marginRight: "10px" }} />
        <button disabled={autoPayMode === "auto" || loading} onClick={payoutAction}>Payout</button>
      </Box>
      <Box className="setting raffle">
        <Typography className="title">Raffle System</Typography>
        <Box className="inputGroup">
          <Box className="onvoff">
            <label htmlFor="raffle">Raffle On/Off</label>
            <input type="checkbox" id="raffle" name="raffle" onChange={raffleAction} checked={raffleMode} />
          </Box>
          <Box className="timer">
            <Typography>Pick End of Raffle &nbsp;</Typography>
            <Box className="timerGroup">
              <input type="date" value={date} onChange={(e) => uploadRaffleDate(e.target.value)} />
            </Box>
          </Box>
        </Box>
        <Box className="buttonGroup">
          <button onClick={resetRaffle} disabled={loading} style={{ background: "red" }}>Reset Tickets</button>
          <CSVLink data={ticketDats ? ticketDats : csvData} filename="ticket.csv" >Download Tickets</CSVLink>
        </Box>
      </Box>
      <Box className="setting turtle">
        <Typography className="title">Turtle && Game Disable Setting</Typography>
        <Box className="onvoff">
          <label htmlFor="turtle">Start Turtle</label>
          <input type="checkbox" id="turtle" name="turtle" onChange={turtleAction} checked={startTurtle} />
        </Box>
        <Box className="disable">
          <Box className="mines onvoff">
            <label htmlFor="mines">Enable Mines Game</label>
            <input type="checkbox" id="mines" name="mines" onChange={minesAction} checked={enableMines} />
          </Box>
          <Box className="double onvoff">
            <label htmlFor="double">Enable Coins Game</label>
            <input type="checkbox" id="double" name="double" onChange={doubleAction} checked={enableDoubles} />
          </Box>
          <Box className="loot onvoff">
            <label htmlFor="loot">Enable Loot Game</label>
            <input type="checkbox" id="loot" name="loot" onChange={lootAction} checked={enableLoots} />
          </Box>
          <Box className="turtle onvoff">
            <label htmlFor="turtle">Enable Turtle Game</label>
            <input type="checkbox" id="turtle" name="turtle" onChange={turtlesAction} checked={enableTurtles} />
          </Box>
        </Box>
      </Box>
      <Box className="setting resetBalance">
        <Typography className="title">Reset Balance</Typography>
        <Box className="gem">
          <label htmlFor="resetGem">Reset GEM balances</label>
          <Box className="onvoff">
            <input type="number" id="resetGem" name="resetGem" onChange={changeGemValue} value={gemTargetBalances} />
            <button onClick={setGemValue}>SET</button>
          </Box>
        </Box>
        {/* <Box className="nugget">
          <label htmlFor="resetNug">Reset NUGGET balances</label>
          <Box className="onvoff">
            <input type="number" id="resetNug" name="resetNug" onChange={changeNugValue} value={nugTargetBalances} />
            <button onClick={setNugValue}>SET</button>
          </Box>
        </Box> */}
      </Box>
      <Box className="setting uploadImg">
        <Typography className="title">Raffle Images</Typography>
        <Box style={{ display: "flex", justifyContent: "center" }}>
          {imageComponent}
        </Box>
        <Box className="nft">
          <label htmlFor="add">
            <Typography className="Input_addhome Button_addhome">
              ADD
            </Typography>
          </label>
          <input className="Input_addhome"
            type="file"
            accept="image/*"
            id="add"
            style={{ display: "none" }}
            multiple
            onChange={(e) => inputFile(e.target.files)}
          />
        </Box>
      </Box>

      <Modal
        open={resetDBModalOpen}
        onClose={() => setResetDBModalOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className="confirm"
        >
          <Typography>Are you sure to delete All datas on DB?</Typography>
          <button onClick={resetDB}>RESET</button>
        </Box>
      </Modal>
    </Box >
  );
}

export default Setting;