const { UserInputError } = require("apollo-server-express");
const Article = require("../models/Article")
const fs = require("fs")

const article = {
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
    updateArticleImage: async (parent, {file}) => {
     args.file.then(file => {
       const {createReadStream, filename, mimetype} = file
       const fileStream = createReadStream()

       fileStream.pipe(fs.createWriteStream(`../uploads/${filename}`))

       return file
     })
    }
  }
}

module.exports = article