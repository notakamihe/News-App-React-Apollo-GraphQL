const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
  _id: ID!
  email: String!
  name: String!
  password: String!
  role: String!
  description: String
  createdOn: String!
  pfpUrl: String
}

input UserRegisterInput {
  email: String!
  name: String!
  password: String!
  role: String!
  description: String
  code: String
}

input UserLoginInput {
  email: String!
  password: String!
}

input UserUpdateInput {
  email: String!
  name: String!
  description: String
}


type Article {
  _id: ID!
  title: String!
  body: String!
  imageUrl: String
  createdOn: String!
  authors: [User]!
  tags: [Tag]
  comments: [Comment]
}

input ArticleInput {
  title: String!
  body: String!
  authors: [ID]!
  tags: [ID]!
}


type Comment {
  _id: ID!
  content: String!
  createdOn: String!
  repliedTo: Comment,
  user: User
}

input CommentInput {
  content: String!
  repliedTo: ID,
  user: ID!
}


type Tag {
  _id: ID!
  name: String!
}

input TagInput {
  name: String!
}


type Token {
  token: String!
}


type Query {
  getAllUsers: [User]
  getUser(id: ID): User
  getUserByToken(token: String) : User
  loginUser(input: UserLoginInput) : Token

  getAllArticles: [Article]
  getArticle(id: ID): Article
  getArticleComments(id: ID): [Comment]

  getAllComments: [Comment]
  getComment(id: ID): Comment

  getAllTags: [Tag]
  getTag(id: ID): Tag
  getTagByName(name: String): Tag
}

type Mutation {
  registerUser(input: UserRegisterInput) : Token
  updateUser(id: ID, input: UserUpdateInput) : User
  updateUserPfp(id: ID, file: Upload) : User
  deleteUser(id: ID): String

  createArticle(input: ArticleInput): Article
  updateArticle(id: ID, input: ArticleInput): Article
  updateArticleImage(id: ID, file: Upload): Article
  addCommentToArticle(id: ID, input: CommentInput): Article
  deleteArticle(id: ID): String

  deleteComment(id: ID): String

  createTag(input: TagInput): Tag
  updateTag(id: ID, input: TagInput): Tag
  deleteTag(id: ID): String
}

type File {
  filename: String!
  mimetype: String!
  encoding: String!
}
`

module.exports = typeDefs