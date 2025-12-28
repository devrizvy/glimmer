import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, User, Waves, Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

const Login: React.FC = () => {
	const { login, isAuthenticated, user } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
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
				toast.success("Welcome back!");
				navigate("/welcome");
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
							<span className="font-bold text-base tracking-tight">Glimmer</span>
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

							{/* Signup Button - Desktop */}
							<NavLink to="/signup" className="hidden sm:block">
								<Button
									size="sm"
									variant="outline"
									className={`h-9 px-5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
										isScrolled ? "" : ""
									}`}
								>
									Sign Up
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
									to="/signup"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-xl transition-all duration-300"
								>
									Sign Up
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
							<User className="w-10 h-10 text-primary" />
						</div>
						<h1 className="text-4xl font-bold mb-3">Welcome Back</h1>
						<p className="text-muted-foreground text-base">
							Sign in to continue to Glimmer
						</p>
					</div>

					{/* Login form */}
					<Card className="bg-card/50 backdrop-blur border shadow-xl">
						<CardContent className="p-6">
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
											className="pr-12"
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
									<div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
										<p className="text-destructive text-sm font-medium">{error}</p>
									</div>
								)}

								{/* Submit button */}
								<Button
									type="submit"
									disabled={isLoading}
									className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
							<div className="mt-6 pt-6 border-t">
								<div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
									<Shield className="w-4 h-4" />
									<span>Secure login powered by Glimmer</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Signup link */}
					<div className="text-center mt-8">
						<p className="text-muted-foreground text-base">
							Don't have an account?{" "}
							<NavLink
								to="/signup"
								className="text-primary hover:text-primary/80 transition-colors font-semibold"
							>
								Sign up here
							</NavLink>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
