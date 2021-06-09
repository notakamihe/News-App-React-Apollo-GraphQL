require("dotenv").config()

const { UserInputError, ApolloError } = require("apollo-server-errors")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const user = {
  Query: {
    getAllUsers: async () => {
      return await User.find()
    },
    getUser: async (parent, args, context, info) => {
      return User.findById(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`User w/ id of ${args.id} not found.`)

          return doc
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    getUserByToken: async (root, { id }, { user }) => {
      try {
        if(!user) 
          throw new Error('Failed to retrieve user.')

        return await User.findById(user.id)
      } catch (err) {
        throw new Error(err)
      }
    },
    loginUser: async (parent, args, context, info) => {
      const {email, password} = args.input
      let user

      try {
        user = await User.findOne({email})
      } catch (err) {
        throw new Error(err)
      }

      if (!user) {
        throw new UserInputError("User with this email does not exist.")
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UserInputError("Incorrect password.")
      }

      const token = jwt.sign({id: user._id}, "secret", {expiresIn: 86400})

      return {token}
    }
  },
  Mutation: {
    deleteUser: async (parent, args, context, info) => {
      return User.findByIdAndDelete(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`User w/ id of ${args.id} not found.`)

          return `User w/ id of ${args.id} was successfully deleted.`
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    registerUser: async (parent, args, context, info) => {
      const {email, name, password, role, description, code} = args.input
      
      const user = new User({
        email,
        name,
        password: bcrypt.hashSync(password, 8),
        role,
        description
      })
      
      if (role == "admin" && code.toLowerCase() != process.env.ADMIN_CODE.toLowerCase()) {
        throw new UserInputError("Admin code is incorrect.");
      }

      try {
        const result = await user.save()
        const token = jwt.sign({id: result._id}, "secret", {expiresIn: 86400})

        return {token}
      } catch (err) {
        if (err.keyPattern) {
          if (err.keyPattern.email) {
            throw new UserInputError("Email not available.")
          }
        }

        if (err.errors) {
          throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
        }
      }
    },
    updateUser: async (parent, args, context, info) => {
      const {email, name, description} = args.input

      return User.findByIdAndUpdate(args.id, {email, name, description}, {new: true, runValidators: true})
        .then(doc => {
          if (!doc)
            throw new UserInputError(`User w/ id of ${args.id} not found.`)

          return doc
        })
        .catch(err => {
          if (err.keyPattern) {
            if (err.keyPattern.email) {
              throw new UserInputError("Email not available.")
            }
          }
  
          if (err.errors) {
            throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
          }

          throw new Error(err)
        })
    }
  }
}

module.exports = user