// filepath: /home/rasi/Documents/Projects/CypherConnect/backend/src/controllers/index.js
const express = require('express');
const router = express.Router();

// Example controller function for a route
router.get('/example', (req, res) => {
    res.send('This is an example response from the controller.');
});

// Export the router to be used in routes
module.exports = router;