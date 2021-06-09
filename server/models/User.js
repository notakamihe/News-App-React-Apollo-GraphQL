const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email must not be blank."],
    unique: [true, "Email is not available."]
  },
  name: {
    type: String,
    required: [true, "You must provide your name."]
  },
  password: {
    type: String,
    required: [true, "Your password cannot be blank."],
    minLength: [8, "Your password is too short."]
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["admin", "author", "user"],
      message: "Role must either a(n) 'admin', 'author', or 'user'"
    }
  },
  description: {
    type: String
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model("User", userSchema)