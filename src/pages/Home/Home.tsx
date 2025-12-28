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
	Star,
	Target,
	Infinity,
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
		<div className="min-h-screen w-full bg-background overflow-hidden">
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

			{/* Hero Section with Animated Background */}
			<div className="relative overflow-hidden">
				{/* Animated Background Shapes */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
				</div>

				{/* Grid Pattern Overlay */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

				<div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
					<div className="text-center space-y-8 max-w-3xl mx-auto">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
							<Sparkles className="w-4 h-4" />
							<span>New: AI-Powered Summarization</span>
							<ArrowRight className="w-4 h-4" />
						</div>

						{/* Logo & Branding */}
						<div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
								<Waves className="w-9 h-9 text-white" />
							</div>
							<div className="text-left">
								<h1 className="text-3xl font-bold tracking-tight">Glimmer</h1>
								<p className="text-sm text-muted-foreground">Where ideas illuminate together</p>
							</div>
						</div>

						{/* Hero Text */}
						<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
							<h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
								Study. Chat.{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
									Think Better.
								</span>
							</h2>
							<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
								A focused chat platform built for learning. Connect with study partners,
								join group discussions, take smart notes, and use AI to summarize
								long conversations into clear insights.
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
							<NavLink to="/signup" className="w-full sm:w-auto group">
								<Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
									Get Started Free
									<ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
								</Button>
							</NavLink>
							<NavLink to="/login" className="w-full sm:w-auto">
								<Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-2 transition-all duration-300 hover:scale-105">
									Sign In
								</Button>
							</NavLink>
						</div>

						{/* Stats / Trust Indicators */}
						<div className="flex flex-wrap items-center justify-center gap-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Shield className="w-5 h-5 text-primary" />
								<span className="font-medium">Secure & Private</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Zap className="w-5 h-5 text-accent" />
								<span className="font-medium">Real-time Sync</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Infinity className="w-5 h-5 text-green-500" />
								<span className="font-medium">Always Free</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-6 py-24">
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
						<Star className="w-4 h-4" />
						<span>Powerful Features</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-bold mb-4">
						Everything You Need to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
							Study Smarter
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Powerful features designed specifically for students and learners
					</p>
				</div>

				{/* Main Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Smart Chats */}
					<Card className="group border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
						<CardContent className="p-6 space-y-4">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<MessageCircle className="w-7 h-7 text-primary" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Smart Chats</h3>
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
					<Card className="group border-accent/20 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
						<CardContent className="p-6 space-y-4">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<Users className="w-7 h-7 text-accent" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Study Groups</h3>
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
					<Card className="group border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10">
						<CardContent className="p-6 space-y-4">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<NotebookPen className="w-7 h-7 text-amber-500" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Built-in Notes</h3>
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
					<Card className="group border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
						<CardContent className="p-6 space-y-4">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<Sparkles className="w-7 h-7 text-purple-500" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">AI Summarizer</h3>
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
					<Card className="group border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
						<CardContent className="p-6 space-y-4">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<Brain className="w-7 h-7 text-blue-500" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Smart Search</h3>
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
					<Card className="group border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
						<CardContent className="p-6 space-y-4">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<BookOpen className="w-7 h-7 text-green-500" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Docs & FAQ</h3>
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
			<div className="relative bg-muted/30 py-24 overflow-hidden">
				{/* Background decoration */}
				<div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent" />
				<div className="max-w-6xl mx-auto px-6 relative">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
							<Target className="w-4 h-4" />
							<span>Simple Steps</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							How Glimmer Works
						</h2>
						<p className="text-muted-foreground text-lg">
							Get started in minutes, study smarter for hours
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
						{/* Connecting Line (Desktop) */}
						<div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />

						{/* Step 1 */}
						<div className="text-center space-y-4 relative">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-xl shadow-primary/30 hover:scale-110 transition-transform duration-300">
								<span className="text-2xl font-bold text-white">1</span>
							</div>
							<h3 className="text-xl font-semibold">Create Your Account</h3>
							<p className="text-muted-foreground">
								Sign up in seconds with just your email and password.
								No credit card required.
							</p>
						</div>

						{/* Step 2 */}
						<div className="text-center space-y-4 relative">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-xl shadow-primary/30 hover:scale-110 transition-transform duration-300">
								<span className="text-2xl font-bold text-white">2</span>
							</div>
							<h3 className="text-xl font-semibold">Connect & Collaborate</h3>
							<p className="text-muted-foreground">
								Find study partners, join groups, and start learning together
								in real-time.
							</p>
						</div>

						{/* Step 3 */}
						<div className="text-center space-y-4 relative">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-xl shadow-primary/30 hover:scale-110 transition-transform duration-300">
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
			<div className="relative py-24 overflow-hidden">
				{/* Animated gradient background */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

				<div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative">
					<h2 className="text-4xl md:text-5xl font-bold">
						Ready to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
							Study Smarter?
						</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Join thousands of students who are already learning more effectively
						with Glimmer. Start your journey today.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<NavLink to="/signup" className="w-full sm:w-auto group">
							<Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
								Create Free Account
								<ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
							</Button>
						</NavLink>
						<NavLink to="/docs" className="w-full sm:w-auto">
							<Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-base border-2 transition-all duration-300 hover:scale-105">
								<BookOpen className="w-4 h-4 mr-2" />
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
								<p className="font-semibold">Glimmer</p>
								<p className="text-xs text-muted-foreground">Where ideas illuminate together</p>
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
						<p>&copy; 2025 Glimmer. Crafted by devrizvy.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
