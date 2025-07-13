const express = require('express');
const router = express.Router();
const { writeCypher, readAll, readCypher } = require('../controllers/cypher.controller');

// Define the routes
router.post('/write', writeCypher);

router.post('/read', readCypher);
router.get('/read-all', readAll);

module.exports = router;