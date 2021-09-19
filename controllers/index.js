const Users = require("../models/user");
const Transation = require("../models/transtations");
const QRCode = require("qrcode");

const getUser = async (req, res) => {
  const user = await Users.findById(req.user._conditions._id);

  res.render("index.ejs", { user: user });
};

const getProfile = async (req, res) => {
  const user = await Users.findById(req.user._conditions._id);

  res.render("profile/index.ejs", { user: user });
};

const myQr = async (req, res) => {
  var opts = {
    errorCorrectionLevel: "H",
    type: "image/jpeg",
    quality: 1,
    margin: 1,
    color: {
      dark: "#252525",
      light: "#fafafa",
    },
  };
  const user = await Users.findById(req.user._conditions._id);
  const phone = "" + user.phone;

  QRCode.toDataURL(phone, opts, (err, src) => {
    res.render("profile/myqr.ejs", { qr: src, phone: user.phone });
  });
};

const scanQr = async (req, res) => {
  res.render("transation/scanqr.ejs");
};

module.exports = {
  scanQr: scanQr,
  myQr: myQr,
  getProfile: getProfile,
  getUser: getUser,
};
