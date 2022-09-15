require("dotenv").config();
const express = require("express");
const app = express();
// const path = require("path");
const bcrypt = require("bcryptjs");

const connectDB = require("./db/connect");
const User = require("./models/User");
const passport = require("./middleware/passport");
const authMiddleware = require("./middleware/auth");
const sessionMiddleware = require("./middleware/session");

// app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(sessionMiddleware);
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  let messages = [];
  if (req.session.messages) {
    messages = req.session.messages;
    req.session.messages = [];
  }
  res.render("index", {messages});
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up", {message: res.locals.message});
  res.locals.message = "";
});

app.post("/sign-up", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({username: req.body.username, password: hashedPassword});
    res.redirect("/");
  } catch (err) {
    res.locals.message = "Invalid username or password";
    res.render("sign-up", {message: res.locals.message});
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  })
);

app.get("/log-out", (req, res) =>
  req.session.destroy((err) => res.redirect("/"))
);

app.get("/restricted", authMiddleware, (req, res) => {
  req.session.pageCount = req.session.pageCount ? req.session.pageCount + 1 : 1;
  res.render("restricted", {pageCount: req.session.pageCount});
});

const port = 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
