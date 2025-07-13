import { API_ENDPOINTS } from '../config/Api.config';

export async function fetchAllGraphData() {
  try {
    const response = await fetch(API_ENDPOINTS.READ_ALL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data; // { success: true, result: [...] }
  } catch (error) {
    return { success: false, error: error.message };
  }
}