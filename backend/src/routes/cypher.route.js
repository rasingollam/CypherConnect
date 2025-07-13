const express = require('express');
const router = express.Router();
const { writeCypher } = require('../controllers/cypher.controller');

router.post('/write', writeCypher);

module.exports = router;