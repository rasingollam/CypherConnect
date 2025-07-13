// You can set REACT_APP_API_BASE_URL in your .env file for deployment flexibility
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = Object.freeze({
  WRITE: `${API_BASE_URL}/api/cypher/write`,      // POST
  READ: `${API_BASE_URL}/api/cypher/read`,        // POST
  READ_ALL: `${API_BASE_URL}/api/cypher/read-all` // GET
});

export default API_BASE_URL;