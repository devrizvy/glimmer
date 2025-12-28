import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	HelpCircle,
	Search,
	ChevronDown,
	ChevronUp,
	ChevronRight,
	MessageCircle,
	Users,
	Shield,
	Zap,
	CreditCard,
	Smartphone,
	Globe,
	Settings,
	BookOpen,
	Mail,
	AlertCircle,
	ExternalLink,
} from "lucide-react";

const FAQ = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
	const [activeCategory, setActiveCategory] = useState("all");

	const categories = [
		{
			id: "all",
			name: "All Questions",
			icon: <HelpCircle className="w-4 h-4" />,
		},
		{
			id: "getting-started",
			name: "Getting Started",
			icon: <Zap className="w-4 h-4" />,
		},
		{
			id: "features",
			name: "Features",
			icon: <BookOpen className="w-4 h-4" />,
		},
		{
			id: "account",
			name: "Account & Billing",
			icon: <CreditCard className="w-4 h-4" />,
		},
		{
			id: "technical",
			name: "Technical Support",
			icon: <Settings className="w-4 h-4" />,
		},
		{
			id: "privacy",
			name: "Privacy & Security",
			icon: <Shield className="w-4 h-4" />,
		},
	];

	const faqs = [
		{
			id: 1,
			category: "getting-started",
			question: "How do I create an account on Glimmer?",
			answer:
				'Creating an account is simple! Click on the "Sign Up" button on the homepage, enter your email, choose a username and password, and verify your email address. The whole process takes less than 2 minutes.',
			icon: <Zap className="w-5 h-5" />,
		},
		{
			id: 2,
			category: "getting-started",
			question: "Is Glimmer free to use?",
			answer:
				"Yes! Glimmer offers a free tier with all essential features for students and teachers. We also have premium plans with additional features like unlimited storage, advanced AI tools, and priority support.",
			icon: <CreditCard className="w-5 h-5" />,
		},
		{
			id: 3,
			category: "features",
			question: "What features does Glimmer offer?",
			answer:
				"Glimmer provides real-time chat, virtual classrooms, smart notes, AI-powered summaries, file sharing, video calls, and collaborative tools. All designed specifically for educational environments.",
			icon: <BookOpen className="w-5 h-5" />,
		},
		{
			id: 4,
			category: "features",
			question: "Can I create multiple classrooms?",
			answer:
				"Absolutely! Teachers and students can create and join unlimited classrooms. Each classroom has its own chat, notes, and member management features.",
			icon: <Users className="w-5 h-5" />,
		},
		{
			id: 5,
			category: "features",
			question: "How does the AI summary feature work?",
			answer:
				"Our AI analyzes your lecture notes, chat messages, and shared documents to generate concise summaries. It identifies key concepts, main topics, and important points to help you study more efficiently.",
			icon: <Zap className="w-5 h-5" />,
		},
		{
			id: 6,
			category: "account",
			question: "How do I reset my password?",
			answer:
				'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. The link expires after 24 hours for security reasons.',
			icon: <Shield className="w-5 h-5" />,
		},
		{
			id: 7,
			category: "account",
			question: "Can I change my username?",
			answer:
				"Yes, you can change your username once every 30 days in your account settings. Go to Settings > Profile > Edit Username.",
			icon: <Settings className="w-5 h-5" />,
		},
		{
			id: 8,
			category: "account",
			question: "How do I cancel my subscription?",
			answer:
				"You can cancel your subscription anytime from your account settings. Go to Settings > Billing > Manage Subscription. Your access will continue until the end of your billing period.",
			icon: <CreditCard className="w-5 h-5" />,
		},
		{
			id: 9,
			category: "technical",
			question: "What browsers does Glimmer support?",
			answer:
				"Glimmer works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.",
			icon: <Globe className="w-5 h-5" />,
		},
		{
			id: 10,
			category: "technical",
			question: "Is there a mobile app available?",
			answer:
				"Yes! Glimmer is available on both iOS and Android. You can download it from the App Store or Google Play Store. Your data syncs seamlessly across all devices.",
			icon: <Smartphone className="w-5 h-5" />,
		},
		{
			id: 11,
			category: "technical",
			question: "How much storage do I get?",
			answer:
				"Free accounts get 5GB of storage. Premium accounts get unlimited storage for notes, files, and chat history. You can always upgrade your plan if you need more space.",
			icon: <BookOpen className="w-5 h-5" />,
		},
		{
			id: 12,
			category: "privacy",
			question: "Is my data secure?",
			answer:
				"Absolutely! We use end-to-end encryption for all messages and files. Your data is stored securely in SOC 2 compliant data centers, and we never sell your information to third parties.",
			icon: <Shield className="w-5 h-5" />,
		},
		{
			id: 13,
			category: "privacy",
			question: "Who can see my messages?",
			answer:
				"Only the participants in your chat or classroom can see the messages. Teachers in classrooms have access to all classroom communications for moderation purposes.",
			icon: <MessageCircle className="w-5 h-5" />,
		},
		{
			id: 14,
			category: "privacy",
			question: "Can I delete my account?",
			answer:
				"Yes, you can delete your account anytime from Settings > Privacy > Delete Account. This will permanently remove all your data, and the action cannot be undone.",
			icon: <AlertCircle className="w-5 h-5" />,
		},
	];

	const filteredFAQs = faqs.filter((faq) => {
		const matchesCategory =
			activeCategory === "all" || faq.category === activeCategory;
		const matchesSearch =
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const toggleExpand = (id: number) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedItems(newExpanded);
	};

	return (
		<div className="max-w-7xl mx-auto px-6 py-12">
			{/* Header */}
			<div className="text-center mb-12">
				<div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
					<HelpCircle className="w-10 h-10 text-primary" />
				</div>
				<h1 className="text-4xl sm:text-5xl font-bold mb-4">
					Frequently Asked Questions
				</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Find answers to common questions about Glimmer
				</p>
			</div>

			{/* Search Bar */}
			<div className="max-w-2xl mx-auto mb-8">
				<div className="relative">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search for answers..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-4 border rounded-xl bg-background text-lg"
					/>
				</div>
			</div>

			{/* Category Tabs */}
			<div className="flex flex-wrap justify-center gap-2 mb-12">
				{categories.map((category) => (
					<button
						key={category.id}
						onClick={() => setActiveCategory(category.id)}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
							activeCategory === category.id
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground hover:bg-muted"
						}`}
					>
						{category.icon}
						<span>{category.name}</span>
					</button>
				))}
			</div>

			{/* FAQ Items */}
			<div className="max-w-4xl mx-auto">
				{filteredFAQs.length === 0 ? (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Search className="w-8 h-8 text-muted-foreground/40" />
						</div>
						<h3 className="text-xl font-semibold mb-2">
							No matching questions found
						</h3>
						<p className="text-muted-foreground mb-4">
							Try different search terms or browse all categories
						</p>
						<button
							onClick={() => {
								setSearchQuery("");
								setActiveCategory("all");
							}}
							className="px-6 py-2 bg-primary text-primary-foreground rounded-xl transition-all hover:opacity-90"
						>
							Browse All Questions
						</button>
					</div>
				) : (
					<div className="space-y-4">
						{filteredFAQs.map((faq) => (
							<div
								key={faq.id}
								className="bg-card border rounded-2xl overflow-hidden transition-all hover:shadow-md"
							>
								<button
									onClick={() => toggleExpand(faq.id)}
									className="w-full px-6 py-4 flex items-center justify-between text-left"
								>
									<div className="flex items-center gap-4 flex-1">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
											<span className="text-primary">
												{faq.icon}
											</span>
										</div>
										<h3 className="text-lg font-medium">
											{faq.question}
										</h3>
									</div>
									<div className="ml-4">
										{expandedItems.has(faq.id) ? (
											<ChevronUp className="w-5 h-5 text-muted-foreground" />
										) : (
											<ChevronDown className="w-5 h-5 text-muted-foreground" />
										)}
									</div>
								</button>

								{expandedItems.has(faq.id) && (
									<div className="px-6 pb-4 border-t">
										<p className="text-muted-foreground leading-relaxed">
											{faq.answer}
										</p>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Contact Support */}
			<div className="mt-16 bg-card border rounded-3xl p-8 max-w-4xl mx-auto">
				<div className="text-center">
					<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<Mail className="w-8 h-8 text-primary" />
					</div>
					<h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Our support team is here to help you 24/7. Get in touch with us
						through any of the following channels.
					</p>

					<div className="grid md:grid-cols-3 gap-6 mb-8">
						<div className="p-6 hover:bg-muted rounded-xl transition-colors">
							<MessageCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
							<h3 className="font-medium mb-2">
								Live Chat
							</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Chat with our support team instantly
							</p>
							<button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mx-auto">
								Start Chat <ChevronRight className="w-3 h-3" />
							</button>
						</div>

						<div className="p-6 hover:bg-muted rounded-xl transition-colors">
							<Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
							<h3 className="font-medium mb-2">
								Email Support
							</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Get detailed help via email
							</p>
							<a
								href="mailto:support@glimmer.com"
								className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mx-auto"
							>
								support@glimmer.com <ExternalLink className="w-3 h-3" />
							</a>
						</div>

						<div className="p-6 hover:bg-muted rounded-xl transition-colors">
							<BookOpen className="w-8 h-8 mx-auto mb-3 text-primary" />
							<h3 className="font-medium mb-2">
								Help Center
							</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Browse our detailed guides
							</p>
							<NavLink
								to="/docs"
								className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mx-auto"
							>
								Visit Help Center <ExternalLink className="w-3 h-3" />
							</NavLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FAQ;
