// eslint-disable-next-line

import axios from "axios";
import useSound from "use-sound";
import { useState, useEffect, useContext } from "react";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Modal, Typography, Grid } from "@mui/material";

import * as solanaWeb3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import {
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import ContractUtils from '../Tools/contractUtils';
import coin from "../../../assets/images/coin.png";
import nug from "../../../assets/images/nugget.png";
import gemImg from "../../../assets/images/gem.png";
import eth from "../../../assets/images/eth.png";
import historyBackground from "../../../assets/images/historyBackground.png"
import cashLoader from "../../../assets/images/frog.gif";
import raffleImg from "../../../assets/images/raffle.png";
import rectangleImage from "../../../assets/images/rectangle.png";
import playgame_sound from "../../../assets/audios/MinesClickSound.mp3";
import yellowrectangle from "../../../assets/images/yellowrectangle.png";
import { StoreContext } from '../../../store';

import "./Header.scss";
import useGameStore from "../../../GameStore";
import getNum from "../Tools/Calculate";
import { ExpandMore } from "@mui/icons-material";

library.add(fas);

const Header = () => {

  const theme = useTheme();
  const { connection } = useConnection();
  const [playgamesoundplay] = useSound(playgame_sound);
  const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const { publicKey, signTransaction } = useWallet();

  const isDesktop = useMediaQuery("(min-width:1300px)");
  const isSmall = useMediaQuery("(min-width:900px)");
  const global = useContext(StoreContext);
  const { setAlerts } = useGameStore();
  const { bNugRatio } = useGameStore();
  const { raffles, setRaffles } = useGameStore();
  const { raffleMode, setRaffleMode } = useGameStore();
  const { showToast, setShowToast } = useGameStore();
  const { setIsAdmin } = useGameStore();
  const { setFactor1 } = useGameStore();
  const { setFactor2 } = useGameStore();
  const { setFactor3 } = useGameStore();
  const { setFactor4 } = useGameStore();
  const { gameState } = useGameStore();
  const { userName, setUserName } = useGameStore();
  const { nugAmount, setNugAmount } = useGameStore();
  const { gemAmount, setGemAmount } = useGameStore();
  const { bettingAmount, setBettingAmount } = useGameStore();
  const { bonusNugAmount, setBonusNugAmount } = useGameStore();
  const { setMinMine } = useGameStore();
  const { setMaxMine } = useGameStore();
  const { setMineAmount } = useGameStore();
  const { solAmount, setSolAmount } = useGameStore();
  const { nftAvatars, setNftAvatars } = useGameStore();
  const { nfts, setNfts } = useGameStore();
  const { currencyMode, setCurrencyMode } = useGameStore();
  const { themeBlack, setThemeBlack } = useGameStore();
  const { setIsHolder } = useGameStore();
  const { gameTHistory, setGameTHistory } = useGameStore();
  const { setMineHouseEdge } = useGameStore();
  const { setDoubleHouseEdge } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();
  const { setRaffleDate } = useGameStore();
  const { setLoggedIn } = useGameStore();
  const { enableMines, setEnableMines } = useGameStore();
  const { enableDouble, setEnableDouble } = useGameStore();
  const { enableLoot, setEnableLoot } = useGameStore();
  const { enableTurtle, setEnableTurtle } = useGameStore();
  const { mineGameWin, setMineGameWin } = useGameStore();
  const { mineGameLose, setMineGameLose } = useGameStore();
  const { doubleGameWin, setDoubleGameWin } = useGameStore();
  const { doubleGameLose, setDoubleGameLose } = useGameStore();

  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nftAvatar, setNftAvatar] = useState("");
  const [suserName, setSUserName] = useState(userName);
  const [walletModal, setWalletModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [walletMode, setWalletMode] = useState("deposit");
  const [avatarSelected, setAvatarSelected] = useState(-1);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [raffleModal, setRaffleModal] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [winnerList, setWinnerList] = useState();
  const [raffleDescription, setRaffleDescription] = useState(1);
  const [description, setDescription] = useState([]);
  const [timer, setTimer] = useState(0);
  const [depositModal, setDepositModal] = useState(false);
  const [nftData, setNftData] = useState();
  const [showOption, setShowOption] = useState(false);
  const [height, setHeight] = useState(60);
  const [address, setAddress] = useState("");

  let count = false;
  let raffleHeight = 0;
  const style = themeBlack
    ? {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 250,
      bgcolor: "#1C1F26",
      color: "#fff",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    }
    : {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 250,
      bgcolor: "#fff",
      color: "black",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    };

  useEffect(() => {
    getRaffleWinners();
    getDescription();
    getNfts();
    getHouseEdges();
  }, [])

  const getAdmin = async () => {
    setLoading(true);
    const body = {
      walletAddress: publicKey?.toBase58()
    }
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/play/admin`, body);
    if (res.data.status) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false);
    }
    setFactor1(res.data.content.data1)
    setFactor2(res.data.content.data2)
    setFactor3(res.data.content.data3)
    setFactor4(res.data.content.data4)
    setLoading(false);
  }
  const getNfts = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/getNfts`);
    setNfts(res.data);
    setLoading(false);
  }
  const getRaffleWinners = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/getRaffleWinners`);
    setWinnerList(res.data);
    setLoading(false);
  }
  const getDescription = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/play/getDescription`);
    setDescription(res.data[0].content);
    setLoading(false);
  }
  const getHolders = async () => {
    setLoading(true);
    if (publicKey?.toBase58()) {
      const body = {
        walletAddress: publicKey.toBase58()
      }
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/play/getHolders`, body);
      if (res.data.status) {
        if (res.data.content) {
          setIsHolder(true);
        } else {
          setIsHolder(false);
        }
      } else {
        setAlerts({
          type: "error",
          content: "Fetch Holder list failed"
        })
      }
    }
    setLoading(false);
  }
  const getHouseEdges = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/play/getHouseEdges`);
    setMineHouseEdge(res.data.mineHouseEdge ? res.data.mineHouseEdge : 0.92);
    setDoubleHouseEdge(res.data.doubleHouseEdge ? res.data.doubleHouseEdge : 1);
    setMinMine(res.data.minMine ? res.data.minMine : 5);
    setMaxMine(res.data.maxMine ? res.data.maxMine : 24);
    setMineAmount(res.data.minMine ? res.data.minMine : 5);
    setRaffleMode(res.data.raffleOn ? res.data.raffleOn : false);
    setRaffleDate(res.data?.raffleDate);
    setEnableMines(res.data.enableMines);
    setEnableDouble(res.data.enableDouble);
    setEnableLoot(res.data.enableLoot);
    setEnableTurtle(res.data.enableTurtle);
    const datas = res.data?.raffleDate;
    if (!count && raffleMode)
      setInterval(() => {
        count = true;
        const now = new Date(Date());
        const remain = new Date(datas) - now;
        let date = formatter(parseInt(remain / 1000 / 60 / 60 / 24));
        let hour = formatter(parseInt((remain - 1000 * 60 * 60 * 24 * date) / 1000 / 60 / 60));
        let mins = formatter(parseInt((remain - 1000 * 60 * 60 * 24 * date - 1000 * 60 * 60 * hour) / 1000 / 60));
        let secs = formatter(parseInt((remain - 1000 * 60 * 60 * 24 * date - 1000 * 60 * 60 * hour - 1000 * 60 * mins) / 1000));


        if (remain >= 0) {
          setTimer(
            <>
              <Box className="clock">
                <Typography className="pointer" style={{ fontSize: isSmall ? "14px" : "12px" }}>{date}: </Typography>
                <Typography className="desc">D</Typography>
              </Box>
              <Box className="clock">
                <Typography className="pointer" style={{ fontSize: isSmall ? "14px" : "12px" }}>{hour}: </Typography>
                <Typography className="desc">H</Typography>
              </Box>
              <Box className="clock">
                <Typography className="pointer" style={{ fontSize: isSmall ? "14px" : "12px" }}>{mins}: </Typography>
                <Typography className="desc">M</Typography>
              </Box>
              <Box className="clock">
                <Typography className="pointer" style={{ fontSize: isSmall ? "14px" : "12px" }}>{secs} </Typography>
                <Typography className="desc">S</Typography>
              </Box>
            </>
          )
        }
      }, 1000)
    const formatter = (d) => {
      if (d < 10)
        d = "0" + d;
      return d;
    }
    setLoading(false);
    return res.data?.raffleDate

  }

  useEffect(() => {
    getAdmin();
    getTransactionHistory();
    ttt();
    getHolders();
    const unloadCallback = async () => {
      if (publicKey?.toBase58()) {
        const body = { walletAddress: publicKey.toBase58() }
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/logOut`, body)
        return "";
      }
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, [global.walletConnected]);

  const getTransactionHistory = async () => {
    const body = { type: "Get THistory", walletAddress: publicKey?.toBase58() }
    if (body.walletAddress) {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/history/getTHistory`, body)
      if (res.data.status !== "error") {
        setGameTHistory(res.data.content);
      } else {
        console.log("Error while getting transaction history", res.data.content);
      }
    }
  }
  const ttt = async () => {
    if (global.walletConnected) {
      const connection = new solanaWeb3.Connection(
        process.env.REACT_APP_QUICK_NODE
      );
      let balance = await connection.getBalance(publicKey);
      balance = balance / LAMPORTS_PER_SOL;
      
      setSolAmount(balance);
      let deviceId = localStorage.getItem("id");
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("id", deviceId);
      }
      const body = {
        walletAddress: publicKey?.toBase58(),
        deviceId: deviceId//do not need
      };
      if (body.walletAddress) {
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/user/getUserData`, body)
          .then((res) => {
            if (res.data) {
              setSUserName(res.data.userName);
              setNugAmount(parseFloat(res.data.amount).toFixed(3));
              setUserName(res.data.userName);
              setRaffles(res.data.raffles)
              setRaffleMode(res.data.raffleMode);
              setBonusNugAmount(parseFloat(res.data.bonusNugAmount).toFixed(3));
              setNftAvatar(res.data.avatar || "");
              setGemAmount(parseFloat(res.data.gemAmount).toFixed(3));
            } else {
              setLoggedIn(true);
            }
          })
          .catch((err) => {
            console.log("Error while fetching user.", err);
            setAlerts({ type: "error", content: err.message })
          });
      }
    }
  };

  const handleChange = (mode) => {
    setCurrencyMode(mode);
    if (mode === "mainNug" && currencyMode !== mode)
      setBettingAmount(bettingAmount / bNugRatio)
    else if (mode === "bonusNug" && currencyMode === "mainNug")
      setBettingAmount(bettingAmount * bNugRatio)
    else if (mode === "gem" && currencyMode === "mainNug")
      setBettingAmount(bettingAmount * bNugRatio)

    setMineGameWin(0)
    setMineGameLose(0)
    setDoubleGameLose(0)
    setDoubleGameWin(0)
  }
  const images = nfts.map((nft, key) => {
    return (
      <img src={nft.path} key={key} alt={key} style={{ width: "70px", height: "70px", border: "1px solid black", margin: "10px 3px" }} />
    )
  })
  const winners = winnerList?.map((winner, key) => {
    return (
      <Box key={key} style={{ fontSize: "14px" }} className={themeBlack ? "sol-balance-black" : "sol-balance"}>
        {winner.walletAddress}
      </Box>
    )
  });

  const handleGameOverModalClose = () => {
    setGameOverModalOpen(false);
  };

  const handleAvatarModalClose = () => {
    setGameOverModalOpen(false);
  };

  const onWalletClick = () => {
    playgamesoundplay();
    if (global.walletConnected) {
      setWalletModal(true);
      setShowOption(false);
    } else {
      setConnectWalletModalOpen(true);
    }
  };

  const depositHandler = (e) => {
    setDepositAmount(e.target.value);
  }

  const withdrawHandler = (e) => {
    setDepositAmount(e.target.value);
  }

  const handleWalletModalClose = () => {
    if (loading) return;
    setWalletModal(false);
    setDepositAmount(0);
  }

  const walletAction = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      if (walletMode === "deposit") {
        let res;
        if (depositAmount >= solAmount) {
          setAlerts({
            type: "error",
            content: "Insufficient Funds"
          })
          return;
        }
        if (depositAmount <= 0) {
          setAlerts({
            type: "error",
            content: "You can't deposit negative sol."
          })
          return;
        }
        let amount = solanaWeb3.LAMPORTS_PER_SOL * depositAmount;
        const transaction = new solanaWeb3.Transaction().add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new solanaWeb3.PublicKey(process.env.REACT_APP_HOUSE_ADDR),
            lamports: parseInt(amount),
          })
        );
        try {
          transaction.recentBlockhash = (
            await connection.getRecentBlockhash("max")
          ).blockhash;
          transaction.feePayer = publicKey;
          let signedTx
          await signTransaction(transaction)
            .then((res) => { signedTx = res })
            .catch((err) => {
              console.log(err)
              setAlerts({
                type: "error",
                content: "Transaction not approved - Are ye scared?"
              })
              return false;
            });
          const t1 = solanaWeb3.Transaction.from(signedTx.serialize());
          let stringfyTx = JSON.stringify(t1.serialize());
          setLoading(true);
          const body = {
            type: "Deposit",
            walletAddress: publicKey.toBase58(),
            depositAmount,
            signedTx: stringfyTx,
            num: num
          };
          res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/play/depositNugget`,
            body
          );
          const bal = await connection.getBalance(publicKey);
          setSolAmount(bal / solanaWeb3.LAMPORTS_PER_SOL);
          setLoading(false);
          if (res.data.status === "success") {
            setAlerts({
              type: "success",
              content: "Deposit Success - Goodluck Matey!"
            });
            setNugAmount(res.data.content.toFixed(3));
            // return true;
          } else {
            setAlerts({
              type: "error",
              content: res.data.content
            })
            // return false;
          }
        } catch (err) {
          console.log("Error while getting balance", err);
          setAlerts({ type: "error", content: "Transaction not approved - Are ye scared?" })
          setLoading(false);
        }
      } else {
        if (parseFloat(process.env.REACT_APP_NUGGET_RATIO) * parseFloat(depositAmount) < parseFloat(nugAmount) && parseFloat(depositAmount) > 0) {
          setLoading(true);
          let body = {
            type: "Withdraw",
            walletAddress: publicKey.toBase58(),
            amount: depositAmount,
          };
          let data = false;
          data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/play/withdrawFundstart`, body)
          // num = await getNum(data, factor1, factor2, factor3, factor4)
          if (data) {
            body = {
              type: "Withdraw",
              walletAddress: publicKey.toBase58(),
              amount: depositAmount,
              num: num
            };
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/play/withdrawFunds`, body)
            if (res.data.status === "error") {
              setAlerts({
                type: "error",
                content: res.data.content
              })
              setLoading(false);
            } else {
              setLoading(false);
              setNugAmount(parseFloat(res.data.content).toFixed(3))
              const bal = await connection.getBalance(publicKey);
              setSolAmount(bal / solanaWeb3.LAMPORTS_PER_SOL);
            }
          }
        } else {
          setAlerts({
            type: "error",
            content: "Insufficient SOL"
          });
        }
      }
      getTransactionHistory();
      handleWalletModalClose();
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

// connect Metamask wallet
  const onClickConnect = async () => {
    let res = await ContractUtils.connectWallet();
    if (res.address) {
      setShowToast(true);
      setAddress(res.address);
      window.localStorage.setItem('walletLocalStorageKey', res.address);
      global.setWalletConnected(true);
      global.setWalletAddress(res.address);
    }
    else {
      setShowToast(true);
      setAddress("");
    }
  }
// disconnect Metamask wallet
  const onClickDisconnect = async () => {
    await ContractUtils.disconnectWallet();
    await window.localStorage.removeItem('walletLocalStorageKey');
    setShowToast(false);
    setAddress("");
    global.setWalletConnected(false);
    global.setWalletAddress('');
}

  const changeWalletMode = (mode) => {
    if (loading) return
    setFocused(!focused);
    setWalletMode(mode);
    setDepositAmount(0);
  }
  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const onClickProfile = () => {
    if (!global.walletConnected) {
      setConnectWalletModalOpen(true);
      return;
    }
    setProfileModalOpen(true);
  };

  const handleConnectWalletModalClose = () => {
    setConnectWalletModalOpen(false);
  };

  const handleSaveUser = () => {
    setUserName(suserName);
    saveUserName();
    setProfileModalOpen(false);
  };

  const handleNameChange = (e) => {
    setSUserName(e.target.value);
  };

  const saveUserName = async () => {
    const body = {
      walletAddress: publicKey.toBase58(),
      userName: suserName,
    };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/user/saveUser`, body)
      .then((res) => { })
      .catch((err) => {
        console.log("Error while saving user", err);
        setAlerts({ type: "error", content: err.message });
      });
  };

  const displayNFTs = async () => {

    setDepositModal(true);
    setAvatarLoading(true);
    let nftDatas
    nftDatas = await getAllNftData();
    let tempData = [];
    nftDatas.forEach((data) => {
      if (data.data.symbol && data.data.symbol === "Nuggets") {
        tempData.push(data);
      }
    })
    setNftData(tempData);
    const arr = [];
    let n = tempData.length;
    for (let i = 0; i < n; i++) {
      let val = await axios.get(tempData[i].data.uri);
      arr.push(val);
    }
    setNftAvatars(arr);
    setAvatarLoading(false);
  }

  const onClickChangeAvatar = async () => {
    setAvatarModalOpen(true);
    setAvatarLoading(true);
    let nftDatas
    nftDatas = await getAllNftData();
    const arr = [];
    let n = nftDatas.length;
    for (let i = 0; i < n; i++) {
      try {
        let val = await axios.get(nftDatas[i].data.uri);
        if (val) {
          arr.push(val);
        }
      } catch (err) {
        console.log("err on storage link", err)
        continue;
      }
    }
    setNftData(nftDatas);
    setNftAvatars(arr);
    setAvatarLoading(false);
  };

  const getAllNftData = async () => {
    try {
      const connect = new solanaWeb3.Connection(
        process.env.REACT_APP_QUICK_NODE
      );
      let ownerToken = publicKey;
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
        serialization: true,
      });
      let tempData = Object.keys(nfts).map((key) => nfts[key]);
      let data = [];
      tempData.forEach((tData) => {
        data.push(tData);
      })
      setNftData(data);
      return data
    } catch (error) {
      console.log("Error while getting nft data.", error);
      setAlerts({ type: "error", content: error.message });
    }
  };

  const onClickAvatar = (key) => {
    setAvatarSelected(key);
  };

  const avatars = nftAvatars.map((item, key) => {
    return (
      <>
        <Grid key={key}>
          <img
            alt="avatars"
            className={
              avatarSelected === key ? "avatar-image active" : "avatar-image"
            }
            src={item.data.image}
            onClick={() => onClickAvatar(key)}
          />
        </Grid>
      </>
    );
  });
  const tHistory = gameTHistory.map((th, key) => {
    return (
      <Grid className="gameTHistory" key={key}>
        <Box className="key">{key + 1}</Box>
        <Box className={th.type}>{th.type}</Box>
        <Box className="amount">{parseFloat(th.amount).toFixed(3)}</Box>
        <Box className="date">{String(th.date).slice(0, 10)}</Box>

      </Grid>
    )
  });

  const onClickCloseAvatarSelectModal = () => {
    setAvatarModalOpen(false);
  };

  const onClickSelectAvatar = () => {
    if (avatarSelected === -1) return;
    setNftAvatar(nftAvatars[avatarSelected].data.image);
    const body = {
      walletAddress: publicKey,
      avatarURL: nftAvatars[avatarSelected].data.image,
    };
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/setAvatar`, body);
    setAvatarModalOpen(false);
    setAvatarSelected(-1)
  };

  const depositNow = async () => {
    if (avatarSelected === -1) {
      setAlerts({
        type: "error",
        content: "Please select NFT"
      })
      return;
    }

    const mintPublicKey = new solanaWeb3.PublicKey(nftData[avatarSelected].mint);// mint is the Mint address found in the NFT metadata
    const ownerPublicKey = publicKey;
    const destPublicKey = new solanaWeb3.PublicKey(process.env.REACT_APP_HOUSE_ADDR);

    const mintToken = new Token(
      connection,
      mintPublicKey,
      TOKEN_PROGRAM_ID,
      ownerPublicKey
    );

    // GET SOURCE ASSOCIATED ACCOUNT
    const associatedSourceTokenAddr = await Token.getAssociatedTokenAddress(
      mintToken.associatedProgramId,
      mintToken.programId,
      mintPublicKey,
      ownerPublicKey
    );

    // GET DESTINATION ASSOCIATED ACCOUNT
    const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
      mintToken.associatedProgramId,
      mintToken.programId,
      mintPublicKey,
      destPublicKey
    );

    const receiverAccount = await connection.getAccountInfo(
      associatedDestinationTokenAddr
    );

    const instructions = [];

    if (receiverAccount === null) {
      instructions.push(
        Token.createAssociatedTokenAccountInstruction(
          mintToken.associatedProgramId,
          mintToken.programId,
          mintPublicKey,
          associatedDestinationTokenAddr,
          destPublicKey,
          ownerPublicKey
        )
      );
    }

    instructions.push(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        associatedSourceTokenAddr,
        associatedDestinationTokenAddr,
        ownerPublicKey,
        [],
        1
      )
    );

    // This transaction is sending the tokens
    let transaction = new solanaWeb3.Transaction();
    for (let i = 0; i < instructions.length; i++) {
      transaction.add(instructions[i]);
    }
    let signedTx;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("max")
    ).blockhash;
    transaction.feePayer = publicKey;
    await signTransaction(transaction)
      .then((res) => { signedTx = res })
      .catch((err) => {
        console.log("error", err)
        setAlerts({
          type: "error",
          content: "Transaction not approved - Are ye scared?"
        })
        return false;
      })
    const t1 = solanaWeb3.Transaction.from(signedTx.serialize());
    let stringfyTx = JSON.stringify(t1.serialize());

    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      setDepositModal(false)
      setAvatarSelected(-1)
      setLoading(true);
      const body = {
        walletAddress: publicKey.toBase58(),
        signedTx: stringfyTx,
        nugValue: nftData[avatarSelected],
        num: num
      };
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/play/NFTDeposit`, body);
      setLoading(false);
      if (res.data.status !== "error") {
        setAlerts({
          type: "success",
          content: "Deposit NFT Succeed - Goodluck Mate!"
        });
        setBonusNugAmount(parseFloat(res.data.content).toFixed(3));
      } else {
        setAlerts({
          type: "error",
          content: res.data.content
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
    setWalletModal(false);
  }

  const showOptions = () => {
    if (gameState) return
    setShowOption(!showOption);
  }

  const navbarItemClass = () =>
    themeBlack ? "navbar-item-black" : "navbar-item";

  const raffleModalOpen = () => {
    setRaffleModal(true);
    setTimeout(() => {
      const DescShow = document.getElementById("description");
      if (DescShow) {
        DescShow.innerHTML = description;
      }
    }, 0)
  }

  raffleHeight = document.getElementById("navbar")?.offsetHeight + 10;
  if (!raffleHeight) raffleHeight = 0;

  useEffect(() => {
    function handleResize() {
      const size = document.getElementById("navbar")?.offsetHeight;
      setHeight(size)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  return (
    <Grid className="header" style={{ marginBottom: raffleHeight }}>
      <Box className="navbar" id="navbar" style={{ width: matchUpSm && "90%" }}>
        {matchUpSm &&
          <Box
            className="navlinks navbar-group"
            sx={{
              width: matchUpSm ? "initial" : "100%",
              justifyContent: matchUpSm ? "center" : "space-around!important",
            }}
          >
            <a href="#Recent" className="recent-link">
              <Button className={navbarItemClass()}>RECENT</Button>
            </a>

            <img
              alt="coin"
              className="balance-image"
              src={nftAvatar === "" ? coin : nftAvatar}
              onClick={onClickProfile}
            />
          </Box>}
        <Box
          className={themeBlack ? "raffleDet navbar-group" : "raffleDet_white navbar-group"}
          sx={{
            justifyContent: matchUpSm ? "center" : "space-between!important"
          }}
          style={{ marginLeft: isDesktop && "60px", width: !matchUpSm && "100%" }}
        >
          <Box style={{ width: "46px" }}>&nbsp;</Box>
          <Box
            className="select"
            style={{ minWidth: isSmall ? "20rem" : "13rem" }}

          >
            <Box className="selectBox" onClick={showOptions}>
              {currencyMode === "mainNug" &&
                <Box value={"mainNug"}  >
                  <Box className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ fontWeight: 600 }}>
                    <Box className="balance">
                      <img className="ethSign" src={eth} alt="ETH" style={{ width: 30, margin: 0 }} />
                      {nugAmount}
                    </Box>
                    <Box className="wallet">
                      <Typography>
                        {matchUpSm ? "ETH" : "WALLET"}
                      </Typography>
                      <ExpandMore />
                    </Box>
                  </Box>
                </Box>
              }
              {currencyMode === "bonusNug" &&
                <Box value={"bonusNug"} >
                  <Box className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ fontWeight: 600 }}>
                    <Box className="balance">
                      <img className="ethereum" src={nug} alt="NUG" />{bonusNugAmount}
                    </Box>
                    <Box className="wallet">
                      <Typography>
                        {matchUpSm ? "NUGGET" : "WALLET"}
                      </Typography>
                      <ExpandMore />
                    </Box>
                  </Box>
                </Box>
              }
              {currencyMode === "gem" &&
                <Box value={"gem"} >
                  <Box className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ fontWeight: 600 }}>
                    <Box className="balance">
                      <img className="ethereum" src={gemImg} alt="GEM" /> &nbsp;{gemAmount}
                    </Box>
                    <Box className="wallet">
                      <Typography>
                        {matchUpSm ? "GEM" : "WALLET"}
                      </Typography>
                      <ExpandMore />
                    </Box>
                  </Box>
                </Box>
              }
            </Box>
            {showOption && <Box
              className="selectOptions"
              style={{ position: !matchUpSm && "inherit" }}
            >
              <Box className="selectOption" style={{ top: !matchUpSm && 70, left: !matchUpSm && 20, right: !matchUpSm && 20 }}>
                <Box onClick={() => { handleChange("mainNug"); setShowOption(false) }} className="option" >
                  <Box className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ fontWeight: 600 }}>
                    <Box className="balance">
                      <img className="ethereum" src={eth} alt="ETH" style={{ width: 30, margin: 0 }} />
                      {nugAmount}
                    </Box>
                    <Box className="wallet">
                      <Typography>
                        ETH
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box onClick={() => { handleChange("bonusNug"); setShowOption(false) }} className="option">
                  <Box className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ fontWeight: 600 }}>
                    <Box className="balance">
                      <img className="ethereum" src={nug} alt="NUG" />{bonusNugAmount}
                    </Box>
                    <Box className="wallet">
                      <Typography color="#ec4f5b">
                        NUGGET
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box onClick={() => { handleChange("gem"); setShowOption(false) }} className="option" >
                  <Box className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ fontWeight: 600 }}>
                    <Box className="balance">
                      <img className="ethereum" src={gemImg} alt="GEM" style={{ width: 30, margin: 0 }} />&nbsp;
                      {gemAmount}
                    </Box>
                    <Box className="wallet">
                      <Typography>
                        GEM
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box style={{}}>
                   {!matchUpSm && address? 
                    <Button onClick={onClickDisconnect} id="walletIcon" className={navbarItemClass()} style={{ width: "100%", marginLeft: 0, padding: 0 }}>
                      <span>{address.substr(0, 4)}...{address.slice(38)}</span>
                    </Button>: 
                      <Button onClick={onClickConnect} id="walletIcon" className={navbarItemClass()} style={{ width: "100%", marginLeft: 0, padding: 0 }}>
                        <span>WALLET</span>
                    </Button>
                  }
                </Box>
              </Box>
            </Box>}
          </Box>
          {matchUpSm && address? 
            <Button onClick={onClickDisconnect} id="walletIcon" className={navbarItemClass()} style={{ mineWidth: "5rem" }}>
              <span>{address.substr(0, 4)}...{address.slice(38)}</span>
            </Button>: 
              <Button onClick={onClickConnect} id="walletIcon" className={navbarItemClass()} style={{ mineWidth: "5rem" }}>
                <span>WALLET</span>
            </Button>
          }
        </Box>

        {isSmall && (
          <Box
            className="control-options navbar-group"
            sx={{ display: { ms: "none", md: "block" } }}
            style={{ marginLeft: 40 }}
          >
            {raffleMode &&
              <Button className={navbarItemClass()} onClick={raffleModalOpen}>
                Join the Weekly Raffle
              </Button>}
          </Box>
        )}
      </Box>
      {raffleMode && window.location.href.includes("game/") && <Box className="raffles" style={{ position: matchUpSm ? "absolute" : "relative", top: raffleHeight }}>
        <span className={themeBlack ? "sol-balance-black" : "sol-balance"} style={{ flexDirection: matchUpSm ? "column" : "row-reverse", alignItems: matchUpSm ? "flex-end" : "center", marginRight: matchUpSm && "3vw" }}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            {global.walletConnected ? raffles : 0}x
            <img className="ethereum" src={raffleImg} style={{ width: "40px" }} alt="Tickets" />
          </Box>
          <Box style={{ display: "flex", flexWrap: "nowrap" }}>
            {images}
          </Box>
          {timer !== 0 && matchUpSm && <Box className="timer">
            {timer}
          </Box>}
          {!matchUpSm && <span style={{ width: "66px" }}></span>}
        </span>
      </Box>}
      <Modal
        open={gameOverModalOpen}
        onClose={handleGameOverModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={styleFair} style={{ backgroundColor: "#101112" }}>
          <Typography
            variant="h3"
            component="h2"
            color="#F7BE44"
            fontSize="40px"
            fontFamily="Mada"
            marginTop="20px"
          >
            Fair
          </Typography>
          <img className="rectangle-image" alt="line" src={rectangleImage} />
          <Grid container style={{ textAlign: "center" }}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Typography color="#fff" fontSize="18px" fontFamily="Mada">
                Playing on the website is secure. The fairness of all bets is
                unquestionable since we use cryptography to make sure every bet
                is transparently fair and can be checked.
              </Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={12}>
              <img className="yellow-image" alt="yLine" src={yellowrectangle} />
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={raffleModal}
        onClose={() => setRaffleModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={styleFair} className="howTo" style={{
          width: (isDesktop ? "35%" : "50%")
        }}>
          <Typography
            variant="h3"
            component="h2"
            color="#F7BE44"
            fontSize="32px"
            fontFamily="Mada"
            marginTop="20px"
          >
            The Weekly Raffle
          </Typography>
          {raffleDescription ?
            <Grid container style={{ textAlign: "left" }} className="description">
              <Grid id="description">
              </Grid>
              <button onClick={() => setRaffleModal(false)}>GOT IT</button>
            </Grid> :
            <Grid container style={{ textAlign: "left" }}>
              <Box className="winnerTable">
                {winnerList?.length ? winners : "No winners yet"}
              </Box>
            </Grid>
          }
        </Box>
      </Modal>
      <Modal
        open={profileModalOpen}
        onClose={handleProfileModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className="header-profile-box"
          sx={profileModal}
          style={
            themeBlack
              ? { backgroundColor: "#101112" }
              : { backgroundColor: "#fff" }
          }
        >
          <Typography
            variant="h3"
            component="h2"
            color="#F7BE44"
            fontSize="28px"
            fontFamily="Mada"
            marginTop="20px"
            paddingTop="10px"
          >
            USER PROFILE
          </Typography>
          <Grid>
            <img
              alt="avatar"
              className="balance-image-profile"
              src={nftAvatar === "" ? coin : nftAvatar}
              onClick={onClickProfile}
            />
          </Grid>
          <Grid style={{ padding: "10px 50px" }}>
            <Button className="btn-change-avatar" onClick={onClickChangeAvatar}>
              Change Avatar
            </Button>
          </Grid>
          <Grid style={{ padding: "10px" }}>
            <input
              style={{
                width: "88%",
                height: "40px",
                borderRadius: "5px",
                fontSize: "17px",
                borderColor: "#101112",
                outlineColor: "#F7BE44",
                textAlign: "center",
                opacity: "80%",
                fontFamily: "Mada"
              }}
              value={suserName}
              maxLength="14"
              onChange={handleNameChange}
            />
          </Grid>
          <Grid style={{ padding: "10px", background: themeBlack ? "#060606a8" : "rgb(185 185 185 / 66%)" }} className="saveBtn">
            <Button className="btn-change-avatar" onClick={handleSaveUser}>
              Save
            </Button>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={avatarModalOpen}
        onClose={handleAvatarModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className="header-profile-box"
          sx={avatarModal}
          style={
            themeBlack
              ? { backgroundColor: "#101112" }
              : { backgroundColor: "#fff" }
          }
        >
          <Typography
            variant="h3"
            component="h2"
            color="#F7BE44"
            fontSize="40px"
            fontFamily="Mada"
            marginTop="30px"
          >
            Select Avatar
          </Typography>
          {avatarLoading ?
            <Box className="avatar-view">
              <img src={cashLoader} style={{ width: "100px", position: "relative", top: "25px" }} alt="Loading..." />
            </Box> :
            <div className="avatar-view">{avatars}</div>
          }
          <Typography
            color="white"
            fontSize="15px"
            fontFamily="Mada"
          >
            Your NFTs will load here
          </Typography>
          <Grid style={{ marginBottom: "10px" }}>
            <Button className="btn-change-avatar" onClick={onClickSelectAvatar}>
              Select Avatar
            </Button>
          </Grid>
          <Grid style={{ margin: "0px" }}>
            <Button
              className="btn-change-avatar"
              onClick={onClickCloseAvatarSelectModal}
            >
              Cancel
            </Button>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={depositModal}
        onClose={() => setDepositModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className="header-profile-box"
          sx={avatarModal}
          style={
            themeBlack
              ? { backgroundColor: "#101112", height: "450px" }
              : { backgroundColor: "#fff", height: "450px" }
          }
        >

          <Box>
            <Typography
              variant="h3"
              component="h2"
              color="#F7BE44"
              fontSize="40px"
              fontFamily="Mada"
              marginTop="20px"
            >
              Select NFTs
            </Typography>
            <Typography
              color="white"
              fontSize="15px"
              fontFamily="Mada"
            >
              Nugget NFTs can take up to 20 seconds to load please wait.
            </Typography>
            {avatarLoading ?
              <Box className="avatar-view">
                <img src={cashLoader} style={{ width: "60px", position: "relative", top: "40px" }} alt="Loading..." />
              </Box> :
              <div className="avatar-view">{avatars}</div>
            }
            <Typography
              color="white"
              fontSize="15px"
              fontFamily="Mada"
            >
              Your ArbiCasino Nugget NFTs will load here.
            </Typography>
            <Typography
              color="white"
              fontSize="15px"
              fontFamily="Mada"
            >
              Please note this is only for Nuggets not for MinesRush NFTs.
            </Typography>
            <Grid style={{ marginBottom: "10px" }}>
              <Button className="btn-change-avatar" onClick={depositNow}>
                Deposit
              </Button>
            </Grid>
            <Grid style={{ margin: "0px" }}>
              <Button
                className="btn-change-avatar"
                onClick={() => setDepositModal(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={connectWalletModalOpen}
        onClose={handleConnectWalletModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title" style={{ textTransform: "uppercase" }}>
            Please connect your Wallet
          </h2>
        </Box>
      </Modal>
      <Modal
        open={walletModal}
        onClose={handleWalletModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} className="walletModal">
          <Box className="walletNavGroup">
            <Button onClick={() => changeWalletMode("deposit")} className={walletMode === "deposit" ? "walletNavFocused" : "walletNav"} style={{ color: themeBlack ? "white" : "black" }}>DEPOSIT</Button>
            <Button onClick={() => changeWalletMode("withdraw")} className={walletMode === "withdraw" ? "walletNavFocused" : "walletNav"} style={{ color: themeBlack ? "white" : "black" }}>WITHDRAW</Button>
            <Button onClick={() => changeWalletMode("history")} className={walletMode === "history" ? "walletNavFocused" : "walletNav"} style={{ color: themeBlack ? "white" : "black" }}>HISTORY</Button>
          </Box>
          {walletMode === "deposit" && (!loading ?
            <Box className="walletAction">
              <Typography fontSize="15px" textAlign="left" fontFamily="Mada" className="balance" >(SOL Balance:&nbsp;
                <img src={eth} alt="SOL" style={{ width: "20px", height: "20px" }} />
                {solAmount.toFixed(3)})
              </Typography>
              <Box className="walletForm">
                <input onChange={depositHandler} value={depositAmount} />
                <Button className="walletActionButton" onClick={walletAction}>Deposit</Button>
              </Box>
            </Box> :
            <Box>
              <img src={cashLoader} style={{ width: "50px", marginTop: "10px" }} alt="Loading..." />
              <Typography color="white" fontSize="15px" fontFamily="Mada">
                Waiting for deposit...
              </Typography>
            </Box>)}
          {walletMode === "withdraw" && (!loading ?
            <Box className="walletAction">
              <Typography fontSize="15px" textAlign="left" fontFamily="Mada" className="balance" style={{ textTransform: "uppercase" }} >(SOL Balance:&nbsp;
                <img src={eth} alt="SOL" style={{ width: "20px", height: "20px" }} />
                {parseFloat(nugAmount / process.env.REACT_APP_NUGGET_RATIO).toFixed(3)})
              </Typography>
              <Box className="walletForm">
                <input onChange={withdrawHandler} value={depositAmount} />
                <Button className="walletActionButton" onClick={walletAction}>Withdraw</Button>
              </Box>
              <Typography fontSize="15px" textAlign="center" fontFamily="Mada" style={{ marginTop: "10px", textTransform: "uppercase" }}>
                You may need to leave 1-2% of your SOLs in your wallet to cover SOL transaction fees.
              </Typography>
            </Box> :
            <Box>
              <img src={cashLoader} style={{ width: "50px", marginTop: "10px" }} alt="Loading..." />
              <Typography color="white" fontSize="15px" fontFamily="Mada">
                Waiting for withdraw...
              </Typography>
            </Box>)
          }
          {walletMode === "history" &&
            (gameTHistory.length !== 0 ?
              tHistory :
              <Box className="noResult" style={{ backgroundImage: `url(${historyBackground})` }}>
                <Box className="text">NO RESULTS FOUND</Box>
              </Box>)
          }
        </Box>
      </Modal>
    </Grid>
  );
  
        }

const styleFair = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "270px",
  height: "316px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  padding: "0px",
};

const profileModal = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "320px",
  height: "400px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  p: 4,
  padding: "0px",
};

const avatarModal = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "270px",
  height: "350px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  p: 4,
  padding: "10px",
};

export default Header;
