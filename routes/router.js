const express = require("express")
const router = express.Router()
const controller = require("../controllers/controller.js")

router.get("/", controller.getWords)
router.post("/check", controller.check)

module.exports = router