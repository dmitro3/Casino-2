import axios from "axios";
import { Button, Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as solanaWeb3 from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import cashLoader from "../../../assets/images/frog.gif";
import OGPirate from "../../../assets/images/OGPirate.jpg";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import useGameStore from "../../../GameStore";
import getNum from "../Tools/Calculate";

import "./PirateDeposit.scss"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const PirateDepositComponent = () => {

  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();

  const { setAlerts } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [nftLoading, setNFTLoading] = useState(false);
  const [nftImgs, setNFTImgs] = useState();
  const [nftData, setNftData] = useState();
  const [nftSelected, setNFTSelected] = useState([]);
  const [totalNum, setTotalNum] = useState(0);


  useEffect(() => {
    getTotalNFTDeposit();
  }, [])

  useEffect(() => {
    displayNFTs()
  }, [connected])

  const getTotalNFTDeposit = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/play/getNFTDeposit`);
    setTotalNum(res.data.totalNum)
  }

  let tempData = [];
  useEffect(() => {
  }, [tempData])
  const displayNFTs = async () => {
    if (connected) {
      setNFTLoading(true);
      let nftDatas
      nftDatas = await getAllNftData();
      nftDatas.forEach((data) => {
        if (data.data.symbol && data.data.symbol === "MIN") {
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
      setNFTImgs(arr);
      setNFTLoading(false);
    }
  }

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

  const pirateImgs = nftImgs?.map((item, key) => {
    return (
      <Grid key={key} style={{ margin: 10 }}>
        <img
          alt="PirateRush"
          src={item.data.image}
          className={
            nftSelected?.includes(key) ? "avatar-image active" : "avatar-image"
          }
          onClick={() => onClickNFT(key)}
        />
      </Grid>
    );
  });

  const onClickNFT = (key) => {
    let datas = [...nftSelected];
    if (datas?.includes(key)) {
      const index = datas.indexOf(key);
      datas.splice(index, 1);
    } else {
      if (nftSelected.length > 5) {
        return
      }
      //  else {
      datas.push(key);
    }
    setNFTSelected(datas);
    // }
  };

  const depositNow = async () => {
    if (nftSelected.length === 0) {
      setAlerts({
        type: "error",
        content: "Please select NFT"
      })
      return;
    }
    let stringfyTx = []
    let instructions = [];
    let transaction
    setNFTLoading(true);
    for (let i = 0; i < nftSelected.length; i++) {
      const mintPublicKey = new solanaWeb3.PublicKey(nftData[nftSelected[i]].mint);// mint is the Mint address found in the NFT metadata
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
      transaction = new solanaWeb3.Transaction();
      for (let i = 0; i < instructions.length; i++) {
        transaction.add(instructions[i]);
      }
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("max")
      ).blockhash;
      transaction.feePayer = publicKey;
    }
    let signedTx;
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
    stringfyTx = JSON.stringify(t1.serialize());
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      let selectedNFT = [];
      for (let i = 0; i < nftSelected.length; i++) {
        selectedNFT.push(nftData[nftSelected[i]]);
      }
      const body = {
        walletAddress: publicKey.toBase58(),
        signedTx: stringfyTx,
        nugValue: selectedNFT,
        num: num
      };
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/play/pirateNFTDeposit`, body);
      setNFTLoading(false);
      // setNumber(res.data.data)
      if (res.data.status !== "error") {
        setAlerts({
          type: "success",
          content: "Deposit NFT Succeed - Goodluck Mate!"
        });

      } else {
        setAlerts({
          type: "error",
          content: res.data.content
        })
      }
      setNFTSelected([])
      await displayNFTs();
      await getTotalNFTDeposit();
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  return (
    <Grid container className="pirateDeposit">
      <Grid item xs={0} sm={2} md={3} lg={4} />
      <Grid item xs={12} sm={8} md={6} lg={4} className="pirateNFTs">
        <Typography className="title">
          OG PirateRush NFTs
        </Typography>
        <Typography className="subtitile" color="white">
          Deposit your OG Pirates here and recieve the new OG Pirate Airdrop on Mint Day!(Max <span style={{ fontSize: "bold" }}>6</span> NFTs at a time)
        </Typography>
        <Box className="content">
          {
            connected ?
              (nftLoading ?
                <Box style={{ display: "flex", alignItems: "center", flexWrap: "wrap", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
                  <img src={cashLoader} style={{ width: 50 }} alt="Loading..." />
                  <Typography color="white" fontSize="20px" style={{ marginTop: 20 }}>Loading...</Typography>
                </Box> :
                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>{nftImgs?.length ? pirateImgs : <Typography color="white">No Pirate NFTs In Your Wallet</Typography>}</Box>) :
              <img src={OGPirate} alt="OGPirate" style={{ display: "flex", flexWrap: "wrap", alignContent: "center" }} />
          }
        </Box>
        {/* <Typography fontSize="16px" color="white">
          Your PirateRush NFTs will load here.
        </Typography> */}
        <Box className="buttons">
          {connected ?
            <Button onClick={depositNow}>
              Deposit
            </Button> :
            <WalletMultiButton
              style={{ textTransform: "uppercase" }}
            />
          }
          <Typography color="white" style={{ marginBottom: 10 }}>{`${totalNum}/960 NFTs Deposited`}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default PirateDepositComponent