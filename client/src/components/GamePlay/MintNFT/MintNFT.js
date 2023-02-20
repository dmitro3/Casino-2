import axios from "axios";
import { Button, Box, Typography, Grid, LinearProgress, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as solanaWeb3 from "@solana/web3.js";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import cashLoader from "../../../assets/images/frog.gif";
import solImg from "../../../assets/images/sol.png";
import OGPirate from "../../../assets/images/nftMint.gif";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import useGameStore from "../../../GameStore";
import getNum from "../Tools/Calculate";

import "./MintNFT.scss"
import { FiberManualRecord } from "@mui/icons-material";
import { useCallback } from "react";
import { useReducer } from "react";

const MintNFTsComponent = () => {

  const [pageLoading, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'loading':
        return false;
      default:
        return true
    }
  }, 0)
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();

  const { alerts, setAlerts } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [loading, setLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [remainedNFT, setRemainedNFT] = useState(0);
  const [remainedTime, setRemainedTime] = useState(0);
  const [timer, setTimer] = useState();
  const [solAmount, setSolAmount] = useState(0);
  const [phase, setPhase] = useState(0);
  let NFTCost = 0.001;

  let count = false;
  let remain = 0;

  useEffect(() => {
    getBalance();
  }, [connected])

  const getBalance = async () => {
    if (publicKey) {
      let balance = await connection.getBalance(publicKey);
      balance = balance / solanaWeb3.LAMPORTS_PER_SOL;
      setSolAmount(balance);
    }
  }

  const getRemainedNFT = useCallback(async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/play/getRemainedNFT`);
    setRemainedNFT(res.data.remainedNFT);
  }, [])
  const getRemaining = useCallback(async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/play/getRemaining`);
    setRemainedNFT(res.data.remainedNFT);
    setRemainedTime(res.data.remainedTime);
    setPhase(res.data.phase);
    const datas = res.data.remainedTime;
    let remain = datas;
    let interval
    if (datas !== 0) {
      interval = setInterval(() => {
        // count = true;
        remain--;
        let hour = formatter(parseInt(remain / 60 / 60));
        let mins = formatter(parseInt((remain - 60 * 60 * hour) / 60));
        let secs = formatter(parseInt((remain - 60 * 60 * hour - 60 * mins)));

        if (remain >= 0) {
          // setTimer(`${date}: ${hour}: ${mins}: ${secs}`)
          setTimer(
            <Box className="timer">
              <Box className="timeCard">
                <Typography className="num">{hour}</Typography>
                <Typography className="clock">hrs</Typography>
              </Box>
              <Box className="timeCard">
                <Typography className="num">{mins}</Typography>
                <Typography className="clock">mins</Typography>
              </Box>
              <Box className="timeCard">
                <Typography className="num">{secs}</Typography>
                <Typography className="clock">secs</Typography>
              </Box>
            </Box>
          )
        }
      }, 1000)
      setTimeout(() => {
        clearInterval(interval)
        getRemaining();
      }, datas * 1000)
    }
    const formatter = (d) => {
      if (d < 10)
        d = "0" + d;
      return d;
    }
  }, [])

  useEffect(() => {
    getRemaining();
  }, [getRemaining])

  const mintNow = async () => {
    let res;
    if (NFTCost >= solAmount) {
      setAlerts({
        type: "error",
        content: "Insufficient Funds"
      })
      return;
    }
    setLoading(true);
    setMintLoading(true);
    let amount = solanaWeb3.LAMPORTS_PER_SOL * NFTCost;
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new solanaWeb3.PublicKey(process.env.REACT_APP_CREATOR_ADDR),
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
      const body = {
        walletAddress: publicKey.toBase58(),
        depositAmount: NFTCost,
        signedTx: stringfyTx,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/play/mintNFTs`, body);
      setMintLoading(false);
      setLoading(false);
      await getRemainedNFT();
      const bal = await connection.getBalance(publicKey);
      setSolAmount(bal / solanaWeb3.LAMPORTS_PER_SOL);
      if (res.data.status === "success") {
        setAlerts({
          type: "success",
          content: "Mint NFT Succeed - Goodluck Matey!"
        });
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
      setMintLoading(false);
      setLoading(false)
    }
  }

  return (
    <Grid className="mintNFTs">
      {loading &&
        <Box className="loading">
          <CircularProgress />
        </Box>
      }
      <Box className="alert">
        {alerts.content && <Box className={alerts.type}>{alerts.content.toString()}</Box>}
      </Box>
      <Box className="header">
        {connected ?
          <WalletDisconnectButton
            style={{ textTransform: "uppercase" }}
            className="walletButton"
          />
          :
          <WalletMultiButton
            style={{ textTransform: "uppercase" }}
            className="walletButton"
          />
        }
      </Box>
      <Grid container>
        <Grid item xs={0} sm={2} md={3} lg={4} />
        <Grid item xs={12} sm={8} md={6} lg={4} className="pirateNFTs">
          <Typography className="title">
            PirateRush NFT
          </Typography>
          <Typography className="subtitile" color="white">
            Mint your Pirates and Sail the Seven Seas of Solana with the PirateRush crew.
          </Typography>
          <Box className="content">
            {/* {
            connected ?
              (nftLoading ?
                <Box style={{ display: "flex", alignItems: "center", flexWrap: "wrap", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
                  <img src={cashLoader} style={{ width: 50 }} alt="Loading..." />
                  <Typography color="white" fontSize="20px" style={{ marginTop: 20 }}>Loading...</Typography>
                </Box> :
                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                  <Typography color="white">No Pirate NFTs In Your Wallet</Typography>
                </Box>
              ) : */}
            <img src={OGPirate} alt="OGPirate" style={{ display: "flex", flexWrap: "wrap", alignContent: "center" }} />
            {/* } */}
          </Box>
          {/* <Typography fontSize="16px" color="white">
          Your PirateRush NFTs will load here.
        </Typography> */}
          <Box className="buttons">
            <Box className="mintButton">
              {/* {loading ?
                <Box style={{ display: "flex", alignItems: "center", flexWrap: "wrap", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
                  <img src={cashLoader} style={{ width: 50 }} alt="Loading..." />
                  <Typography color="white" fontSize="20px" style={{ marginTop: 20 }}>Loading...</Typography>
                </Box> : */}
              <Box>
                <Box className="top">
                  <Box className="left">
                    <Box className="remain">
                      <Typography fontSize="15px">Remaining</Typography>
                      <Typography fontWeight="bold" fontSize="20px">{connected ? remainedNFT : 0}/3500</Typography>
                    </Box>
                    <Box className="remain">
                      <Typography fontSize="15px">Price</Typography>
                      <Box style={{ display: "flex", alignItems: "center" }}>
                        <img src={solImg} alt="SOL" />
                        <Typography fontWeight="bold" fontSize="20px">{NFTCost}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  {phase !== 3 &&
                    <Box className="timerBox">
                      {timer}
                      <Typography className="until">
                        {
                          phase === 1 ?
                            "UNTIL WHITELIST2 MINT" :
                            "UNTIL PUBLIC MINT"
                        }
                      </Typography>
                    </Box>
                  }
                </Box>
                <LinearProgress variant="determinate" value={100 * (3500 - remainedNFT) / 3500} />
                {connected ?
                  <Box>
                    <button onClick={mintNow}>
                      {
                        phase === 1 ?
                          "WHITELIST1 MINT" :
                          (
                            phase === 2 ?
                              "WHITELIST2 MINT" :
                              "PUBLIC MINT"
                          )
                      }
                    </button>
                    <WalletDisconnectButton
                      style={{ textTransform: "uppercase" }}
                      className="walletButton"
                    />
                  </Box> :
                  <WalletMultiButton
                    style={{ textTransform: "uppercase" }}
                    className="walletButton"
                  />
                }
              </Box>
              {/* } */}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container style={{display: "flex", flexDirection: "column"}}>
        {/* <Grid item xs={0} sm={2} md={3} lg={4} /> */}
        <Grid className="container">
          <Grid className="videoContainer">
            <iframe
              src={`https://youtube.com/embed/PRuMCZTavhM?autoplay=0`}
              title="PirateRush"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder='0'
            />
          </Grid>
          {/* <Grid className="desc">
            <Box className="line">
              <FiberManualRecord fontSize="small" />
              <Typography>We have already built 3 custom games(Mines, Pirate Coins, Pirte Loot)</Typography>
            </Box>
            <Box className="line">
              <FiberManualRecord fontSize="small" />
              <Typography>We have been self funding since the beginning</Typography>
            </Box>
            <Box className="line">
              <FiberManualRecord fontSize="small" />
              <Typography>We will launch a beta version of turtles shortly after mint to holders</Typography>
            </Box>
            <Box className="line">
              <FiberManualRecord fontSize="small" />
              <Typography>We are designing a wheel game that will award bluechip NFTs, SOLs, etc.</Typography>
            </Box>
            <Box className="line">
              <FiberManualRecord fontSize="small" />
              <Typography>We will be launching staking where you can earn free spins + daily wheel + bluechip wheel.</Typography>
            </Box>
            <Box className="line">
              <FiberManualRecord fontSize="small" />
              <Typography>Holders earn passive income from the transaction fees and casino proceeds.</Typography>
            </Box>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MintNFTsComponent

// import axios from "axios";
// import { Button, Box, Typography, Grid } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import * as solanaWeb3 from "@solana/web3.js";
// import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import {
//   Token,
//   TOKEN_PROGRAM_ID,
// } from "@solana/spl-token";

// import cashLoader from "../../../assets/images/frog.gif";
// import solImg from "../../../assets/images/sol.png";
// import OGPirate from "../../../assets/images/OGPirate.jpg";
// import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
// import useGameStore from "../../../GameStore";
// import getNum from "../Tools/Calculate";

// import "./MintNFT.scss"
// import { FiberManualRecord } from "@mui/icons-material";
// import { useCallback } from "react";
// import { useReducer } from "react";

// const MintNFTsComponent = () => {

//   const [pageLoading, dispatch] = useReducer((state, action) => {
//     switch (action.type) {
//       case 'loading':
//         return false;
//       default:
//         return true
//     }
//   }, 0)
//   const { publicKey, connected, signTransaction } = useWallet();
//   const { connection } = useConnection();

//   const { alerts, setAlerts } = useGameStore();
//   const { number, setNumber } = useGameStore();
//   const { factor1, factor2, factor3, factor4 } = useGameStore();

//   const [loading, setLoading] = useState(false);
//   const [remainedNFT, setRemainedNFT] = useState(0);
//   const [remainedTime, setRemainedTime] = useState(0);
//   const [timer, setTimer] = useState();
//   const [solAmount, setSolAmount] = useState(0);
//   let NFTCost = 0.0001;

//   let count = false;
//   let remain = 0;

//   useEffect(() => {
//     getBalance();
//   }, [connected])

//   const getBalance = async () => {
//     if (publicKey) {
//       let balance = await connection.getBalance(publicKey);
//       balance = balance / solanaWeb3.LAMPORTS_PER_SOL;
//       setSolAmount(balance);
//     }
//   }

//   const getRemaining = useCallback(async () => {
//     const res = await axios.get(
//       `${process.env.REACT_APP_BACKEND_URL}/api/play/getRemaining`);
//     setRemainedNFT(res.data.remainedNFT);
//     setRemainedTime(res.data.remainedTime);
//     const datas = res.data.remainedTime;
//     let remain = datas;
//     console.log("datas", datas)
//     let interval
//     if (datas !== 0) {
//       interval = setInterval(() => {
//         // count = true;
//         remain--;
//         let hour = formatter(parseInt(remain / 60 / 60));
//         let mins = formatter(parseInt((remain - 60 * 60 * hour) / 60));
//         let secs = formatter(parseInt((remain - 60 * 60 * hour - 60 * mins)));

//         console.log("remain", remain)

//         if (remain >= 0) {
//           // setTimer(`${date}: ${hour}: ${mins}: ${secs}`)
//           setTimer(
//             <Box className="timer">
//               <Box className="timeCard">
//                 <Typography className="num">{hour}</Typography>
//                 <Typography className="clock">hrs</Typography>
//               </Box>
//               <Box className="timeCard">
//                 <Typography className="num">{mins}</Typography>
//                 <Typography className="clock">mins</Typography>
//               </Box>
//               <Box className="timeCard">
//                 <Typography className="num">{secs}</Typography>
//                 <Typography className="clock">secs</Typography>
//               </Box>
//             </Box>
//           )
//         }
//       }, 1000)
//       setTimeout(() => {
//         console.log("clear")
//         clearInterval(interval)
//       }, datas*1000)
//     }
//     const formatter = (d) => {
//       if (d < 10)
//         d = "0" + d;
//       return d;
//     }
//   }, [])

//   useEffect(() => {
//     getRemaining();
//   }, [getRemaining])

//   const mintNow = async () => {
//     let res;
//     if (NFTCost >= solAmount) {
//       setAlerts({
//         type: "error",
//         content: "Insufficient Funds"
//       })
//       return;
//     }
//     let amount = solanaWeb3.LAMPORTS_PER_SOL * NFTCost;
//     const transaction = new solanaWeb3.Transaction().add(
//       solanaWeb3.SystemProgram.transfer({
//         fromPubkey: publicKey,
//         toPubkey: new solanaWeb3.PublicKey(process.env.REACT_APP_CREATOR_ADDR),
//         lamports: parseInt(amount),
//       })
//     );
//     try {
//       transaction.recentBlockhash = (
//         await connection.getRecentBlockhash("max")
//       ).blockhash;
//       transaction.feePayer = publicKey;
//       let signedTx
//       await signTransaction(transaction)
//         .then((res) => { signedTx = res })
//         .catch((err) => {
//           console.log(err)
//           setAlerts({
//             type: "error",
//             content: "Transaction not approved - Are ye scared?"
//           })
//           return false;
//         });
//       const t1 = solanaWeb3.Transaction.from(signedTx.serialize());
//       let stringfyTx = JSON.stringify(t1.serialize());
//       setLoading(true);
//       const body = {
//         type: "NFTMintDeposit",
//         walletAddress: publicKey,
//         depositAmount: NFTCost,
//         signedTx: stringfyTx,
//       };
//       res = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/api/play/NFTMint`,
//         body
//       );
//       const bal = await connection.getBalance(publicKey);
//       setSolAmount(bal / solanaWeb3.LAMPORTS_PER_SOL);
//       await getRemaining();
//       setLoading(false);
//       if (res.data.status === "success") {
//         setAlerts({
//           type: "success",
//           content: "Mint NFT Succeed - Goodluck Matey!"
//         });
//         // return true;
//       } else {
//         setAlerts({
//           type: "error",
//           content: res.data.content
//         })
//         // return false;
//       }
//     } catch (err) {
//       console.log("Error while getting balance", err);
//       setAlerts({ type: "error", content: "Transaction not approved - Are ye scared?" })
//       setLoading(false);
//     }
//   }

//   return (
//     <Grid className="mintNFTs">
//       <Box className="alert">
//         {alerts.content && <Box className={alerts.type}>{alerts.content.toString()}</Box>}
//       </Box>
//       <Box className="header">
//         {connected ?
//           <WalletDisconnectButton
//             style={{ textTransform: "uppercase" }}
//             className="walletButton"
//           />
//           :
//           <WalletMultiButton
//             style={{ textTransform: "uppercase" }}
//             className="walletButton"
//           />
//         }
//       </Box>
//       <Grid container>
//         <Grid item xs={0} sm={2} md={3} lg={4} />
//         <Grid item xs={12} sm={8} md={6} lg={4} className="pirateNFTs">
//           <Typography className="title">
//             PirateRush NFT
//           </Typography>
//           <Typography className="subtitile" color="white">
//             Mint your Pirates and Sail the Seven Seas of Solana with the PirateRush crew.
//           </Typography>
//           <Box className="content">
//             {/* {
//             connected ?
//               (nftLoading ?
//                 <Box style={{ display: "flex", alignItems: "center", flexWrap: "wrap", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
//                   <img src={cashLoader} style={{ width: 50 }} alt="Loading..." />
//                   <Typography color="white" fontSize="20px" style={{ marginTop: 20 }}>Loading...</Typography>
//                 </Box> :
//                 <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
//                   <Typography color="white">No Pirate NFTs In Your Wallet</Typography>
//                 </Box>
//               ) : */}
//             <img src={OGPirate} alt="OGPirate" style={{ display: "flex", flexWrap: "wrap", alignContent: "center" }} />
//             {/* } */}
//           </Box>
//           {/* <Typography fontSize="16px" color="white">
//           Your PirateRush NFTs will load here.
//         </Typography> */}
//           <Box className="buttons">
//             <Box className="mintButton">
//               {/* {loading ?
//                 <Box style={{ display: "flex", alignItems: "center", flexWrap: "wrap", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
//                   <img src={cashLoader} style={{ width: 50 }} alt="Loading..." />
//                   <Typography color="white" fontSize="20px" style={{ marginTop: 20 }}>Loading...</Typography>
//                 </Box> : */}
//               <Box>
//                 <Box className="top">
//                   <Box className="left">
//                     <Box className="remain">
//                       <Typography fontSize="15px">Remaining</Typography>
//                       <Typography fontWeight="bold" fontSize="20px">{connected ? remainedNFT : 0}/3500</Typography>
//                     </Box>
//                     <Box className="remain">
//                       <Typography fontSize="15px">Price</Typography>
//                       <Box style={{ display: "flex", alignItems: "center" }}>
//                         <img src={solImg} alt="SOL" />
//                         <Typography fontWeight="bold" fontSize="20px">{NFTCost}</Typography>
//                       </Box>
//                     </Box>
//                   </Box>
//                   <Box className="timerBox">
//                     {timer}
//                     <Typography className="until">UNTIL PUBLIC MINT</Typography>
//                   </Box>
//                 </Box>
//                 {connected ?
//                   <Box>
//                     <button onClick={mintNow}>WHITELIST MINT</button>
//                     <WalletDisconnectButton
//                       style={{ textTransform: "uppercase" }}
//                       className="walletButton"
//                     />
//                   </Box> :
//                   <WalletMultiButton
//                     style={{ textTransform: "uppercase" }}
//                     className="walletButton"
//                   />
//                 }
//               </Box>
//               {/* } */}
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//       <Grid container>
//         <Grid item xs={0} sm={0} md={0} lg={1} />
//         <Grid item xs={12} sm={12} md={12} lg={10} className="container">
//           <Grid item xs={12} sm={12} md={4} lg={5} className="videoContainer">
//             <iframe
//               src={`https://youtube.com/embed/PRuMCZTavhM?autoplay=0`}
//               title="PirateRush"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               frameBorder='0'
//             />
//           </Grid>
//           <Grid item xs={12} sm={12} md={8} lg={7} className="desc">
//             <Box className="line">
//               <FiberManualRecord fontSize="small" />
//               <Typography>We have already built 3 custom games(Mines, Pirate Coins, Pirte Loot)</Typography>
//             </Box>
//             <Box className="line">
//               <FiberManualRecord fontSize="small" />
//               <Typography>We have been self funding since the beginning</Typography>
//             </Box>
//             <Box className="line">
//               <FiberManualRecord fontSize="small" />
//               <Typography>We will launch a beta version of turtles shortly after mint to holders</Typography>
//             </Box>
//             <Box className="line">
//               <FiberManualRecord fontSize="small" />
//               <Typography>We are designing a wheel game that will award bluechip NFTs, SOLs, etc.</Typography>
//             </Box>
//             <Box className="line">
//               <FiberManualRecord fontSize="small" />
//               <Typography>We will be launching staking where you can earn free spins + daily wheel + bluechip wheel.</Typography>
//             </Box>
//             <Box className="line">
//               <FiberManualRecord fontSize="small" />
//               <Typography>Holders earn passive income from the transaction fees and casino proceeds.</Typography>
//             </Box>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// }

// export default MintNFTsComponent