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