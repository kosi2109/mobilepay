const Users = require("../models/user");
const Transation = require("../models/transtations");

const getUser = async (req, res) => {
  const user = await Users.findById(req.user._conditions._id);
  const transations = await Transation.find({ sender: user.id })
    .populate("receiver")
    .exec();
  res.render("index.ejs", { user: user, transations: transations });
};

module.exports = {
  getUser: getUser,
};
