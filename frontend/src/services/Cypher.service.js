import { API_ENDPOINTS } from '../config/Api.config';

export async function fetchAllGraphData() {
  try {
    const response = await fetch(API_ENDPOINTS.READ_ALL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function writeCypherQuery(query) {
  try {
    const response = await fetch(API_ENDPOINTS.WRITE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function readCypherQuery(query) {
  try {
    const response = await fetch(API_ENDPOINTS.READ, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}