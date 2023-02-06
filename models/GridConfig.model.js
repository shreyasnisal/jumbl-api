const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GridConfigSchema = new Schema({
	dateString: {
		type: String,
		required: true,
		unique: true,
	},
	gridConfig: {
		type: String,
		required: true,
	}
})

module.exports = mongoose.model("GridConfig", GridConfigSchema)