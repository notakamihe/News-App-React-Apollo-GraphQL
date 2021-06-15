const { UserInputError } = require("apollo-server-express");
const mongoose = require("mongoose");
const { isIdValid } = require("../utils/utils");
const Tag = require("./Tag");
const User = require("./User");

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "The article title must not be blank."]
  },
  body: {
    type: String,
    required: [true, "The article body must not be blank."],
    minLength: [100, "Article body must be at least 100 characters long."]
  },
  imageUrl: {
    type: String
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  authors: [{
    type: mongoose.Types.ObjectId,
    ref: "User",
  }],
  tags: [{
    type: mongoose.Types.ObjectId,
    ref: "Tag"
  }],
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: "Comment"
  }],
})

articleSchema.path("authors").validate(async (authors) => {
  if (!authors.every(a => authors.filter(x => a.toString() === x.toString()).length === 1))
    throw new UserInputError("Duplicate authors not allowed.")

    for (const author of authors) {
      if (!(await isIdValid(author, User)))
        throw new UserInputError("All author ids must be valid.")
    }

  if (authors.length < 1)
    throw new UserInputError("Article must have at least one author.")

  return true
})

articleSchema.path("tags").validate(async (tags) => {
  if (!tags.every(t => tags.filter(x => t.toString() === x.toString()).length === 1))
    throw new UserInputError("Duplicate tags not allowed.")

  for (const tag of tags) {
    if (!(await isIdValid(tag, Tag)))
      throw new UserInputError("All tag ids must be valid.")
  }
  
  if (tags.length < 1)
    throw new UserInputError("Article must belong to at least 1 tag.")
  else if (tags.length > 5)
    throw new UserInputError("Article must have no more than 5 tags.")

  return true
})

module.exports = mongoose.model("Article", articleSchema)