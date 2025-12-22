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
} from "lucide-react";

const Welcome = () => {
	const { user } = useAuth();

	return (
		<div className="min-h-screen w-full bg-background">
			<div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
				{/* Welcome Header */}
				<div className="text-center space-y-4">
					<div className="flex items-center justify-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
							<Waves className="w-7 h-7 text-primary" />
						</div>
						<h1 className="text-3xl font-bold">zenWhisper</h1>
					</div>
					<h2 className="text-2xl font-semibold">
						Welcome back, {user?.username || "Friend"}!
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">
						Find your inner peace. Connect with study groups, take notes,
						and summarize with AI.
					</p>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
						<CardContent className="p-6 text-center">
							<MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
							<p className="text-2xl font-bold">Chats</p>
							<p className="text-sm text-muted-foreground">Connect & learn</p>
						</CardContent>
					</Card>
					<Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
						<CardContent className="p-6 text-center">
							<Users className="w-8 h-8 text-accent mx-auto mb-2" />
							<p className="text-2xl font-bold">Groups</p>
							<p className="text-sm text-muted-foreground">Study together</p>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-br from-amber-500/10 to-transparent">
						<CardContent className="p-6 text-center">
							<NotebookPen className="w-8 h-8 text-amber-500 mx-auto mb-2" />
							<p className="text-2xl font-bold">Notes</p>
							<p className="text-sm text-muted-foreground">Capture ideas</p>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
						<CardContent className="p-6 text-center">
							<Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
							<p className="text-2xl font-bold">AI</p>
							<p className="text-sm text-muted-foreground">Summarize & learn</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card>
					<CardContent className="p-6">
						<h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<NavLink to="/chat" className="w-full">
								<Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
									<MessageCircle className="w-5 h-5" />
									<span>Open Chats</span>
								</Button>
							</NavLink>
							<NavLink to="/chat/users" className="w-full">
								<Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
									<Users className="w-5 h-5" />
									<span>Find People</span>
								</Button>
							</NavLink>
							<NavLink to="/notes" className="w-full">
								<Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
									<NotebookPen className="w-5 h-5" />
									<span>My Notes</span>
								</Button>
							</NavLink>
							<NavLink to="/ai-summary" className="w-full">
								<Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
									<Sparkles className="w-5 h-5" />
									<span>AI Summary</span>
								</Button>
							</NavLink>
						</div>
					</CardContent>
				</Card>

				{/* Getting Started */}
				<Card className="border-primary/20">
					<CardContent className="p-6 space-y-4">
						<h3 className="text-lg font-semibold">Getting Started</h3>
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
									<span className="text-xs font-bold text-primary">1</span>
								</div>
								<div>
									<p className="font-medium">Find study partners</p>
									<p className="text-sm text-muted-foreground">
										Browse users and start one-on-one conversations
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
									<span className="text-xs font-bold text-primary">2</span>
								</div>
								<div>
									<p className="font-medium">Join or create study groups</p>
									<p className="text-sm text-muted-foreground">
										Connect with classmates in collaborative group rooms
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
									<span className="text-xs font-bold text-primary">3</span>
								</div>
								<div>
									<p className="font-medium">Take notes & use AI</p>
									<p className="text-sm text-muted-foreground">
										Capture important points and let AI summarize long discussions
									</p>
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
