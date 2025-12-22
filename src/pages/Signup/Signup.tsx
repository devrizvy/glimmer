import React, { useState, useEffect } from "react";
import {
	Eye,
	EyeOff,
	Shield,
	CheckCircle,
	AlertCircle,
	UserPlus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { authApi } from "../../services/apiService";
import toast from "react-hot-toast";

interface ValidationState {
	email: boolean;
	password: boolean;
	username: boolean;
}

const Signup: React.FC = () => {
	const { isAuthenticated, login } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [validation, setValidation] = useState<ValidationState>({
		email: false,
		password: false,
		username: false,
	});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/chat/chats");
		}
	}, [isAuthenticated, navigate]);

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		return password.length >= 6;
	};

	const validateUsername = (username: string) => {
		return username.length >= 3 && username.length <= 20;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Real-time validation
		switch (name) {
			case "email":
				setValidation((prev) => ({ ...prev, email: validateEmail(value) }));
				break;
			case "password":
				setValidation((prev) => ({
					...prev,
					password: validatePassword(value),
				}));
				break;
			case "username":
				setValidation((prev) => ({
					...prev,
					username: validateUsername(value),
				}));
				break;
		}

		setError(null);
		setSuccess(null);
	};

	const getPasswordStrength = (password: string) => {
		if (password.length === 0)
			return { strength: 0, color: "text-foreground/40", label: "" };
		if (password.length < 6)
			return { strength: 1, color: "text-red-600", label: "Weak" };
		if (password.length < 10)
			return { strength: 2, color: "text-yellow-600", label: "Fair" };
		if (password.length < 14)
			return { strength: 3, color: "text-blue-600", label: "Good" };
		return { strength: 4, color: "text-green-600", label: "Strong" };
	};

	const passwordStrength = getPasswordStrength(formData.password);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (
			!formData.username ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword
		) {
			setError("Please fill in all fields");
			return;
		}

		if (!validateEmail(formData.email)) {
			setError("Please enter a valid email address");
			return;
		}

		if (!validatePassword(formData.password)) {
			setError("Password must be at least 6 characters long");
			return;
		}

		if (!validateUsername(formData.username)) {
			setError("Username must be between 3 and 20 characters");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Call your backend signup endpoint
			const response = await authApi.signup(
				formData.username,
				formData.email,
				formData.password
			);

			// Log the response for debugging
			console.log("Signup response:", response);

			// Check if signup was successful
			if (response.success) {
				const data = response.data;

				// Check if backend returned token and userInfo directly
				if (data && data.token && (data.userInfo || data.user)) {
					const userInfo = data.userInfo || data.user;
					// Use loginWithToken by calling it from auth context
					// We need to get it differently since we're using login now
					setSuccess("Account created successfully! Welcome to zenWhisper!");
					toast.success("Welcome to zenWhisper!");

					// Redirect to login page with credentials pre-filled
					setTimeout(() => {
						navigate("/login", { state: { email: formData.email, autoLogin: true } });
					}, 1000);
				} else {
					// Backend only returned success message, need to login separately
					setSuccess("Account created! Logging you in...");

					// Auto-login with the credentials
					const loginSuccess = await login(formData.email, formData.password);

					if (loginSuccess) {
						toast.success("Welcome to zenWhisper!");
						setTimeout(() => {
							navigate("/");
						}, 500);
					} else {
						// Account created but login failed - redirect to login
						setError("Account created! Please login with your credentials.");
						setTimeout(() => {
							navigate("/login");
						}, 1500);
					}
				}
			} else {
				// Signup failed with error from backend
				const errorMsg = response.error || "Signup failed. Please try again.";
				setError(errorMsg);
				toast.error(errorMsg);
			}
		} catch (err: any) {
			// Better error extraction
			console.error("Signup error:", err);

			let errorMessage = "Connection error. Please try again.";

			// Try to extract error from different possible structures
			if (err?.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err?.response?.data?.error) {
				errorMessage = err.response.data.error;
			} else if (err?.message) {
				errorMessage = err.message;
			} else if (typeof err === "string") {
				errorMessage = err;
			}

			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen min-w-full mira-content chat-container flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				{/* Logo and title */}
				<div className="text-center mb-8">
					<Card className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-background/80 backdrop-blur-md border-border/50">
						<UserPlus
							className="w-8 h-8"
							style={{ color: "oklch(0.55 0.08 145)" }}
						/>
					</Card>
					<h1 className="mira-title text-3xl mb-2">Join zenWhisper</h1>
					<p className="text-foreground/60 text-sm">
						Create your account for educational collaboration
					</p>
				</div>

				{/* Signup form */}
				<Card className="bg-background/80 backdrop-blur-md border-border/50">
					<CardContent className="p-8">
						<form onSubmit={handleSubmit} className="space-y-5">
						{/* Username field */}
						<div className="space-y-2">
							<label className="text-foreground text-sm font-medium flex items-center justify-between">
								<span>Username</span>
								{formData.username &&
									(validation.username ? (
										<CheckCircle className="w-4 h-4 text-primary" />
									) : (
										<AlertCircle className="w-4 h-4 text-destructive" />
									))}
							</label>
							<Input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Choose a username"
								className="bg-background/50 border-border/50 focus:border-primary/50"
								disabled={isLoading}
							/>
							{formData.username && (
								<p className="text-xs text-foreground/60">
									{validation.username
										? "Username available"
										: "3-20 characters required"}
								</p>
							)}
						</div>

						{/* Email field */}
						<div className="space-y-2">
							<label className="text-foreground text-sm font-medium flex items-center justify-between">
								<span>Email Address</span>
								{formData.email &&
									(validation.email ? (
										<CheckCircle className="w-4 h-4 text-primary" />
									) : (
										<AlertCircle className="w-4 h-4 text-destructive" />
									))}
							</label>
							<Input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								className="bg-background/50 border-border/50 focus:border-primary/50"
								disabled={isLoading}
							/>
							{formData.email && (
								<p className="text-xs text-foreground/60">
									{validation.email
										? "Valid email address"
										: "Please enter a valid email"}
								</p>
							)}
						</div>

						{/* Password field */}
						<div className="space-y-2">
							<label className="text-foreground text-sm font-medium flex items-center justify-between">
								<span>Password</span>
								{formData.password &&
									(validation.password ? (
										<CheckCircle className="w-4 h-4 text-primary" />
									) : (
										<AlertCircle className="w-4 h-4 text-destructive" />
									))}
							</label>
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Create a password"
									className="bg-background/50 border-border/50 focus:border-primary/50 pr-12"
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</Button>
							</div>
							{formData.password && (
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<div className="flex gap-1">
											{[...Array(4)].map((_, i) => (
												<div
													key={i}
													className={`h-1 w-6 rounded-full transition-all ${
														i < passwordStrength.strength
															? "bg-current"
															: "bg-sidebar-accent/30"
													} ${passwordStrength.color}`}
												/>
											))}
										</div>
										<span className={`text-xs ${passwordStrength.color}`}>
											{passwordStrength.label}
										</span>
									</div>
									<p className="text-xs text-foreground/60">
										Minimum 6 characters
									</p>
								</div>
							)}
						</div>

						{/* Confirm password field */}
						<div className="space-y-2">
							<label className="text-foreground text-sm font-medium">
								Confirm Password
							</label>
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="Confirm your password"
									className="bg-background/50 border-border/50 focus:border-primary/50"
									disabled={isLoading}
								/>
								{formData.confirmPassword &&
									formData.password === formData.confirmPassword && (
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											<CheckCircle className="w-4 h-4 text-primary" />
										</div>
									)}
							</div>
							{formData.confirmPassword && (
								<p className="text-xs text-foreground/60">
									{formData.password === formData.confirmPassword
										? "Passwords match"
										: "Passwords do not match"}
								</p>
							)}
						</div>

						{/* Error/Success message */}
						{error && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{success && (
							<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
								<p className="text-green-600 text-sm flex items-center gap-2">
									<CheckCircle className="w-4 h-4" />
									{success}
								</p>
							</div>
						)}

						{/* Submit button */}
						<Button
							type="submit"
							disabled={
								isLoading ||
								!validation.email ||
								!validation.password ||
								!validation.username
							}
							className="w-full py-3 px-4 text-primary-foreground font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
							style={{
								background: "var(--primary)",
								boxShadow: "0 4px 20px var(--primary) / 0.3",
							}}
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
									<span>Creating account...</span>
								</>
							) : (
								<>
									<span>Create Account</span>
								</>
							)}
						</Button>
					</form>

					{/* Security note */}
					<div className="mt-6 pt-6 mira-separator">
						<div className="flex items-center justify-center gap-2 text-foreground/60 text-xs">
							<Shield className="w-3 h-3" />
							<span>Your data is secure and protected</span>
						</div>
					</div>
					</CardContent>
				</Card>

				{/* Login link */}
				<div className="text-center mt-8">
					<p className="text-foreground/60 text-sm">
						Already have an account?{" "}
						<NavLink
							to="/login"
							className="text-primary hover:text-primary-foreground transition-colors font-medium"
						>
							Sign in here
						</NavLink>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
