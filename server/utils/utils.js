const { UserInputError } = require("apollo-server-express")
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

module.exports.getFileExtension = mimetype => {
  return "." + mimetype.split("/")[mimetype.split("/").length - 1]
}

module.exports.isIdValid = async (id, model) => {
  return model.findById(id)
    .then(doc => {
      return doc != null
    })
    .catch(err => {
      throw new UserInputError(err)
    })
}