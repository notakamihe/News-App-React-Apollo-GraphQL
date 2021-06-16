const { UserInputError } = require("apollo-server-express");
const Article = require("../models/Article")
const fs = require("fs");
const path = require("path");
const Comment = require("../models/Comment")
const {v4: uuidv4} = require("uuid");
const { getFileExtension } = require("../utils/utils");

const articleResolver = {
  queries: {
    getAllArticles: async () => {
      return Article.find().populate("authors").populate("tags").exec().then(doc => doc);
    },
    getArticle: async (parent, args, context, info) => {
      return Article.findById(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Article w/ id of ${args.id} not found.`)

          return doc.populate("authors").populate("tags").execPopulate().then(doc => doc);
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  },
  mutations: {
    addCommentToArticle: async (parent, args, context, info) => {
      let article

      try {
        article = await Article.findById(args.id)

        if (!article)
          throw new UserInputError(`Article w/ id of ${args.id} not found.`)
      } catch (err) {
        throw new Error(err)
      }

      const {content, repliedTo, user} = args.input
      const comment = new Comment({content, repliedTo, user})
      
      try {
        const result = await comment.save();
        
        article.comments.push(result)
        article.save();
  
        return article.populate("authors").populate("tags").execPopulate().then(d => d)
      } catch (err) {
        if (err.errors) {
          throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
        }
      
        throw new Error(err)
      }
      
    },
    createArticle: async (parent, args, context, info) => {
      const {title, body, authors, tags} = args.input
      const article = new Article({title, body, authors, tags, comments: []})

      try {
        const result = await article.save();
        return result.populate("authors").populate("tags").execPopulate().then(doc => doc)
      } catch (err) {
        if (err.errors) {
          throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
        }

        throw new Error(err)
      }
    },
    deleteArticle: async (parent, args, context, info) => {
      return Article.findByIdAndDelete(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Article w/ id of ${args.id} not found.`)

          return `Article w/ id of ${args.id} was successfully deleted.`
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    updateArticle: async (parent, args, context, info) => {
      const {title, body, authors, tags} = args.input

      return Article.findByIdAndUpdate(args.id, {title, body, authors, tags}, {new: true, runValidators: true})
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Article w/ id of ${args.id} not found.`)

          return doc.populate("authors").populate("tags").execPopulate().then(doc => doc)
        })
        .catch(err => {
          if (err.errors) {
            throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
          }
  
          throw new Error(err)
        })
    },
    updateArticleImage: async (parent, args) => {
      try {
        const article = await Article.findById(args.id)

        if (!article)
          throw new Error(`Article w/ id of ${args.id} not found.`)
          
        const file = await args.file

        if (file) {
          const { createReadStream, mimetype, encoding } =  file
  
          if (!mimetype.includes("image"))
            throw new UserInputError("Provided file must be an image.")
  
          const stream = createReadStream();
          const url = path.join("uploads", "images", uuidv4() + getFileExtension(mimetype))
  
          await stream
            .on("error", error => {
              throw new Error(error)
            }) 
            .pipe(fs.createWriteStream(url))
  
          article.imageUrl = url
        } else {
          article.imageUrl = null
        }

        await article.save()
        return article.populate("authors").populate("tags").execPopulate().then(doc => doc)
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}

module.exports = articleResolver