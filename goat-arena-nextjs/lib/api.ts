import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import { toast } from 'sonner';

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const message = error.response.data?.detail || 'An unexpected error occurred';
            toast.error('API Error', {
                description: message,
            });
            console.warn('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            toast.error('Network Error', {
                description: 'Unable to reach the server. Please check if the backend is running.',
            });
            console.warn('Network Error: Unable to reach API server.');
        } else {
            toast.error('Request Error', {
                description: error.message,
            });
            console.warn('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);
