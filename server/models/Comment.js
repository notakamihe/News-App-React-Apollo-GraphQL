const mongoose = require("mongoose");

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

module.exports = mongoose.model("Comment", commentSchema)