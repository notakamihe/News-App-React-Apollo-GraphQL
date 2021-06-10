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

articleSchema.path("authors").validate((authors) => {
  if (!authors.every(a => authors.filter(x => a === x).length === 1))
    throw new Error("Duplicate authors not allowed.")

  if (authors.length < 1)
    throw new Error("Article must have at least one author.")

  return true
})

articleSchema.path("tags").validate((tags) => {
  if (tags.some(t => { console.log(tags); tags.filter(x => t === x).length === 1 }))
    throw new Error("Duplicate tags not allowed.")

  if (tags.length < 1)
    throw new Error("Article must belong to at least 1 tag.")
  else if (tags.length > 5)
    throw new Error("Article must have no more than 5 tags.")

  return true
})

module.exports = mongoose.model("Article", articleSchema)