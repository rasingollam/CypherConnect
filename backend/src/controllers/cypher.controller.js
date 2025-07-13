const { writeCypherQuery, readAllQuery, readCypherQuery } = require('../services/cypher.service');

exports.writeCypher = async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Cypher query is required.' });
    }
    try {
        const result = await writeCypherQuery(query);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.readAll = async (req, res) => {
    try {
        const result = await readAllQuery();
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.readCypher = async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Cypher query is required.' });
    }
    try {
        const result = await readCypherQuery(query);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};