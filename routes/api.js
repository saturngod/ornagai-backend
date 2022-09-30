var express = require('express')
var router = express.Router()
const {findWord,resultWord} = require("../controllers/words")
const {guard} = require("../middleware/guardapi")

router.use("/",guard)
router.get('/search/:word', findWord)
router.get('/result/:word', resultWord)

module.exports = router;
