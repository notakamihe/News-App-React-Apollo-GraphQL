const express = require("express")
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
const { ApolloServer, gql } = require('apollo-server-express');

const resolvers = require("./resolvers/resolvers")
const typeDefs = require("./schema");
const { getUserByToken } = require("./utils/utils");

mongoose.connect('mongodb://localhost/news', {
	useNewUrlParser: true, 
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})

const db = mongoose.connection

db.on("error", (err) => console.error(err))
db.on("open", () => console.log("Successfully connected to database."))

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const server = new ApolloServer({
	typeDefs, 
	resolvers,
	context: ({req}) => {
		return {user: getUserByToken(req.headers.authorization)}
	}
})

server.applyMiddleware({app})

app.listen({port: 8000}, () => console.log(`Server ready at http://localhost:8000${server.graphqlPath}`))