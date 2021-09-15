const express = require("express");

const router = express.Router();
const { checkAuthenticate } = require("../decorators");
const { getUser } = require("../controllers/index");

router.get("/", checkAuthenticate, getUser);

module.exports = router;
