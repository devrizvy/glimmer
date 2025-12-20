import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import toast from "react-hot-toast";

const Login: React.FC = () => {
	const { login, isAuthenticated, user } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/chat");
		}
	}, [isAuthenticated, navigate, user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			setError("Please fill in all fields");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Use the new login method from auth context
			const success = await login(formData.email, formData.password);
			if (success) {
				toast.success("Login successful!");
				navigate("/chat");
			}
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || "Connection error. Please try again.";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen min-w-full mira-content flex items-center justify-center p-6 relative">
			{/* Background decoration */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>

			<div className="w-full max-w-md relative z-10">
				{/* Logo and title */}
				<div className="text-center mb-8 animate-mira-message">
					<div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 mira-glass border-border/50 shadow-lg">
						<User className="w-10 h-10 text-primary" />
					</div>
					<h1 className="mira-title text-4xl font-bold mb-3">zenWhisper</h1>
					<p className="text-muted-foreground text-base font-medium">
						Educational platform for students and teachers
					</p>
				</div>

				{/* Login form */}
				<Card className="mira-glass border-border/50 shadow-xl animate-mira-message" style={{ animationDelay: "100ms" }}>
					<CardHeader className="text-center pb-4">
						<h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
						<p className="text-muted-foreground">Sign in to continue your journey</p>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email field */}
						<div className="space-y-2">
							<label htmlFor="email" className="text-foreground font-medium text-sm">
								Email Address
							</label>
							<Input
								id="email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email address"
								className="mira-search"
								disabled={isLoading}
							/>
						</div>

						{/* Password field */}
						<div className="space-y-2">
							<label htmlFor="password" className="text-foreground font-medium text-sm">
								Password
							</label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter your password"
									className="mira-search pr-12"
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>

						{/* Error message */}
						{error && (
							<div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 animate-mira-message">
								<p className="text-destructive text-sm font-medium">{error}</p>
							</div>
						)}

						{/* Submit button */}
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full h-12 text-base font-semibold"
							size="lg"
						>
							{isLoading ? (
								<>
									<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>

					{/* Security note */}
					<div className="mt-6 pt-6 mira-separator">
						<div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
							<Shield className="w-4 h-4" />
							<span>Secure login for educational purposes</span>
						</div>
					</div>
					</CardContent>
				</Card>

				{/* Signup link */}
				<div className="text-center mt-8 animate-mira-message" style={{ animationDelay: "200ms" }}>
					<p className="text-muted-foreground text-base font-medium">
						Don't have an account?{" "}
						<NavLink
							to="/signup"
							className="text-primary hover:text-primary/80 transition-colors font-semibold underline-offset-4 hover:underline"
						>
							Sign up here
						</NavLink>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
