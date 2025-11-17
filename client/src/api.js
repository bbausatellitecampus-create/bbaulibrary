// import axios from 'axios'
// const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' })
// export default API


import axios from 'axios';

// 1. Create the Axios instance
const API = axios.create({ 
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' 
});

// 2. Add an Interceptor to every request
API.interceptors.request.use((config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token'); 
    
    // If a token exists, attach it to the request header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add the Content-Type header
    config.headers['Content-Type'] = 'application/json';

    return config;
}, (error) => {
    // Handle request errors
    return Promise.reject(error);
});

export default API;