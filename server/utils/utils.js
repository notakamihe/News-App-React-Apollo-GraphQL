const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports.getUserByToken = token => {
  try {
    if (token) {
      return jwt.verify(token, "secret")
    }

    return null
  } catch (err) {
    return null
  }
}