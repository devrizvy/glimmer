import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
	MessageCircle,
	Users,
	Sparkles,
	NotebookPen,
	Waves,
	ArrowRight,
	CheckCircle2,
	Hand,
	Star,
	Zap,
} from "lucide-react";

const Welcome = () => {
	const { user } = useAuth();

	return (
		<div className="min-h-screen w-full bg-background overflow-hidden">
			{/* Animated Background */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/3 to-accent/3 rounded-full blur-3xl" />
			</div>

			{/* Grid Pattern Overlay */}
			<div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

			<div className="relative max-w-6xl mx-auto px-6 py-12 space-y-8">
				{/* Welcome Header */}
				<div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
						<Hand className="w-4 h-4" />
						<span>Welcome back</span>
					</div>

					{/* Logo */}
					<div className="flex items-center justify-center gap-4">
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300">
							<Waves className="w-9 h-9 text-white" />
						</div>
						<div className="text-left">
							<h1 className="text-3xl font-bold tracking-tight">Glimmer</h1>
							<p className="text-sm text-muted-foreground">Where ideas illuminate together</p>
						</div>
					</div>

					<h2 className="text-3xl md:text-4xl font-bold">
						Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{user?.username || "Friend"}</span>!
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto text-lg">
						Connect with study groups, take smart notes, and let AI help you learn better.
					</p>
				</div>

				{/* Quick Stats */}
				{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
					<Card className="group border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
								<MessageCircle className="w-6 h-6 text-primary" />
							</div>
							<p className="text-2xl font-bold">Chats</p>
							<p className="text-sm text-muted-foreground">Connect & learn</p>
						</CardContent>
					</Card>

					<Card className="group border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
								<Users className="w-6 h-6 text-accent" />
							</div>
							<p className="text-2xl font-bold">Groups</p>
							<p className="text-sm text-muted-foreground">Study together</p>
						</CardContent>
					</Card>

					<Card className="group border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
								<NotebookPen className="w-6 h-6 text-amber-500" />
							</div>
							<p className="text-2xl font-bold">Notes</p>
							<p className="text-sm text-muted-foreground">Capture ideas</p>
						</CardContent>
					</Card>

					<Card className="group border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
						<CardContent className="p-6 text-center">
							<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
								<Sparkles className="w-6 h-6 text-purple-500" />
							</div>
							<p className="text-2xl font-bold">AI</p>
							<p className="text-sm text-muted-foreground">Summarize & learn</p>
						</CardContent>
					</Card>
				</div> */}

				{/* Quick Actions */}
				<Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 border-border/50">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
								<Zap className="w-5 h-5 text-primary" />
							</div>
							<div>
								<h3 className="text-lg font-semibold">Quick Actions</h3>
								<p className="text-sm text-muted-foreground">Jump right into your workspace</p>
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<NavLink to="/chat" className="w-full group">
								<Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
									<MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
									<span>Open Chats</span>
								</Button>
							</NavLink>
							<NavLink to="/chat/users" className="w-full group">
								<Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-2 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300">
									<Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
									<span>Find People</span>
								</Button>
							</NavLink>
							<NavLink to="/notes" className="w-full group">
								<Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-2 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300">
									<NotebookPen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
									<span>My Notes</span>
								</Button>
							</NavLink>
							<NavLink to="/ai-summary" className="w-full group">
								<Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300">
									<Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
									<span>AI Summary</span>
								</Button>
							</NavLink>
						</div>
					</CardContent>
				</Card>

				{/* Getting Started */}
				<Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 border-primary/20">
					<CardContent className="p-6 space-y-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
								<Star className="w-5 h-5 text-primary" />
							</div>
							<div>
								<h3 className="text-lg font-semibold">Getting Started</h3>
								<p className="text-sm text-muted-foreground">Follow these steps to make the most of Glimmer</p>
							</div>
						</div>
						<div className="space-y-4">
							{/* Step 1 */}
							<div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
									<span className="text-sm font-bold text-white">1</span>
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<p className="font-semibold">Find study partners</p>
										<CheckCircle2 className="w-4 h-4 text-green-500" />
									</div>
									<p className="text-sm text-muted-foreground">
										Browse users and start one-on-one conversations
									</p>
									<NavLink to="/chat/users" className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline">
										Go to users <ArrowRight className="w-3 h-3" />
									</NavLink>
								</div>
							</div>

							{/* Step 2 */}
							<div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
									<span className="text-sm font-bold text-white">2</span>
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<p className="font-semibold">Join or create study groups</p>
										<Users className="w-4 h-4 text-accent" />
									</div>
									<p className="text-sm text-muted-foreground">
										Connect with classmates in collaborative group rooms
									</p>
									<NavLink to="/chat/rooms" className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline">
										View rooms <ArrowRight className="w-3 h-3" />
									</NavLink>
								</div>
							</div>

							{/* Step 3 */}
							<div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
									<span className="text-sm font-bold text-white">3</span>
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<p className="font-semibold">Take notes & use AI</p>
										<Sparkles className="w-4 h-4 text-purple-500" />
									</div>
									<p className="text-sm text-muted-foreground">
										Capture important points and let AI summarize long discussions
									</p>
									<NavLink to="/notes" className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline">
										Open notes <ArrowRight className="w-3 h-3" />
									</NavLink>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Welcome;
