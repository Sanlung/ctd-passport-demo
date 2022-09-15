const session = require("express-session");
const sessionStore = require("connect-mongodb-session");
const MongoDBStore = sessionStore(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log(err));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
});

module.exports = sessionMiddleware;
