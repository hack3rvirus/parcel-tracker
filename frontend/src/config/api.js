// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? (import.meta.env.VITE_RENDER_URL || import.meta.env.VITE_NETLIFY_URL || 'https://your-backend.onrender.com')
    : 'http://localhost:8000');

export default API_BASE_URL;
