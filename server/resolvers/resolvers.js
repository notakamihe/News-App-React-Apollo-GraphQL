const { GraphQLUpload } = require("apollo-server-core")
const article = require("./article")
const comment = require("./comment")
const tag = require("./tag")
const user = require("./user")

const resolvers = {
  FileUpload: GraphQLUpload,
  Query: {
    ...user.queries,
    ...tag.queries,
    ...article.queries,
    ...comment.queries,
  },
  Mutation: {
    ...user.mutations,
    ...tag.mutations,
    ...article.mutations,
    ...comment.mutations
  },
}

console.log(resolvers);

module.exports = resolvers