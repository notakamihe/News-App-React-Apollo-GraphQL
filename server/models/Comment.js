const { UserInputError } = require("apollo-server-express");
const mongoose = require("mongoose");
const { isIdValid } = require("../utils/utils");
const User = require("./User");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content of comment must not be blank."],
    maxLength: [1000, "Content must not exceed 1000 characters"]
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  repliedTo: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
})

commentSchema.path("repliedTo").validate(async (id) => {
  const isValid = await isIdValid(id, User)

  if (!isValid) {
    console.log("hi");
    throw new UserInputError(`No user found w/ id of ${id}.`)
  }

  return true
})

commentSchema.path("user").validate(async (id) => {
  const isValid = await isIdValid(id, User)

  if (!isValid) {
    console.log("hi");
    throw new UserInputError(`No user found w/ id of ${id}.`)
  }

  return true
})

module.exports = mongoose.model("Comment", commentSchema)