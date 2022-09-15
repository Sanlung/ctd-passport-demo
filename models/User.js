const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new Schema({
    username: {
      type: String,
      required: [true, "Please provide a name"],
      minLength: 3,
      MaxLength: 15,
    },
    password: {
      type: String,
      reqwuired: [true, "Please provide a password"],
      minLength: 8,
    },
  })
);

module.exports = User;
