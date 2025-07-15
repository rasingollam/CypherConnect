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
        // Friendly error message
        console.error('❌ Failed to connect to Neo4j database.');
        if (err.code === 'ServiceUnavailable') {
            console.error('Reason: Could not connect to Neo4j at the specified host/port.');
            console.error('Hint: Is Neo4j running and accessible at', process.env.NEO4J_URI || 'bolt://localhost:7687', '?');
        } else if (err.code === 'Neo.ClientError.Security.Unauthorized') {
            console.error('Reason: Authentication failed. Please check your NEO4J_USER and NEO4J_PASSWORD.');
        } else {
            console.error('Error:', err.message);
        }
        // Print stack trace only in development
        if (process.env.NODE_ENV === 'development') {
            console.error(err);
        }
        process.exit(1);
    }
}

startServer();