const {
  payGet,
  payPost,
  getTransations,
} = require("../controllers/transation");
const express = require("express");
const router = express.Router();
const { checkAuthenticate } = require("../decorators");

router.get("/", checkAuthenticate, getTransations);
router.get("/send", checkAuthenticate, payGet);
router.post("/send", payPost);

module.exports = router;
