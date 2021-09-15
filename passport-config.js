const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

function initialize(passport, getUserByPhone, getUserById) {
  const authenticatedUser = async (phone, password, done) => {
    const user = await getUserByPhone(phone);

    if (user == null) {
      return done(null, false, {
        message: "No Account With This Phone Number",
      });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(
    new LocalStrategy({ usernameField: "phone" }, authenticatedUser)
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
