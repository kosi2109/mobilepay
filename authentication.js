const { checkNotAuthenticated, checkAuthenticate } = require("./decorators");
const bcrypt = require("bcrypt");
const Users = require("./models/user");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const authentication = (app, passport) => {
  app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("authentication/register.ejs");
  });

  app.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const checkUser = await Users.find({ phone: req.body.phone });
    if (checkUser.length > 0) {
      const message = "This Phone Number is already used";
      res.render("authentication/register.ejs", { message: message });
    } else {
      const user = new Users({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        sex: req.body.sex,
        password: hashedPassword,
      });
      saveCover(user, req.body.cover);
      try {
        const newUser = await user.save();
        res.redirect("/login");
      } catch (error) {
        res.render("authentication/register".ejs);
      }
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

  app.get("/password_reset", checkAuthenticate, (req, res) => {
    res.render("authentication/passwordReset.ejs");
  });

  app.post("/password_reset", checkAuthenticate, async (req, res) => {
    const pas1 = req.body.password1;
    const pas2 = req.body.password2;
    const user = await Users.findById(req.user._conditions._id);

    const hashedpas1 = await bcrypt.hash(pas1, 10);

    if (pas1 != pas2) {
      const message = "Password doesn't match.";
      res.render("authentication/passwordReset.ejs", { message: message });
    } else {
      const passwordUpdated = await Users.findByIdAndUpdate(
        user.id,
        { password: hashedpas1 },
        {
          new: false,
        }
      );
      passwordUpdated.save();
      res.redirect("/");
    }
  });
};

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = authentication;
