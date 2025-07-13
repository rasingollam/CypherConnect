const express = require('express');
const router = express.Router();
const { writeCypher, readAll } = require('../controllers/cypher.controller');

router.post('/write', writeCypher);
router.get('/read', readAll);

module.exports = router;