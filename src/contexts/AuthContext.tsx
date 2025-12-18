import React, { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

interface User {
	email: string;
	username: string;
	role?: string;
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
	| { type: "SET_USER"; payload: User };

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
		default:
			return state;
	}
};

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	login: (email: string, username: string) => void;
	loginWithToken: (user: User, token: string) => void;
	logout: () => void;
	setUser: (user: User) => void;
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
		const savedUser = localStorage.getItem("zenwhisper_user");
		const savedToken = localStorage.getItem("zenwhisper_token");

		if (savedUser && savedToken) {
			try {
				const user = JSON.parse(savedUser);
				// Validate token (simple check for now, you could add JWT validation)
				dispatch({
					type: "LOGIN_SUCCESS",
					payload: { user, token: savedToken },
				});
			} catch (error) {
				toast.error("Session expired. Please login again.");
				localStorage.removeItem("zenwhisper_user");
				localStorage.removeItem("zenwhisper_token");
				dispatch({ type: "SET_LOADING", payload: false });
			}
		} else {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	const login = (email: string, username: string) => {
		const user = { email, username };
		// This is for demo purposes - normally you'd get token from backend
		const token = localStorage.getItem("zenwhisper_token") || "demo-token";
		localStorage.setItem("zenwhisper_user", JSON.stringify(user));
		dispatch({
			type: "LOGIN_SUCCESS",
			payload: { user, token },
		});
	};

	const loginWithToken = (user: User, token: string) => {
		localStorage.setItem("zenwhisper_user", JSON.stringify(user));
		localStorage.setItem("zenwhisper_token", token);
		dispatch({
			type: "LOGIN_SUCCESS",
			payload: { user, token },
		});
	};

	const logout = () => {
		localStorage.removeItem("zenwhisper_user");
		localStorage.removeItem("zenwhisper_token");
		dispatch({ type: "LOGOUT" });
	};

	const setUser = (user: User) => {
		const token = localStorage.getItem("zenwhisper_token") || "demo-token";
		localStorage.setItem("zenwhisper_user", JSON.stringify(user));
		dispatch({
			type: "LOGIN_SUCCESS",
			payload: { user, token },
		});
	};

	const value: AuthContextType = {
		...state,
		login,
		loginWithToken,
		logout,
		setUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
