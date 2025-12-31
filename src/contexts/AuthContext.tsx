import React, { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";
import { authApi } from "@/services/apiService";

interface User {
	email: string;
	username: string;
	name?: string;
	role?: string;
	status?: string;
	credits?: number;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
}

type AuthAction =
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
	| { type: "LOGOUT" }
	| { type: "SET_USER"; payload: User }
	| { type: "UPDATE_CREDITS"; payload: number };

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: true,
	token: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };
		case "LOGIN_SUCCESS":
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				isLoading: false,
			};
		case "LOGOUT":
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
			};
		case "SET_USER":
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				isLoading: false,
			};
		case "UPDATE_CREDITS":
			return {
				...state,
				user: state.user ? { ...state.user, credits: action.payload } : null,
			};
		default:
			return state;
	}
};

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	loginWithToken: (user: User, token: string) => void;
	logout: () => void;
	setUser: (user: User) => void;
	updateCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Check for saved user and token on mount
	useEffect(() => {
		const savedUser = localStorage.getItem("glimmer_user");
		const savedToken = localStorage.getItem("glimmer_token");

		if (savedUser && savedToken) {
			try {
				const user: User = JSON.parse(savedUser);
				// Validate token (simple check for now, you could add JWT validation)
				dispatch({
					type: "LOGIN_SUCCESS",
					payload: { user, token: savedToken },
				});
			} catch (error) {
				toast.error("Session expired. Please login again.");
				localStorage.removeItem("glimmer_user");
				localStorage.removeItem("glimmer_token");
				dispatch({ type: "SET_LOADING", payload: false });
			}
		} else {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const response = await authApi.login(email, password);
			if (response.success && response.data) {
				const { token, userInfo } = response.data;
				const userData = userInfo as User & { status: string; credits?: number };

				// Check if user is blocked
				if (userData.status === "BLOCKED") {
					toast.error("Your account has been blocked. Please contact the administrator.");
					return false;
				}

				const user: User = {
					email: userData.email,
					username: userData.username,
					name: userData.username,
					role: userData.role,
					status: userData.status,
					credits: userData.credits ?? 10,
				};

				localStorage.setItem("glimmer_user", JSON.stringify(user));
				localStorage.setItem("glimmer_token", token);
				dispatch({
					type: "LOGIN_SUCCESS",
					payload: { user, token },
				});
				return true;
			} else {
				toast.error(response.error || "Login failed");
				return false;
			}
		} catch (error) {
			toast.error("Login failed. Please try again.");
			return false;
		}
	};

	const loginWithToken = (user: any, token: string) => {
		// Map backend user data to frontend User interface
		const mappedUser: User = {
			email: user.email,
			username: user.name || user.username, // Use name from backend, fallback to username
			name: user.name,
			role: user.role,
			status: user.status,
			credits: user.credits ?? 10,
		};

		localStorage.setItem("glimmer_user", JSON.stringify(mappedUser));
		localStorage.setItem("glimmer_token", token);
		dispatch({
			type: "LOGIN_SUCCESS",
			payload: { user: mappedUser, token },
		});
	};

	const logout = () => {
		localStorage.removeItem("glimmer_user");
		localStorage.removeItem("glimmer_token");
		dispatch({ type: "LOGOUT" });
	};

	const setUser = (user: User) => {
		const token = localStorage.getItem("glimmer_token") || "demo-token";
		localStorage.setItem("glimmer_user", JSON.stringify(user));
		dispatch({
			type: "LOGIN_SUCCESS",
			payload: { user, token },
		});
	};

	const updateCredits = (credits: number) => {
		if (state.user) {
			const updatedUser = { ...state.user, credits };
			localStorage.setItem("glimmer_user", JSON.stringify(updatedUser));
			dispatch({
				type: "UPDATE_CREDITS",
				payload: credits,
			});
		}
	};

	const value: AuthContextType = {
		...state,
		login,
		loginWithToken,
		logout,
		setUser,
		updateCredits,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
