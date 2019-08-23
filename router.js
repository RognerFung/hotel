const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const https = require('https')
const transferSource = require('./transfer')
router.use(bodyParser.json())

router.route('/')
.post(async (req, res, next) => {
    res.json(req.body.data.map(e => transferSource(e)));
})

module.exports = router