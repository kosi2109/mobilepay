const Users = require("../models/user");
const Transation = require("../models/transtations");

const getUser = async (req, res) => {
  const user = await Users.findById(req.user._conditions._id);

  res.render("index.ejs", { user: user });
};

module.exports = {
  getUser: getUser,
};
