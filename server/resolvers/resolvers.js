const { GraphQLUpload } = require("apollo-server-core")
const article = require("./article")
const comment = require("./comment")
const tag = require("./tag")
const user = require("./user")

const resolvers = {
  FileUpload: GraphQLUpload,
  ...user,
  ...article,
  ...tag,
  ...comment
}

module.exports = resolvers