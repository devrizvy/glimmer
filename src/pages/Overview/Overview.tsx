import { useState } from "react";
import {
	Users,
	MessageCircle,
	BookOpen,
	Brain,
	TrendingUp,
	Clock,
	Award,
	Target,
	Activity,
	Zap,
	Globe,
	BarChart3,
	PieChart,
	ArrowUp,
	ArrowDown,
	Star,
	Filter,
	Download,
	Eye,
	UserCheck,
	GraduationCap,
	Lightbulb,
	Trophy,
} from "lucide-react";

const Overview = () => {
	const [timeRange, setTimeRange] = useState("week");

	const stats = {
		week: {
			users: 1247,
			messages: 8934,
			classrooms: 156,
			activeUsers: 892,
			engagement: 87,
			completion: 92,
		},
		month: {
			users: 5234,
			messages: 45678,
			classrooms: 623,
			activeUsers: 3421,
			engagement: 91,
			completion: 95,
		},
		year: {
			users: 28456,
			messages: 234567,
			classrooms: 2847,
			activeUsers: 19234,
			engagement: 94,
			completion: 97,
		},
	};

	const currentStats = stats[timeRange as keyof typeof stats];

	const statCards = [
		{
			title: "Total Users",
			value: currentStats.users.toLocaleString(),
			change: "+12.5%",
			trend: "up",
			icon: <Users className="w-6 h-6" />,
			color: "oklch(0.55 0.08 145)",
		},
		{
			title: "Messages Sent",
			value: currentStats.messages.toLocaleString(),
			change: "+23.1%",
			trend: "up",
			icon: <MessageCircle className="w-6 h-6" />,
			color: "oklch(0.65 0.12 155)",
		},
		{
			title: "Active Classrooms",
			value: currentStats.classrooms.toLocaleString(),
			change: "+8.3%",
			trend: "up",
			icon: <BookOpen className="w-6 h-6" />,
			color: "oklch(0.6 0.18 25)",
		},
		{
			title: "Engagement Rate",
			value: `${currentStats.engagement}%`,
			change: "+2.4%",
			trend: "up",
			icon: <Activity className="w-6 h-6" />,
			color: "oklch(0.5 0.12 220)",
		},
	];

	const recentActivity = [
		{
			id: 1,
			type: "user_joined",
			user: "Sarah Chen",
			action: "joined Glimmer",
			time: "2 minutes ago",
			icon: <UserCheck className="w-4 h-4" />,
		},
		{
			id: 2,
			type: "classroom_created",
			user: "Prof. Johnson",
			action: 'created "Advanced Physics"',
			time: "15 minutes ago",
			icon: <BookOpen className="w-4 h-4" />,
		},
		{
			id: 3,
			type: "milestone",
			user: "Michael Park",
			action: "completed 100 study sessions",
			time: "1 hour ago",
			icon: <Trophy className="w-4 h-4" />,
		},
		{
			id: 4,
			type: "achievement",
			user: "Emma Wilson",
			action: 'earned "Quick Learner" badge',
			time: "3 hours ago",
			icon: <Award className="w-4 h-4" />,
		},
		{
			id: 5,
			type: "classroom_joined",
			user: "Alex Kumar",
			action: 'joined "Data Science 101"',
			time: "5 hours ago",
			icon: <Users className="w-4 h-4" />,
		},
	];

	const topPerformers = [
		{
			name: "Sarah Chen",
			avatar: "SC",
			score: 987,
			sessions: 156,
			badge: "gold",
		},
		{
			name: "Michael Park",
			avatar: "MP",
			score: 923,
			sessions: 142,
			badge: "silver",
		},
		{
			name: "Emma Wilson",
			avatar: "EW",
			score: 891,
			sessions: 138,
			badge: "silver",
		},
		{
			name: "Alex Kumar",
			avatar: "AK",
			score: 856,
			sessions: 129,
			badge: "bronze",
		},
		{
			name: "Lisa Rodriguez",
			avatar: "LR",
			score: 834,
			sessions: 125,
			badge: "bronze",
		},
	];

	const recentClassrooms = [
		{
			name: "Advanced Mathematics",
			instructor: "Dr. Smith",
			students: 45,
			messages: 1234,
			activity: "very-high",
			created: "2 days ago",
		},
		{
			name: "Web Development Bootcamp",
			instructor: "Prof. Johnson",
			students: 89,
			messages: 2456,
			activity: "high",
			created: "5 days ago",
		},
		{
			name: "Data Science Fundamentals",
			instructor: "Dr. Chen",
			students: 67,
			messages: 1876,
			activity: "high",
			created: "1 week ago",
		},
		{
			name: "Creative Writing Workshop",
			instructor: "Ms. Williams",
			students: 34,
			messages: 892,
			activity: "medium",
			created: "2 weeks ago",
		},
	];

	return (
		<div className="min-h-screen mira-content">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
					<div>
						<h1 className="mira-title text-4xl mb-2">Platform Overview</h1>
						<p className="text-xl text-foreground/70">
							Real-time insights and analytics for Glimmer
						</p>
					</div>

					{/* Time Range Selector */}
					<div className="flex items-center gap-2 mt-4 md:mt-0">
						<button
							onClick={() => setTimeRange("week")}
							className={`px-4 py-2 rounded-xl font-medium transition-all ${
								timeRange === "week"
									? "bg-primary text-primary-foreground"
									: "text-foreground/70 hover:text-foreground hover:bg-sidebar-accent/20"
							}`}
						>
							Week
						</button>
						<button
							onClick={() => setTimeRange("month")}
							className={`px-4 py-2 rounded-xl font-medium transition-all ${
								timeRange === "month"
									? "bg-primary text-primary-foreground"
									: "text-foreground/70 hover:text-foreground hover:bg-sidebar-accent/20"
							}`}
						>
							Month
						</button>
						<button
							onClick={() => setTimeRange("year")}
							className={`px-4 py-2 rounded-xl font-medium transition-all ${
								timeRange === "year"
									? "bg-primary text-primary-foreground"
									: "text-foreground/70 hover:text-foreground hover:bg-sidebar-accent/20"
							}`}
						>
							Year
						</button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{statCards.map((stat, idx) => (
						<div
							key={idx}
							className="mira-glass rounded-2xl p-6 hover:scale-105 transition-all"
						>
							<div className="flex items-center justify-between mb-4">
								<div
									className="w-12 h-12 rounded-xl flex items-center justify-center"
									style={{ backgroundColor: `${stat.color}15` }}
								>
									<span style={{ color: stat.color }}>{stat.icon}</span>
								</div>
								<div
									className={`flex items-center gap-1 text-sm ${
										stat.trend === "up" ? "text-green-600" : "text-red-600"
									}`}
								>
									{stat.trend === "up" ? (
										<ArrowUp className="w-3 h-3" />
									) : (
										<ArrowDown className="w-3 h-3" />
									)}
									{stat.change}
								</div>
							</div>
							<h3 className="text-2xl font-bold text-foreground mb-1">
								{stat.value}
							</h3>
							<p className="text-sm text-foreground/60">{stat.title}</p>
						</div>
					))}
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column */}
					<div className="lg:col-span-2 space-y-8">
						{/* Activity Chart */}
						<div className="mira-glass rounded-2xl p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
									<BarChart3
										className="w-5 h-5"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
									Platform Activity
								</h2>
								<button className="p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
									<Filter className="w-4 h-4 text-foreground/60" />
								</button>
							</div>
							<div className="h-64 bg-sidebar-accent/10 rounded-xl flex items-center justify-center">
								<div className="text-center">
									<BarChart3 className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
									<p className="text-foreground/60">
										Activity chart visualization
									</p>
									<p className="text-sm text-foreground/40">
										Shows user engagement over time
									</p>
								</div>
							</div>
						</div>

						{/* Recent Classrooms */}
						<div className="mira-glass rounded-2xl p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
									<BookOpen
										className="w-5 h-5"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
									Active Classrooms
								</h2>
								<a
									href="/group"
									className="text-primary hover:text-primary/80 transition-colors text-sm"
								>
									View All
								</a>
							</div>
							<div className="space-y-4">
								{recentClassrooms.map((classroom, idx) => (
									<div
										key={idx}
										className="flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-xl transition-colors"
									>
										<div className="flex items-center gap-4">
											<div
												className="w-10 h-10 rounded-lg flex items-center justify-center"
												style={{
													backgroundColor: "oklch(0.55 0.08 145 / 0.1)",
												}}
											>
												<GraduationCap
													className="w-5 h-5"
													style={{ color: "oklch(0.55 0.08 145)" }}
												/>
											</div>
											<div>
												<h4 className="text-foreground font-medium">
													{classroom.name}
												</h4>
												<p className="text-sm text-foreground/60">
													{classroom.instructor} • {classroom.students} students
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="text-sm text-foreground/60 mb-1">
												{classroom.messages} messages
											</div>
											<div
												className={`w-2 h-2 rounded-full mx-auto ${
													classroom.activity === "very-high"
														? "bg-green-500"
														: classroom.activity === "high"
															? "bg-blue-500"
															: "bg-yellow-500"
												}`}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Recent Activity */}
						<div className="mira-glass rounded-2xl p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
									<Clock
										className="w-5 h-5"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
									Recent Activity
								</h2>
								<button className="p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
									<Eye className="w-4 h-4 text-foreground/60" />
								</button>
							</div>
							<div className="space-y-4">
								{recentActivity.map((activity) => (
									<div
										key={activity.id}
										className="flex items-center gap-4 p-3 hover:bg-sidebar-accent/20 rounded-xl transition-colors"
									>
										<div
											className="w-10 h-10 rounded-lg flex items-center justify-center"
											style={{ backgroundColor: "oklch(0.55 0.08 145 / 0.1)" }}
										>
											<span style={{ color: "oklch(0.55 0.08 145)" }}>
												{activity.icon}
											</span>
										</div>
										<div className="flex-1">
											<p className="text-foreground">
												<span className="font-medium">{activity.user}</span>{" "}
												{activity.action}
											</p>
											<p className="text-sm text-foreground/60">
												{activity.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-8">
						{/* Top Performers */}
						<div className="mira-glass rounded-2xl p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
									<Trophy
										className="w-5 h-5"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
									Top Performers
								</h2>
								<button className="p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
									<Award className="w-4 h-4 text-foreground/60" />
								</button>
							</div>
							<div className="space-y-4">
								{topPerformers.map((performer, idx) => (
									<div key={idx} className="flex items-center gap-3">
										<div className="relative">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-sidebar-border">
												<span className="text-sm font-semibold text-primary">
													{performer.avatar}
												</span>
											</div>
											{idx === 0 && (
												<div className="absolute -top-1 -right-1">
													<Star className="w-4 h-4 text-yellow-500 fill-current" />
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h4 className="text-foreground font-medium truncate">
													{performer.name}
												</h4>
												<span className="text-sm font-bold text-primary">
													{performer.score}
												</span>
											</div>
											<div className="flex items-center justify-between text-xs text-foreground/60">
												<span>{performer.sessions} sessions</span>
												<span
													className={`px-2 py-0.5 rounded-full ${
														performer.badge === "gold"
															? "bg-yellow-500/20 text-yellow-600"
															: performer.badge === "silver"
																? "bg-gray-500/20 text-gray-600"
																: "bg-orange-500/20 text-orange-600"
													}`}
												>
													{performer.badge}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Quick Stats */}
						<div className="mira-glass rounded-2xl p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
									<PieChart
										className="w-5 h-5"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
									Key Metrics
								</h2>
								<button className="p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
									<Download className="w-4 h-4 text-foreground/60" />
								</button>
							</div>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3">
									<div className="flex items-center gap-3">
										<Target className="w-4 h-4 text-foreground/60" />
										<span className="text-foreground/70">
											Completion Rate
										</span>
									</div>
									<span className="text-lg font-bold text-primary">
										{currentStats.completion}%
									</span>
								</div>
								<div className="flex items-center justify-between p-3">
									<div className="flex items-center gap-3">
										<Users className="w-4 h-4 text-foreground/60" />
										<span className="text-foreground/70">
											Active Users
										</span>
									</div>
									<span className="text-lg font-bold text-primary">
										{currentStats.activeUsers.toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between p-3">
									<div className="flex items-center gap-3">
										<Lightbulb className="w-4 h-4 text-foreground/60" />
										<span className="text-foreground/70">
											Avg. Session Time
										</span>
									</div>
									<span className="text-lg font-bold text-primary">45m</span>
								</div>
								<div className="flex items-center justify-between p-3">
									<div className="flex items-center gap-3">
										<Globe className="w-4 h-4 text-foreground/60" />
										<span className="text-foreground/70">
											Global Reach
										</span>
									</div>
									<span className="text-lg font-bold text-primary">127</span>
								</div>
							</div>
						</div>

						{/* AI Insights */}
						<div className="mira-glass rounded-2xl p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
									<Brain
										className="w-5 h-5"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
									AI Insights
								</h2>
								<Zap className="w-4 h-4 text-primary animate-pulse" />
							</div>
							<div className="space-y-4">
								<div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
									<div className="flex items-center gap-2 mb-2">
										<TrendingUp className="w-4 h-4 text-primary" />
										<span className="text-sm font-medium text-primary">
											Trending Up
										</span>
									</div>
									<p className="text-sm text-foreground/80">
										Student engagement increased by 15% this week with peak
										activity between 2-4 PM
									</p>
								</div>
								<div className="p-4 bg-sidebar-accent/30 rounded-xl">
									<div className="flex items-center gap-2 mb-2">
										<Lightbulb className="w-4 h-4 text-foreground" />
										<span className="text-sm font-medium text-foreground">
											Recommendation
										</span>
									</div>
									<p className="text-sm text-foreground/80">
										Consider scheduling more collaborative sessions during
										weekend afternoons for higher participation
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Overview;
