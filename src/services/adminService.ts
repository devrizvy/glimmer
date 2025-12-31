import api from "./axios";

// Types
export type AdminUser = {
	email: string;
	username: string;
	role: string;
	status: string;
	credits?: number;
	createdAt: string;
	updatedAt: string;
};

export type AdminRoom = {
	_id: string;
	roomId: string;
	name: string;
	messageCount: number;
	createdAt: string;
};

export type UpdateUserStatusRequest = {
	status: "ACTIVE" | "BLOCKED";
};

export type UpdateUserRoleRequest = {
	role: "user" | "admin";
};

export type UpdateUserCreditsRequest = {
	credits: number;
};

export type DeleteRoomsRequest = {
	roomIds: string[];
};

// Admin API functions
export const adminApi = {
	// Get all users with status
	getAllUsers: async (): Promise<{ success: boolean; data: AdminUser[]; error?: string }> => {
		try {
			const response = await api.get("/admin/users");
			console.log("Admin API - Users response:", response.data);
			// Handle nested response structure - check various possible formats
			let users: AdminUser[] = [];
			if (Array.isArray(response.data)) {
				users = response.data;
			} else if (Array.isArray(response.data?.users)) {
				users = response.data.users;
			} else if (Array.isArray(response.data?.data)) {
				users = response.data.data;
			}
			console.log("Admin API - Parsed users:", users);
			return {
				success: true,
				data: users,
			};
		} catch (error: any) {
			console.error("Admin API - Users error:", error);
			return {
				success: false,
				data: [],
				error: error.response?.data?.message || "Failed to fetch users",
			};
		}
	},

	// Update user status (block/unblock)
	updateUserStatus: async (
		email: string,
		statusData: UpdateUserStatusRequest
	): Promise<{ success: boolean; message?: string; error?: string }> => {
		try {
			const response = await api.patch(`/admin/users/${email}/status`, statusData);
			return {
				success: true,
				message: response.data.message,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.message || "Failed to update user status",
			};
		}
	},

	// Update user role
	updateUserRole: async (
		email: string,
		roleData: UpdateUserRoleRequest
	): Promise<{ success: boolean; message?: string; error?: string }> => {
		try {
			const response = await api.patch(`/admin/users/${email}/role`, roleData);
			return {
				success: true,
				message: response.data.message,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.message || "Failed to update user role",
			};
		}
	},

	// Delete user
	deleteUser: async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
		try {
			const response = await api.delete(`/admin/users/${email}`);
			return {
				success: true,
				message: response.data.message,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.message || "Failed to delete user",
			};
		}
	},

	// Update user credits
	updateUserCredits: async (
		email: string,
		creditsData: UpdateUserCreditsRequest
	): Promise<{ success: boolean; message?: string; data?: AdminUser; error?: string }> => {
		try {
			const response = await api.patch(`/admin/users/${email}/credits`, creditsData);
			return {
				success: true,
				message: response.data.message,
				data: response.data.data,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.message || "Failed to update user credits",
			};
		}
	},

	// Get all rooms with message count
	getAllRooms: async (): Promise<{ success: boolean; data: AdminRoom[]; error?: string }> => {
		try {
			const response = await api.get("/admin/rooms");
			console.log("Admin API - Rooms response:", response.data);
			// Handle nested response structure - check various possible formats
			let rooms: AdminRoom[] = [];
			if (Array.isArray(response.data)) {
				rooms = response.data;
			} else if (Array.isArray(response.data?.rooms)) {
				rooms = response.data.rooms;
			} else if (Array.isArray(response.data?.data)) {
				rooms = response.data.data;
			}
			console.log("Admin API - Parsed rooms:", rooms);
			return {
				success: true,
				data: rooms,
			};
		} catch (error: any) {
			console.error("Admin API - Rooms error:", error);
			return {
				success: false,
				data: [],
				error: error.response?.data?.message || "Failed to fetch rooms",
			};
		}
	},

	// Delete single room messages
	deleteRoom: async (roomId: string): Promise<{ success: boolean; message?: string; error?: string }> => {
		try {
			const response = await api.delete(`/admin/rooms/${roomId}`);
			return {
				success: true,
				message: response.data.message,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.message || "Failed to delete room",
			};
		}
	},

	// Delete multiple rooms
	deleteMultipleRooms: async (
		roomIds: string[]
	): Promise<{ success: boolean; message?: string; error?: string }> => {
		try {
			const response = await api.delete("/admin/rooms", { data: { roomIds } });
			return {
				success: true,
				message: response.data.message,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.message || "Failed to delete rooms",
			};
		}
	},
};

export default adminApi;
