const express = require('express');
const app = require('./src/app');
const dotenv = require('dotenv');
const driver = require('./src/config/neo4j');

dotenv.config();

const PORT = process.env.PORT;

// Test Neo4j connection before starting the server
async function startServer() {
    try {
        const session = driver.session();
        await session.run('RETURN 1');
        await session.close();
        console.log('✅ Connected to Neo4j database!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to connect to Neo4j:', err);
        process.exit(1);
    }
}

startServer();