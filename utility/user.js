
const web3 = require("@solana/web3.js");
const HashList = require("../HashList.json");
const User = require("../models/userModel");
const Hack = require("../models/hackModel");
const HouseEdge = require("../models/houseEdgeModel");
const Checking = require("../models/checkingModel");
const Holder = require("../models/holderModel");

const log4js = require("log4js");
// const { findOneAndUpdate } = require("../models/userModel");
const Raffle = require("../models/raffleModel");
const RaffleWinner = require("../models/raffleWinnerModel");
const whiteListModel = require("../models/whiteListModel");
const Image = require("../models/imageModel");
const { generateTurtleMulti } = require("./play");
const withdrawBanModel = require("../models/withdrawBanModel");
log4js.configure({
  appenders: { log4js: { type: "file", filename: "/home/jenkins/backend5.log" } },
  categories: { default: { appenders: ["log4js"], level: "ALL" } }
});

const logger = log4js.getLogger("default");

const checkUser = async (walletAddress) => {
  const query = { walletAddress: walletAddress };
  const result = await Hack.findOne(query);
  return result
}
const saveUser = async (userdata) => {
  const query = { walletAddress: userdata.walletAddress };
  const update = { $set: userdata };
  const options = { upsert: true };
  await User.findOneAndUpdate(query, update, options);
};
let fetched = true
const getNFTHolders = async () => {
  // const date = 1000 * 3600 * 12
  const date = 1000 * 3600 * 12
  setInterval(async () => {
    try {
      if (fetched) {
        fetched = false;
        const connection = new web3.Connection(process.env.QUICK_NODE);
        let accounts = [];
        let nftamount = [];
        // const holders = await Holder.find({});
        // if (holders.length < 50) {
        //get holder datas
        console.log("in")
        for (let i = 0; i < HashList.length; i++) {
          console.log("i", i)
          const acc = await connection.getTokenLargestAccounts(
            new web3.PublicKey(HashList[i])
          );
          if (acc.value.length) {
            const accInfo = await connection.getParsedAccountInfo(acc.value[0].address);
            let alreadyExists = false;
            for (let j = 0; j < accounts.length; j++) {
              if (accInfo.value.data.parsed.info.owner == accounts[j]) {//if previous owner is also owner of other token
                // if(accounts.includes(accInfo.value.data.parsed.info.owner)) {
                nftamount[j]++;
                // accounts.push(accInfo.value.data.parsed.info.owner);//if it is new account
                alreadyExists = true;
              }
            }
            if (alreadyExists) continue;
            accounts.push(accInfo.value.data.parsed.info.owner);//if it is new account
            nftamount.push(1);
          }
        }
        await Holder.remove({});
        //insert holderDatas to DB.
        for (let i = 0; i < accounts.length; i++) {
          let player = false;
          const query = { walletAddress: accounts[i] };
          const user = await User.findOne(query);
          if (user) player = true;
          const holder = new Holder({
            walletAddress: accounts[i],
            nftAmount: nftamount[i],
            player: player
          })
          await holder.save();
        }
        logger.info("New holders added")
        console.log("New holders added")
        fetched = true;
      }
    } catch (err) {
      fetched = true;
      console.log("err", err)
      logger.debug(`===Error while fetching holder ${err}`)
    }
  }, date)
}

const saveUserData = async (data) => {
  console.log('backend-wallet', data.walletAddress);
  const query = { walletAddress: data.walletAddress };
  let result = await User.findOne(query);
  let holder = await Holder.findOne(query);
  let isHolder
  let spinNum = 0;
  let gemAmount = 2500;
  if (holder) {
    console.log("holder")
    isHolder = true;
    spinNum = 2;
  }
  else isHolder = false
  if (!result) {
    logger.info(`===Save new User(${data.walletAddress})===`)
    console.log(`===Save new User(${data.walletAddress})===`)
    result = new User({
      walletAddress: data.walletAddress,
      userName: data.walletAddress,
      avatar: "",
      nugAmount: 0,
      holder: isHolder,
      rewardData: 0,
      rewardNum: 0,
      deviceId: data.deviceId,
      spinDate: 0,
      logIn: true,
      spinNum: spinNum,
      bonusNugAmount: 0,
      gemAmount: 2500,
    })
    await result.save();
    console.log('saved')
  }
  else {
    // if (result.logIn) {
    //   return false
    // } else {
    let bonusNugAmount = 0;
    let update
    let userName
    if (result.bonusNugAmount) bonusNugAmount = result.bonusNugAmount;
    if (result.gemAmount) gemAmount = result.gemAmount;
    if (data.userName) {
      userName = data.userName
    } else {
      userName = data.walletAddress
    }
    if (!result.holder && isHolder) {
      update = {
        $set: {
          walletAddress: data.walletAddress,
          gemAmount: gemAmount,
          userName: userName,
          deviceId: data.deviceId,
          logIn: true,
          bonusNugAmount: bonusNugAmount,
          spinNum: 2,
          holder: true
        }
      }
    } else {
      update = {
        $set: {
          gemAmount: gemAmount,
          walletAddress: data.walletAddress,
          userName: userName,
          deviceId: data.deviceId,
          logIn: true,
          bonusNugAmount: bonusNugAmount
        }
      }
    }
    const options = { $upsert: true };
    result = await User.findOneAndUpdate(query, update, options);
    // }
  }
  //const balance = await Nugget.findOne(query);//unneccessary after fixing this.
  const houseEdge = await HouseEdge.find({});
  if (!houseEdge.length) {
    logger.info(`===Creat House Edge(0.92 & 1)===`)
    const setHouseEdge = new HouseEdge({
      mineHouseEdge: 0.92,
      doubleHouseEdge: 1,
      turtleHouseEdge: 0.75,
      quinellaHouseEdge: 0.37,
      turtleTime: 60,
      minMine: 5,
      maxMine: 24,
      autoPayout: "auto",
      raffleOn: false,
      startTurtle: false,
      turtleFirst: 1,
      turtleSecond: 1,
      raffleDate: Date.now(),
      remainedNFT: 0,
      remainedTime1: 0,
      remainedTime2: 0,
      enableMines: true,
      enableDouble: true,
      enableLoot: true,
      enableTurtle: true,
    })
    await setHouseEdge.save();
  }
  // let amount;
  // let userName;
  // let avatar;
  //if (balance?.amount) amount = balance.amount
  //else amount = 0;
  // if (result?.userName) {
  //   userName = result.userName;
  //   avatar = result.avatar;
  // } else {
  //   userName = data.walletAddress;
  //   avatar = undefined
  // }

  //==Checking request part==//
  // const random = await generateCert(data.walletAddress);
  const raffle = await Raffle.find({ walletAddress: data.walletAddress })
  const res = {
    avatar: result.avatar,
    userName: result.userName,
    amount: result.nugAmount,
    // data: random,
    raffles: raffle.length,
    raffleMode: houseEdge[0].raffleOn,
    bonusNugAmount: result.bonusNugAmount,
    gemAmount: gemAmount
  }
  console.log("gemAmount", gemAmount);
  console.log("res", res)
  return res;
};

const userLogOut = async (query) => {
  const update = {
    $set: {
      logIn: false
    }
  };
  const options = { upsert: true };
  await User.findOneAndUpdate(query, update, options);
}

const generateCert = async (walletAddress) => {
  const random = Math.floor(Math.random() * 10000);
  const cert = random ^ 7 + random ^ 6 + random ^ 4 + random * 2023;
  await Checking.findOneAndUpdate(
    { walletAddress: walletAddress },
    {
      $set: {
        walletAddress: walletAddress,
        cert: cert
      }
    },
    { upsert: true }
  )
  return random;
}

const getAllUsers = async () => {
  const users = await User.find({});
  return users;
}
const getRaffleWinners = async () => {
  const winners = await RaffleWinner.find({});
  return winners;
}
const getImages = async () => {
  const images = await Image.find({});
  let data = [];
  images.map((img, key) => {
    data.push(img.path)
  })
  return data
}
const getAllHackers = async () => {
  const hackers = await Hack.find({});
  return hackers
}
const getWhite = async () => {
  const white = await whiteListModel.find({});
  return white
}
const getWithdrawBanList = async () => {
  const white = await withdrawBanModel.find({});
  return white
}

const deleteHackList = async (walletAddress) => {
  const query = { walletAddress: walletAddress };
  await Hack.deleteOne(query);
}
const deleteWhiteList = async (walletAddress) => {
  const query = { walletAddress: walletAddress };
  await whiteListModel.deleteOne(query);
}
const deleteWithdrawBanList = async (walletAddress) => {
  const query = { walletAddress: walletAddress };
  await withdrawBanModel.deleteOne(query);
}
const deleteUserList = async (walletAddress) => {
  const query = { walletAddress: walletAddress };
  await User.deleteOne(query);
}
const setAvatar = async (avatarData) => {
  const query = { walletAddress: avatarData.walletAddress };
  const userData = await User.findOne(query);
  userData.avatar = avatarData.avatarURL;
  const update = { $set: userData };
  const options = { upsert: true };
  return User.findOneAndUpdate(query, update, options);
};

const getHouseEdge = async () => {
  const result = await HouseEdge.find({});
  return result[0];
}

const setHouseEdge = async (body) => {
  const options = { upsert: true }
  await HouseEdge.findOneAndUpdate({}, body, options)
}
const getAllHolders = async (walletAddress) => {
  const holders = await Holder.find({});
  return holders;
}
const getHolders = async (walletAddress) => {
  const holders = await Holder.findOne({ walletAddress: walletAddress });
  return holders;
}

const addHolderList = async (data) => {
  const query = { walletAddress: data.walletAddress };
  const user = await User.findOne(query);
  let isPlayer = false;
  if (user) isPlayer = true;
  let update = {
    $set: {
      walletAddress: data.walletAddress,
      nftAmount: data.nftAmount,
      player: isPlayer,
    }
  }
  const options = { upsert: true };
  const holder = await Holder.findOneAndUpdate(query, update, options);
  update = {
    $set: {
      walletAddress: data.walletAddress,
      holder: false
    }
  }
  await User.findOneAndUpdate(query, update, options);
}

const addTicketWallet = async (data) => {
  const raffles = await Raffle.find({});
  const ticket = new Raffle({
    walletAddress: data,
    index: raffles.length,
    type: "Reward",
    date: Date.now()
  })
  await ticket.save();
}

const getRewardData = async (data) => {
  const rewardData = await User.findOne(data);
  return rewardData.rewardData
}

const payUsers = async () => {
  const users = await User.find({});

  users.map(async (user) => {
    const query = { walletAddress: user.walletAddress };
    let amount = 0;
    if (user?.bonusNugAmount) {
      amount = 2500
    } else {
      amount = 2500;
    }
    const update = {
      $set: {
        bonusNugAmount: amount
      }
    }
    const options = { upsert: true }
    await User.findOneAndUpdate(query, update, options)
  })
  console.log("updated");
  return true
}

const setGemValue = async (data) => {
  const users = await User.find({});
  const options = {upsert: true};
  for(let i = 0 ; i < users.length; i++) {
    const query = {walletAddress: users[i].walletAddress};
    const update = {$set: {
      gemAmount: data.value
    }}
    await User.findOneAndUpdate(query, update, options);
  }
}
const setNugValue = async (data) => {
  const users = await User.find({});
  const options = {upsert: true};
  for(let i = 0 ; i < users.length; i++) {
    const query = {walletAddress: users[i].walletAddress};
    const update = {$set: {
      bonusNugAmount: data.value
    }}
    await User.findOneAndUpdate(query, update, options);
  }
}

module.exports = {
  setGemValue,
  setNugValue,
  payUsers,
  saveUser,
  saveUserData,
  getAllUsers,
  getRaffleWinners,
  getImages,
  getAllHackers,
  getWhite,
  getWithdrawBanList,
  setAvatar,
  checkUser,
  getHouseEdge,
  setHouseEdge,
  generateCert,
  getAllHolders,
  getHolders,
  addHolderList,
  deleteHackList,
  deleteWhiteList,
  deleteWithdrawBanList,
  deleteUserList,
  addTicketWallet,
  getRewardData,
  userLogOut,
  getNFTHolders,
}