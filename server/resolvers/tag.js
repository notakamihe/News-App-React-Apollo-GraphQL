const { UserInputError } = require("apollo-server-errors")
const Tag = require("../models/Tag")

const tag = {
  queries: {
    getAllTags: async () => {
      return await Tag.find()
    },
    getTag: async (parent, args, context, info) => {
      return Tag.findById(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Tag w/ id of ${args.id} not found.`)

          return doc
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    getTagByName: async (parent, args, context, info) => {
      return Tag.findOne({name: args.name})
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Tag w/ name of ${args.name} not found.`)

          return doc
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  },
  mutations: {
    createTag: async (parent, args, context, info) => {
      const {name} = args.input
      const tag = new Tag({name})

      try {
        return await tag.save()
      } catch (err) {
        if (err.keyPattern) {
          if (err.keyPattern.name) {
            throw new UserInputError("Tag name already exists.")
          }
        }

        if (err.errors) {
          throw new UserInputError(err.errors[Object.keys(err.errors)[0]].message)
        }

        throw new Error(err)
      }
    },
    deleteTag: async (parent, args, context, info) => {
      return Tag.findByIdAndDelete(args.id)
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Tag w/ id of ${args.id} not found.`)

          return `Tag w/ id of ${args.id} was successfully deleted.`
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    updateTag: async (parent, args, context, info) => {
      const {name} = args.input

      return Tag.findByIdAndUpdate(args.id, {name}, {new: true, runValidators: true})
        .then(doc => {
          if (!doc)
            throw new UserInputError(`Tag w/ id of ${args.id} not found.`)

          return doc
        })
        .catch(err => {
          if (err.keyPattern) {
            if (err.keyPattern.name) {
              throw new UserInputError("Tag name already exists.")
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

module.exports = tag