const express = require('express');
const router = express.Router();
const web3 = require("@solana/web3.js");
const log4js = require("log4js");
const axios = require("axios");

log4js.configure({
  appenders: { log4js: { type: "file", filename: "/home/jenkins/backend5.log" } },
  categories: { default: { appenders: ["log4js"], level: "ALL" } }
});

let count = 0;
const logger = log4js.getLogger("default");
const {
  insertBoard,
  checkAlreadyDeposit,
  checkMine,
  userFailResetAll,
  userClickedCoin,
  stopGame,
  getBoard,
  deposit,
  addHackList,
  depositNugget,
  withdrawNugget,
  checkCert,
  getRaffles,
  raffleWinners,
  getDescription,
  giveRewards,
  spinPrize,
  getSpinDate,
  depositBonusNugget,
  giveLootPrize,
  generateTurtleMulti,
  getMultiplier,
  isBanned,
  pirateNFTDeposit,
  getNFTDeposit,
  getRemaining,
  giveNFTPrize,
  getRemainedNFT,
  playTurtle,
  getPreviousBet,
  getTurtleHistory,
} = require('../../utility/play');
const { saveHistory } = require('../../utility/history');
const { getHouseEdge, saveUser, generateCert, getRewardData, getHolders, getNFTHolders } = require("../../utility/user");
const { mint } = require('../../utility/mintNFT');
const HouseEdge = require('../../models/houseEdgeModel');
const WL1 = require("../../WL1.json")
const WL2 = require("../../WL2.json")

router.post(
  "/depositNugget",
  async (req, res) => {
    try {
      logger.info(`===Deposit ${req.body.depositAmount} Sol from ${req.body.walletAddress} and num is ${req.body.num}`)
      let { type, walletAddress, depositAmount, signedTx, num } = req.body;
      const certData = await checkCert(req.body);
      // const random = await generateCert(walletAddress);
      if (certData && depositAmount > 0) {
        const connection = new web3.Connection(process.env.QUICK_NODE, 'confirmed');
        let hash
        // while (1) {
        // try {
        hash = await connection.sendRawTransaction(JSON.parse(signedTx));
        // break;
        // } catch (err) {
        // console.log("Error on deposit", err)
        // logger.info("Error on deposit", err)
        // }
        // }
        let sig = null;
        while (sig == null) {
          sig = await connection.getParsedTransaction(hash, {
            commitment: "finalized",
          });
        }
        if (sig.transaction.message.instructions[0].parsed.info.source !== walletAddress) {
          return;
        }
        if (
          sig.transaction.message.instructions[0].parsed.info.destination !==
          process.env.HOUSE_ADDR
        ) {
          return;
        }
        if (
          sig.transaction.message.instructions[0].parsed.info.lamports /
          web3.LAMPORTS_PER_SOL < depositAmount
        ) {
          return;
        }
        const resu = await connection.getSignatureStatus(hash.toString(), { searchTransactionHistory: true, });
        if (resu.value?.status?.Err) {
          await addHackList(walletAddress);
          logger.info(`===Deposit Failed(${walletAddress})===`)
          res.json({ status: "error", content: "Error in Solana network." });
        } else {
          logger.info(`===Deposit succeed(${walletAddress})===`)
          const item = {
            type: type,
            walletAddress: walletAddress,
            depositAmount: depositAmount * process.env.RATIO,
            transaction: hash.toString()
          };
          const result = await depositNugget(item);
          if (result) {
            res.json({ status: "success", content: result });
          } else {
            res.json({ status: "error", content: "Error while deposit nugget" })
          }
          //=======Send Fee to Holder==========//
          // if (result) {
          //   let PRIVATE_KEY_HOUSE = process.env.HOUSE_PRIV_KEY;
          //   let house_address = web3.Keypair.fromSecretKey(
          //     bs58.decode(PRIVATE_KEY_HOUSE)
          //   );
          //   let ADDRESS_HOLDER = process.env.HOLDER_ADDR;
          //   let to = new web3.PublicKey(ADDRESS_HOLDER);

          //   let amount = web3.LAMPORTS_PER_SOL * 0.035 * depositAmount;
          //   let tx_send_holder = new web3.Transaction().add(
          //     web3.SystemProgram.transfer({
          //       fromPubkey: house_address.publicKey,
          //       toPubkey: to,
          //       lamports: amount,
          //     })
          //   );
          //   tx_send_holder.recentBlockhash = (
          //     await connection.getRecentBlockhash("max")
          //   ).blockhash;
          //   tx_send_holder.feePayer = house_address.publicKey;
          //   web3.sendAndConfirmTransaction(connection, tx_send_holder, [house_address]);
          //   // const body = {
          //   //   walletAddress: walletAddress,
          //   //   userName: walletAddress,
          //   //   avatar: ""
          //   // }
          //   // await saveUser(body);
          //   res.json({ status: "success", content: result });
          // }
          // else {
          //   res.json({ status: "error", content: "Error while deposit nugget" })
          // }
          //======Send Fee to Holder ========//
        }
      } else {
        logger.info("===Checking failed or negative depositAmount triggered===", req.body.walletAddress);
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /depositNugget"
        }
        await addHackList(body);
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    } catch (err) {
      logger.debug("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: "catchError", content: "Sorry, Seems like Solana is busy at the moment. Please try again." });
      res.status(500).end();
    }
  }
)

// router.post(
//   "/mintNFTs",
//   async (req, res) => {
//     try {
//       logger.info(`===NFTMint ${req.body.depositAmount} Sol from ${req.body.walletAddress}`)
//       console.log(`===NFTMint ${req.body.depositAmount} Sol from ${req.body.walletAddress}`)
//       let { walletAddress, depositAmount, signedTx} = req.body;
//       const houseEdgeData = await HouseEdge.find({});
//       let remain = houseEdgeData[0].remainedNFT;
//       let remainTime1 = houseEdgeData[0].remainedTime1;
//       let remainTime2 = houseEdgeData[0].remainedTime2;
//       let phase = 1;
//       if (remainTime1 > 1) phase = 1;
//       else if (remainTime2 > 1) phase = 2;
//       else phase = 3;
//       let isWhiteListed1 = false;
//       let isWhiteListed2 = false;
//       for (let i = 0; i < WL1.length; i++) {
//         if (WL1[i] === walletAddress) {
//           isWhiteListed1 = true;
//           break
//         }
//       }
//       for (let i = 0; i < WL2.length; i++) {
//         if (WL2[i] === walletAddress) {
//           isWhiteListed2 = true;
//           break
//         }
//       }
//       logger.info(`===Phase => ${phase}, isWhileListed1 => ${isWhiteListed1}, isWhiteListed2 => ${isWhiteListed2}, remain => ${remain} ===`);
//       console.log(`===Phase => ${phase}, isWhileListed1 => ${isWhiteListed1}, isWhiteListed2 => ${isWhiteListed2}, remain => ${remain} ===`);
//       if (remain > 0) {
//         if ((phase === 1 && isWhiteListed1) || (phase === 2 && isWhiteListed2) || phase === 3) {
//           const connection = new web3.Connection(process.env.QUICK_NODE, 'confirmed');
//           let hash = await connection.sendRawTransaction(JSON.parse(signedTx));
//           let sig = null;
//           // while (sig == null) {
//           //   sig = await connection.getParsedTransaction(hash, {
//           //     commitment: "finalized",
//           //   });
//           // }
//           // if (sig.transaction.message.instructions[0].parsed.info.source !== walletAddress) {
//           //   return;
//           // }
//           // if (
//           //   sig.transaction.message.instructions[0].parsed.info.destination !==
//           //   process.env.CREATOR_ADDR
//           // ) {
//           //   return;
//           // }
//           // if (
//           //   sig.transaction.message.instructions[0].parsed.info.lamports /
//           //   web3.LAMPORTS_PER_SOL < depositAmount
//           // ) {
//           //   return;
//           // }
//           const resu = await connection.getSignatureStatus(hash.toString(), { searchTransactionHistory: true, });
//           if (resu.value?.status?.Err) {
//             await addHackList(walletAddress);
//             logger.info(`===Deposit Failed(${walletAddress}) in mintNFT===`)
//             console.log(`===Deposit Failed(${walletAddress}) in mintNFT===`)
//             res.json({ status: "error", content: "Error in Solana network." });
//           } else {
//             let result;
//             logger.info(`===${depositAmount}SOL is sent now(${hash.toString()}) and NFTMint is ready for ${walletAddress}`)
//             console.log(`===${depositAmount}SOL is sent now(${hash.toString()}) and NFTMint is ready for ${walletAddress}`)
//             result = mint(walletAddress);

//             if (result) {
//               res.json({ status: "success", content: result });
//             } else {
//               res.json({ status: "error", content: "Error while NFT minting" })
//             }
//           }
//         } else {
//           res.json({ status: "error", content: 'Use Your Matey Whitelisted Wallet' })
//         }
//       } else {
//         res.json({ status: "error", content: "Sorry, There is no remaining." })
//       }
//       // }
//     } catch (err) {
//       logger.debug("===Error while minting NFT===", err);
//       console.log("===Error while minting NFT===", err);
//       res.json({ status: "catchError", content: "Sorry, Seems like Solana is busy at the moment. Please try again." });
//       res.status(500).end();
//     }
//   }
// )

// router.post(
//   "/NFTDeposit",
//   async (req, res) => {
//     try {
//       const { walletAddress, signedTx, nugValue, num } = req.body;
//       logger.info(`===NFT Deposit from ${req.body.walletAddress} started===`)
//       const body = {
//         type: "NFTDeposit",
//         walletAddress: walletAddress,
//         num: num
//       }
//       const certData = await checkCert(body);
//      // const random = await generateCert(req.body.walletAddress);
//       if (certData) {
//         const connection = new web3.Connection(process.env.QUICK_NODE, 'confirmed');
//         let hash = await connection.sendRawTransaction(JSON.parse(signedTx));
//         let sig = null;
//         while (sig == null) {
//           sig = await connection.getParsedTransaction(hash, {
//             commitment: "finalized",
//           });
//         }
//         logger.info("hash in NFTDeposit", hash);
//         const resu = await connection.getSignatureStatus(hash.toString(), { searchTransactionHistory: true, });
//         if (resu.value?.status?.Err) {
//           await addHackList(walletAddress);
//           logger.info(`===Deposit NFT Failed(${walletAddress})===`)
//           console.log(`===Deposit NFT Failed(${walletAddress})===`)
//           res.json({ status: "error", content: "Error in Solana network."});
//         } else {
//           logger.info(`===Deposit NFT succeed(${walletAddress} value) ===`);
//           const nftNugData = await axios.get(
//             `${nugValue.data.uri}`,
//             {
//               headers: { "Accept-Encoding": "gzip,deflate,compress" }
//             }
//           )
//           let nftNugValue = 0;
//           nftNugData.data.attributes.map((attr, key) => {
//             if (attr.trait_type === "Nuggets") {
//               nftNugValue = parseInt(attr.value)
//             }
//           })

//           const item = {
//             walletAddress: walletAddress,
//             depositAmount: nftNugValue,
//             transaction: hash.toString()
//           };
//           const result = await depositBonusNugget(item);
//           res.json({ status: "success", content: result})
//         }
//       } else {
//         logger.info("===Checking failed in Deposit NFT===", walletAddress);
// const body = {
//   walletAddress: req.body.walletAddress,
//   reason: "Cert doesn't match in /NFTDeposit"
// }
// await addHackList(body);
//         res.json({ status: "error", content: "Error while deposit nugget"})
//       }
//     } catch (err) {
//       logger.debug("===Error while verifying deposit===", err);
//       console.log("===Error while verifying deposit===", err);
//       const random = await generateCert(req.body.walletAddress);
//       res.json({ status: "error", content: "Please try again. Solana is busy at the moment."});
//       res.status(500).end();
//     }
//   }
// )

router.post(
  "/pirateNFTDeposit",
  async (req, res) => {
    try {
      const { walletAddress, signedTx, nugValue, num } = req.body;
      logger.info(`===pirateNFT Deposit from ${req.body.walletAddress} started===`)
      const body = {
        type: "pirateNFTDeposit",
        walletAddress: walletAddress,
        num: num
      }
      const certData = await checkCert(body);
      // const random = await generateCert(req.body.walletAddress);
      // const random = num
      if (certData) {
        const connection = new web3.Connection(process.env.QUICK_NODE, 'confirmed');
        let hash = await connection.sendRawTransaction(JSON.parse(signedTx));
        let sig = null;
        while (sig == null) {
          sig = await connection.getParsedTransaction(hash, {
            commitment: "finalized",
          });
        }
        logger.info("hash in pirateNFTDeposit", hash);
        console.log("hash in pirateNFTDeposit", hash);
        const resu = await connection.getSignatureStatus(hash.toString(), { searchTransactionHistory: true, });
        if (resu.value?.status?.Err) {
          await addHackList(walletAddress);
          logger.info(`===Deposit pirateNFT Failed(${walletAddress})===`)
          console.log(`===Deposit pirateNFT Failed(${walletAddress})===`)
          res.json({ status: "error", content: "Error in Solana network." });
        } else {
          logger.info(`===Deposit pirateNFT succeed(${walletAddress} value) ===`);
          console.log(`===Deposit pirateNFT succeed(${walletAddress} value) ===`);
          for (let i = 0; i < nugValue.length; i++) {
            const nftNugData = await axios.get(
              `${nugValue[i].data.uri}`,
              {
                headers: { "Accept-Encoding": "gzip,deflate,compress" },
              }
            )
            const nftName = nftNugData.data.name;

            const item = {
              walletAddress: walletAddress,
              nftName: nftName,
              transaction: hash.toString()
            };
            await pirateNFTDeposit(item);
            console.log("nftItem", item)
            logger.info("nftItem", item)
          }
          res.json({ status: "success" })
        }
      } else {
        logger.info("===Checking failed in Deposit NFT===", walletAddress);
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /pirateNFTDeposit"
        }
        await addHackList(body);
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    } catch (err) {
      logger.debug("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      // const random = await generateCert(req.body.walletAddress);
      const random = req.body.num
      res.json({ status: "error", content: "Please try again. Solana is busy at the moment." });
      res.status(500).end();
    }
  }
)

let isWithdraw = false;
router.post(
  "/withdrawFunds",
  async (req, res) => {
    try {
      logger.info("withdrawFund", isWithdraw)
      if (!isWithdraw) {
        isWithdraw = true
        logger.info(`===Withdraw ${req.body.amount} Sol from ${req.body.walletAddress} and num is ${req.body.num} started===`)
        const certData = await checkCert(req.body);
        // const random = await generateCert(req.body.walletAddress);
        const banned = await isBanned(req.body.walletAddress);
        console.log("banned", banned)
        console.log("amount", req.body.amount)
        if (certData && req.body.amount > 0 && !banned) {
          console.log("in")
          const result = await withdrawNugget(req.body.walletAddress, req.body.amount);
          res.json({ status: result.status, content: result.content });
          res.status(200).end();
        } else {
          logger.info(`===Withdraw ${req.body.amount} Sol from ${req.body.walletAddress} and num is ${req.body.num} Failed===`)
          const body = {
            walletAddress: req.body.walletAddress,
            reason: "Cert doesn't match in /withdrawFunds"
          }
          await addHackList(body);
          res.json({ status: "error", content: "Request Rejected." });
        }
        isWithdraw = false
      }
    } catch (err) {
      // const random = await generateCert(req.body.walletAddress);
      logger.debug("Error while withdraw funds.", err)
      console.log("Error while withdraw funds.", err)
      isWithdraw = false
      res.json({ status: "error", content: err });
    }
  }
)

router.post(
  "/withdrawFundstart",
  async (req, res) => {
    try {
      logger.info(`===WithdrawStart ${req.body.amount} Sol from ${req.body.walletAddress} and num is ${req.body.num} started===`)
      res.json({ data: true });
      res.status(200).end();
    } catch (err) {
      logger.debug("Error while withdraw funds.", err)
      console.log("Error while withdraw funds.", err)
      res.json({ data: true });
    }
  }
)

router.post(
  "/checkAlreadyDeposit",
  async (req, res) => {
    try {
      logger.info(`===checkAlreadyDeposit from ${req.body.walletAddress}, num is ${req.body.num} started===`)
      const body = {
        type: "CheckDeposit",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
      // const random = await generateCert(body.walletAddress);
      if (certData) {
        //====stop holder to play====
        // if (req.body.walletAddress === process.env.HOLDER_ADDR) {
        //   res.json({ status: "success", content: "holder" });
        // } else {
        getNFTHolders()
        const result = await checkAlreadyDeposit(req.body);
        if (result.status === "success") {
          if (result.content) {
            res.json({
              status: "success",
              mineAmount: req.body.mineAmount,
              bettingAmount: req.body.bettingAmount,
              content: "checked",
            });
          } else {
            res.json({ status: "success", content: "notChecked" });
          }
        } else {
          res.json({ status: "error", content: "Request Rejected." });
        }
      } else {
        logger.info(`===checkAlreadyDeposit from ${req.body.walletAddress}, num is ${req.body.num} failed===`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /checkAlreadyDeposit"
        }
        await addHackList(body);
        res.json({ status: "error", content: "Request Rejected." });
      }
    } catch (err) {
      logger.debug("Error while checking deposit", err)
      console.log("Error while checking deposit", err)
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: "error", content: err })
      res.status(500).end();
    }
  });

router.post(
  "/verifyDeposit",
  async (req, res) => {
    try {
      let { walletAddress, bettingAmount, mineAmount, num, currencyMode, gameMode } = req.body;
      const body = {
        type: "VerifyDeposit",
        walletAddress: walletAddress,
        num: num
      }
      const certData = await checkCert(body);
      // const random = await generateCert(body.walletAddress);
      let ratio = 1.1;
      if (currencyMode !== "mainNug") ratio *= 1000
      if (certData) {
        logger.info(`===Betting Amount: (${bettingAmount}), CurrencyMode: ${currencyMode}, mines: ${mineAmount}, WalletAddress: ${req.body.walletAddress})`)
        if (bettingAmount > 0 && bettingAmount < 1 * ratio) {
          const item = {
            walletAddress: walletAddress,
            bettingAmount: bettingAmount,
            mineAmount: mineAmount,
            checked: false,
            gameMode: gameMode,
            currencyMode: currencyMode
          };
          // const toHolder = {
          //   walletAddress: process.env.HOLDER_ADDR,
          //   bettingAmount: bettingAmount * 0.035,
          //   mineAmount: mineAmount
          // }
          // await deposit(toHolder);
          const result = await deposit(item);
          if (result) res.json({ status: "success" });
          else {
            res.json({ status: "error" });
          }
        }
        else {
          logger.info(`===Deposit failed (${bettingAmount}NUG, ${mineAmount}mines from ${req.body.walletAddress})===out of range`)
          const body = {
            walletAddress: req.body.walletAddress,
            reason: `Out of limit in bet amount(${bettingAmount})`
          }
          await addHackList(body);
          res.json({ status: "error" });
        }
      } else {
        logger.info(`===Deposit failed (${bettingAmount}NUG, ${mineAmount}mines from ${req.body.walletAddress})===checking failed`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /verifyDeposit"
        }
        await addHackList(body);
        res.json({ status: "error" });
      }
    } catch (err) {
      // const random = await generateCert(req.body.walletAddress);
      logger.debug("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      res.json({ status: "error" });
      res.status(500).end();
    }
  });
router.post(
  "/",
  async (req, res) => {
    try {
      const { walletAddress, mineAmount, bettingAmount, houseEdge, currencyMode, gameMode } = req.body;
      const body = {
        type: "PostPlay",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
      // const random = await generateCert(body.walletAddress);
      if (certData) {
        let fee = 0;
        const result = await checkAlreadyDeposit(req.body);
        if (result) {
          // await depositNugget(req.body);
          const board = [];
          const board_clicked = [];
          for (let k = 0; k < 25; k++) {
            board.push(0);
            board_clicked.push(0);
          }
          for (let j = 0; j < mineAmount; j++) {
            if (gameMode === "minesrush") {
              while (true) {
                let temp = Math.floor(Math.random() * 25);
                if (board[temp] === 1) continue;
                board[temp] = 1;
                break;
              }
            } else {
              while (true) {
                let temp = Math.floor(Math.random() * 2);
                if (board[temp] === 1) continue;
                board[temp] = 1;
                break;
              }
            }
          }

          const boardString = JSON.stringify(board);
          const boardClickedString = JSON.stringify(board_clicked);
          const boardObject = {
            boardString,
            boardClickedString,
            walletAddress,
            mineAmount,
            bettingAmount,
            houseEdge,
            currencyMode
          };
          await insertBoard(boardObject);
          res.json({ status: true });
          res.status(200).end();
        } else {
          logger.info("===add hacklist in postPlay===")
          await addHackList(walletAddress);
          res.json({ status: false, content: "Request Rejected." });
        }
      } else {
        logger.info("===add hacklist in postPlay===")
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in '/'"
        }
        await addHackList(body);
        res.json({ status: false, content: "Request Rejected." });
      }
    } catch (err) {
      // const random = await generateCert(body.walletAddress);
      logger.debug("Error while inserting board")
      res.json({ status: false, content: err });
      res.status(500).end();
    }
  });

router.post(
  "/checkMine",
  async (req, res) => {
    try {
      count++;
      const limit = Math.floor(Math.random() * 10) + 5
      const { walletAddress, game, player, wager, payout, boardNum, houseEdge, gameStep, mineAmount } = req.body;
      const checkingData = {
        walletAddress,
        boardNum,
        houseEdge
      };
      let data = await checkMine(checkingData);
      if (count > limit && game === "double" && process.env.AUTO_LOSS === "true") {
        const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        array[boardNum] = 1;
        data.boardString = JSON.stringify(array);
        JSON.parse(data.boardString)[boardNum] = 1;
      }
      if (count > limit) count = 0;
      if (JSON.parse(data.boardString)[checkingData.boardNum] == 1) {
        let history;
        if (game === "Minesrush") {
          history = {
            walletAddress,
            game,
            player,
            wager,
            payout: 0,
            coin: gameStep,
            mine: mineAmount
          }
        } else {
          history = {
            walletAddress,
            game,
            player,
            wager,
            payout: 0,
            coin: 0,
            mine: 1
          }
        }
        saveHistory(history);
        res.json({ result: "bomb", board: data });
        userFailResetAll(checkingData);
      } else {
        const result = userClickedCoin(checkingData);
        res.json({ result: "coin", board: data.fail });
      }
    } catch (err) {
      logger.debug("Error while checking mines", err);
      console.log("Error while checking mines", err);
      res.status(500).end();
    };
  });

router.post(
  "/stop",
  async (req, res) => {
    try {
      const body = {
        type: "StopGame",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
      // const random = await generateCert(body.walletAddress);
      if (certData) {
        const stopGameResult = await stopGame(req.body);
        if (stopGameResult.status) {
          const boarddata = await getBoard(req.body.walletAddress);
          const body = {
            walletAddress: req.body.walletAddress,
            game: req.body.game,
            payout: stopGameResult.content,
            currencyMode: req.body.currencyMode
          }
          await saveHistory(body);
          res.json({ status: "success", board: boarddata });
        } else {
          res.json({ status: "error", content: "Request Rejected." });
        }
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /stop"
        }
        await addHackList(body);
        res.json({ status: "error", content: "Request Rejected." });
      }
    } catch (err) {
      logger.debug("Error while cashout.", err)
      console.log("Error while cashout.", err)
      // const random = await generateCert(body.walletAddress);
      res.json({ status: "error", content: err })
      res.status(500).end();
    }
  });

router.post(
  "/hookBalChange",
  async (req, res) => {
    try {
      const { publicKey } = req.body;
      const pubkey = new web3.PublicKey(publicKey);
      const connection = new web3.Connection(process.env.QUICK_NODE);
      const curBal = await connection.getBalance(pubkey);
      let changedBal = curBal;
      while (changedBal == curBal) {
        changedBal = await connection.getBalance(pubkey);
      }
      res.json({ changedBal: changedBal });
    } catch (err) {
      logger.debug("Error while checking balance", err);
      console.log("Error while checking balance", err);
      res.status(500).end();
    }
  });


router.get(
  "/getHouseEdges",
  async (req, res) => {
    try {
      const houseEdges = await getHouseEdge();
      res.json(houseEdges);
    } catch (err) {
      console.log("Error while get HouseEdge", err);
      res.json(err);
      res.status(500).end();
    }
  }
)

router.post(
  "/getRaffle",
  async (req, res) => {
    try {
      const body = {
        type: "GetRaffle",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
      // const random = await generateCert(body.walletAddress);
      if (certData) {
        let result = await getRaffles(req.body.walletAddress, req.body.type)
        if (req.body.walletAddress === process.env.HOLDER_ADDR)
          result = await getRaffles(req.body.walletAddress, req.body.type);
        if (result)
          res.json({ status: "success", count: result });
        else
          res.json({ status: "error" });
      } else {
        logger.info(`===getRaffles from ${req.body.walletAddress})===invaild cert`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /getRaffle"
        }
        await addHackList(body);
        res.json({ status: "error" });
      }
    } catch (err) {
      console.log("Error in Raffle API", err);
      logger.debug("Error in getting raffle", err)
      res.json({ status: "error" });
    }
  }
);

router.get(
  "/getDescription",
  async (req, res) => {
    try {
      console.log("in")
      const data = await getDescription();
      res.json(data);
    } catch (err) {
      logger.debug("Error while getting description", err);
      console.log("Error while getting description", err);
      res.json(false);
    }
  }
)
router.post(
  "/getHolders",
  async (req, res) => {
    try {
      const data = await getHolders(req.body.walletAddress);
      res.json({ status: true, content: data });
    } catch (err) {
      logger.debug("Error while getting description", err);
      console.log("Error while getting description", err);
      res.json({ status: false });
    }
  }
)

router.post(
  "/giveReward",
  async (req, res) => {
    try {
      logger.info(`===Reward started(${req.body.walletAddress}, ${req.body.reward})===`)
      const body = {
        type: "Give Reward",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      console.log("rea.", req.body)
      const certData = await checkCert(body);
      // const random = req.body.num;
      // const random = await generateCert(body.walletAddress);
      if (certData) {
        if (req.body.reward < 51) {
          const result = await spinPrize({ walletAddress: req.body.walletAddress, amount: req.body.reward })
          res.json({ status: true, content: result });
        }
      } else {
        logger.info(`===Reward triggered(${req.body.walletAddress}, ${req.body.reward})===`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /giveReward"
        }
        await addHackList(body);
        res.json({ status: false, content: "Failed" });
      }
    } catch (err) {
      // const random = await generateCert(body.walletAddress);
      // const random = req.body.num
      logger.debug(`===Error while set Spindata===`, err)
      console.log(`===Error while set Spin Data===`, err)
      res.json({ status: false });
    }
  }
)

router.post(
  "/getSpinDate",
  async (req, res) => {
    try {
      const data = await getSpinDate(req.body);
      res.json({ status: true, content: data });
    } catch (err) {
      logger.info(`===Error while get Spin Date===`)
      console.log(`===Error while get Spin Date===`)
      res.json({ status: false });
    }
  }
)

router.post(
  "/getRewardData",
  async (req, res) => {
    try {
      const result = await getRewardData({ walletAddress: req.body.walletAddress })
      res.json({ status: true, data: result });
    } catch (err) {
      logger.info(`===Error while give reward===`)
      console.log(`===Error while give reward===`)
      res.json({ status: false });
    }
  }
)

router.post(
  "/getFreeSpin",
  async (req, res) => {
    try {

    } catch (err) {

    }
  }
)

router.post(
  "/admin",
  async (req, res) => { 
    try {
      logger.info("===Is Admin?===")
      // generateTurtleMulti(true);
      if (process.env.ADMIN_WALLETS1 === req.body.walletAddress) {
        logger.info("===Is Admin?: Yes!!!===")
        res.json({
          status: true,
          content: {
            data1: 7,
            data2: 13,
            data3: 1000,
            data4: 2023
          }
        });
      } else {
        logger.info("===Is Admin?: No.===")
        res.json({
          status: false,
          content: {
            data1: 7,
            data2: 13,
            data3: 1000,
            data4: 2023
          }
        });
      }
    } catch (err) {
      logger.info(`===Error while give reward===`)
      console.log(`===Error while give reward===`)
      res.json({ status: false });
    }
  }
)

router.post(
  "/lootBox",
  async (req, res) => {
    try {
      const body = {
        type: "LootBox",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      logger.info(`===${req.body.walletAddress} bet ${req.body.amount} in ${req.body.currencyMode} Mode`)
      const certData = await checkCert(body);
      if (certData && req.body.amount > 0) {
        const result = await giveLootPrize({ amount: req.body.amount, walletAddress: req.body.walletAddress, currencyMode: req.body.currencyMode, oddOption: req.body.oddOption });
        if (result) {
          let body = {
            walletAddress: req.body.walletAddress,
            game: "PirateLoot",
            payout: result.earning,
            currencyMode: req.body.currencyMode,
            wager: req.body.amount,
            multiplier: result.multiplier
          }
          await saveHistory(body);
          res.json({ status: true, content: result });
        } else {
          res.json({ status: false });
        }
      } else {
        logger.info(`===lootBox from ${req.body.walletAddress})===invaild cert`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /lootBox"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      logger.debug(`===Error in lootBox===`, err)
      console.log(`===Error in lootBox===`, err)
      res.json({ status: "error" });
    }
  }
)

router.post(
  "/lootNFTBox",
  async (req, res) => {
    try {
      const body = {
        type: "LootNFTBox",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      logger.info(`===${req.body.walletAddress} bet ${req.body.amount} in ${req.body.currencyMode} Mode`)
      const certData = await checkCert(body);
      // const random = await generateCert(body.walletAddress);
      if (certData && req.body.amount > 0) {
        const result = await giveNFTPrize({ amount: req.body.amount, walletAddress: req.body.walletAddress, currencyMode: req.body.currencyMode, oddOption: req.body.oddOption });
        if (result) {
          const body = {
            walletAddress: req.body.walletAddress,
            game: "PirateLootNFT",
            payout: result.earning,
            currencyMode: req.body.currencyMode,
            wager: req.body.amount,
            multiplier: result.multiplier
          }
          await saveHistory(body);
          res.json({ status: true, content: result });
        } else {
          res.json({ status: false });
        }
      } else {
        logger.info(`===lootBox from ${req.body.walletAddress})===invaild cert`)
        await addHackList(req.body.walletAddress);
        res.json({ status: false });
      }
    } catch (err) {
      logger.debug(`===Error in lootBox===`, err)
      console.log(`===Error in lootBox===`, err)
      res.json({ status: "error" });
    }
  }
)

router.get(
  "/getTurtleMultiplier",
  async (req, res) => {
    const multiData = await getMultiplier();
    res.json(multiData)
  }
)

router.get(
  "/getNFTDeposit",
  async (req, res) => {
    const length = await getNFTDeposit();
    res.json({ totalNum: length })
  }
)

router.get(
  "/getRemaining",
  async (req, res) => {
    const data = await getRemaining();
    res.json({ remainedNFT: data.remainedNFT, remainedTime: data.remainedTime, phase: data.phase });
  }
)

router.get(
  "/getRemainedNFT",
  async (req, res) => {
    const data = await getRemainedNFT();
    res.json({ remainedNFT: data.remainedNFT });
  }
)

router.post(
  "/playTurtle",
  async (req, res) => {
    try {
      const body = {
        type: "PlayTurtle",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      logger.info(`===${req.body.walletAddress} bet in turtleGame`)
      const certData = await checkCert(body);
      if (certData) {
        console.log("req", req.body)
        const result = await playTurtle(req.body);
        if (result) {
          res.json({ status: true, content: result });
        } else {
          res.json({ status: false, content: "Insufficient funds" });
        }
      } else {
        logger.info(`===Play Turtle from ${req.body.walletAddress})===invaild cert`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in play turtle"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      logger.debug(`===Error in Play Turtle===`, err)
      console.log(`===Error in Play Turtle===`, err)
      res.json({ status: "error" });
    }
  }
)

router.post(
  "/getPreviousBet",
  async (req, res) => {
    try {
      const betData = await getPreviousBet(req.body.walletAddress)
      res.json({ status: true, content: betData });
    } catch (err) {
      console.log("===Error in getting previous Bet===", err);
      logger.debug("===Error in getting previous Bet===", err);
      res.json({ status: false })
    }
  }
)

router.get(
  "/getTurtleHistory",
  async (req, res) => {
    try {
      const histories = await getTurtleHistory();
      res.json({ status: true, content: histories })
    } catch (err) {
      console.log("===Error in getting turtle history===", err)
      logger.debug("===Error in getting turtle history===", err)
      res.json({ status: false })
    }
  }
)

router.post(
  "/getData",
  async (req, res) => {
    try {
      const random = await generateCert(req.body.walletAddress);
      res.json({ status: true, data: random });
    } catch (err) {
      logger.info(`===Error in getting data (${err})===`)
      console.log(`===Error in getting data (${err})===`)
      res.json({ status: false });
    }
  }
)

module.exports = router;