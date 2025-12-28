import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	BookOpen,
	Search,
	MessageCircle,
	Users,
	FileText,
	Sparkles,
	Shield,
	Zap,
	ChevronRight,
	ExternalLink,
	GitBranch,
	Waves,
} from "lucide-react";

const Docs = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSection, setActiveSection] = useState("getting-started");

	const sections = [
		{
			id: "getting-started",
			title: "Getting Started",
			icon: <Zap className="w-5 h-5" />,
		},
		{
			id: "features",
			title: "Features",
			icon: <Sparkles className="w-5 h-5" />,
		},
	];

	const filteredSections = sections.filter((section) =>
		searchQuery === "" ||
		section.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const renderContent = () => {
		switch (activeSection) {
			case "getting-started":
				return (
					<div className="space-y-6">
						{/* Hero Card */}
						<div className="relative overflow-hidden border border-border/50 rounded-2xl p-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
							<div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
							<div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
							<div className="relative flex items-center gap-4 mb-6">
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
									<Waves className="w-8 h-8 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold">Getting Started</h2>
									<p className="text-muted-foreground">
										Quick guide to start using Glimmer
									</p>
								</div>
							</div>
							<p className="text-muted-foreground max-w-2xl">
								Glimmer is a collaborative study platform designed for students.
								Connect with peers, join study groups, take notes, and use AI to summarize your learning materials.
							</p>
						</div>

						{/* Quick Actions */}
						<div className="grid sm:grid-cols-2 gap-4">
							<NavLink to="/chat/users" className="group">
								<div className="border border-border/50 rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
									<div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
										<Users className="w-6 h-6 text-primary" />
									</div>
									<h3 className="text-lg font-semibold mb-2">Find Study Partners</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Discover other students and start one-on-one conversations
									</p>
									<span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
										Browse users <ChevronRight className="w-4 h-4" />
									</span>
								</div>
							</NavLink>

							<NavLink to="/chat/rooms" className="group">
								<div className="border border-border/50 rounded-xl p-6 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300">
									<div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
										<Users className="w-6 h-6 text-accent" />
									</div>
									<h3 className="text-lg font-semibold mb-2">Join Study Groups</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Create or join virtual classrooms for group discussions
									</p>
									<span className="text-sm text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
										View rooms <ChevronRight className="w-4 h-4" />
									</span>
								</div>
							</NavLink>

							<NavLink to="/notes" className="group">
								<div className="border border-border/50 rounded-xl p-6 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300">
									<div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
										<FileText className="w-6 h-6 text-amber-500" />
									</div>
									<h3 className="text-lg font-semibold mb-2">Take Notes</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Create and organize your study materials with folders
									</p>
									<span className="text-sm text-amber-500 flex items-center gap-1 group-hover:gap-2 transition-all">
										Open notes <ChevronRight className="w-4 h-4" />
									</span>
								</div>
							</NavLink>

							<NavLink to="/ai-summary" className="group">
								<div className="border border-border/50 rounded-xl p-6 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300">
									<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
										<Sparkles className="w-6 h-6 text-purple-500" />
									</div>
									<h3 className="text-lg font-semibold mb-2">AI Summarizer</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Transform long text into concise summaries
									</p>
									<span className="text-sm text-purple-500 flex items-center gap-1 group-hover:gap-2 transition-all">
										Try AI <ChevronRight className="w-4 h-4" />
									</span>
								</div>
							</NavLink>
						</div>

						{/* Quick Start Steps */}
						<div className="border border-border/50 rounded-2xl p-6">
							<h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
								<BookOpen className="w-5 h-5 text-primary" />
								Quick Start
							</h3>
							<div className="space-y-4">
								{[
									{ step: 1, title: "Sign up or log in", desc: "Create your account or access existing one" },
									{ step: 2, title: "Explore the dashboard", desc: "Get familiar with the welcome page" },
									{ step: 3, title: "Find study partners", desc: "Browse users and start conversations" },
									{ step: 4, title: "Join or create rooms", desc: "Connect with classmates in study groups" },
									{ step: 5, title: "Take notes", desc: "Organize your learning materials" },
									{ step: 6, title: "Use AI summarizer", desc: "Summarize long content quickly" },
								].map((item) => (
									<div key={item.step} className="flex gap-4">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
											{item.step}
										</div>
										<div className="flex-1 pb-4 border-b border-border/50 last:border-0 last:pb-0">
											<h4 className="font-medium mb-1">{item.title}</h4>
											<p className="text-sm text-muted-foreground">{item.desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				);

			case "features":
				return (
					<div className="space-y-6">
						{/* Hero Card */}
						<div className="relative overflow-hidden border border-border/50 rounded-2xl p-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
							<div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
							<div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
							<div className="relative flex items-center gap-4 mb-6">
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
									<Sparkles className="w-8 h-8 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold">Features</h2>
									<p className="text-muted-foreground">
										Everything you need for effective studying
									</p>
								</div>
							</div>
						</div>

						{/* Features Grid */}
						<div className="grid sm:grid-cols-2 gap-4">
							{[
								{
									icon: <MessageCircle className="w-6 h-6" />,
									title: "Real-time Chat",
									desc: "Instant messaging with typing indicators and online status",
									color: "primary",
									link: "/chat",
								},
								{
									icon: <Users className="w-6 h-6" />,
									title: "Virtual Classrooms",
									desc: "Study rooms with unique IDs for collaborative learning",
									color: "accent",
									link: "/chat/rooms",
								},
								{
									icon: <FileText className="w-6 h-6" />,
									title: "Smart Notes",
									desc: "Organize notes in folders with search, pin & archive",
									color: "amber",
									link: "/notes",
								},
								{
									icon: <Sparkles className="w-6 h-6" />,
									title: "AI Summarizer",
									desc: "Summarize text in different lengths and formats",
									color: "purple",
									link: "/ai-summary",
								},
								{
									icon: <Shield className="w-6 h-6" />,
									title: "Secure & Private",
									desc: "JWT authentication with secure token management",
									color: "green",
									link: null,
								},
								{
									icon: <Zap className="w-6 h-6" />,
									title: "Real-time Sync",
									desc: "WebSocket powered instant updates across devices",
									color: "blue",
									link: null,
								},
							].map((feature, idx) => (
								<div key={idx} className="group">
									{feature.link ? (
										<NavLink to={feature.link} className="block">
											<div className={`border border-border/50 rounded-xl p-6 hover:border-${feature.color}/50 hover:bg-${feature.color}/5 transition-all duration-300 h-full`}>
												<div className={`w-12 h-12 rounded-xl bg-${feature.color === 'primary' ? 'primary' : feature.color === 'accent' ? 'accent' : feature.color === 'green' ? 'green-500' : feature.color === 'blue' ? 'blue-500' : feature.color + '-500'}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
													<span className={`text-${feature.color === 'primary' ? 'primary' : feature.color === 'accent' ? 'accent' : feature.color === 'green' ? 'green-500' : feature.color === 'blue' ? 'blue-500' : feature.color + '-500'}`}>
														{feature.icon}
													</span>
												</div>
												<h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
												<p className="text-sm text-muted-foreground">{feature.desc}</p>
											</div>
										</NavLink>
									) : (
										<div className="border border-border/50 rounded-xl p-6 h-full">
											<div className={`w-12 h-12 rounded-xl bg-${feature.color === 'primary' ? 'primary' : feature.color === 'accent' ? 'accent' : feature.color === 'green' ? 'green-500' : feature.color === 'blue' ? 'blue-500' : feature.color + '-500'}/20 flex items-center justify-center mb-4`}>
												<span className={`text-${feature.color === 'primary' ? 'primary' : feature.color === 'accent' ? 'accent' : feature.color === 'green' ? 'green-500' : feature.color === 'blue' ? 'blue-500' : feature.color + '-500'}`}>
													{feature.icon}
												</span>
											</div>
											<h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
											<p className="text-sm text-muted-foreground">{feature.desc}</p>
										</div>
									)}
								</div>
							))}
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
			<div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
					<BookOpen className="w-4 h-4" />
					<span>Documentation</span>
				</div>
				<h1 className="text-4xl md:text-5xl font-bold mb-2">
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Docs</span>
				</h1>
				<p className="text-muted-foreground text-lg">
					Everything you need to know about Glimmer
				</p>
			</div>

			{/* Search Bar */}
			<div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
				<div className="relative max-w-2xl mx-auto">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search documentation..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 border-2 border-border/50 rounded-xl bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
					/>
				</div>
			</div>

			{/* Sidebar Navigation - Mobile Only */}
			<div className="lg:hidden mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
				<div className="border border-border/50 rounded-2xl p-4 bg-card">
					<nav className="space-y-2">
						{filteredSections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
									activeSection === section.id
										? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
										: "text-muted-foreground hover:text-foreground hover:bg-muted"
								}`}
							>
								{section.icon}
								<span className="font-medium">{section.title}</span>
							</button>
						))}
					</nav>
				</div>
			</div>

			{/* Desktop Layout with Sidebar */}
			<div className="hidden lg:grid grid-cols-[280px_1fr] gap-8 items-start max-w-6xl mx-auto">
				{/* Sidebar - Desktop */}
				<div className="shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
					<div className="border border-border/50 rounded-2xl p-6 bg-card sticky top-24">
						<nav className="space-y-2">
							{filteredSections.map((section) => (
								<button
									key={section.id}
									onClick={() => setActiveSection(section.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
										activeSection === section.id
											? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
									}`}
								>
									{section.icon}
									<span className="font-medium">{section.title}</span>
								</button>
							))}
						</nav>

						<div className="mt-8 pt-8 border-t border-border/50">
							<a
								href="https://github.com/devrizvy/glimmer"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group"
							>
								<GitBranch className="w-4 h-4" />
								<span>GitHub Repo</span>
								<ExternalLink className="w-3 h-3 ml-auto group-hover:scale-110 transition-transform" />
							</a>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
					{renderContent()}
				</div>
			</div>

			{/* Mobile Layout - Full Width Content */}
			<div className="lg:hidden max-w-4xl mx-auto">
				{renderContent()}
			</div>
		</div>
	);
};

export default Docs;
