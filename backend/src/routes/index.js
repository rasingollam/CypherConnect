// filepath: /home/rasi/Documents/Projects/CypherConnect/backend/src/routes/index.js
const express = require('express');
const router = express.Router();

const cypherRoutes = require('./cypher.route');
router.use('/cypher', cypherRoutes);

// Export the router
module.exports = router;