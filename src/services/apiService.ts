// HTTP API Service for Glimmer backend
import api from "./axios";

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

interface AuthResponse {
	token: string;
	userInfo: {
		email: string;
		username: string;
		name?: string;
	};
}

// Backend message types (matching your MongoDB schema)
export interface BackendPrivateMessage {
	_id: string;
	chatId: string;
	senderEmail: string;
	senderUsername: string;
	receiverEmail: string;
	receiverUsername: string;
	message: string;
	time: string;
	createdAt: string; // ISO date string
}

export interface BackendRoomMessage {
	_id: string;
	roomId: string;
	room: string;
	author: string;
	message: string;
	time: string;
	createdAt: string; // ISO date string
}

export interface BackendChat {
	chatId: string;
	partnerEmail: string;
	partnerUsername: string;
	lastMessage: string;
	lastMessageTime: string;
	lastMessageDate: string;
}

// Generic API request wrapper using axios
const apiRequest = async <T>(
	endpoint: string,
	options: any = {},
): Promise<ApiResponse<T>> => {
	try {
		let response;

		switch (options.method) {
			case "POST":
				response = await api.post(
					endpoint,
					options.body ? JSON.parse(options.body) : {},
				);
				break;
			case "PUT":
				response = await api.put(
					endpoint,
					options.body ? JSON.parse(options.body) : {},
				);
				break;
			case "PATCH":
				response = await api.patch(
					endpoint,
					options.body ? JSON.parse(options.body) : {},
				);
				break;
			case "DELETE":
				response = await api.delete(endpoint);
				break;
			default:
				response = await api.get(endpoint);
				break;
		}

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		// Try to extract the actual error message from various possible structures
		let errorMessage = "Unknown error occurred";

		if (error.response?.data) {
			const data = error.response.data;
			errorMessage = data.message || data.error || data.errorMsg || JSON.stringify(data);
		} else if (error.message) {
			errorMessage = error.message;
		} else if (typeof error === "string") {
			errorMessage = error;
		}

		return {
			success: false,
			error: errorMessage,
		};
	}
};

// Authentication API
export const authApi = {
	login: async (email: string, password: string) => {
		return apiRequest<AuthResponse>("/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	},

	signup: async (username: string, email: string, password: string) => {
		return apiRequest("/signup", {
			method: "POST",
			body: JSON.stringify({ username, email, password }),
		});
	},

	// Get all users (for testing/debugging)
	getUsers: async () => {
		return apiRequest<any[]>("/users");
	},
};

// Messages API
export const messagesApi = {
	// Get room messages for a specific room
	getRoomMessages: async (roomId: string) => {
		return apiRequest<BackendRoomMessage[]>(`/room/${roomId}`);
	},

	// Get private messages for a specific chat
	getPrivateMessages: async (chatId: string) => {
		return apiRequest<BackendPrivateMessage[]>(`/private-chat/${chatId}`);
	},

	// Get all chats for a specific user
	getUserChats: async (userEmail: string) => {
		return apiRequest<BackendChat[]>(`/user-chats/${userEmail}`);
	},
};

// Utility functions
export const generateChatId = (email1: string, email2: string): string => {
	// Create a consistent chat ID regardless of email order
	const sortedEmails = [email1, email2].sort();
	return btoa(sortedEmails.join("_")).replace(/[/+=]/g, "");
};

export const formatMessageTime = (date: Date): string => {
	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

export const formatDate = (date: Date): string => {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const messageDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	const diffTime = Math.abs(today.getTime() - messageDate.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return "Today";
	} else if (diffDays === 1) {
		return "Yesterday";
	} else if (diffDays < 7) {
		return date.toLocaleDateString("en-US", { weekday: "long" });
	} else {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	}
};

export default apiRequest;
