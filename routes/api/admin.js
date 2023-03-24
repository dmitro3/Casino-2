const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const log4js = require("log4js");

log4js.configure({
  appenders: { log4js: { type: "file", filename: "/backend5.log" } },
  categories: { default: { appenders: ["log4js"], level: "ALL" } }
});

const logger = log4js.getLogger("default");

const {
  getAllHolders,
  setHouseEdge,
  getHouseEdge,
  addHolderList,
  getAllUsers,
  getAllHackers,
  deleteHackList,
  getRaffleWinners,
  deleteUserList,
  addTicketWallet,
  generateCert,
  getWhite,
  deleteWhiteList,
  getImages,
  getNFTHolders,
  getWithdrawBanList,
  deleteWithdrawBanList,
  payUsers,
  setGemValue,
  setNugValue,

} = require("../../utility/user")
const {
  // getPayoutData,
  payout,
  setPayoutData,
  setRaffleMode,
  claimRoalty,
  giveRewards,
  addHackList,
  addUserList,
  resetDB,
  resetRaffle,
  downloadTickets,
  raffleWinners,
  getRaffle,
  getDescription,
  checkCert,
  addWhiteList,
  giveBRewards,
  addWithdrawBanList,
  setStartTurtle,
  generateTurtleMulti,
  setMintInterval,
  setEnableGames,
  giveGemRewards,
} = require("../../utility/play");
const {
  getAllHistory,
  getAllTHistory,
  getNugData,
  // getTicket,
  removeTicket,
  // upload,
  // saveImages,
  getNfts,
  savePopup,
  uploadImgs,
  uploadDate,
  deleteImg,
  updateImgs,
  updateDB,
  getDepositHistory,
  getNFTHistory,
  // saveWinners,
} = require("../../utility/history");

router.get(
  "/getAllHolders",
  async (req, res) => {
    try {
      const result = await getAllHolders();
      res.json({ status: true, content: result });
    } catch (err) {
      console.log("error on getHolder", err)
      res.json({ status: false });
    }
  }
)

router.get(
  "/getAllTHistory",
  async (req, res) => {
    try {
      let items = await getAllTHistory();
      items = items.map((item) => ({
        walletAddress: item.walletAddress,
        type: item.type,
        amount: item.amount,
        transaction: item.transaction,
        date: item.date
      }))
      res.json(items);
    } catch (err) {
      console.log("Error while getting transaction history", err);
      res.json(err);
      res.status(500).end();
    }
  }
)

router.get(
  "/getAll",
  async (req, res) => {
    try {
      let items = await getAllHistory();
      items = items.map((item) => ({
        id: item._id,
        walletAddress: item.walletAddress,
        player: item.player == null ? item.walletAddress : item.player,
        wager: item.wager,
        game: item.game,
        payout: item.payout,
        coin: item.coin,
        mine: item.mine,
        currencyMode: item.currencyMode
      }));
      res.json(items);
    } catch (err) {
      console.log("Error while getting All history: ", err);
      res.json(err);
      res.status(500).end();
    };
  });

router.get(
  "/getTicket",
  async (req, res) => {
    try {
      let items = await downloadTickets();
      items.shift()
      const tickets = [];
      for (let i = 0; i < items.length; i++) {
        const data = {
          walletAddress: items[i][0],
          number: items[i][1],
        }
        tickets.push(data);
      }
      res.json(tickets);
    } catch (err) {
      console.log("Error while getting ticket: ", err);
      res.json(err);
      res.status(500).end();
    };
  });

router.get(
  "/getDepositHistory",
  async (req, res) => {
    try {
      const data = await getDepositHistory();
      res.json(data);
    } catch (err) {
      console.log("Error while getting ticket: ", err);
      res.json(err);
      res.status(500).end();
    };
  });
router.get(
  "/getNFTHistory",
  async (req, res) => {
    try {
      const data = await getNFTHistory();
      res.json(data);
    } catch (err) {
      console.log("Error while getting Mint History: ", err);
      res.json(err);
      res.status(500).end();
    };
  });

router.post(
  "/addTicket",
  async (req, res) => {
    try {
      const body = {
        type: "AddTicket_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
      if ((process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host) && certData) {
        await getRaffle(req.body.walletAddress, req.body.addingTicket, "RewardTicket");
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in add ticket"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while adding ticket: ", err);
      res.json({ status: false, content: err });
      res.status(500).end();
    };
  });

router.post(
  "/getNugData",
  async (req, res) => {
    try {
      const transactionData = await getNugData(req.body.walletAddress);
      res.json(transactionData);
    } catch (err) {
      console.log("Error while getting Nug History: ", err);
      res.json(err);
      res.status(400).end();
    }
  });

router.get(
  "/getHouseEdge",
  async (req, res) => {
    try {
      const result = await getHouseEdge();
      res.json(result)
    } catch (err) {
      console.log("Error while reset DB", err);
    }
  }
);

router.post(
  "/setHouseEdges",
  async (req, res) => {
    try {
      const wallet = req.body.walletAddress;
      const body = {
        type: "SetHouseEdges_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        await setHouseEdge(req.body);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setHouseEdges"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while get HouseEdge", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false });
      res.status(500).end();
    }
  }
)

router.post(
  "/setPayoutData",
  async (req, res) => {
    try {
      const body = {
        type: "SetPayoutData_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        const result = await setPayoutData(req.body.value);
        res.json({ status: true, content: result })
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setPayoutData"
        }
        await addHackList(body);
        res.json({ status: false })
      }
    } catch (err) {
      console.log("Error while setPayout API", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
);

router.post(
  "/setRaffleMode",
  async (req, res) => {
    try {
      const body = {
        type: "setRaffleMode_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        const result = await setRaffleMode(req.body.value);
        res.json({ status: true, content: result })
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setRaffleMode"
        }
        await addHackList(body);
        res.json({ status: false })
      }
    } catch (err) {
      console.log("Error while setPayout API", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
);

router.post(
  "/setStartTurtle",
  async (req, res) => {
    try {
      const body = {
        type: "setStartTurtle_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        const result = await setStartTurtle(req.body.value);
        await generateTurtleMulti(result);
        // console.log("result", result)
        res.json({ status: true, content: result })
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setStartTurtle"
        }
        await addHackList(body);
        res.json({ status: false })
      }
    } catch (err) {
      console.log("Error while setStartTurtle API", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
);

router.post(
  "/setMintInterval",
  async (req, res) => {
    try {
      const body = {
        type: "setMintInterval_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        console.log(`===Set MintInterval started===${req.body.walletAddress}`)
        // const result = await setMintInterval({interval: req.body.interval, remainedNFT: req.body.remainedNFT});
        const result = await payUsers()
        res.json({ status: true, content: result })
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setmintInterval"
        }
        await addHackList(body);
        res.json({ status: false })
      }
    } catch (err) {
      console.log("Error while setMintInterval", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
);

router.post(
  "/payout",
  async (req, res) => {
    try {
      const body = {
        type: "Payout_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        await claimRoalty(req.body.amount); x
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /payout"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("error on payout", err)
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false });
    }
  }
);

router.get(
  "/getAllUsers",
  async (req, res) => {
    try {
      const result = await getAllUsers();
      res.json(result);
      res.status(200).end();
      // }
    } catch (err) {
      console.log("Error while getting All user data:  ", err);
      res.status(400).end();
    };
  });

router.get(
  "/getAllHackers",
  async (req, res) => {
    try {
      const result = await getAllHackers();
      res.json(result);
      res.status(200).end();
      // }
    } catch (err) {
      console.log("Error while getting Hacker data:  ", err);
      res.status(400).end();
    };
  });

router.get(
  "/getWhiteList",
  async (req, res) => {
    try {
      const result = await getWhite();
      res.json(result);
      res.status(200).end();
      // }
    } catch (err) {
      console.log("Error while getting White List:  ", err);
      res.status(400).end();
    };
  });

router.get(
  "/getWithdrawList",
  async (req, res) => {
    try {
      const result = await getWithdrawBanList();
      res.json(result);
      res.status(200).end();
    } catch (err) {
      console.log("Error while getting WithdrawBan List:  ", err);
      res.status(400).end();
    };
  });

router.post(
  "/giveReward",
  async (req, res) => {
    try {
      const body = {
        type: "GiveReward_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        const rewards = await giveRewards(req.body);
        res.json({ rewards: rewards, status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /giveReward"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error in get reward", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/giveBReward",
  async (req, res) => {
    try {
      const body = {
        type: "GiveBReward_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        const rewards = await giveBRewards(req.body);
        res.json({ rewards: rewards, status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /giveBReward"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error in get reward", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/giveGemReward",
  async (req, res) => {
    try {
      const body = {
        type: "GiveGemReward_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        const rewards = await giveGemRewards(req.body);
        res.json({ rewards: rewards, status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /giveGemReward"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error in get reward", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/addHack",
  async (req, res) => {
    try {
      const body = {
        type: "AddHacker_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Added by admin"
        }
        await addHackList(body);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in play turtle"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add hack", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/addWhite",
  async (req, res) => {
    try {
      const body = {
        type: "AddWhite_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        await addWhiteList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /addWhite"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add White list", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/addWithdrawBanWallet",
  async (req, res) => {
    try {
      const body = {
        type: "AddWithdraw_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        await addWithdrawBanList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /addWithdrawBanWallet"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add Withdraw list", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/deleteHack",
  async (req, res) => {
    try {
      const body = {
        type: "DeleteHacker_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        await deleteHackList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /deleteHack"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add hack", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/deleteWhite",
  async (req, res) => {
    try {
      const body = {
        type: "DeleteWhite_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        await deleteWhiteList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /deleteWhite"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add hack", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/deleteWithdraw",
  async (req, res) => {
    try {
      const body = {
        type: "DeleteWithdraw_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        await deleteWithdrawBanList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /deleteWithdraw"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add hack", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/deleteUser",
  async (req, res) => {
    try {
      const body = {
        type: "DeleteUser_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        console.log(`===Set deleteHack started===${req.body.host}`)
        await deleteUserList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        console.log(`===Set deleteHack triggered===${req.body.host}`)
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /deleteUser"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add hack", err);
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/addUser",
  async (req, res) => {
    try {
      const body = {
        type: "Add User_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        console.log(`===Set addUser started===${req.body.host}`)
        await addUserList(req.body.walletAddress);
        res.json({ status: true });
      } else {
        console.log(`===Set addUser triggered===${req.body.host}`)
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /addUser"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while add user", err);
      
      res.json({ status: false });
    }
  }
)
router.post(
  "/addHolder",
  async (req, res) => {
    try {
      const body = {
        type: "AddHolder_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host)) {
        console.log(`===Set addHolder started===${req.body.host}`)
        await addHolderList(req.body);
        res.json({ status: true });
      } else {
        console.log(`===Set addHolder triggered===${req.body.host}`)
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /addHolder"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`Error while adding holders => ${err}`);
      console.log("error on addHolder", err)
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/resetDBs",
  async (req, res) => {
    try {
      const body = {
        type: "ResetDBs_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        // await resetDB();
        console.log(`===Reset DB started===`, req.body.walletAddress)
        res.json({ status: true });
      } else {
        console.log(`===Reset DB triggered===`, req.body.walletAddress)
        // await addHackList(req.body.walletAddress);
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in play turtle"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while reset DB", err)
      console.log("Error while reset DB", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
)

router.post(
  "/resetRaffle",
  async (req, res) => {
    try {
      const body = {
        type: "ResetRaffle_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        await resetRaffle();
        console.log(`===Reset Raffle started===`, req.body.walletAddress)
        res.json({ status: true });
      } else {
        console.log(`===Reset DB triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /resetRaffle"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while reset DB", err)
      console.log("Error while reset DB", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
)

router.post(
  "/downloadTickets",
  async (req, res) => {
    try {
      const body = {
        type: "ResetRaffle_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        const data = await downloadTickets();
        console.log(`===Reset Raffle started===`, req.body.walletAddress)
        const fields = [{
          label: 'WalletAddress',
          value: 'walletAddress'
        }, {
          label: 'Number of Tickets',
          value: 'tickets'
        }]
        res.json({ status: true, data: data });
      } else {
        console.log(`===Reset DB triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /downloadTickets"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while reset DB", err)
      console.log("Error while reset DB", err);
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false })
    }
  }
)

router.get(
  "/getRaffleWinners",
  async (req, res) => {
    try {
      const winners = await getRaffleWinners();
      res.json(winners);
    } catch (err) {
      console.log("Error while add user", err);
    }
  }
)

router.get(
  "/getImages",
  async (req, res) => {
    try {
      const images = await getImages();
      if (images)
        res.json({ status: true, content: images });
      else res.json({ status: false })
    } catch (err) {
      console.log("Error while add user", err);
    }
  }
)

///======Raffle Now Option========///

// router.post(
//   "/raffleNow",
//   async (req, res) => {
//     try {
//       if (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress) {
//         console.log(`===raffleNow started===`, req.body.walletAddress)
//         const winners = await raffleWinners();
//         if (winners)
//           res.json({ status: true, content: winners });
//         else res.json({ status: false, content: "Not enough raffle" })
//       } else {
//         console.log(`===raffleNow triggered===`, req.body.walletAddress)
//         await addHackList(req.body.walletAddress);
//         res.json(false);
//       }
//     } catch (err) {
//       console.log("Error while raffle", err)
//       console.log("Error while raffle", err)
//       res.json({ status: false, content: err });
//     }
//   }
// )

///========================================///

router.post(
  "/setDescription",
  async (req, res) => {
    try {
      const body = {
        type: "SetDescription_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        console.log(`===setDescription started===`, req.body.walletAddress)
        const content = req.body.content;
        await savePopup(content);
        // await updateDB();
        res.json({ status: true });
      } else {
        console.log(`===setDescription triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setDescription"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while raffle", err)
      console.log("Error while raffle", err)
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false });
    }
  }
)

router.post(
  "/uploadImgs",
  async (req, res) => {
    try {
      const body = {
        type: "UploadImage_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        console.log(`===Uploading Image started===`, req.body.walletAddress)
        const result = await uploadImgs(req.body.imgs);
        if (result)
          res.json({ status: true })
      } else {
        console.log(`===Uploading Image triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in play turtle"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while uploading images", err)
      console.log("Error while uploading images", err)
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false, content: err })
    }
  }
)

router.post(
  "/updateImgs",
  async (req, res) => {
    try {
      
      if (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress) {
        console.log(`===Uploading Image started===`, req.body.walletAddress)
        const result = await updateImgs(req.body.new, req.body.prev);
        if (result)
          res.json({ status: true })
      } else {
        console.log(`===Uploading Image triggered===`, req.body.walletAddress)
        await addHackList(req.body.walletAddress);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while uploading images", err)
      console.log("Error while uploading images", err)
      res.json({ status: false, content: err })
    }
  }
)

router.post(
  "/delImgs",
  async (req, res) => {
    try {
      
      if (process.env.ADMIN_WALLETS1 === req.body.walletAddress) {
        console.log(`===Deleting Image started===`, req.body.walletAddress)
        const result = await deleteImg(req.body.img);
        if (result)
          res.json({ status: true })
      } else {
        console.log(`===Deleting Image triggered===`, req.body.walletAddress)
        await addHackList(req.body.walletAddress);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while Deleting images", err)
      console.log("Error while Deleting images", err)
      res.json({ status: false, content: err })
    }
  }
)

router.post(
  "/uploadDate",
  async (req, res) => {
    try {
      const body = {
        type: "UploadDate_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if (certData && (process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress)) {
        console.log(`===Uploading Date started===`, req.body.walletAddress)
        const result = await uploadDate(req.body.date);
        if (result) {
          res.json({ status: true })
        }
      } else {
        console.log(`===Uploading Date triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /uploadDate"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log("Error while uploading Dates", err)
      console.log("Error while uploading Dates", err)
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false, content: err })
    }
  }
)

router.get(
  "/getNfts",
  async (req, res) => {
    const result = await getNfts();
    res.json(result);
  }
)


router.get(
  "/getDescription",
  async (req, res) => {
    try {
      const data = await getDescription();
      // let str = "";
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].type === "header") {
      //     str = str + "<h>" + data[i].content + "</h>"
      //   } else if (data[i].type === "p") {
      //     str = str + "<p>" + data[i].content + "</p>"
      //   }
      // }
      // res.json(str);
      res.json(data[0]);
    } catch (err) {
      console.log("Error while getting description", err);
      console.log("Error while getting description", err);
      res.json(false);
    }
  }
)

router.post(
  "/addTicketWallet",
  async (req, res) => {
    try {
      const body = {
        type: "AddTicketWallet_admin",
        walletAddress: req.body.host,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if ((process.env.ADMIN_WALLETS1 === req.body.host || process.env.ADMIN_WALLETS2 === req.body.host || process.env.ADMIN_WALLETS3 === req.body.host) && certData) {
        console.log(`===addTicketWallet started===`, req.body.host)
        await addTicketWallet(req.body.walletAddress);
        res.json({ status: true });
      } else {
        console.log(`===addTicketWallet triggered===`, req.body.host)
        const body = {
          walletAddress: req.body.host,
          reason: "Cert doesn't match in /addTicketWallet"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`===addTicketWallet Failed===`, err)
      console.log(`===addTicketWallet Failed===`, err)
      
      res.json({ status: false });
    }
  }
)

router.post(
  "/setEnableGames",
  async (req, res) => {
    try {
      const body = {
        type: "SetEnableGames_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
     
      if ((process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress) && certData) {
        const result = await setEnableGames({ type: req.body.type, value: req.body.value })
        res.json({ status: true, content: result });
      } else {
        console.log(`===SetEnableGames triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setEnableGames"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`===Set Enable Games Failed===`, err)
      console.log(`===Set Enable Games Failed===`, err)
      // const random = await generateCert(req.body.walletAddress);
      res.json({ status: false });
    }
  }
)

router.post(
  "/setGemValue",
  async (req, res) => {
    try {
      const body = {
        type: "SetGemValue_admin",
        walletAddress: req.body.walletAddress,
        num: req.body.num
      }
      const certData = await checkCert(body);
      if ((process.env.ADMIN_WALLETS1 === req.body.walletAddress || process.env.ADMIN_WALLETS2 === req.body.walletAddress || process.env.ADMIN_WALLETS3 === req.body.walletAddress) && certData) {
        await setGemValue(req.body)
        res.json({ status: true});
      } else {
        console.log(`===SetEnableGames triggered===`, req.body.walletAddress)
        const body = {
          walletAddress: req.body.walletAddress,
          reason: "Cert doesn't match in /setGemValue"
        }
        await addHackList(body);
        res.json({ status: false });
      }
    } catch (err) {
      console.log(`===Error while set gem value(${err})===`)
      console.log(`===Error while set gem value(${err})===`)
      res.json({ status: false });
    }
  }
)

module.exports = router;
