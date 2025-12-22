import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, ArrowLeft, Waves } from "lucide-react";

export default function PublicLayout() {
	const { theme, toggleTheme } = useTheme();
	const { isAuthenticated } = useAuth();

	return (
		<div className="min-h-screen bg-background">
			{/* Public Header */}
			<header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
								<Waves className="w-5 h-5 text-primary" />
							</div>
							<span className="font-semibold">zenWhisper</span>
						</NavLink>

						<nav className="hidden md:flex items-center gap-4 text-sm">
							<NavLink
								to="/"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Home
							</NavLink>
							<NavLink
								to="/docs"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Docs
							</NavLink>
							<NavLink
								to="/faq"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								FAQ
							</NavLink>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						{/* Theme Toggle */}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							className="text-muted-foreground hover:text-foreground"
						>
							{theme === 'dark' ? (
								<Sun className="w-4 h-4" />
							) : (
								<Moon className="w-4 h-4" />
							)}
						</Button>

						{/* Auth Buttons */}
						{!isAuthenticated && (
							<div className="flex items-center gap-2">
								<NavLink to="/login">
									<Button variant="ghost" size="sm">
										Sign In
									</Button>
								</NavLink>
								<NavLink to="/signup">
									<Button size="sm">
										Sign Up
									</Button>
								</NavLink>
							</div>
						)}

						{isAuthenticated && (
							<NavLink to="/">
								<Button variant="outline" size="sm">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Go to App
								</Button>
							</NavLink>
						)}
					</div>
				</div>
			</header>

			{/* Main Content - Full width for child pages to control their own layout */}
			<main className="px-6 py-12">
				<Outlet />
			</main>

			{/* Public Footer */}
			<footer className="border-t mt-20">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
								<Waves className="w-4 h-4 text-primary" />
							</div>
							<span className="text-sm text-muted-foreground">zenWhisper</span>
						</div>
						<div className="flex items-center gap-6 text-sm text-muted-foreground">
							<NavLink to="/docs" className="hover:text-foreground transition-colors">
								Documentation
							</NavLink>
							<NavLink to="/faq" className="hover:text-foreground transition-colors">
								FAQ
							</NavLink>
							{!isAuthenticated && (
								<>
									<NavLink to="/login" className="hover:text-foreground transition-colors">
										Sign In
									</NavLink>
									<NavLink to="/signup" className="hover:text-foreground transition-colors">
										Sign Up
									</NavLink>
								</>
							)}
						</div>
					</div>
					<div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
						<p>&copy; 2024 zenWhisper. Find your inner peace.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
