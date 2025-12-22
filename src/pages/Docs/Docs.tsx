import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	BookOpen,
	HelpCircle,
	Search,
	MessageCircle,
	Users,
	Settings,
	Shield,
	Zap,
	Code,
	ChevronRight,
	ExternalLink,
	Copy,
	Download,
	FileText,
	Video,
	Terminal,
	GitBranch,
	Cloud,
	Smartphone,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

const Docs = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSection, setActiveSection] = useState("getting-started");

	const sections = [
		{
			id: "getting-started",
			title: "Getting Started",
			icon: <BookOpen className="w-5 h-5" />,
			items: [
				{ title: "Installation", icon: <Download className="w-4 h-4" /> },
				{ title: "Quick Start Guide", icon: <Zap className="w-4 h-4" /> },
				{ title: "Account Setup", icon: <Users className="w-4 h-4" /> },
				{ title: "Basic Concepts", icon: <AlertCircle className="w-4 h-4" /> },
			],
		},
		{
			id: "features",
			title: "Features",
			icon: <Zap className="w-5 h-5" />,
			items: [
				{
					title: "Real-time Chat",
					icon: <MessageCircle className="w-4 h-4" />,
				},
				{ title: "Virtual Classrooms", icon: <Users className="w-4 h-4" /> },
				{ title: "Smart Notes", icon: <FileText className="w-4 h-4" /> },
				{ title: "AI Summaries", icon: <Terminal className="w-4 h-4" /> },
			],
		},
		{
			id: "api",
			title: "API Reference",
			icon: <Code className="w-5 h-5" />,
			items: [
				{ title: "Authentication", icon: <Shield className="w-4 h-4" /> },
				{ title: "Endpoints", icon: <GitBranch className="w-4 h-4" /> },
				{ title: "Webhooks", icon: <Cloud className="w-4 h-4" /> },
				{ title: "Rate Limits", icon: <AlertCircle className="w-4 h-4" /> },
			],
		},
		{
			id: "tutorials",
			title: "Tutorials",
			icon: <Video className="w-5 h-5" />,
			items: [
				{ title: "Video Guides", icon: <Video className="w-4 h-4" /> },
				{
					title: "Step-by-Step Examples",
					icon: <CheckCircle className="w-4 h-4" />,
				},
				{ title: "Best Practices", icon: <BookOpen className="w-4 h-4" /> },
				{ title: "Troubleshooting", icon: <Settings className="w-4 h-4" /> },
			],
		},
	];

	const filteredSections = sections
		.map((section) => ({
			...section,
			items: section.items.filter((item) =>
				item.title.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		}))
		.filter((section) => section.items.length > 0);

	const renderContent = () => {
		switch (activeSection) {
			case "getting-started":
				return (
					<div className="space-y-8 ">
						<div className="bg-card border rounded-2xl p-8">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
									<BookOpen className="w-6 h-6 text-primary" />
								</div>
								<div>
									<h2 className="text-2xl font-semibold">
										Getting Started with zenWhisper
									</h2>
									<p className="text-muted-foreground">
										Everything you need to know to get started
									</p>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
										<Users className="w-5 h-5 text-primary" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										Create Your Account
									</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Sign up in seconds with your email and start collaborating
										immediately.
									</p>
									<NavLink
										to="/signup"
										className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
									>
										Get Started <ChevronRight className="w-3 h-3" />
									</NavLink>
								</div>

								<div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
										<MessageCircle className="w-5 h-5 text-primary" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										Join Your First Classroom
									</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Connect with teachers and classmates in virtual classrooms.
									</p>
									<NavLink
										to="/group"
										className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
									>
										Explore Classrooms <ChevronRight className="w-3 h-3" />
									</NavLink>
								</div>
							</div>
						</div>

						<div className="bg-card border rounded-2xl p-8">
							<h3 className="text-xl font-semibold mb-6">
								Quick Start Steps
							</h3>
							<div className="space-y-6">
								{[
									{
										step: 1,
										title: "Sign Up",
										desc: "Create your account with email and password",
									},
									{
										step: 2,
										title: "Complete Profile",
										desc: "Add your username and avatar",
									},
									{
										step: 3,
										title: "Join Classrooms",
										desc: "Enter classroom codes or create new ones",
									},
									{
										step: 4,
										title: "Start Collaborating",
										desc: "Chat, share notes, and learn together",
									},
								].map((item) => (
									<div key={item.step} className="flex gap-4">
										<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground flex-shrink-0">
											{item.step}
										</div>
										<div className="flex-1">
											<h4 className="font-medium">
												{item.title}
											</h4>
											<p className="text-sm text-muted-foreground">
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				);

			case "features":
				return (
					<div className="space-y-8">
						<div className="bg-card border rounded-2xl p-8">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
									<Zap className="w-6 h-6 text-primary" />
								</div>
								<div>
									<h2 className="text-2xl font-semibold">Powerful Features</h2>
									<p className="text-muted-foreground">
										Discover what makes zenWhisper special
									</p>
								</div>
							</div>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[
									{
										icon: <MessageCircle className="w-6 h-6" />,
										title: "Real-time Messaging",
										desc: "Instant chat with typing indicators and read receipts",
										badge: "New",
									},
									{
										icon: <Users className="w-6 h-6" />,
										title: "Virtual Classrooms",
										desc: "Create and join collaborative learning spaces",
									},
									{
										icon: <FileText className="w-6 h-6" />,
										title: "Smart Notes",
										desc: "Organize and share study materials with ease",
									},
									{
										icon: <Terminal className="w-6 h-6" />,
										title: "AI Summaries",
										desc: "Get AI-generated summaries of lectures and content",
									},
									{
										icon: <Shield className="w-6 h-6" />,
										title: "Privacy First",
										desc: "End-to-end encryption for all communications",
									},
									{
										icon: <Smartphone className="w-6 h-6" />,
										title: "Cross Platform",
										desc: "Available on web, mobile, and desktop",
									},
								].map((feature, idx) => (
									<div
										key={idx}
										className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
									>
										<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
											<span className="text-primary">
												{feature.icon}
											</span>
										</div>
										<h3 className="text-lg font-semibold mb-2">
											{feature.title}
											{feature.badge && (
												<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
													{feature.badge}
												</span>
											)}
										</h3>
										<p className="text-sm text-muted-foreground">
											{feature.desc}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				);

			case "api":
				return (
					<div className="space-y-8">
						<div className="bg-card border rounded-2xl p-8">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
									<Code className="w-6 h-6 text-primary" />
								</div>
								<div>
									<h2 className="text-2xl font-semibold">API Reference</h2>
									<p className="text-muted-foreground">
										Integrate zenWhisper into your applications
									</p>
								</div>
							</div>

							<div className="bg-muted rounded-xl p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">
										Base URL
									</h3>
									<button className="p-2 hover:bg-muted-foreground/20 rounded-lg transition-colors">
										<Copy className="w-4 h-4" />
									</button>
								</div>
								<code className="block p-4 bg-background rounded-lg text-sm font-mono">
									https://api.zenwhisper.com/v1
								</code>
							</div>

							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold mb-4">
										Authentication
									</h3>
									<p className="text-muted-foreground mb-4">
										All API requests must include your API key in the
										Authorization header:
									</p>
									<div className="bg-muted rounded-xl p-4 overflow-x-auto">
										<pre className="text-sm">
											<code>{`Authorization: Bearer YOUR_API_KEY`}</code>
										</pre>
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold mb-4">
										Example Request
									</h3>
									<div className="bg-muted rounded-xl p-4 overflow-x-auto">
										<pre className="text-sm">
											<code>{`curl -X POST https://api.zenwhisper.com/v1/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello World", "roomId": "12345"}'`}</code>
										</pre>
									</div>
								</div>
							</div>
						</div>
					</div>
				);

			case "tutorials":
				return (
					<div className="space-y-8">
						<div className="bg-card border rounded-2xl p-8">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
									<Video className="w-6 h-6 text-primary" />
								</div>
								<div>
									<h2 className="text-2xl font-semibold">Video Tutorials</h2>
									<p className="text-muted-foreground">
										Learn by watching step-by-step guides
									</p>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								{[
									{
										title: "Getting Started",
										duration: "5:23",
										desc: "Complete walkthrough of the basics",
										level: "Beginner",
									},
									{
										title: "Advanced Chat Features",
										duration: "8:15",
										desc: "Master real-time messaging",
										level: "Intermediate",
									},
									{
										title: "Classroom Management",
										duration: "10:42",
										desc: "Create and manage virtual classrooms",
										level: "Advanced",
									},
									{
										title: "AI Tools Integration",
										duration: "7:30",
										desc: "Leverage AI for better learning",
										level: "Intermediate",
									},
								].map((video, idx) => (
									<div
										key={idx}
										className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
									>
										<div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
											<Video className="w-8 h-8 text-muted-foreground/40" />
										</div>
										<h3 className="font-medium mb-2">
											{video.title}
										</h3>
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>{video.duration}</span>
											<span className="px-2 py-0.5 rounded-full bg-muted">
												{video.level}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-6 py-12">
			{/* Page Header */}
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold mb-2">Documentation</h1>
				<p className="text-muted-foreground">
					Complete guide to zenWhisper
				</p>
			</div>

			{/* Search Bar */}
			<div className="mb-8">
				<div className="relative max-w-2xl mx-auto">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search documentation..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 border rounded-xl bg-background"
					/>
				</div>
			</div>

			{/* Sidebar Navigation - Mobile Only */}
			<div className="lg:hidden mb-8">
				<div className="bg-card border rounded-2xl p-4">
					<nav className="space-y-2">
						{filteredSections.map((section) => (
							<div key={section.id}>
								<button
									onClick={() => setActiveSection(section.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
										activeSection === section.id
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
									}`}
								>
									{section.icon}
									<span className="font-medium">{section.title}</span>
								</button>
							</div>
						))}
					</nav>
				</div>
			</div>

			{/* Desktop Layout with Sidebar */}
			<div className="hidden lg:grid grid-cols-[280px_1fr] gap-8 items-start max-w-6xl mx-auto">
				{/* Sidebar - Desktop */}
				<div className="shrink-0">
					<div className="bg-card border rounded-2xl p-6 sticky top-24">
						<nav className="space-y-6">
							{filteredSections.map((section) => (
								<div key={section.id}>
									<button
										onClick={() => setActiveSection(section.id)}
										className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${
											activeSection === section.id
												? "bg-primary text-primary-foreground"
												: "text-muted-foreground hover:text-foreground hover:bg-muted"
										}`}
									>
										{section.icon}
										<span className="font-medium">{section.title}</span>
									</button>
									{activeSection === section.id && (
										<div className="ml-4 space-y-1">
											{section.items.map((item, idx) => (
												<a
													key={idx}
													href="#"
													className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors"
												>
													{item.icon}
													{item.title}
												</a>
											))}
										</div>
									)}
								</div>
							))}
						</nav>

						<div className="mt-8 pt-8 border-t">
							<div className="space-y-3">
								<a
									href="https://github.com/zenwhisper"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-colors"
								>
									<GitBranch className="w-4 h-4" />
									<span>GitHub</span>
									<ExternalLink className="w-3 h-3 ml-auto" />
								</a>
								<NavLink
									to="/faq"
									className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-colors"
								>
									<HelpCircle className="w-4 h-4" />
									<span>FAQ</span>
									<ExternalLink className="w-3 h-3 ml-auto" />
								</NavLink>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="min-w-0">{renderContent()}</div>
			</div>

			{/* Mobile Layout - Full Width Content */}
			<div className="lg:hidden max-w-4xl mx-auto">
				{renderContent()}
			</div>
		</div>
	);
};

export default Docs;
