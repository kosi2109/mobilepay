const Users = require("../models/user");
const Transation = require("../models/transtations");

const getTransations = async (req, res) => {
  const user = await Users.findById(req.user._conditions._id);
  console.log(user.id);
  const transations = await Transation.find({
    $or: [{ sender: user.id }, { receiver: user.id }],
  })
    .populate("sender")
    .populate("receiver")
    .sort({ transationDate: -1 });
  console.log(transations);
  res.render("transation/index.ejs", { user: user, transations: transations });
};

const payGet = (req, res) => {
  res.render("transation/send.ejs");
};

const payCheck = async (req, res, sender, receiver, ammount, payment) => {
  if (receiver == null) {
    const message = "No user with this Phone Number";
    res.render(`transation/${payment}.ejs`, { message: message });
  } else if (ammount < 500) {
    const message = "Ammount must be at least 500 Ks";
    res.render(`transation/${payment}.ejs`, { message: message });
  } else if (sender.phone == req.body.phone) {
    const message = "You Can't Send to your phone";
    res.render(`transation/${payment}.ejs`, { message: message });
  } else if (sender.balance <= 0) {
    const message = "You Don't have sufficient balance to transfer";
    res.render(`transation/${payment}.ejs`, { message: message });
  } else {
    const senderAmmount = parseInt(sender.balance) - parseInt(ammount);
    const receiverAmmount = parseInt(receiver.balance) + parseInt(ammount);
    const transation = new Transation({
      sender: sender.id,
      receiver: receiver.id,
      ammount: ammount,
    });
    try {
      await Users.findByIdAndUpdate(
        sender.id,
        { balance: senderAmmount },
        {
          new: false,
        }
      );
      await Users.findByIdAndUpdate(
        receiver.id,
        { balance: receiverAmmount },
        {
          new: false,
        }
      );
      await transation.save();
      res.redirect("/");
    } catch (error) {
      res.render(`transation/${payment}.ejs`);
    }
  }
};

const payPost = async (req, res) => {
  const sender = await Users.findById(req.user._conditions._id);
  const receiver = await Users.findOne({ phone: req.body.phone });
  const ammount = req.body.ammount;
  const qr = req.body.qr;
  if (qr == "qr") {
    payCheck(req, res, sender, receiver, ammount, "scanqr");
  } else {
    payCheck(req, res, sender, receiver, ammount, "send");
  }
};

module.exports = {
  getTransations: getTransations,
  payGet: payGet,
  payPost: payPost,
};
