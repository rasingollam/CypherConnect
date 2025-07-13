// filepath: /home/rasi/Documents/Projects/CypherConnect/backend/src/utils/helpers.js
const isEmpty = (value) => {
    return value === undefined || value === null || value === '';
};

const generateResponse = (status, message, data = null) => {
    return {
        status,
        message,
        data,
    };
};

const formatDate = (date) => {
    return new Date(date).toISOString();
};

module.exports = {
    isEmpty,
    generateResponse,
    formatDate,
};