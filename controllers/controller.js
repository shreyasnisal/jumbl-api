const path = require("path")
const fs = require("fs")
const helper = require('../common/helper.js')
const mongoose = require("mongoose")
const GridConfig = require("../models/GridConfig.model")

exports.getWords = async function(req, res) {

	const clientDate = new Date(JSON.parse(req.query.date))
	const serverDate = new Date()

	const curYear = clientDate.getFullYear()
	const curMonth = clientDate.getMonth()
	const curDate = clientDate.getDate()
	const dateString = "" + curYear + curMonth + curDate

	if (Math.abs(clientDate - serverDate) / (1000 * 60 * 60) > 24) {
		return res.status(400).json({message: "Invalid date query"})
	}

	let resultArray = []

	try {
		// check if config has already been generated
		const gridConfigDocument = await GridConfig.findOne({dateString})
		if (gridConfigDocument) {
			resultArray = await GridConfig.findOne({dateString})
			resultArray = JSON.parse(resultArray.gridConfig)
		}
		else {
			// read files and convert to word arrays
			const wordList4File = fs.readFileSync(path.resolve("words4.txt"))
			const wordList4 = wordList4File.toString()
			const wordArray4 = wordList4.trim().split(" ")
			const wordList3File = fs.readFileSync(path.resolve("words3.txt"))
			const wordList3 = wordList3File.toString()
			const wordArray3 = wordList3.trim().split(" ")

			const resultWordArray = []

			for (let i = 0; i < 3; i++) {
				const index = Math.floor(Math.random() * wordArray4.length)
				resultWordArray.push(wordArray4[index])
			}

			const index = Math.floor(Math.random() * wordArray3.length)
			resultWordArray.push(wordArray3[index])

			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					if (i == 3 && j == 3) {
						resultArray.push(0)
						continue
					}

					resultArray.push(resultWordArray[i].charAt(j))
				}
			}

			resultArray = helper.shuffle(resultArray)

			if (resultArray) {
				const generatedConfig = new GridConfig({dateString: dateString, gridConfig: JSON.stringify(resultArray)})
				await generatedConfig.save()
			}
		}

		res.status(200).json(JSON.stringify(resultArray))
	}
	catch (err) {
		console.log(err)
		res.status(500).json({error: err})
	}
}

exports.check = function(req, res) {
	const resultArr = []
	
	// read files and convert to word arrays
	const wordList4File = fs.readFileSync(path.resolve("words4.txt"))
	const wordList4 = wordList4File.toString()
	const wordArray4 = wordList4.trim().split(" ")
	const wordList3File = fs.readFileSync(path.resolve("words3.txt"))
	const wordList3 = wordList3File.toString()
	const wordArray3 = wordList3.trim().split(" ")

	const {grid} = req.body
	
	if (!grid) {
		return res.status(400).json({message: "Invalid grid"})
	}

	for (let i = 0; i < 4; i++) {
		let word = ""
		for (let j = 0; j < 4; j++) {
			if (j != 3 || i != 3) {
				word += grid[i * 4 + j]
			}
		}
		if (i == 3) {
			if (wordArray3.includes(word) && grid[i * 4 + 3] == 0) {
				resultArr.push(1)
			}
			else {
				resultArr.push(0)
			}

			continue
		}
		if (wordArray4.includes(word)) {
			resultArr.push(1)
		}
		else {
			resultArr.push(0)
		}
	}

	res.status(200).json(JSON.stringify(resultArr))
}