const bs58 = require("bs58");
const web3 = require("@solana/web3.js");
const log4js = require("log4js");

const Boards = require("../models/boardsModel");
const NFTDeposit = require("../models/pirateNFTDepositModel");
const Deposit = require("../models/depositModel");
const Raffle = require("../models/raffleModel");
const RaffleWinner = require("../models/raffleWinnerModel");
const Hack = require("../models/hackModel");
const Reward = require("../models/rewardModel");
const User = require("../models/userModel");
const THistory = require("../models/transactionHistoryModel");
const History = require("../models/historyModel");
const Holder = require("../models/holderModel");
const Checking = require("../models/checkingModel");
const TurtleMulti = require("../models/turtleMultiModel");

const { saveTransactionHistory } = require("./history");
const HashList = require("../HashList.json");
const HouseEdge = require("../models/houseEdgeModel");
const Popup = require("../models/popupModel");
const whiteListModel = require("../models/whiteListModel");
const withdrawBanModel = require("../models/withdrawBanModel");
const turtleMultiModel = require("../models/turtleMultiModel");
const TurtleHistory = require("../models/turtleHistoryModel");

log4js.configure({
  appenders: { log4js: { type: "file", filename: "/backend5.log" } },
  categories: { default: { appenders: ["log4js"], level: "ALL" } }
});

const logger = log4js.getLogger("default");

let payouts = true;

const getMulti = (coinAmount, mineAmount, houseEdge) => {
  let tempMulti = 1;
  for (let j = 0; j < coinAmount; j++) {
    tempMulti *= 25 / (25 - mineAmount);
  }
  return tempMulti * houseEdge;
};

const withdrawETH = async (walletAddress, payout) => {
  console.log(`===Withdraw Fund Started===${walletAddress, payout}`);
  const query = { walletAddress: walletAddress };
  const nuggetData = await User.findOne(query);
  const nuggetBalance = nuggetData.nugAmount;
  console.log(`===nuggetBalance on DB (${nuggetBalance})===`)
  console.log(`===nuggetBalance on DB (${nuggetBalance})===`)
  if (payout > nuggetBalance || payout <= 0) return { status: "error", content: "Insufficient Nugget." }
  else {

    const balance = nuggetBalance - parseFloat(payout);
    const update = {
      $set:
      {
        nugAmount: balance,
      }
    }
    const option = { $upsert: true };
    await User.findOneAndUpdate(query, update, option);
    return { status: "success", content: balance };
  }
}

const withdrawDAI = async (walletAddress, payout) => {
  console.log(`===Withdraw Fund Started===${walletAddress, payout}`);
  const query = { walletAddress: walletAddress };
  const bonusNuggetData = await User.findOne(query);
  const bonusNuggetBalance = bonusNuggetData.bonusNugAmount;
  console.log(`===bonusNuggetBalance on DB (${bonusNuggetBalance})===`)
  if (payout > bonusNuggetBalance || payout <= 0) return { status: "error", content: "Insufficient Nugget." }
  else {

    const balance = bonusNuggetBalance - parseFloat(payout);
    const update = {
      $set:
      {
        bonusNugAmount: balance,
      }
    }
    const option = { $upsert: true };
    await User.findOneAndUpdate(query, update, option);
    return { status: "success", content: balance };
  }
}

const claimReward = async (walletAddress, payout, game, wager) => {
  try {
    console.log("===Let's start cash out===");
    if (game === "Minesrush") {
      const query = { walletAddress: walletAddress };
      const curBoard = await Boards.findOne(query);
      const clickeddata = JSON.parse(curBoard.boardClickedString);
      let payAmount = 0;
      let coinAmount = 0;
      for (let i = 0; i < 25; i++) {
        if (clickeddata[i] === 1) {
          coinAmount++
        }
      }
      const multi = getMulti(coinAmount, curBoard.mineAmount, curBoard.houseEdge);
      payAmount = multi * curBoard.bettingAmount;
      console.log("===payamount on DB is", payAmount);
      console.log("===payout from client is ", payout);
      let body;
      const nugData = await User.findOne(query);
      if (curBoard.currencyMode === "mainNug") {
        let nugBalance = nugData.nugAmount + payAmount;
        const update = {
          $set: {
            walletAddress: walletAddress,
            nugAmount: nugBalance
          }
        }
        const options = { upsert: true };
        await User.findOneAndUpdate(query, update, options);
        body = {
          walletAddress: walletAddress,
          type: "Play with SOL",
          amount: payAmount,
          transaction: "Mine"
        }
      } else if (curBoard.currencyMode === "bonusNug") {
        let nugBalance = nugData.bonusNugAmount + payAmount;
        const update = {
          $set: {
            walletAddress: walletAddress,
            bonusNugAmount: nugBalance
          }
        }
        const options = { upsert: true };
        await User.findOneAndUpdate(query, update, options);
        body = {
          walletAddress: walletAddress,
          type: "Play with NUGGETs",
          amount: payAmount,
          transaction: "Mine"
        }
      } else if (curBoard.currencyMode === "gem") {
        let nugBalance = nugData.gemAmount + payAmount;
        const update = {
          $set: {
            walletAddress: walletAddress,
            gemAmount: nugBalance
          }
        }
        const options = { upsert: true };
        await User.findOneAndUpdate(query, update, options);
        body = {
          walletAddress: walletAddress,
          type: "Play with GEM",
          amount: payAmount,
          transaction: "Mine"
        }
      }
      await saveTransactionHistory(body);
      return { status: true, content: payAmount };
    } else if (game === "double") {
      const query = { walletAddress: walletAddress };
      const curBoard = await Boards.findOne(query);
      let payAmount = 2 * curBoard.bettingAmount
      console.log("===payout from client is===", payout);
      console.log("===PayAmount from DB is ===", payAmount);

      let body
      const nugData = await User.findOne(query);
      if (curBoard.currencyMode === "mainNug") {
        let nugBalance = nugData.nugAmount + payAmount;
        const update = {
          $set: {
            walletAddress: walletAddress,
            nugAmount: nugBalance
          }
        }
        const options = { upsert: true };
        await User.findOneAndUpdate(query, update, options);
        body = {
          walletAddress: walletAddress,
          type: "Play with SOL",
          amount: payAmount,
          transaction: "Double"
        }
      } else if (curBoard.currencyMode === "bonusNug") {
        let nugBalance = nugData.bonusNugAmount + payAmount;
        const update = {
          $set: {
            walletAddress: walletAddress,
            bonusNugAmount: nugBalance
          }
        }
        const options = { upsert: true };
        await User.findOneAndUpdate(query, update, options);
        body = {
          walletAddress: walletAddress,
          type: "Play with NUGGETs",
          amount: payAmount,
          transaction: "Double"
        }
      } else if (curBoard.currencyMode === "gem") {
        let nugBalance = nugData.gemAmount + payAmount;
        const update = {
          $set: {
            walletAddress: walletAddress,
            gemAmount: nugBalance
          }
        }
        const options = { upsert: true };
        await User.findOneAndUpdate(query, update, options);
        body = {
          walletAddress: walletAddress,
          type: "Play with GEM",
          amount: payAmount,
          transaction: "Double"
        }
      }
      await saveTransactionHistory(body);
      return { status: true, content: payAmount };
    }
  }
  catch (err) {
    console.log("Error while cash out.", err);
    return false
  };
};

const insertBoard = async (boardObject) => {
  const query = { walletAddress: boardObject.walletAddress };
  const options = { upsert: true };
  const depositData = await Deposit.findOne(query);
  const update = {
    $set: {
      walletAddress: boardObject.walletAddress,
      bettingAmount: depositData.bettingAmount,
      boardClickedString: boardObject.boardClickedString,
      boardString: boardObject.boardString,
      fail: false,
      houseEdge: boardObject.houseEdge,
      mineAmount: depositData.mineAmount,
      currencyMode: boardObject.currencyMode
    }
  };

  await Boards.findOneAndUpdate(query, update, options);
};

const checkAlreadyDeposit = async (data) => {
  const query = { walletAddress: data.walletAddress };
  const houseEdgeData = await HouseEdge.find({});
  if (0 < data.bettingAmount < 1.1 && houseEdgeData[0].minMine <= data.mineAmount && data.mineAmount <= houseEdgeData[0].maxMine) {
    const result = await Deposit.findOne(query);
    if (result) {
      result.mineAmount = data.mineAmount;
      const options = { upsert: true };
      const update = {
        $set: {
          walletAddress: data.walletAddress,
          bettingAmount: data.bettingAmount,
          mineAmount: data.mineAmount,
          currencyMode: data.currencyMode
        }
      };
      await Deposit.findOneAndUpdate(query, update, options);
      return { status: "success", content: true };
    } else {
      return { status: "success", content: false };
    }
  } else return { status: "error" };
};

const checkMine = async (checkData) => {
  const query = { walletAddress: checkData.walletAddress };
  const curBoard = await Boards.findOne(query);
  return curBoard
};

const userFailResetAll = async (data) => {
  const query = { walletAddress: data.walletAddress };
  await Deposit.deleteOne(query);
};

const userClickedCoin = async (data) => {
  const query = { walletAddress: data.walletAddress };
  const curBoard = await Boards.findOne(query);
  const clickeddata = JSON.parse(curBoard.boardClickedString);
  if (clickeddata[data.boardNum] == 1) {
    return "double click";
  }
  clickeddata[data.boardNum] = 1;
  curBoard.boardClickedString = JSON.stringify(clickeddata);
  const update = { $set: curBoard };
  const options = { upsert: true };
  await Boards.findOneAndUpdate(query, update, options);
  let result = true;
  return result;
};

const stopGame = async (data) => {
  const result = await claimReward(data.walletAddress, data.payout, data.game, data.wager);
  userFailResetAll(data);
  return result
};

const getBoard = (boardObject) => {
  const query = { walletAddress: boardObject };
  const result = Boards.findOne(query);
  return result;
};

const deposit = async (data) => {
  try {
    let query = { walletAddress: data.walletAddress };
    let update = { $set: data };
    const options = { upsert: true };
    let nugData = await User.findOne(query);
    let nuggetBalance = 0;
    let tHistory
    if (nugData) {
      if (data.currencyMode === "mainNug") {
        nuggetBalance = nugData.nugAmount - data.bettingAmount * 1.035;
        tHistory = new THistory({
          walletAddress: data.walletAddress,
          type: "Play with SOL",
          amount: -parseFloat(data.bettingAmount) * 1.035,
          transaction: data.gameMode === "minesrush" ? "Mine" : "Double",
          date: Date.now()
        })
      }
      else if (data.currencyMode === "bonusNug") {
        nuggetBalance = nugData.bonusNugAmount - data.bettingAmount;
        tHistory = new THistory({
          walletAddress: data.walletAddress,
          type: "Play with NUGGETs",
          amount: -parseFloat(data.bettingAmount) * 1.035,
          transaction: data.gameMode ? "Mine" : "Double",
          date: Date.now()
        })
      }
      else if (data.currencyMode === "gem") {
        nuggetBalance = nugData.gemAmount - data.bettingAmount;
        tHistory = new THistory({
          walletAddress: data.walletAddress,
          type: "Play with GEM",
          amount: -parseFloat(data.bettingAmount),
          transaction: data.gameMode ? "Mine" : "Double",
          date: Date.now()
        })
      }
    } else return false;
    if (nuggetBalance < 0) {
      console.log(`Nugget Balance is ${nuggetBalance} (${data.walletAddress} and amount is ${data.bettingAmount})`)
      return false;
    } else {
      await Deposit.findOneAndUpdate(query, update, options);
      if (data.currencyMode === "mainNug") {
        update = {
          $set: {
            nugAmount: nuggetBalance,
          }
        }
      }
      else if (data.currencyMode === "bonusNug") {
        update = {
          $set: {
            bonusNugAmount: nuggetBalance,
          }
        }
      }
      else if (data.currencyMode === "gem") {
        update = {
          $set: {
            gemAmount: nuggetBalance,
          }
        }
      }
      await User.findOneAndUpdate(query, update, options);
      await tHistory.save();

      query = { walletAddress: process.env.HOLDER_ADDR }
      nugData = await User.findOne(query);
      if (data.currencyMode === "mainNug") {
        if (nugData) {
          nuggetBalance = nugData.nugAmount + data.bettingAmount * 0.035;
        }
        else nuggetBalance = data.bettingAmount * 0.035;
        update = {
          $set: {
            nugAmount: nuggetBalance,
          }
        }
        await User.findOneAndUpdate(query, update, options);
        tHistory = new THistory({
          walletAddress: process.env.HOLDER_ADDR,
          type: "Play",
          amount: parseFloat(data.bettingAmount * 0.035),
          transaction: data.mineAmount < 3 ? "Double" : "Mine",
          date: Date.now()
        })
        await tHistory.save();
      } else if (data.currencyMode === "bonusNug") {
        if (nugData) {
          nuggetBalance = nugData.bonusNugAmount + data.bettingAmount * 0.035;
        }
        else nuggetBalance = data.bettingAmount * 0.035;
        update = {
          $set: {
            bonusNugAmount: nuggetBalance,
          }
        }
        await User.findOneAndUpdate(query, update, options);
        tHistory = new THistory({
          walletAddress: process.env.HOLDER_ADDR,
          type: "Play",
          amount: parseFloat(data.bettingAmount * 0.035),
          transaction: data.mineAmount < 3 ? "Double" : "Mine",
          date: Date.now()
        })
        await tHistory.save();
      }
      return true;
    }
  } catch (err) {
    console.log("Error in Deposit", err);
    console.log("Error in Deposit", err);
    return false;
  }
};

const addHackList = async (data) => {
  const query = { walletAddress: data.walletAddress };
  const white = await whiteListModel.findOne(query);
  if (!white) {
    console.log(`===This wallet is hackListed===(${data.walletAddress})`)
    const hack = new Hack({
      walletAddress: data.walletAddress,
      reason: data.reason,
      timeStamp: Date.now()
    })
    await hack.save();
  } else {
    console.log(`===This wallet is whiteList===(${data.walletAddress})`)
  }
}
const addWhiteList = async (data) => {
  const query = { walletAddress: data };
  const update = { $set: { walletAddress: data } };
  const options = { upsert: true };
  await whiteListModel.findOneAndUpdate(query, update, options);
}
const addWithdrawBanList = async (data) => {
  const query = { walletAddress: data };
  const update = { $set: { walletAddress: data } };
  const options = { upsert: true };
  await withdrawBanModel.findOneAndUpdate(query, update, options);
}
const addUserList = async (data) => {
  const query = { walletAddress: data };
  const update = {
    $set: {
      walletAddress: data,
      userName: data,
      avatar: "",
      nugAmount: 0,
      holder: false,
      rewardData: 0,
      deviceId: "",
      spinData: 0,
      logIn: false,
      bonusNugAmount: 0,
    }
  };
  const options = { upsert: true };
  await User.findOneAndUpdate(query, update, options);
}

//Limbo play
const depositNuggetForLimbo = async (data) => {
  try {
    const depositData = await User.findOne({ walletAddress: data.walletAddress });
    let dbAmount = 0, playAmount = 0;
    let earning = 0;
    if (depositData) {
      if (data.currencyMode === "mainNug") {
        dbAmount = depositData.nugAmount
      } else if (data.currencyMode === "bonusNug") {
        dbAmount = depositData.bonusNugAmount
      } else {
        dbAmount = depositData.gemAmount
      }
    }
    if (parseFloat(data.payout) > parseFloat(data.limboWord)) {
      playAmount = parseFloat(dbAmount) - parseFloat(data.amount);
    } else {
      playAmount = parseFloat(dbAmount) + parseFloat(data.amount) * (data.payout - 1);
      earning = parseFloat(data.amount) * data.payout
    }
    playAmount = parseFloat(playAmount).toFixed(3)

    let update;
    if (data.currencyMode === "mainNug") {
      update = {$set: {
        walletAddress: data.walletAddress,
        nugAmount: playAmount,
      }}
    } else if (data.currencyMode === "bonusNug") {
      update = {$set: {
        walletAddress: data.walletAddress,
        bonusNugAmount: playAmount,
      }}
    } else {
      update = {$set: {
        walletAddress: data.walletAddress,
        gemAmount: playAmount,
      }}
    }
    await User.findOneAndUpdate(
      { walletAddress: data.walletAddress },
      update,
      { upsert: true }
    )
    return { status: true, playAmount: playAmount, limboWord: data.limboWord, earning: earning }
  } catch (err) {
    console.log("error in deposit utility", err);
    return { status: false }
  }
}

// Dice play
const depositNuggetForDice = async (data) => {
  try {
    const depositData = await User.findOne({ walletAddress: data.walletAddress });
    let dbAmount = 0, playAmount = 0;
    let earning = 0;
    if (depositData) {
      if (data.currencyMode === "mainNug") {
        dbAmount = depositData.nugAmount
      } else if (data.currencyMode === "bonusNug") {
        dbAmount = depositData.bonusNugAmount
      } else {
        dbAmount = depositData.gemAmount
      }
    }
    if (parseFloat(data.percent) < parseFloat(data.diceWord)) {
      playAmount = parseFloat(dbAmount) - parseFloat(data.amount);
    } else {
      playAmount = parseFloat(dbAmount) + parseFloat(data.amount) * (data.payout - 1);
      earning = parseFloat(data.amount )* data.payout;
    }
    playAmount = parseFloat(playAmount).toFixed(3)

    
    let update;
    if (data.currencyMode === "mainNug") {
      update = {$set: {
        walletAddress: data.walletAddress,
        nugAmount: playAmount,
      }}
    } else if (data.currencyMode === "bonusNug") {
      update = {$set: {
        walletAddress: data.walletAddress,
        bonusNugAmount: playAmount,
      }}
    } else {
      update = {$set: {
        walletAddress: data.walletAddress,
        gemAmount: playAmount,
      }}
    }
    await User.findOneAndUpdate(
      { walletAddress: data.walletAddress },
      update,
      { upsert: true }
    )
    return { status: true, playAmount: playAmount, diceWord: data.diceWord, earning: earning }
  } catch (err) {
    console.log("error in deposit utility", err);
    return { status: false }
  }
}


const depositNugget = async (data) => {
  try {
    const depositData = await User.findOne({ walletAddress: data.walletAddress });
    let dbAmount = 0;
    if (depositData)
      dbAmount = depositData.nugAmount
    const depositAmount = parseFloat(dbAmount) + parseFloat(data.depositAmount);
    await User.findOneAndUpdate(
      { walletAddress: data.walletAddress },
      {
        $set: {
          walletAddress: data.walletAddress,
          nugAmount: depositAmount
        }
      },
      { upsert: true }
    )
    const req = {
      walletAddress: data.walletAddress,
      type: "Deposit",
      amount: data.depositAmount,
      transaction: data.transaction
    }
    await saveTransactionHistory(req);
    return depositAmount
  } catch (err) {
    console.log("error in deposit utility", err);
    return false
  }
}

const depositDai = async (data) => {
  try {
    const depositData = await User.findOne({ walletAddress: data.walletAddress });
    let dbAmount = 0;
    if (depositData)
      dbAmount = depositData.bonusNugAmount
    const depositAmount = parseFloat(dbAmount) + parseFloat(data.depositAmount);
    await User.findOneAndUpdate(
      { walletAddress: data.walletAddress },
      {
        $set: {
          walletAddress: data.walletAddress,
          bonusNugAmount: depositAmount
        }
      },
      { upsert: true }
    )
    return depositAmount
  } catch (err) {
    console.log("error in deposit utility", err);
    return false
  }
}

const depositBonusNugget = async (data) => {
  try {
    const depositData = await User.findOne({ walletAddress: data.walletAddress });
    let dbAmount = 0;
    if (depositData)
      dbAmount = depositData.bonusNugAmount;
    const depositAmount = parseFloat(dbAmount) + parseFloat(data.depositAmount);
    await User.findOneAndUpdate(
      { walletAddress: data.walletAddress },
      {
        $set: {
          walletAddress: data.walletAddress,
          bonusNugAmount: depositAmount
        }
      },
      { upsert: true }
    )
    const req = {
      walletAddress: data.walletAddress,
      type: "NFTDeposit",
      amount: data.depositAmount,
      transaction: data.transaction
    }
    await saveTransactionHistory(req);
    return depositAmount
  } catch (err) {
    console.log("error in deposit utility", err);
    return false
  }
}

const giveRewards = async ({ walletAddress, amount }) => {
  const query = { walletAddress: walletAddress };
  const nugData = await User.findOne(query);
  let rewards = 0;
  if (nugData) rewards = parseFloat(nugData?.nugAmount) + parseFloat(amount);
  else rewards = parseFloat(amount);
  const date = new Date().getDate();
  const update = {
    $set: {
      walletAddress: walletAddress,
      nugAmount: rewards,
      rewardData: date
    }
  }
  const options = { upsert: true };
  await User.findOneAndUpdate(query, update, options);

  const rewardlist = {
    walletAddress: walletAddress,
    type: "Nug Reward",
    amount: parseFloat(amount),
    date: Date.now(),
    transaction: "Nug Reward"
  }
  await saveTransactionHistory(rewardlist);
  return { rewards: rewards, date: date }
}
const giveBRewards = async ({ walletAddress, amount }) => {
  const query = { walletAddress: walletAddress };
  const bnugData = await User.findOne(query);
  let rewards = 0;
  if (bnugData?.bonusNugAmount) rewards = parseFloat(bnugData?.bonusNugAmount) + parseFloat(amount);
  else rewards = parseFloat(amount);
  const date = new Date().getDate();
  const update = {
    $set: {
      walletAddress: walletAddress,
      bonusNugAmount: rewards,
      rewardData: date
    }
  }
  const options = { upsert: true };
  await User.findOneAndUpdate(query, update, options);

  const rewardlist = {
    walletAddress: walletAddress,
    type: "Bonus Reward",
    amount: parseFloat(amount),
    date: Date.now(),
    transaction: "Bonus Reward"
  }
  await saveTransactionHistory(rewardlist);
  return { rewards: rewards, date: date }
}
const giveGemRewards = async ({ walletAddress, amount }) => {
  const query = { walletAddress: walletAddress };
  const gemData = await User.findOne(query);
  let rewards = 0;
  if (gemData?.gemAmount) rewards = parseFloat(gemData?.gemAmount) + parseFloat(amount);
  else rewards = parseFloat(amount);
  const date = new Date().getDate();
  const update = {
    $set: {
      walletAddress: walletAddress,
      gemAmount: rewards,
      rewardData: date
    }
  }
  const options = { upsert: true };
  await User.findOneAndUpdate(query, update, options);

  const rewardlist = {
    walletAddress: walletAddress,
    type: "Gem Reward",
    amount: parseFloat(amount),
    date: Date.now(),
    transaction: "Gem Reward"
  }
  await saveTransactionHistory(rewardlist);
  return { rewards: rewards, date: date }
}
const spinPrize = async ({ walletAddress, amount }) => {
  const query = { walletAddress: walletAddress };
  const nugData = await User.findOne(query);
  let rewards = 0;
  if (!nugData?.spinNum && nugData.spinData !== new Date().getDate()) {
    const update = {
      $set: {
        spinNum: 2
      }
    }
    const options = { upsert: true };
    await User.findOneAndUpdate(query, update, options);
  }
  if (!nugData?.spinData) {
    const update = {
      $set: {
        spinData: 0
      }
    }
    const options = { upsert: true };
    await User.findOneAndUpdate(query, update, options);
  }
  if (amount > 0.5) {
    if (nugData) rewards = parseFloat(nugData?.bonusNugAmount) + parseFloat(amount);
    else rewards = parseFloat(amount);
    if (nugData.spinNum > 0) {

      const today = new Date().getDate();
      const update = {
        $set: {
          walletAddress: walletAddress,
          bonusNugAmount: rewards,
          spinData: today,
          spinNum: nugData.spinNum - 1,
        }
      }
      const options = { upsert: true };
      await User.findOneAndUpdate(query, update, options);

      const rewardlist = {
        walletAddress: walletAddress,
        type: "Spin",
        amount: parseFloat(amount),
        date: Date.now(),
        transaction: "Nugget"
      }
      await saveTransactionHistory(rewardlist);
      return { status: true, rewards: rewards, spinNum: nugData.spinNum - 1, spinDate: today }
    } else {
      return { status: false, content: "Out of Spin." };
    }
  } else {
    if (nugData) rewards = parseFloat(nugData?.nugAmount) + parseFloat(amount);
    else rewards = parseFloat(amount);
    if (nugData.spinNum > 0) {

      const today = new Date().getDate();
      const update = {
        $set: {
          walletAddress: walletAddress,
          nugAmount: rewards,
          spinData: today,
          spinNum: nugData.spinNum - 1,
        }
      }
      const options = { upsert: true };
      await User.findOneAndUpdate(query, update, options);

      const rewardlist = {
        walletAddress: walletAddress,
        type: "Spin",
        amount: parseFloat(amount),
        date: Date.now(),
        transaction: "SOL"
      }
      await saveTransactionHistory(rewardlist);
      return { status: true, rewards: rewards, spinNum: nugData.spinNum - 1, spinDate: today }
    } else {
      return { status: false, content: "Out of Spin." };
    }
  }
}
const getSpinDate = async ({ walletAddress }) => {
  const data = await User.findOne({ walletAddress: walletAddress });

  let spinDate = data.spinData;
  let spinNum = data.spinNum;

  if (!spinDate) {
    const query = { walletAddress: walletAddress };
    const update = {
      $set: {
        spinDate: 0
      }
    }
    const options = { upsert: true };
    await User.findOneAndUpdate(query, update, options);
    spinDate = 0
  }
  if (spinDate < new Date().getDate()) {
    const query = { walletAddress: walletAddress };
    const update = {
      $set: {
        spinNum: 2
      }
    }
    const options = { upsert: true };
    await User.findOneAndUpdate(query, update, options);
    spinNum = 2;
  }
  return { spinDate: spinDate, spinNum: spinNum }
}
const checkCert = async ({ type, walletAddress, num }) => {
  const checkData = await Checking.findOne({ walletAddress: walletAddress });
  console.log("checkData.cert", checkData?.cert)
  console.log("num", num);
  console.log("cert", checkData.cert);
  if (checkData && parseFloat(checkData?.cert) === parseFloat(num)) {
    console.log(`===Checking Succeed in ${type} (${walletAddress})===`)
    console.log("checking succeed")
    return true
  } else {
    console.log(`===Checking Failed in ${type} (${walletAddress})===`)
    console.log("checking failed")
    return false
  }
}

const getNFTDeposit = async () => {
  let data = await NFTDeposit.find({});
  return data.length
}

const resetDB = async () => {
  await Boards.remove({});
  await Deposit.remove({});
  await Hack.remove({});
  await History.remove({});
  await HouseEdge.remove({});
  await Raffle.remove({});
  await Reward.remove({});
  await THistory.remove({});
  await User.remove({});
}

const resetRaffle = async () => {
  await Raffle.remove({});
}

const downloadTickets = async () => {
  const raffles = await Raffle.find({});
  let wallets = [];
  let tickets = [];
  const ticketDatas = [
    ['WalletAddress', 'Number of Tickets'],
  ];

  for (let i = 0; i < raffles.length; i++) {
    let alreadyExists = false;
    for (let j = 0; j < wallets.length; j++) {
      if (wallets[j] === raffles[i].walletAddress) {
        tickets[j]++;
        alreadyExists = true;
      }
    }
    if (alreadyExists) continue;
    wallets.push(raffles[i].walletAddress);
    tickets.push(1);

  }
  for (let j = 0; j < wallets.length; j++) {
    const data = [
      wallets[j],
      tickets[j]
    ]
    ticketDatas.push(data);
  }
  return ticketDatas;
}

const claimRoalty = async (amount) => {
  accounts = await Holder.find({});
  console.log(`===Claim Roalty Started===${amount}`);
  //===SOL pay======//
  const connection = new web3.Connection(process.env.QUICK_NODE);
  let holderKeypair = web3.Keypair.fromSecretKey(
    bs58.decode(process.env.HOLDER_PRIV_KEY)
  );
  const holderbalance = await connection.getBalance(
    new web3.PublicKey(process.env.HOLDER_ADDR)
  );
  if (0 < amount * web3.LAMPORTS_PER_SOL < holderbalance) {

    for (i = 0; i < accounts.length; i++) {
      while (1) {
        console.log("address2", accounts[i].walletAddress);
        try {
          let tx = new web3.Transaction();
          tx.add(
            web3.SystemProgram.transfer({
              fromPubkey: holderKeypair.publicKey,
              toPubkey: new web3.PublicKey(accounts[i].walletAddress),
              lamports: parseInt(((accounts[i].nftAmount / HashList.length) * amount * web3.LAMPORTS_PER_SOL))
            })
          );
          const sig1 = await web3.sendAndConfirmTransaction(
            connection,
            tx,
            [holderKeypair,],
            { maxRetries: 10 },
          );
          console.log(`===THashValue normal->${sig1}===`);
          break;
        } catch (err) {
          console.log("error loop", err)
          console.log("error loop", err)
          console.log("wallet loop", accounts[i].walletAddress)
        }
      }
    }

  }
};

const getRaffle = async (walletAddress, addingTicket, type) => {
  try {
    const raffles = await Raffle.find({});
    const update = {
      walletAddress: walletAddress,
      index: raffles.length,
      type: type,
      date: Date.now()
    }
    if (addingTicket > 0) {
      for (let i = 0; i < addingTicket; i++) {
        const raffle = new Raffle(update);
        await raffle.save();
      }
    } else {
      for (let i = addingTicket; i < 0; i++) {
        await Raffle.findOneAndRemove({ walletAddress: walletAddress })
      }
    }
    const count = await Raffle.find({ walletAddress: walletAddress })
    return count.length;
  } catch (err) {
    console.log("Error on raffle utility, ", err);
    return false
  }
};

const getRaffles = async (walletAddress, type) => {
  try {
    const raffles = await Raffle.find({});
    const update = {
      walletAddress: walletAddress,
      index: raffles.length,
      type: type,
      date: Date.now()
    }
    const raffle = new Raffle(update);
    await raffle.save();
    const count = await Raffle.find({ walletAddress: walletAddress })
    return count.length;
  } catch (err) {
    console.log("Error on raffle utility, ", err);
    return false
  }
};

const getPayoutData = async () => {
  const houseEdgeData = await HouseEdge.find({});
  return houseEdgeData[0].autoPayout
}
const setPayoutData = async (value) => {
  const update = {
    $set: {
      autoPayout: value
    }
  }
  const options = { $upsert: true };
  await HouseEdge.findOneAndUpdate({}, update, options);
  const houseEdgeData = await HouseEdge.find({});
  return houseEdgeData[0].autoPayout
}
const setRaffleMode = async (value) => {
  const update = {
    $set: {
      raffleOn: value
    }
  }
  const options = { $upsert: true };
  await HouseEdge.findOneAndUpdate({}, update, options);
  const houseEdgeData = await HouseEdge.find({});
  return houseEdgeData[0].raffleOn
}
const setStartTurtle = async (value) => {
  const update = {
    $set: {
      startTurtle: value
    }
  }
  const options = { $upsert: true };
  await HouseEdge.findOneAndUpdate({}, update, options);
  const houseEdgeData = await HouseEdge.find({});
  return houseEdgeData[0].startTurtle
}
const payout = async () => {
  const date = 1000 * 3600 * 24
  setInterval(() => {
    const today = new Date().getDay();
    if (today === 1 && payouts) {
      claimRoalty(5);
      payouts = false;
    } else if (today === 2) payouts = true;
  }, date)
}

const raffleWinners = async () => {
  let winners = [];
  let raffleUser = [];
  const raffleData = await Raffle.find({});
  for (let i = 0; i < raffleData.length; i++) {
    if (raffleUser.includes(raffleData[i].walletAddress)) {

    } else {
      raffleUser.push(raffleData[i].walletAddress)
    }
  }
  await RaffleWinner.remove({});
  if (raffleUser.length > 4) {
    while (winners.length < 5) {
      const random = Math.floor(Math.random() * (raffleData.length));
      if (!winners.includes(raffleData[random].walletAddress)) {
        winners.push(raffleData[random].walletAddress);
        const winner = new RaffleWinner({
          walletAddress: raffleData[random].walletAddress,
          index: raffleData[random].index,
          date: Date.now(),
        })
        await winner.save();
      }
    }
    await Raffle.remove({});
    return winners;
  } else return false;
}

const getDescription = async () => {
  const descData = await Popup.find({});
  return descData;
}

const giveLootPrize = async ({ amount, walletAddress, currencyMode, oddOption }) => {
  const query = { walletAddress: walletAddress };
  const pointer = Math.floor(Math.random() * 100000);
  console.log("pointer", pointer);
  const ratios = [
    [0, 40000, 82500, 100000],
    [0, 65000, 84000, 96000, 100000],
    [0, 53950, 93200, 98200, 100000],
    [0, 39400, 60400, 80400, 95400, 98400, 99800, 99960, 99990, 100000],
    [0, 99808, 100000],
    [0, 99908, 100000]
  ];
  const multipliers = [
    [0, 0.5, 4],
    [0.5, 1, 2, 5],
    [0.1, 0.5, 5, 25],
    [0, 0.5, 1, 2, 5, 10, 25, 50, 100],
    [0, 500],
    [0.5, 500],
  ];
  const userData = await User.findOne(query);
  if ((currencyMode === "mainNug" && userData.nugAmount > amount * 1.035) || (currencyMode === "bonusNug" && userData.bonusNugAmount > amount * 1.035) || (currencyMode === "gem" && userData.gemAmount > amount)) {
    for (let i = 0; i < ratios[oddOption].length - 1; i++) {
      if (ratios[oddOption][i] <= pointer && pointer < ratios[oddOption][i + 1]) {
        let earning = amount * multipliers[oddOption][i];

        let nugAmount
        let bonusNugAmount
        let gemAmount
        console.log("currencyMode", currencyMode);
        if (currencyMode === "mainNug") {
          nugAmount = userData.nugAmount + earning - amount * 1.035;
          bonusNugAmount = userData.bonusNugAmount;
          gemAmount = userData.gemAmount;
        }
        else if (currencyMode === "bonusNug") {
          nugAmount = userData.nugAmount;
          bonusNugAmount = userData.bonusNugAmount - amount * 1.035 + earning;
          gemAmount = userData.gemAmount;
        }
        else if (currencyMode === "gem") {
          nugAmount = userData.nugAmount;
          bonusNugAmount = userData.bonusNugAmount;
          gemAmount = userData.gemAmount - amount + earning;
        }
        console.log(`pointer: ${pointer}, nugAmount: ${userData.nugAmount} and earning is ${earning}, so total nugAmount is ${nugAmount} in ${walletAddress}`);
        console.log(`pointer: ${pointer}, nugAmount: ${userData.nugAmount} and earning is ${earning}, so total nugAmount is ${nugAmount} in ${walletAddress}`);
        let update = {
          $set: {
            nugAmount: nugAmount,
            bonusNugAmount: bonusNugAmount,
            gemAmount: gemAmount
          }
        }
        const options = { $upsert: true }
        await User.findOneAndUpdate(query, update, options);

        const queries = { walletAddress: process.env.HOLDER_ADDR }
        const nugData = await User.findOne(queries);
        let raffle = -1;
        if (currencyMode !== "gem") {
          if (nugData) {
            if (currencyMode === "mainNug") {
              nuggetBalance = nugData.nugAmount + amount * 0.035;
              update = {
                $set: {
                  nugAmount: nuggetBalance,
                }
              }
            }
            else if (currencyMode === "bonusNug") {
              nuggetBalance = nugData.bonusNugAmount + amount * 0.035;
              update = {
                $set: {
                  bonusNugAmount: nuggetBalance,
                }
              }
            }
          }
          await User.findOneAndUpdate(queries, update, options);
          const tHistory = new THistory({
            walletAddress: process.env.HOLDER_ADDR,
            type: "Play",
            amount: parseFloat(amount * 0.035),
            transaction: "Loot",
            date: Date.now()
          })
          await tHistory.save();
          // }

          if (multipliers[oddOption][i] > 1 && currencyMode === "mainNug") {
            const type = "Loot"
            raffle = await getRaffles(walletAddress, type)
          }
        }
        return { nugAmount: nugAmount, raffle: raffle, bonusNugAmount: bonusNugAmount, gemAmount: gemAmount, earning: earning, multiplier: multipliers[oddOption][i] }
      }
    }
  } else
    return false
}

const giveNFTPrize = async ({ amount, walletAddress, currencyMode, oddOption }) => {
  const query = { walletAddress: walletAddress };
  const pointer = Math.floor(Math.random() * 100);
  const ratios = [0, 94, 95, 96, 97, 98, 99, 100];
  const nftAddresses = [
    "Cets on Creck",
    "Immortals",
    "Lily",
    "Degen Fat Cat",
    "Oak Paradise",
    "Degen Taxi"
  ]
  const userData = await User.findOne(query);
  if ((currencyMode === "mainNug" && userData.nugAmount > amount * 1.035) || currencyMode === "bonusNug" && userData.bonusNugAmount > amount * 1.035) {

    let NFTName = 0;
    switch (pointer) {
      case 94:
        NFTName = nftAddresses[0];
        break;
      case 95:
        NFTName = nftAddresses[1];
        break;
      case 96:
        NFTName = nftAddresses[2];
        break;
      case 97:
        NFTName = nftAddresses[3];
        break;
      case 98:
        NFTName = nftAddresses[4];
        break;
      case 99:
        NFTName = nftAddresses[5];
        break;
      default:
        NFTName = 0
        break;
    }

    let nugAmount
    let bonusNugAmount
    if (currencyMode === "mainNug") {
      nugAmount = userData.nugAmount - amount * 1.035;
      bonusNugAmount = userData.bonusNugAmount;
    }
    else {
      nugAmount = userData.nugAmount;
      bonusNugAmount = userData.bonusNugAmount - amount * 1.035;
    }
    let update = {
      $set: {
        nugAmount: nugAmount,
        bonusNugAmount: bonusNugAmount
      }
    }
    const options = { $upsert: true }
    await User.findOneAndUpdate(query, update, options);

    const queries = { walletAddress: process.env.HOLDER_ADDR }
    const nugData = await User.findOne(queries);
    if (nugData) {
      if (currencyMode === "mainNug") {
        nuggetBalance = nugData.nugAmount + amount * 0.035;
        update = {
          $set: {
            nugAmount: nuggetBalance,
          }
        }
      } else {
        nuggetBalance = nugData.bonusNugAmount + amount * 0.035;
        update = {
          $set: {
            bonusNugAmount: nuggetBalance,
          }
        }
      }
    }
    await User.findOneAndUpdate(queries, update, options);
    const tHistory = new THistory({
      walletAddress: process.env.HOLDER_ADDR,
      type: "Play",
      amount: parseFloat(amount * 0.035),
      transaction: "LootNFT",
      date: Date.now()
    })
    await tHistory.save();
    // }
    NFTName = nftAddresses[1];
    if (NFTName !== 0)
      return { nugAmount: nugAmount, bonusNugAmount: bonusNugAmount, earning: nftAddress }
  } else
    return false
}

//====Turtles Race====
let startTurtle
const date = 1000 * 35
let clock = date / 1000;
let started = false;
const start = () => {
  startTurtle = setInterval(async () => {
    try {
      if (!started) {
        started = true;
        let timer = () => {
          updateTime(clock);
          const interval = setInterval(() => {
            clock--;
            updateTime(clock);
          }, 1000)
          setTimeout(() => {
            clock = date / 1000;
            clearInterval(interval);
          }, date)
        }
        timer();
        const houseOddsMultiplier = 0.7 + Math.random() * 0.1;
        const quinellaMultiplier = 0.35 + Math.random() * 0.05;
        const update = {
          $set: {
            turtleHouseEdge: houseOddsMultiplier,
            quinellaHouseEdge: quinellaMultiplier
          }
        }
        const option = { $upsert: true }
        await HouseEdge.findOneAndUpdate({}, update, option)
        let horseOdds = [];
        let houseOdds = [];
        let sum = 0;
        for (let i = 0; i < 6; i++) {
          const horseOdd = Math.random() * 0.5;
          sum += horseOdd;
          horseOdds.push(horseOdd);
        }
        horseOdds = horseOdds.map((horseOdd) => {
          const houseOdd = (sum / horseOdd * houseOddsMultiplier).toFixed(1)
          houseOdds.push(houseOdd);
          return horseOdd / sum
        })
        await TurtleMulti.remove({});
        for (let i = 0; i < 6; i++) {
          const turtleMulti = new TurtleMulti({
            turtle: i + 1,
            horseOdd: horseOdds[i],
            multiplier: houseOdds[i]
          })
          await turtleMulti.save();
        }
        await pickWinner()
        started = false
      }
    } catch (err) {
      started = false
      console.log("err", err)
      console.log(`===Error while generating multiplier ${err}`)
    }
  }, date)
}
const updateTime = async (turtleTime) => {
  const update = {
    $set: {
      turtleTime: turtleTime
    }
  }
  const options = { $upsert: true }
  await HouseEdge.findOneAndUpdate({}, update, options)
}
const pickWinner = async () => {
  // pick first
  const first = Math.random();
  const horseOdds = await TurtleMulti.find({});
  const houseEdge = await HouseEdge.find({});
  let prev = 0;
  let turtleFirst = 0;
  let turtleSecond;
  let foundSec = false;
  for (let i = 0; i < horseOdds.length; i++) {
    let next = prev + horseOdds[i].horseOdd;
    if (prev < first && first < next) {
      turtleFirst = i
      break;
    } else {
      prev = next;
    }
  }
  // pick second
  while (!foundSec) {
    prev = 0;
    let second = Math.random();
    for (let i = 0; i < horseOdds.length; i++) {
      let next = prev + horseOdds[i].horseOdd;
      if (prev < second && second < next) {
        turtleSecond = i
        if (turtleSecond === turtleFirst) break;
        else
          foundSec = true
        break;
      } else {
        prev = next;
      }
    }
  }
  const update = {
    $set: {
      turtleFirst: turtleFirst,
      turtleSecond: turtleSecond
    }
  }
  const options = { $upsert: true }
  await HouseEdge.findOneAndUpdate({}, update, options)
  const turtleHistory = new TurtleHistory({
    first: turtleFirst,
    second: turtleSecond,
    winMultiplier: horseOdds[turtleFirst].multiplier,
    quinellaMultiplier: horseOdds[turtleFirst].multiplier * horseOdds[turtleSecond].multiplier * houseEdge[0].quinellaHouseEdge
  })
  await turtleHistory.save()
}
const generateTurtleMulti = async (isStart) => {
  // const date = 1000 * 3600 * 12

  console.log("Turtle Multiplier Generate.");


  if (isStart) {
    if (startTurtle) {
      console.log("already started")
    } else {
      start();
    }
  } else {
    console.log("clearInterval")
    if (startTurtle) clearInterval(startTurtle);
  }
}

const isBanned = async (walletAddress) => {
  const query = { walletAddress: walletAddress }
  const banList = await withdrawBanModel.findOne(query);
  return banList
}

const getMultiplier = async () => {
  const multipliers = await TurtleMulti.find({});
  const quinellaData = await HouseEdge.find({});
  const qHouseEdge = quinellaData[0].quinellaHouseEdge;
  const turtleTime = quinellaData[0].turtleTime;
  const data = multipliers.map((multiplierData) => {
    return {
      turtleId: multiplierData.turtle,
      multiplier: multiplierData.multiplier
    }
  })
  return { multiData: data, qHouseEdge: qHouseEdge, turtleTime: turtleTime }
}

const pirateNFTDeposit = async (data) => {
  const item = new NFTDeposit({
    walletAddress: data.walletAddress,
    nftName: data.nftName
  })

  await item.save();
  return true
}

const getRemaining = async () => {
  const houseEdgeData = await HouseEdge.find({});
  let remaining = houseEdgeData[0].remainedNFT;
  let remainingTime1 = houseEdgeData[0].remainedTime1;
  let remainingTime2 = houseEdgeData[0].remainedTime2;
  let remainedTime = 0;
  let phase = 1;
  if (remainingTime1 > 1) {
    phase = 1;
    remainedTime = remainingTime1;
  }
  else if (remainingTime2 > 1) {
    phase = 2;
    remainedTime = remainingTime2;
  } else {
    phase = 3;
  }
  return { remainedNFT: remaining, remainedTime: remainedTime, phase: phase }
}

const getRemainedNFT = async () => {
  const houseEdgeData = await HouseEdge.find({});
  let remaining = houseEdgeData[0].remainedNFT;
  return { remainedNFT: remaining }
}

const updateClock1 = async (remain) => {
  const update = {
    $set: {
      remainedTime1: remain
    }
  }
  const options = { $upsert: true }
  await HouseEdge.findOneAndUpdate({}, update, options)
}
const updateClock2 = async (remain) => {
  const update = {
    $set: {
      remainedTime2: remain
    }
  }
  const options = { $upsert: true }
  await HouseEdge.findOneAndUpdate({}, update, options)
}

const timer = async (duration) => {
  let remain1 = duration / 1000;
  let remain2 = duration / 1000 * 2;
  const interval1 = setInterval(() => {
    remain1--;
    updateClock1(remain1);
  }, 1000)
  const interval2 = setInterval(() => {
    remain2--;
    updateClock2(remain2);
  }, 1000)

  setTimeout(() => {
    clearInterval(interval1);
  }, remain1 * 1000)
  setTimeout(() => {
    clearInterval(interval2);
  }, remain2 * 1000)
}

const setMintInterval = async (data) => {
  const houseData = await HouseEdge.find({});
  const update = {
    $set: {
      _id: houseData[0]._id,
      turtleHouseEdge: houseData[0].turtleHouseEdge,
      quinellaHouseEdge: houseData[0].quinellaHouseEdge,
      turtleTime: houseData[0].turtleTime,
      startTurtle: houseData[0].startTurtle,
      turtleFirst: houseData[0].turtleFirst,
      turtleSecond: houseData[0].turtleSecond,
      raffleDate: houseData[0].raffleDate,
      remainedTime1: data.interval / 1000,
      remainedTime2: parseInt(data.interval / 1000) * 2,
      remainedNFT: data.remainedNFT
    }
  }
  const options = { upsert: true }
  await HouseEdge.findOneAndUpdate({}, update, options)
  timer(data.interval);
}

const playTurtle = async (data) => {
  const query = { walletAddress: data.walletAddress };
  const options = { upsert: true }
  const turtleData = await HouseEdge.find({});
  const turtleMulti = await turtleMultiModel.find({});
  const userData = await User.findOne(query);
  const turtleFirst = turtleData[0].turtleFirst
  const turtleSecond = turtleData[0].turtleSecond
  let winMultiplier;
  let quinellaMultiplier;
  let bEarning = 0;
  let mEarning = 0;
  let bBetAmount = 0;
  let mBetAmount = 0;
  for (let i = 0; i < data.singleGame.length; i++) {
    if (data.singleGame[i].betAmount > 0) {
      if (data.currencyMode === "bonusNug" || data.currencyMode === "gem") {
        if (data.singleGame[i].id - 1 === turtleFirst) {
          console.log("bid", data.singleGame[i].id - 1)
          console.log("bmulti", turtleMulti[data.singleGame[i].id - 1].multiplier)
          winMultiplier = turtleMulti[data.singleGame[i].id - 1].multiplier
          bEarning += data.singleGame[i].betAmount * winMultiplier;
        }
        bBetAmount += data.singleGame[i].betAmount;
      } else if (data.currencyMode === "mainNug") {
        if (data.singleGame[i].id - 1 === turtleData[0].turtleFirst) {
          console.log("id", data.singleGame[i].id - 1)
          console.log("multi", turtleMulti[data.singleGame[i].id - 1].multiplier)
          winMultiplier = turtleMulti[data.singleGame[i].id - 1].multiplier
          mEarning += data.singleGame[i].betAmount * winMultiplier;
        }
        mBetAmount += data.singleGame[i].betAmount;
      }
    }
  }
  for (let i = 0; i < data.quinellaGame.length; i++) {
    if (data.quinellaGame[i].betAmount > 0) {
      if (data.currencyMode === "bonusNug" || data.currencyMode === "gem") {
        if ((data.quinellaGame[i].id1 - 1 === turtleData[0].turtleFirst || data.quinellaGame[i].id2 - 1 === turtleData[0].turtleFirst) && (data.quinellaGame[i].id1 - 1 === turtleData[0].turtleSecond || data.quinellaGame[i].id2 - 1 === turtleData[0].turtleSecond)) {
          quinellaMultiplier = turtleMulti[data.quinellaGame[i].id2 - 1].multiplier * turtleMulti[data.quinellaGame[i].id1 - 1].multiplier * turtleData[0].quinellaHouseEdge
          bEarning += data.quinellaGame[i].betAmount * quinellaMultiplier;
        }
        bBetAmount += data.quinellaGame[i].betAmount;
      } else if (data.currencyMode === "mainNug") {
        if ((data.quinellaGame[i].id1 - 1 === turtleData[0].turtleFirst || data.quinellaGame[i].id2 - 1 === turtleData[0].turtleFirst) && (data.quinellaGame[i].id1 - 1 === turtleData[0].turtleSecond || data.quinellaGame[i].id2 - 1 === turtleData[0].turtleSecond)) {
          quinellaMultiplier = turtleMulti[data.quinellaGame[i].id2 - 1].multiplier * turtleMulti[data.quinellaGame[i].id1 - 1].multiplier * turtleData[0].quinellaHouseEdge
          mEarning += data.quinellaGame[i].betAmount * quinellaMultiplier;
        }
        mBetAmount += data.quinellaGame[i].betAmount;
      }
    }
  }
  console.log(`bEarning: ${bEarning}, mEarning: ${mEarning}, bBetAmount: ${bBetAmount}, mBetAmount: ${mBetAmount}, turtleFirst: ${turtleFirst}, turtleSecond: ${turtleSecond}, winMultiplier: ${winMultiplier}, quinellaMultiplier: ${quinellaMultiplier}`)
  console.log(`bEarning: ${bEarning}, mEarning: ${mEarning}, bBetAmount: ${bBetAmount}, mBetAmount: ${mBetAmount}, winMultiplier: ${winMultiplier}, quinellaMultiplier: ${quinellaMultiplier}, walletAddress: ${data.walletAddress}`)
  if ((0 <= mBetAmount && mBetAmount <= userData.nugAmount) && ((data.currencyMode === "bonusNug" && 0 <= bBetAmount && bBetAmount <= userData.bonusNugAmount) || (data.currencyMode === "gem" && 0 <= bBetAmount && bBetAmount <= userData.gemAmount))) {
    let update
    if (data.currencyMode === "bonusNug" || data.currencyMode === "mainNug") {
      update = {
        $set: {
          bonusNugAmount: userData.bonusNugAmount - bBetAmount + bEarning,
          nugAmount: userData.nugAmount - mBetAmount + mEarning,
          turtleBet: {
            singleGame: data.singleGame,
            quinellaGame: data.quinellaGame
          }
        }
      }

    } else if (data.currencyMode === "gem" || data.currencyMode === "mainNug") {
      update = {
        $set: {
          gemAmount: userData.gemAmount - bBetAmount + bEarning,
          nugAmount: userData.nugAmount - mBetAmount + mEarning,
          turtleBet: {
            singleGame: data.singleGame,
            quinellaGame: data.quinellaGame
          }
        }
      }
    }
    await User.findOneAndUpdate(query, update, options);
    saveTurtleHistory(bEarning, data.currencyMode, bBetAmount, mEarning, mBetAmount, data.walletAddress, userData.userName);
    return { first: turtleData[0].turtleFirst, second: turtleData[0].turtleSecond, earning: bEarning }
  } else {
    return false
  }
}

const saveTurtleHistory = async (bEarning, currencyMode, bBetAmount, mEarning, mBetAmount, walletAddress, userName) => {

  const history = new History({
    walletAddress: walletAddress,
    game: "Turtle",
    player: userName,
    wager: bBetAmount,
    payout: bEarning,
    coin: 1,
    mine: 1,
    date: Date.now(),
    currencyMode: currencyMode
  })
  await history.save();
}

const getTurtleHistory = async () => {
  const histories = await TurtleHistory.find({}).sort({ $natural: -1 }).limit(30);
  return histories
}

const getPreviousBet = async (walletAddress) => {
  const userData = await User.findOne({ walletAddress: walletAddress })
  return userData.turtleBet
}

const setEnableGames = async ({ type, value }) => {
  console.log("type", type)
  console.log("value", value)
  let update
  if (type === "mines") {
    update = {
      $set: {
        enableMines: value
      }
    }
  } else if (type === "double") {
    update = {
      $set: {
        enableDouble: value
      }
    }
  } else if (type === "loot") {
    update = {
      $set: {
        enableLoot: value
      }
    }
  } else if (type === "turtle") {
    update = {
      $set: {
        enableTurtle: value
      }
    }
  }

  const options = { upsert: true };

  await HouseEdge.findOneAndUpdate({}, update, options);
  const houseEdgeData = await HouseEdge.find({});
  return houseEdgeData[0]
}

module.exports = {
  setEnableGames,
  getTurtleHistory,
  getPreviousBet,
  playTurtle,
  setMintInterval,
  insertBoard,
  checkAlreadyDeposit,
  checkMine,
  userFailResetAll,
  userClickedCoin,
  stopGame,
  getBoard,
  deposit,
  addHackList,
  addWhiteList,
  addWithdrawBanList,
  depositNuggetForLimbo,
  addUserList,
  depositNugget,
  depositDai,
  depositBonusNugget,
  withdrawETH,
  withdrawDAI,
  giveRewards,
  giveBRewards,
  giveGemRewards,
  resetDB,
  resetRaffle,
  downloadTickets,
  checkCert,
  claimRoalty,
  getRaffle,
  getRaffles,
  getPayoutData,
  setPayoutData,
  setRaffleMode,
  setStartTurtle,
  payout,
  raffleWinners,
  getDescription,
  spinPrize,
  getSpinDate,
  giveLootPrize,
  giveNFTPrize,
  generateTurtleMulti,
  isBanned,
  getMultiplier,
  pirateNFTDeposit,
  getNFTDeposit,
  getRemaining,
  getRemainedNFT,
  depositNuggetForDice,
}