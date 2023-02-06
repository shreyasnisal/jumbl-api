const express = require("express")
const cors = require("cors")
const router = require("./routes/router.js")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')

require('dotenv').config();

const app = express()
const PORT = process.env.PORT
const MONGODB = process.env.MONGODB_URI

mongoose.connect(MONGODB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
).catch(err => {
	console.log(err)
})

mongoose.Promise = global.Promise
const DB = mongoose.connection

DB.on("error", console.error.bind(console, "Database connection error"))
DB.once("open", () => {
	console.log("Connected to database")
})

app.use(cors({origin: "*"}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use("/", router)

app.listen(PORT, () => {
	console.log("Server started")
})