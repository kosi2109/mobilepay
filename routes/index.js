const express = require("express");

const router = express.Router();
const { checkAuthenticate } = require("../decorators");
const { getUser, getProfile, myQr, scanQr } = require("../controllers/index");

router.get("/", checkAuthenticate, getUser);
router.get("/profile", checkAuthenticate, getProfile);
router.get("/myQr", checkAuthenticate, myQr);
router.get("/scanQr", checkAuthenticate, scanQr);
module.exports = router;
