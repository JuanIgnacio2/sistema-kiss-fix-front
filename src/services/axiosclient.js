import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.100/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // Set a timeout of 5 seconds
});

export default axiosClient;