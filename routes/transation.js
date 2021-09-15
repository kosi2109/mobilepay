const { payGet, payPost } = require("../controllers/transation");
const express = require("express");
const router = express.Router();
const { checkAuthenticate } = require("../decorators");

router.get("/", checkAuthenticate, payGet);
router.post("/", payPost);

module.exports = router;
