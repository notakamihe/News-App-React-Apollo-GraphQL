const { GraphQLUpload } = require("apollo-server-core")
const articleResolver = require("./article")
const commentResolver = require("./comment")
const tagResolver = require("./tag")
const userResolver = require("./user")

const resolvers = {
  Query: {
    ...userResolver.queries,
    ...tagResolver.queries,
    ...articleResolver.queries,
    ...commentResolver.queries,
  },
  Mutation: {
    ...userResolver.mutations,
    ...tagResolver.mutations,
    ...articleResolver.mutations,
    ...commentResolver.mutations
  },
}

module.exports = resolvers