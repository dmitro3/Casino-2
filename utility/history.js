const multer = require("multer");
const path = require("path");
const log4js = require("log4js");

const User = require("../models/userModel");
const Boards = require("../models/boardsModel");
const Deposit = require("../models/depositModel");
const History = require("../models/historyModel");
const Reward = require("../models/rewardModel");
const THistory = require("../models/transactionHistoryModel");
const Raffle = require("../models/raffleModel");
const Image = require("../models/imageModel");
const Popup = require("../models/popupModel");
const HouseEdge = require("../models/houseEdgeModel");
const NFTDeposit = require("../models/pirateNFTDepositModel");
const NewNFT = require("../models/newNFTModel");
// const { dirname } = require("path");

log4js.configure({
  appenders: { log4js: { type: "file", filename: "/home/jenkins/backend5.log" } },
  categories: { default: { appenders: ["log4js"], level: "ALL" } }
});

const logger = log4js.getLogger("default");

const getHistory = async () => {
  const histories = await History.find({}).sort({ $natural: -1 }).limit(11);
  const users = await User.find({});
  let datas = [];
  for (let i = 0; i < histories.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (histories[i].walletAddress === users[j].walletAddress) {
        const data = {
          walletAddress: histories[i].walletAddress,
          player: histories[i].player == null ? histories[i].walletAddress : histories[i].player,
          wager: histories[i].wager,
          game: histories[i].game,
          payout: histories[i].payout,
          avatar: users[j].avatar,
          currencyMode: histories[i].currencyMode
        }
        datas.push(data);
        break;
      }
    }
  }
  return datas;
};

const getAllHistory = async () => {
  const histories = await History.find({}).sort({ $natural: -1 });
  return histories;
};

const getTicket = async () => {
  const tickets = await Raffle.find({});
  return tickets
}

const getTHistory = async (data) => {
  const histories = await THistory.find({ walletAddress: data }).sort({ $natural: -1 });
  let datas = [];
  histories.map((history) => {
    if (history.type !== "Play" && history.type !== "Reward") datas.push(history)
  })
  // console.log("history", datas);
  return datas;
};

const getNugData = async (data) => {
  const histories = await THistory.find({ walletAddress: data }).sort({ $natural: -1 });
  // let datas = [];
  // histories.map((history) => {
  //   if(history.type !== "Play" && history.type !== "Reward") datas.push(history)
  // })
  // // console.log("history", datas);
  return histories;
};

const getPlayData = async (walletAddress) => {
  const playData = await History.find({ walletAddress: walletAddress });
  return playData
}

const getRewardData = async (walletAddress) => {
  const rewardData = await Reward.find({ walletAddress: walletAddress });
  return rewardData;
}

const getAllTHistory = async () => {
  const histories = await THistory.find({}).sort({ $natural: -1 });
  let datas = [];
  histories.map((history) => {
    if (history.type === "Withdraw" || history.type === "Deposit" || history.type === "Royalty" || history.type === "NFTDeposit" || history.type === "Spin") datas.push(history)
  })
  return datas;
};

const getDepositHistory = async () => {
  const histories = await NFTDeposit.find({});
  return histories;
};
const getNFTHistory = async () => {
  const histories = await NewNFT.find({});
  return histories;
};

const saveTransactionHistory = async (req) => {
  console.log("reqest", req)
  logger.info(`===Transaction history saved in ${req.type}, ${req.walletAddress}, ${req.transaction}===`)
  const history = new THistory({
    walletAddress: req.walletAddress,
    type: req.type,
    amount: req.amount,
    transaction: req.transaction,
    date: Date.now()
  })
  await history.save();
}

const saveHistory = async (historyData) => {
  const query = { walletAddress: historyData.walletAddress };
  if (historyData.game === "ArbiCasino") {
    const userData = await User.findOne(query);
    data = {
      walletAddress: historyData.walletAddress,
      game: historyData.game,
      player: userData.userName,
      wager: historyData.wager,
      payout: historyData.payout,
      coin: historyData.multiplier,
      mine: 1,
      date: Date.now(),
      currencyMode: historyData.currencyMode
    }
    const history = new History(data);
    await history.save();
  } else if (historyData.game === "ArbiCasinoNFT") {
    const userData = await User.findOne(query);
    data = {
      walletAddress: historyData.walletAddress,
      game: historyData.game,
      player: userData.userName,
      wager: historyData.wager,
      payout: historyData.payout,
      coin: historyData.payout === 0 ? 0 : 1,
      mine: 1,
      date: Date.now(),
      currencyMode: historyData.currencyMode
    }
    const history = new History(data);
    await history.save();
  } else if (historyData.game === "Limbo") {
    const userData = await User.findOne(query);
    data = {
      walletAddress: historyData.walletAddress,
      game: historyData.game,
      player: userData.userName,
      wager: historyData.wager,
      payout: historyData.payout,
      coin: 1,
      mine: 1,
      date: Date.now(),
      currencyMode: historyData.currencyMode
    }
    const history = new History(data);
    await history.save();
  } else if (historyData.game === "dice") {
    const userData = await User.findOne(query);
    data = {
      walletAddress: historyData.walletAddress,
      game: historyData.game,
      player: userData.userName,
      wager: historyData.wager,
      payout: historyData.earning === 0 ? 0 : 1,
      coin: historyData.earning === 0 ? 0 : 1,
      mine: 1,
      date: Date.now(),
      currencyMode: historyData.currencyMode
    }
    const history = new History(data);
    await history.save();
  }
  else {
    const boardData = await Boards.findOne(query);
    const userData = await User.findOne(query);

    let data;
    const clickedData = JSON.parse(boardData.boardClickedString);
    let count = 0;
    for (let i = 0; i < clickedData.length; i++) {
      if (clickedData[i]) count++;
    }
    data = {
      walletAddress: boardData.walletAddress,
      game: historyData.game,
      player: userData.userName,
      wager: boardData.bettingAmount,
      payout: historyData.payout,
      coin: count,
      mine: boardData.mineAmount,
      date: Date.now(),
      currencyMode: boardData.currencyMode
    }
    await Boards.deleteOne(query);
    await Deposit.deleteOne(query);
    const history = new History(data);
    await history.save();
  }
};

const getDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  return today;
};

const getTodayHistory = async () => {
  const today = Date.now() - 1000 * 3600 * 25;
  const results = await History.find({});
  let data = [];
  results.map((result, key) => {
    if (String(result.date).slice(0, 10) === String(Date(today)).slice(0, 10)) {
      data.push(result);
    }
  })
  return data
};

const getWeekHistory = async () => {
  let day = new Date().getDay();
  let sunday = new Date() - 1000 * 3600 * 24 * (day + 1);
  let data = [];
  const results = await History.find({});
  results.map((result, key) => {
    if (Date.parse(result.date) > sunday) {
      data.push(result);
    }
  })
  return data
};

const removeTicket = async (walletAddress) => {
  const ticketData = await Raffle.deleteOne({ walletAddress: walletAddress });
  return true;
}

const uploadImgs = async (imgs) => {
  for (let i = 0; i < imgs.length; i++) {
    const data = new Image({
      path: imgs[i],
      date: Date.now()
    })
    await data.save()
  }
  return true;
}
const updateImgs = async (newImgs, prev) => {
  const query = { path: prev };
  const update = {
    $set: {
      path: newImgs,
      date: Date.now()
    }
  }
  const options = { upsert: true };
  await Image.findOneAndUpdate(query, update, options);
  return true;
}
const deleteImg = async (img) => {
  await Image.remove({ path: img });
  return true;
}

const uploadDate = async (date) => {
  const now = new Date(Date());
  const duration = new Date(date) - now;
  const remain = new Date(duration);
  const remainDate = remain.getTime();

  const update = {
    $set: {
      raffleDate: new Date(date)
    }
  }
  const options = { $upsert: true }
  await HouseEdge.findOneAndUpdate({}, update, options);

  return true
}

const getNfts = async () => {
  const images = await Image.find({});
  return images;
}

const savePopup = async (texts) => {
  try {
    await Popup.remove({});
    const popup = new Popup({
      type: "test",
      content: texts
    });
    await popup.save();
    return true;
  } catch (err) {
    console.log("error on savePopup", err);
    return false
  }
}

const getTotalGames = async () => {
  const histories = await History.find({});
  let totalETHGames = 0;
  let totalNugGames = 0;
  let totalETHWager = 0;
  let totalETHEarning = 0;
  let totalNugWager = 0;
  let totalNugEarning = 0;
  histories.map(async (history, key) => {
    if (history.currencyMode === "mainNug") {
      totalETHWager += parseFloat(history.wager);
      totalETHEarning += parseFloat(history.payout);
      totalETHGames++;
    } else if(history.currencyMode === "bonusNug") {
      totalNugGames++;
      totalNugEarning += parseFloat(history.payout);
      totalNugWager += parseFloat(history.wager);
    }
  })
  return { totalETHGames: totalETHGames, totalNugGames: totalNugGames, totalETHWager: totalETHWager, totalETHEarning: totalETHEarning, totalNugEarning: totalNugEarning, totalNugWager: totalNugWager }
}

const updateDB = async () => {
  const boards = await Boards.find({});
  const deposits = await Deposit.find({});
  const histories = await History.find({});
  const tHistories = await THistory.find({});
  const users = await User.find({});
  const options = { $upsert: true }
  boards.forEach(async (board) => {
    const betAmount = board.bettingAmount / 1000;
    const query = { _id: board._id };
    const update = {
      $set: {
        bettingAmount: betAmount
      }
    }
    await Boards.findOneAndUpdate(query, update, options)
  })
  logger.info("===Board updated===")

  deposits.forEach(async (deposit) => {
    const betAmount = deposit.bettingAmount / 1000;
    const query = { _id: deposit._id };
    const update = {
      $set: {
        bettingAmount: betAmount
      }
    }
    await Deposit.findOneAndUpdate(query, update, options)
  })
  logger.info("===Deposit updated===")

  histories.forEach(async (history) => {
    const wager = history.wager / 1000;
    const payout = history.payout / 1000;
    const query = { _id: history._id };
    const update = {
      $set: {
        wager: wager,
        payout: payout
      }
    }
    await History.findOneAndUpdate(query, update, options)
  })
  logger.info("===History updated===")

  tHistories.forEach(async (tHistory) => {
    const amount = tHistory.amount / 1000;
    const query = { _id: tHistory._id };
    const update = {
      $set: {
        amount: amount
      }
    }
    await THistory.findOneAndUpdate(query, update, options);
  })
  logger.info("===THistory updated===")

  users.forEach(async (user) => {
    const nugAmount = user.nugAmount / 1000;
    const query = { _id: user._id };
    const update = {
      $set: {
        nugAmount: nugAmount
      }
    }
    await User.findOneAndUpdate(query, update, options);
  })
  logger.info("===User updated===")

}

module.exports = {
  getTotalGames,
  getHistory,
  getAllHistory,
  getTicket,
  getAllTHistory,
  getDepositHistory,
  getNFTHistory,
  getTHistory,
  getNugData,
  saveHistory,
  getTodayHistory,
  getWeekHistory,
  getDate,
  saveTransactionHistory,
  getRewardData,
  getPlayData,
  removeTicket,
  // upload,
  // saveImages,
  getNfts,
  savePopup,
  uploadImgs,
  updateImgs,
  deleteImg,
  uploadDate,
  updateDB,
  // saveWinners,
}