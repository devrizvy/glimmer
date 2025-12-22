import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
	MessageCircle,
	Users,
	Sparkles,
	NotebookPen,
	Brain,
	Zap,
	Shield,
	CheckCircle2,
	ArrowRight,
	Waves,
	Feather,
	BookOpen,
	HelpCircle,
	Moon,
	Sun,
	Menu,
	X,
} from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
	const { theme, toggleTheme } = useTheme();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Handle scroll effect for navbar
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Landing page for all users
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

							{/* Get Started Button - Desktop */}
							<NavLink to="/signup" className="hidden sm:block">
								<Button
									size="sm"
									className={`h-9 px-5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
										isScrolled
											? "shadow-primary/25 hover:shadow-primary/40"
											: "shadow-primary/30 hover:shadow-primary/50"
									}`}
								>
									Get Started
									<ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
					<div className="md:hidden mt-2 pt-4 border-t border-border/50 bg-background/95 backdrop-blur-xl rounded-b-2xl animate-in slide-in-from-top-2 duration-300">
						<div className="px-4 pb-4 space-y-1">
							{[
								{ to: "/docs", label: "Docs", icon: BookOpen },
								{ to: "/faq", label: "FAQ", icon: HelpCircle },
								{ to: "/about", label: "About", icon: Feather },
							].map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
								>
									<link.icon className="w-4 h-4" />
									{link.label}
								</NavLink>
							))}
							<div className="pt-2">
								<NavLink
									to="/signup"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
								>
									Get Started
									<ArrowRight className="w-4 h-4" />
								</NavLink>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
				<div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
					<div className="text-center space-y-6 max-w-3xl mx-auto">
						{/* Logo & Branding */}
						<div className="flex items-center justify-center gap-3 mb-8">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
								<Waves className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold tracking-tight">zenWhisper</h1>
								<p className="text-sm text-muted-foreground">Find your inner peace</p>
							</div>
						</div>

						{/* Hero Text */}
						<h2 className="text-4xl md:text-6xl font-bold tracking-tight">
							Study. Chat.{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
								Think Better.
							</span>
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
							A focused chat platform built for learning. Connect with study partners,
							join group discussions, take smart notes, and use AI to summarize
							long conversations into clear insights.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
							<NavLink to="/signup" className="w-full sm:w-auto">
								<Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
									Get Started Free
									<ArrowRight className="ml-2 w-4 h-4" />
								</Button>
							</NavLink>
							<NavLink to="/login" className="w-full sm:w-auto">
								<Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
									Sign In
								</Button>
							</NavLink>
						</div>

						{/* Trust Indicators */}
						<div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-primary" />
								<span>Secure & Private</span>
							</div>
							<div className="flex items-center gap-2">
								<Zap className="w-4 h-4 text-accent" />
								<span>Real-time Sync</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4 text-green-500" />
								<span>Always Free</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-6xl mx-auto px-6 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Everything You Need to Study Smarter
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Powerful features designed specifically for students and learners
					</p>
				</div>

				{/* Main Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
					{/* Smart Chats */}
					<Card className="border-primary/20 hover:shadow-lg transition-shadow">
						<CardContent className="p-6 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
								<MessageCircle className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Smart Chats</h3>
								<p className="text-sm text-muted-foreground">
									Direct messaging with real-time sync. Organize conversations,
									favorite important chats, and never lose track of discussions.
								</p>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>One-on-one conversations</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>User discovery & search</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Message history</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Study Groups */}
					<Card className="border-accent/20 hover:shadow-lg transition-shadow">
						<CardContent className="p-6 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
								<Users className="w-6 h-6 text-accent" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Study Groups</h3>
								<p className="text-sm text-muted-foreground">
									Create or join classroom study circles. Collaborate in real-time
									with multiple students on any subject.
								</p>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Group chat rooms</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Topic-based discussions</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Real-time collaboration</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Built-in Notes */}
					<Card className="border-amber-500/20 hover:shadow-lg transition-shadow">
						<CardContent className="p-6 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
								<NotebookPen className="w-6 h-6 text-amber-500" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Built-in Notes</h3>
								<p className="text-sm text-muted-foreground">
									Powerful note-taking with folders, tags, pinning, and archiving.
									Keep your study materials organized and accessible.
								</p>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Rich text editing</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Folder organization</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Pin & archive notes</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* AI Summary */}
					<Card className="border-purple-500/20 hover:shadow-lg transition-shadow">
						<CardContent className="p-6 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-purple-500" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">AI Summarizer</h3>
								<p className="text-sm text-muted-foreground">
									Transform long text into concise summaries. Choose your preferred
									length and format. Perfect for reviewing study materials.
								</p>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Customizable length</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Bullet or paragraph format</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>File upload support</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Search & Discovery */}
					<Card className="border-blue-500/20 hover:shadow-lg transition-shadow">
						<CardContent className="p-6 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
								<Brain className="w-6 h-6 text-blue-500" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Smart Search</h3>
								<p className="text-sm text-muted-foreground">
									Find anything across conversations, notes, and people.
									Quickly locate that important discussion or note.
								</p>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Global search</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Note filtering</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>User discovery</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Docs & Support */}
					<Card className="border-green-500/20 hover:shadow-lg transition-shadow">
						<CardContent className="p-6 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
								<BookOpen className="w-6 h-6 text-green-500" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Docs & FAQ</h3>
								<p className="text-sm text-muted-foreground">
									Comprehensive documentation and FAQ to help you get started.
									Learn tips and tricks for productive studying.
								</p>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Getting started guides</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Common questions answered</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									<span>Feature explanations</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* How It Works Section */}
			<div className="bg-muted/30 py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							How zenWhisper Works
						</h2>
						<p className="text-muted-foreground text-lg">
							Get started in minutes, study smarter for hours
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center space-y-4">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
								<span className="text-2xl font-bold text-white">1</span>
							</div>
							<h3 className="text-xl font-semibold">Create Your Account</h3>
							<p className="text-muted-foreground">
								Sign up in seconds with just your email and password.
								No credit card required.
							</p>
						</div>

						<div className="text-center space-y-4">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
								<span className="text-2xl font-bold text-white">2</span>
							</div>
							<h3 className="text-xl font-semibold">Connect & Collaborate</h3>
							<p className="text-muted-foreground">
								Find study partners, join groups, and start learning together
								in real-time.
							</p>
						</div>

						<div className="text-center space-y-4">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
								<span className="text-2xl font-bold text-white">3</span>
							</div>
							<h3 className="text-xl font-semibold">Take Notes & Summarize</h3>
							<p className="text-muted-foreground">
								Capture important points and use AI to turn long discussions
								into clear, concise summaries.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
				<div className="max-w-4xl mx-auto px-6 text-center space-y-6">
					<h2 className="text-3xl md:text-4xl font-bold">
						Ready to Study Smarter?
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Join thousands of students who are already learning more effectively
						with zenWhisper. Start your journey today.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<NavLink to="/signup" className="w-full sm:w-auto">
							<Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
								Create Free Account
								<ArrowRight className="ml-2 w-4 h-4" />
							</Button>
						</NavLink>
						<NavLink to="/docs" className="w-full sm:w-auto">
							<Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
								Read Documentation
							</Button>
						</NavLink>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t py-12">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
								<Waves className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="font-semibold">zenWhisper</p>
								<p className="text-xs text-muted-foreground">Find your inner peace</p>
							</div>
						</div>
						<div className="flex items-center gap-6 text-sm text-muted-foreground">
							<NavLink to="/docs" className="hover:text-foreground transition-colors">
								Documentation
							</NavLink>
							<NavLink to="/faq" className="hover:text-foreground transition-colors">
								FAQ
							</NavLink>
							<NavLink to="/login" className="hover:text-foreground transition-colors">
								Sign In
							</NavLink>
						</div>
					</div>
					<div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
						<p>&copy; 2024 zenWhisper. Built with care for students everywhere.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
