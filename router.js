const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const https = require('https');
const { businessLogic } = require('./transfer');
router.use(bodyParser.json());

router.route('/')
.post(async (req, res, next) => {
    res.json(businessLogic(req.body.data));
})

module.exports = router;