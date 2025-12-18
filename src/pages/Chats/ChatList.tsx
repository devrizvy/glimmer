import { useState, useEffect } from "react";
import { Search, MessageCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUserChats } from "../../hooks/usePrivateMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface ChatUser {
	_id : string;
	email: string;
	username: string;
	lastMessage?: string;
	lastMessageTime?: string;
	isOnline?: boolean;
	isTyping?: boolean;
	unreadCount?: number;
}

const ChatList = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");

	// Use TanStack Query for user chats
	const { isPending, chats, isError, error, refetch } = useUserChats(
		user?.email || "",
	);

	// Show success toast when chats load successfully
	useEffect(() => {
		if (chats && chats.length > 0 && !isPending) {
			toast.success(`Loaded ${chats.length} conversation${chats.length === 1 ? '' : 's'}`);
		}
	}, [chats, isPending]);

	// Transform backend chats to frontend format
	const chatUsers: ChatUser[] = chats.map((chat: any) => ({
		email: chat.partnerEmail,
		username: chat.partnerUsername,
		lastMessage: chat.lastMessage,
		lastMessageTime: chat.lastMessageTime,
		isOnline: false, // TODO: Implement real-time online status with socket
		isTyping: false, // TODO: Implement real-time typing status with socket
		unreadCount: 0, // TODO: Implement unread count logic
	}));

	const handleChatSelect = (chat: ChatUser) => {
		navigate(`/chat/${chat.email}`, {
			state: {
				partnerUsername: chat.username,
				partnerEmail: chat.email,
			},
		});
	};

	const filteredUsers = chatUsers.filter((user) =>
		user.username.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	
	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated, navigate]);

	if (!isAuthenticated) {
		return null;
	}

	if (isPending) {
		return (
			<div className="min-h-screen mira-content">
				<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center">
						<div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 mira-glass">
							<div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
						</div>
						<h3 className="mira-title text-xl mb-2">
							Loading your conversations...
						</h3>
						<p className="text-sm text-muted-foreground">
							Please wait while we load your messages
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen mira-content">
				<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center max-w-md">
						<div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center mira-glass">
							<span className="text-3xl">⚠️</span>
						</div>
						<h2 className="mira-title text-xl mb-4">Error Loading Chats</h2>
						<p className="text-sm text-muted-foreground mb-6">
							{error?.message || "Failed to load chats"}
						</p>
						<Button
							onClick={() => refetch()}
							className="px-6 py-3"
						>
							Retry
						</Button>
					</div>
				</div>
			</div>
		);
	}

	let count = 0 


	return (
		<div className="min-h-screen mira-content">
			<div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
				{/* Header */}
				<div className="p-6 border-b mira-glass">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className="w-12 h-12 rounded-xl flex items-center justify-center mira-glass">
									<MessageCircle className="w-6 h-6 text-primary" />
								</div>
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
							</div>
							<div>
								<h2 className="mira-title text-2xl">Messages</h2>
								<p className="text-xs text-muted-foreground font-medium tracking-wide">
									Your conversations
								</p>
							</div>
						</div>

						{/* Users button */}
						<Button
							onClick={() => navigate("/chat/users")}
							className="flex items-center gap-2"
						>
							<Users className="w-4 h-4" />
							<span className="text-sm font-medium">Find Users</span>
						</Button>
					</div>

					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
						<Input
							type="text"
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Chat List */}
				<div className="flex-1 overflow-y-auto p-4">
					{filteredUsers.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center max-w-md">
								<div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center mira-glass animate-mira-message">
									<MessageCircle className="w-8 h-8 text-primary" />
								</div>
								<h3 className="mira-title text-xl mb-4">
									{searchQuery
										? "No conversations found"
										: "No conversations yet"}
								</h3>
								<p className="text-sm text-muted-foreground mb-6 leading-relaxed">
									{searchQuery
										? "Try adjusting your search terms"
										: "Start a new conversation to see it here"}
								</p>
								{!searchQuery && (
									<Button
										onClick={() => navigate("/chat/users")}
										className="px-6 py-3"
									>
										Find Users to Chat With
									</Button>
								)}
							</div>
						</div>
					) : (
						<div className="space-y-3">
							{filteredUsers.map((user, index) => (
								<div
									key={count++}
									onClick={() => handleChatSelect(user)}
									className="mira-glass rounded-xl p-4 hover:scale-[1.01] cursor-pointer transition-all animate-mira-message group border border-border/50"
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<div className="flex items-center gap-4">
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border">
												<span className="text-sm font-semibold text-foreground">
													{user.username.charAt(0).toUpperCase()}
												</span>
											</div>
											{user.isOnline && (
												<div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse"></div>
											)}
											{user.isTyping && (
												<div className="absolute bottom-0 right-0 w-3 h-3">
													<div className="w-full h-full bg-accent rounded-full animate-pulse"></div>
												</div>
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-baseline mb-1">
												<h3 className="font-semibold text-foreground truncate">
													{user.username}
												</h3>
												{user.lastMessageTime && (
													<span className="text-xs text-muted-foreground/50 ml-2">
														{user.lastMessageTime}
													</span>
												)}
											</div>
											<p className="text-sm text-muted-foreground truncate leading-relaxed">
												{user.isTyping
													? "typing..."
													: user.lastMessage || "No messages yet"}
											</p>
										</div>

										<div className="flex items-center gap-2">
											{user.unreadCount && user.unreadCount > 0 && (
												<div className="mira-badge">
													{user.unreadCount}
												</div>
											)}

											<div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
												<MessageCircle className="w-4 h-4 text-primary" />
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatList;
