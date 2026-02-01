import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Use console.warn instead of console.error to avoid Next.js treating it as unhandled
        if (error.response) {
            // Server responded with error status
            console.warn('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response (network error, CORS, etc.)
            console.warn('Network Error: Unable to reach API server. Make sure backend is running.');
        } else {
            // Something else happened
            console.warn('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);
