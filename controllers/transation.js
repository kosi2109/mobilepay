const Users = require("../models/user");
const Transation = require("../models/transtations");

const payGet = (req, res) => {
  res.render("transation/send.ejs");
};

const payPost = async (req, res) => {
  const sender = await Users.findById(req.user._conditions._id);
  const receiver = await Users.findOne({ phone: req.body.phone });
  const ammount = req.body.ammount;

  const transation = new Transation({
    sender: sender.id,
    receiver: receiver.id,
    ammount: ammount,
  });
  try {
    sender.ammount = sender.ammount - ammount;
    receiver.ammount = receiver.ammount + ammount;
    console.log(sender)
    const newTransation = await transation.save();
    res.redirect("/");
  } catch (error) {
    res.render("transation/send.ejs");
  }
};

module.exports = {
  payGet: payGet,
  payPost: payPost,
};
