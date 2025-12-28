import axios from "axios";

// Create axios instance with default configuration
const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("glimmer_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor to handle common errors
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle token expiration
		if (error.response?.status === 401) {
			localStorage.removeItem("glimmer_token");
			localStorage.removeItem("glimmer_user");
			// Clear all auth data and redirect to login
			window.location.href = "/login";
		}

		return Promise.reject(error);
	},
);

export default api;
