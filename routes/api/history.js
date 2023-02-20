const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();

const {
  getHistory,
  getTHistory,
  getTodayHistory,
  getWeekHistory,
  getPlayData,
  getRewardData,
  getTotalGames,
} = require('../../utility/history')

const {checkCert} = require('../../utility/play');
const { generateCert } = require("../../utility/user");

router.get(
  "/get",
  async (req, res) => {
    try {
      let items = await getHistory();
      res.json(items);
    } catch (err) {
      console.log("Error while getting history: ", err);
      res.json(err);
      res.status(500).end();
    };
  });

router.post(
  "/getTHistory",
  async (req, res) => {
    try {
        let items = await getTHistory(req.body.walletAddress);
        items = items.map((item) => ({
          id: item._id,
          walletAddress: item.walletAddress,
          amount: item.amount,
          type: item.type,
          date: item.date
        }))
        res.json({status: "success", content: items});
    } catch (err) {
      // const random = await generateCert(req.body.walletAddress);
      console.log("Error while getting transaction history", err);
      res.json({status: "error", content: err})
      res.status(500).end();
    }
  }
)

router.get(
  "/getTodayHighlight",
  async (req, res) => {
    try {
      const result = await getTodayHistory(req);
      res.json(result);
    } catch (err) {
      console.log("Error while getting today highlight: ", err);
      res.json(err);
      res.status(400).end();
    }
  });

router.get(
  "/getWeekHighlight",
  async (req, res) => {
    try {
      const result = await getWeekHistory(req);
      res.json(result);
    } catch (err) {
      console.log("Error while getting week highlight: ", err);
      res.json(err);
      res.status(400).end();
    }
  });

router.get(
  "/statistics",
  async(req, res) => {
    try {
      const data = await getTotalGames();
      res.json({status: true, data: data})
    } catch (err) {
      console.log("Error while getting statistics", err);
      res.json({status: false, err: err})
      res.status(400).end();
    }
  }
)

module.exports = router;