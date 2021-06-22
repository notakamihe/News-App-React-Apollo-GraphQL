const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Tag name already exists."],
    required: [true, "Tag name must not be blank."],
    maxLength: [30, "Tag name must have no more than 30 characters."],
    lowercase: true
  },
  imageUrl: {
    type: String
  }
})

module.exports = mongoose.model("Tag", tagSchema)