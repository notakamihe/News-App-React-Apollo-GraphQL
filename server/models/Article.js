const mongoose = require("mongoose");

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
    minLength: [1, "Article must have at least one author."]
  }],
  tags: [{
    type: mongoose.Types.ObjectId,
    ref: "Tag",
    maxLength: [5, "Article msut have no more than 5 tags."]
  }],
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: "Comment"
  }],
})

articleSchema.path("authors").validate((authors) => {
  return authors.all(a => authors.filter(x => a === x).length === 1)
}, "Duplicate authors not allowed.")

articleSchema.path("tags").validate((tags) => {
  return tags.all(t => tags.filter(x => t === x).length === 1)
}, "Duplicate tags not allowed.")

module.exports = mongoose.model("Article", articleSchema)