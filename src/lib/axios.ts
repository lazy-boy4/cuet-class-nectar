
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data on 401 (Unauthorized) - careful not to loop if login fails
            // Maybe dispatch a logout event or redirect, but for now just reject
            // console.warn("Unauthorized access - token might be invalid/expired");
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
