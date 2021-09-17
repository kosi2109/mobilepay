const Users = require("../models/user");
const Transation = require("../models/transtations");

const getTransations = async (req, res) => {
  const user = await Users.findById(req.user._conditions._id);
  const transations = await Transation.find({
    $or: [{ sender: user.id }, { recevier: user.id }],
  })
    .populate("receiver")
    .populate("sender")
    .exec();

  res.render("transation/index.ejs", { user: user, transations: transations });
};

const payGet = (req, res) => {
  res.render("transation/send.ejs");
};

const payPost = async (req, res) => {
  const sender = await Users.findById(req.user._conditions._id);
  const receiver = await Users.findOne({ phone: req.body.phone });
  const ammount = req.body.ammount;

  if (receiver == null) {
    const message = "No user with this Phone Number";
    res.render("transation/send.ejs", { message: message });
  } else if (ammount < 500) {
    const message = "Ammount must be at least 500 Ks";
    res.render("transation/send.ejs", { message: message });
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
      res.render("transation/send.ejs");
    }
  }
};

module.exports = {
  getTransations: getTransations,
  payGet: payGet,
  payPost: payPost,
};
