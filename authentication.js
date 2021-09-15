const { checkNotAuthenticated } = require("./decorators");
const bcrypt = require("bcrypt");
const Users = require("./models/user");

const authentication = (app, passport) => {
  app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("authentication/register.ejs");
  });

  app.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    });
    try {
      const newUser = await user.save();
      res.redirect("/login");
    } catch (error) {
      res.render("authentication/register".ejs);
    }
  });

  app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("authentication/login.ejs");
  });

  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
  });
};

module.exports = authentication;
