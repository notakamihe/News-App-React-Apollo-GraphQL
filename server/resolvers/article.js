const { UserInputError } = require("apollo-server-express");
const Article = require("../models/Article")

const article = {
  queries: {
    getAllArticles: async () => {
      return await Article.find();
    }
  },
  mutations: {
    createArticle: async (parent, args, context, info) => {
      const {title, body, authors, tags} = args.input

      const article = new Article({title, body, authors, tags, comments: []})

      try {
        return await article.save();
      } catch (err) {
        if (err.errors) {
          throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
        }

        throw new Error(err)
      }
    }
  }
}

module.exports = article