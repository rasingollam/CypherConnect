const driver = require('../config/neo4j');

exports.writeCypherQuery = async (query) => {
    const session = driver.session();
    try {
        const result = await session.executeWrite(async tx => {
            return await tx.run(query);
        });
        return result.records.map(record => record.toObject());
    } finally {
        await session.close();
    }
};

exports.readAllQuery = async () => {
    const session = driver.session();
    try {
        // Get all nodes and relationships
        const result = await session.executeRead(async tx => {
            return await tx.run(`
                MATCH (n)
                OPTIONAL MATCH (n)-[r]->(m)
                RETURN n, r, m
            `);
        });
        return result.records.map(record => record.toObject());
    } finally {
        await session.close();
    }
};

exports.readCypherQuery = async (query) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(async tx => {
            return await tx.run(query);
        });
        return result.records.map(record => record.toObject());
    } finally {
        await session.close();
    }
};