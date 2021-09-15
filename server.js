if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}
const express = require("express");
const expressLatouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const indexRoute = require("./routes/index");
const transationRoute = require("./routes/transation");
const passport = require("passport");
const session = require("express-session");
const initializePassport = require("./passport-config");
const Users = require("./models/user");
const flash = require("express-flash");
const methodOverride = require("method-override");
const authentication = require("./authentication");

initializePassport(
  passport,
  (phone) => Users.findOne({ phone: phone }),
  (id) => Users.findById(id)
);
app.use(flash());
app.use(
  session({
    secret: process.env.SECTION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLatouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

app.use("/", indexRoute);
app.use("/send", transationRoute);
authentication(app, passport);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () =>
  app.listen(process.env.PORT || 3000, () => {
    console.log("connected to mongodb");
    console.log(`Server is running on  ${process.env.PORT}`);
  })
);
