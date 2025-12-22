import React, { useState, useEffect } from "react";
import {
	Eye,
	EyeOff,
	Shield,
	CheckCircle,
	AlertCircle,
	UserPlus,
	Waves,
	Moon,
	Sun,
	Menu,
	X,
	ArrowRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

	// Handle scroll effect for navbar
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/welcome");
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
			return { strength: 0, color: "text-muted-foreground", label: "" };
		if (password.length < 6)
			return { strength: 1, color: "text-destructive", label: "Weak" };
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
				const data = response.data as any;

				// Check if backend returned token and userInfo directly
				if (data && data.token && (data.userInfo || data.user)) {
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
							navigate("/welcome");
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
		<div className="min-h-screen w-full bg-background">
			{/* Floating Navbar */}
			<nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-out ${
				isScrolled
					? "bg-background/90 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/5 rounded-2xl py-2"
					: "bg-transparent py-3"
			}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<NavLink to="/" className="flex items-center gap-2.5 group">
							<div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg transition-all duration-300 ${
								isScrolled ? "shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105" : "shadow-primary/20"
							}`}>
								<Waves className="w-5 h-5 text-white" />
							</div>
							<span className="font-bold text-base tracking-tight">zenWhisper</span>
						</NavLink>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-1">
							{[
								{ to: "/docs", label: "Docs" },
								{ to: "/faq", label: "FAQ" },
								{ to: "/about", label: "About" },
							].map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
								>
									{link.label}
								</NavLink>
							))}
						</div>

						{/* Right Actions */}
						<div className="flex items-center gap-2">
							{/* Theme Toggle */}
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleTheme}
								className={`h-9 w-9 rounded-xl transition-all duration-300 ${
									isScrolled
										? "hover:bg-muted/80"
										: "hover:bg-black/5 dark:hover:bg-white/10"
								}`}
							>
								{theme === 'dark' ? (
									<Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-90" />
								) : (
									<Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
								)}
							</Button>

							{/* Login Button - Desktop */}
							<NavLink to="/login" className="hidden sm:block">
								<Button
									size="sm"
									variant="outline"
									className="h-9 px-5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
								>
									Sign In
								</Button>
							</NavLink>

							{/* Mobile Menu Button */}
							<Button
								variant="ghost"
								size="icon"
								className={`md:hidden h-9 w-9 rounded-xl transition-all duration-300 ${
									isScrolled
										? "hover:bg-muted/80"
										: "hover:bg-black/5 dark:hover:bg-white/10"
								}`}
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								{isMobileMenuOpen ? (
									<X className="w-5 h-5 transition-transform duration-300 rotate-90" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden mt-2 pt-4 border-t border-border/50 bg-background/95 backdrop-blur-xl rounded-b-2xl">
						<div className="px-4 pb-4 space-y-1">
							{[
								{ to: "/docs", label: "Docs" },
								{ to: "/faq", label: "FAQ" },
								{ to: "/about", label: "About" },
							].map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									onClick={() => setIsMobileMenuOpen(false)}
									className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
								>
									{link.label}
								</NavLink>
							))}
							<div className="pt-2">
								<NavLink
									to="/login"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium border rounded-xl transition-all duration-300"
								>
									Sign In
									<ArrowRight className="w-4 h-4" />
								</NavLink>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* Main Content */}
			<div className="min-h-screen flex items-center justify-center p-6 relative">
				{/* Background decoration */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>

				<div className="w-full max-w-md relative z-10">
					{/* Logo and title */}
					<div className="text-center mb-8">
						<div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-card border shadow-lg">
							<UserPlus className="w-10 h-10 text-primary" />
						</div>
						<h1 className="text-3xl font-bold mb-2">Join zenWhisper</h1>
						<p className="text-muted-foreground text-sm">
							Create your account for educational collaboration
						</p>
					</div>

					{/* Signup form */}
					<Card className="bg-card/50 backdrop-blur border shadow-xl">
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
									disabled={isLoading}
								/>
								{formData.username && (
									<p className="text-xs text-muted-foreground">
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
									disabled={isLoading}
								/>
								{formData.email && (
									<p className="text-xs text-muted-foreground">
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
										className="pr-12"
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
																: "bg-muted"
														} ${passwordStrength.color}`}
													/>
												))}
											</div>
											<span className={`text-xs ${passwordStrength.color}`}>
												{passwordStrength.label}
											</span>
										</div>
										<p className="text-xs text-muted-foreground">
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
									<p className="text-xs text-muted-foreground">
										{formData.password === formData.confirmPassword
											? "Passwords match"
											: "Passwords do not match"}
									</p>
								)}
							</div>

							{/* Error/Success message */}
							{error && (
								<div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10">
									<p className="text-destructive text-sm">{error}</p>
								</div>
							)}

							{success && (
								<div className="p-3 rounded-lg border border-primary/50 bg-primary/10">
									<p className="text-primary text-sm flex items-center gap-2">
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
								className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
								size="lg"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
										<span>Creating account...</span>
									</>
								) : (
									<>
										<span>Create Account</span>
										<ArrowRight className="ml-2 w-4 h-4" />
									</>
								)}
							</Button>
						</form>

						{/* Security note */}
						<div className="mt-6 pt-6 border-t">
							<div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
								<Shield className="w-3 h-3" />
								<span>Your data is secure and protected</span>
							</div>
						</div>
						</CardContent>
					</Card>

					{/* Login link */}
					<div className="text-center mt-8">
						<p className="text-muted-foreground text-sm">
							Already have an account?{" "}
							<NavLink
								to="/login"
								className="text-primary hover:text-primary/80 transition-colors font-semibold"
							>
								Sign in here
							</NavLink>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
