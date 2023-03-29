const express = require('express');
const router = express.Router();
const web3 = require("@solana/web3.js");
const log4js = require("log4js");
const axios = require("axios");

let count = 0;
const {
  insertBoard,
  depositNuggetForLimbo,
  depositNuggetForCrash,
  depositNuggetForDice,
  checkAlreadyDeposit,
  checkMine,
  userFailResetAll,
  userClickedCoin,
  stopGame,
  getBoard,
  deposit,
  addHackList,
  depositNugget,
  withdrawETH,
  withdrawDAI,
  checkCert,
  getRaffles,
  getDescription,
  spinPrize,
  getSpinDate,
  giveLootPrize,
  getMultiplier,
  pirateNFTDeposit,
  getNFTDeposit,
  getRemaining,
  giveNFTPrize,
  getRemainedNFT,
  playTurtle,
  getPreviousBet,
  getTurtleHistory,
  depositDai,
  getTime,
} = require('../../utility/play');
const { saveHistory } = require('../../utility/history');
const { getHouseEdge, generateCert, getRewardData, getHolders, getNFTHolders } = require("../../utility/user");
const WL1 = require("../../WL1.json")
const WL2 = require("../../WL2.json")

router.post(
  "/depositNugget",
  async (req, res) => {
    try {
      console.log(`===Deposit ${req.body.depositAmount} ETH from ${req.body.walletAddress}`)
      console.log(`===Deposit ${req.body.depositAmount} ETH from ${req.body.walletAddress}`)
      const item = {
        walletAddress: walletAddress,
        depositAmount: req.body.depositAmount
      };
      const result = await depositNugget(item);
      if (result) {
        res.json({ status: "success", content: result });
      } else {
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    }
    catch (err) {
      console.log("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      res.json({ status: "catchError", content: "Sorry, Seems like Arbitrum is busy at the moment. Please try again." });
      res.status(500).end();
    }
  }
)

// limbo
router.post(
  "/limboDeposit",
  async (req, res) => {
    try {
      console.log(`===Deposit ${req.body.amount} mainNug from ${req.body.walletAddress}`)

      let i = Math.random();
      let limboWord = parseFloat(1 / i).toFixed(2);

      const item = {
        walletAddress: req.body.walletAddress,
        amount: req.body.amount,
        payout: req.body.payout,
        currencyMode: req.body.currencyMode,
        limboWord: limboWord,
      };

      const result = await depositNuggetForLimbo(item);
      if (result.status) {
        const body = {
          walletAddress: req.body.walletAddress,
          game: 'Limbo',
          player: req.body.walletAddress,
          wager: req.body.amount,
          payout: result.earning,
          coin: 1,
          mine: 1,
          currencyMode: req.body.currencyMode
        }
        await saveHistory(body);
        res.json({ status: "success", content: result });
      } else {
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    }
    catch (err) {
      console.log("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      res.json({ status: "catchError", content: "Sorry, Seems like Arbitrum is busy at the moment. Please try again." });
      res.status(500).end();
    }
  }
)


// Crash
router.get(
  '/getcrashtime',
  async (req, res) => {
    try {
      const time = await getTime();
      console.log("time", time)
      res.json(time);
    }
    catch {

    }
  }
)

router.post(
  "/crashDeposit",
  async (req, res) => {
    try {
      console.log(`===Deposit ${req.body.amount} mainNug from ${req.body.walletAddress}`)

      let i = Math.random();
      let crashWord = parseFloat(1 / i).toFixed(2);

      const item = {
        walletAddress: req.body.walletAddress,
        amount: req.body.amount,
        payout: req.body.payout,
        currencyMode: req.body.currencyMode,
        crashWord: crashWord,
      };

      const result = await depositNuggetForCrash(item);
      if (result.status) {
        const body = {
          walletAddress: req.body.walletAddress,
          game: 'Crash',
          player: req.body.walletAddress,
          wager: req.body.amount,
          payout: result.earning,
          coin: 1,
          mine: 1,
          currencyMode: req.body.currencyMode
        }
        await saveHistory(body);
        res.json({ status: "success", content: result });
      } else {
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    }
    catch (err) {
      console.log("===Error while verifying deposit===", err);
      res.json({ status: "catchError", content: "Sorry, Seems like Arbitrum is busy at the moment. Please try again." });
      res.status(500).end();
    }
  }
)

// dice 
router.post(
  "/diceDeposit",
  async (req, res) => {
    try {
      console.log(`===Deposit ${req.body.amount} dice from ${req.body.walletAddress}`)

      let diceWord = parseFloat(100 * Math.random()).toFixed(2);
      // let diceWord = parseFloat(1/i).toFixed(2);

      const item = {
        walletAddress: req.body.walletAddress,
        amount: req.body.amount,
        payout: req.body.payout,
        percent: req.body.percent,
        currencyMode: req.body.currencyMode,
        diceWord: diceWord,
      };

      const result = await depositNuggetForDice(item);
      if (result.status) {
        const body = {
          walletAddress: req.body.walletAddress,
          game: 'Dice',
          player: req.body.walletAddress,
          wager: req.body.amount,
          payout: result.earning,
          coin: 1,
          mine: 1,
          currencyMode: req.body.currencyMode,
        }
      console.log("body", body)
      await saveHistory(body);
        res.json({ status: "success", content: result });
      } else {
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    }
    catch (err) {
      console.log("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      res.json({ status: "catchError", content: "Sorry, Seems like Arbitrum is busy at the moment. Please try again." });
      res.status(500).end();
    }
  }
)

router.post(
  "/depositDai",
  async (req, res) => {
    try {
      console.log(`===Deposit ${req.body.depositAmount} Dai from ${req.body.walletAddress}`)
      const item = {
        walletAddress: req.body.walletAddress,
        depositAmount: req.body.depositAmount,
      };
      const result = await depositDai(item);
      if (result) {
        res.json({ status: "success", content: result });
      } else {
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    } catch (err) {
      console.log("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      res.json({ status: "catchError", content: "Sorry, Seems like Arbitrum is busy at the moment. Please try again." });
      res.status(500).end();
    }
  }
)

router.post(
  "/pirateNFTDeposit",
  async (req, res) => {
    try {
      const { walletAddress, signedTx, nugValue, num } = req.body;
      console.log(`===pirateNFT Deposit from ${req.body.walletAddress} started===`)
      const body = {
        type: "pirateNFTDeposit",
        walletAddress: walletAddress,
        num: num
      }
      const certData = await checkCert(body);
      if (certData) {
        const connection = new web3.Connection(process.env.QUICK_NODE, 'confirmed');
        let hash = await connection.sendRawTransaction(JSON.parse(signedTx));
        let sig = null;
        while (sig == null) {
          sig = await connection.getParsedTransaction(hash, {
            commitment: "finalized",
          });
        }
        console.log("hash in pirateNFTDeposit", hash);
        console.log("hash in pirateNFTDeposit", hash);
        const resu = await connection.getSignatureStatus(hash.toString(), { searchTransactionHistory: true, });
        if (resu.value?.status?.Err) {
          await addHackList(walletAddress);
          console.log(`===Deposit pirateNFT Failed(${walletAddress})===`)
          console.log(`===Deposit pirateNFT Failed(${walletAddress})===`)
          res.json({ status: "error", content: "Error in Solana network." });
        } else {
          console.log(`===Deposit pirateNFT succeed(${walletAddress} value) ===`);
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
            console.log("nftItem", item)
          }
          res.json({ status: "success" })
        }
      } else {
        console.log("===Checking failed in Deposit NFT===", walletAddress);
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /pirateNFTDeposit"
        }
        await addHackList(body);
        res.json({ status: "error", content: "Error while deposit nugget" })
      }
    } catch (err) {
      console.log("===Error while verifying deposit===", err);
      console.log("===Error while verifying deposit===", err);
      const random = req.body.num
      res.json({ status: "error", content: "Please try again. Solana is busy at the moment." });
      res.status(500).end();
    }
  }
)

// withdraw ETH
router.post(
  "/withdrawETH",
  async (req, res) => {
    try {
      console.log(`===Withdraw ${req.body.depositAmount} ETH from ${req.body.walletAddress} and num is ${req.body.num} started===`)
      const result = await withdrawETH(req.body.walletAddress, req.body.depositAmount);
      res.json({ status: result.status, content: result.content });
      res.status(200).end();
    } catch (err) {
      console.log("Error while withdraw funds.", err)
      isWithdraw = false
      res.json({ status: "error", content: err });
    }
  }
)

// withdraw DAI
router.post(
  "/withdrawDAI",
  async (req, res) => {
    try {
      console.log(`===Withdraw ${req.body.depositAmount} DAI from ${req.body.walletAddress} and num is ${req.body.num} started===`)
      const result = await withdrawDAI(req.body.walletAddress, req.body.depositAmount);
      res.json({ status: result.status, content: result.content });
      res.status(200).end();
    } catch (err) {
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
      console.log(`===WithdrawStart ${req.body.amount} Sol from ${req.body.walletAddress} and num is ${req.body.num} started===`)
      res.json({ data: true });
      res.status(200).end();
    } catch (err) {
      console.log("Error while withdraw funds.", err)
      console.log("Error while withdraw funds.", err)
      res.json({ data: true });
    }
  }
)

router.post(
  "/checkAlreadyDeposit",
  async (req, res) => {
    try {
      console.log(`===checkAlreadyDeposit from ${req.body.walletAddress}, num is ${req.body.num} started===`)
      const body = {
        type: "CheckDeposit",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
      if (certData) {
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
        console.log(`===checkAlreadyDeposit from ${req.body.walletAddress}, num is ${req.body.num} failed===`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /checkAlreadyDeposit"
        }
        await addHackList(body);
        res.json({ status: "error", content: "Request Rejected." });
      }
    } catch (err) {
      console.log("Error while checking deposit", err)
      console.log("Error while checking deposit", err)
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
      let ratio = 1.1;
      if (currencyMode !== "mainNug") ratio *= 1000
      if (certData) {
        console.log(`===Betting Amount: (${bettingAmount}), CurrencyMode: ${currencyMode}, mines: ${mineAmount}, WalletAddress: ${req.body.walletAddress})`)
        if (bettingAmount > 0 && bettingAmount < 1 * ratio) {
          const item = {
            walletAddress: walletAddress,
            bettingAmount: bettingAmount,
            mineAmount: mineAmount,
            checked: false,
            gameMode: gameMode,
            currencyMode: currencyMode
          };
          const result = await deposit(item);
          if (result) res.json({ status: "success" });
          else {
            res.json({ status: "error" });
          }
        }
        else {
          console.log(`===Deposit failed (${bettingAmount}NUG, ${mineAmount}mines from ${req.body.walletAddress})===out of range`)
          const body = {
            walletAddress: req.body.walletAddress,
            reason: `Out of limit in bet amount(${bettingAmount})`
          }
          await addHackList(body);
          res.json({ status: "error" });
        }
      } else {
        console.log(`===Deposit failed (${bettingAmount}NUG, ${mineAmount}mines from ${req.body.walletAddress})===checking failed`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /verifyDeposit"
        }
        await addHackList(body);
        res.json({ status: "error" });
      }
    } catch (err) {
      console.log("===Error while verifying deposit===", err);
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
      if (certData) {
        let fee = 0;
        const result = await checkAlreadyDeposit(req.body);
        if (result) {
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
          console.log("===add hacklist in postPlay===")
          await addHackList(walletAddress);
          res.json({ status: false, content: "Request Rejected." });
        }
      } else {
        console.log("===add hacklist in postPlay===")
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in '/'"
        }
        await addHackList(body);
        res.json({ status: false, content: "Request Rejected." });
      }
    } catch (err) {
      console.log("Error while inserting board")
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
      console.log("Error while checking mines", err);
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
      console.log("Error while cashout.", err)
      console.log("Error while cashout.", err)
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
      console.log("Error while checking balance", err);
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
      if (certData) {
        let result = await getRaffles(req.body.walletAddress, req.body.type)
        if (req.body.walletAddress === process.env.HOLDER_ADDR)
          result = await getRaffles(req.body.walletAddress, req.body.type);
        if (result)
          res.json({ status: "success", count: result });
        else
          res.json({ status: "error" });
      } else {
        console.log(`===getRaffles from ${req.body.walletAddress})===invaild cert`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /getRaffle"
        }
        await addHackList(body);
        res.json({ status: "error" });
      }
    } catch (err) {
      console.log("Error in Raffle API", err);
      console.log("Error in getting raffle", err)
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
      console.log("Error while getting description", err);
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
      console.log("Error while getting description", err);
      console.log("Error while getting description", err);
      res.json({ status: false });
    }
  }
)

router.post(
  "/giveReward",
  async (req, res) => {
    try {
      console.log(`===Reward started(${req.body.walletAddress}, ${req.body.reward})===`)
      const body = {
        type: "Give Reward",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      console.log("rea.", req.body)
      const certData = await checkCert(body);
      if (certData) {
        if (req.body.reward < 51) {
          const result = await spinPrize({ walletAddress: req.body.walletAddress, amount: req.body.reward })
          res.json({ status: true, content: result });
        }
      } else {
        console.log(`===Reward triggered(${req.body.walletAddress}, ${req.body.reward})===`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /giveReward"
        }
        await addHackList(body);
        res.json({ status: false, content: "Failed" });
      }
    } catch (err) {
      console.log(`===Error while set Spindata===`, err)
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
      console.log(`===Error while get Spin Date===`)
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
      console.log(`===Error while give reward===`)
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
      console.log("===Is Admin?===")
      if (process.env.ADMIN_WALLETS1 === req.body.walletAddress) {
        console.log("===Is Admin?: Yes!!!===")
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
        console.log("===Is Admin?: No.===")
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
      console.log(`===Error while give reward===`)
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
      console.log(`===${req.body.walletAddress} bet ${req.body.amount} in ${req.body.currencyMode} Mode`)
      const certData = await checkCert(body);
      if (certData && req.body.amount > 0) {
        const result = await giveLootPrize({ amount: req.body.amount, walletAddress: req.body.walletAddress, currencyMode: req.body.currencyMode, oddOption: req.body.oddOption });
        if (result) {
          let body = {
            walletAddress: req.body.walletAddress,
            game: "ArbiCasino",
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
        console.log(`===lootBox from ${req.body.walletAddress})===invaild cert`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /lootBox"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`===Error in lootBox===`, err)
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
      console.log(`===${req.body.walletAddress} bet ${req.body.amount} in ${req.body.currencyMode} Mode`)
      const certData = await checkCert(body);
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
        console.log(`===lootBox from ${req.body.walletAddress})===invaild cert`)
        await addHackList(req.body.walletAddress);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`===Error in lootBox===`, err)
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
      console.log(`===${req.body.walletAddress} bet in turtleGame`)
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
        console.log(`===Play Turtle from ${req.body.walletAddress})===invaild cert`)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in play turtle"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`===Error in Play Turtle===`, err)
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
      console.log("===Error in getting previous Bet===", err);
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
      console.log("===Error in getting turtle history===", err)
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
      console.log(`===Error in getting data (${err})===`)
      console.log(`===Error in getting data (${err})===`)
      res.json({ status: false });
    }
  }
)

module.exports = router;