const express = require('express');
const router = express.Router();
const log4js = require("log4js");
const bs58 = require("bs58");

const {
  saveUser,
  saveUserData,
  setAvatar,
  checkUser,
  userLogOut,
} = require('../../utility/user');

const { claimRoalty } = require("../../utility/play");

// const {mintNow} = require("../../utility/mintNFT");

router.post(
  "/saveUser",
  async (req, res) => {
    try {
      const { walletAddress, userName } = req.body;
      const data = {
        walletAddress,
        userName,
      };
      await saveUser(data);
      res.json({ result: "success" });
      res.status(200).end();
    } catch (err) {
      console.log("Error while saving user: ", err)
      res.status(400).end();
    };
  });

router.post(
  "/getUserData",
  async (req, res) => {
    try {
      const { walletAddress, deviceId } = req.body;
      //
      const isHack = await checkUser(walletAddress);
      //
      const result = await saveUserData(req.body);

      // await mintNow()
      res.json(result);
      res.status(200).end();
      // }
    } catch (err) {
      console.log("===Error while getting user Data===", err);
      console.log("Error while getting user data:  ", err);
      res.status(400).end();
    };
  });

router.post(
  "/logOut",
  async (req, res) => {
    try {
      const { walletAddress, avatar, deviceId } = req.body;
      //
      const isHack = await checkUser(walletAddress);
      //
      await userLogOut(req.body);
      res.status(200).end();
      // }
    } catch (err) {
      console.log("===Error while getting user Data===");
      console.log("Error while getting user data:  ", err);
      res.status(400).end();
    };
  });
router.post(
  "/setAvatar",
  async (req, res) => {
    try {
      await setAvatar(req.body)
    } catch (err) {
      console.log(err);
    };
  });

module.exports = router;