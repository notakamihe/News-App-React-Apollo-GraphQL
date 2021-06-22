const { UserInputError } = require("apollo-server-express")
const mongoose = require("mongoose")
const Article = require("../models/Article")
const Comment = mongoose.model("Comment")

const commentResolver = {
  queries: {
    getAllComments: async (parent, args, context, info) => {
      return populatedComments(Comment.find())
    },
    getArticleComment: async (parent, args, context, info) => {
      return Article.findById(args.articleId)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Article w/ id of ${args.articleId} not found.`)

            return Comment.findOne({$and: [{_id: args.commentId}, {_id: {$in: doc.comments}}]})
              .then(d => {
                if (!d)
                  throw new UserInputError(`Comment w/ id of ${args.commentId} not found within article's comments.`)

                  return populatedComments(d)
              })
              .catch(err => {
                throw new Error(err)
              })
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    getArticleComments: async (parent, args, context, info) => {
      return Article.findById(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Article w/ id of ${args.id} not found.`)

          return populatedComments(Comment.find({_id: {$in: doc.comments}}))
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    getComment: async (parent, args, context, info) => {
      return Comment.findById(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Comment w/ id of ${args.id} not found.`)

          return populatedComments(doc)
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  },
  mutations: {
    deleteComment: async (parent, args, context, info) => {
      return Comment.findByIdAndDelete(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Comment w/ id of ${args.id} not found.`)

          return `Comment w/ id of ${args.id} was successfully deleted.`
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}

const populatedComments = async (docs) => {
  const populatePromise = docs.populate("user").populate({
    path: "repliedTo",
    model: "Comment",
    populate: [
      { path: "user", model: "User" },
    ]
  })

  if ((await docs).length != undefined) {
    return populatePromise.exec().then(d => d)
  } else {
    return populatePromise.execPopulate().then(d => d)
  }
}

module.exports = commentResolver