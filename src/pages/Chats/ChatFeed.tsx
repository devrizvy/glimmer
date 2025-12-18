import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePrivateMessages } from "../../hooks/usePrivateMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Message {
	id: string;
	chatId: string;
	senderEmail: string;
	senderUsername: string;
	receiverEmail: string;
	receiverUsername: string;
	message: string;
	time: string;
	isOwn?: boolean;
	createdAt?: Date;
}

const ChatFeed = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams(); // get partner email from URL
	const { user, isAuthenticated } = useAuth();

	// Helper function to format time in 12-hour format with AM/PM
	const formatTime12Hour = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	// Try to get partner info from location.state, else use the URL parameter
	let partnerUsername, partnerEmail;
	if (location.state?.partnerUsername && location.state?.partnerEmail) {
		partnerUsername = location.state.partnerUsername;
		partnerEmail = location.state.partnerEmail;
	} else {
		// For now, we'll use the ID as both email and username
		// In a real implementation, you'd fetch user data from your API
		partnerEmail = id || "";
		partnerUsername = id?.split("@")[0] || "Unknown User";
	}

	const currentUserEmail = user?.email || "";
	const currentUsername = user?.username || "";

	const [currentMessage, setCurrentMessage] = useState("");
	const [socket, setSocket] = useState<any>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Generate chat ID (consistent ordering)
	const chatId = [currentUserEmail, partnerEmail].sort().join("_");

	// Use TanStack Query for initial messages
	const {
		isPending,
		messages: initialMessages,
		isError,
		error,
	} = usePrivateMessages(chatId);

	// Combine initial messages with real-time socket messages
	useEffect(() => {
		if (initialMessages && initialMessages.length > 0) {
			const transformedMessages: Message[] = initialMessages.map(
				(msg: any) => ({
					id: msg._id,
					chatId: msg.chatId,
					senderEmail: msg.senderEmail,
					senderUsername: msg.senderUsername,
					receiverEmail: msg.receiverEmail,
					receiverUsername: msg.receiverUsername,
					message: msg.message,
					time: msg.time || formatTime12Hour(new Date(msg.createdAt)),
					isOwn: msg.senderEmail === currentUserEmail,
					createdAt: new Date(msg.createdAt),
				}),
			);
			setMessages(transformedMessages);
		}
	}, [initialMessages, currentUserEmail]);

	// Auto-scroll to bottom when messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Socket connection setup for real-time messaging
	useEffect(() => {
		if (!chatId || !currentUserEmail || !isAuthenticated) return;

		const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
		setSocket(newSocket);

		newSocket.on("connect", () => {
			setIsConnected(true);
			toast.success(`Connected to ${partnerUsername}`);
			// Join the private chat
			newSocket.emit("join_private_chat", chatId, currentUserEmail);
			newSocket.emit("user_online", currentUserEmail);
		});

		newSocket.on("disconnect", () => {
			setIsConnected(false);
			toast.error("Connection lost. Trying to reconnect...");
		});

		// Listen for incoming messages
		const handleReceiveMessage = (data: any) => {
			setMessages((prevMessages) => {
				// Check if message already exists to avoid duplicates
				const messageExists = prevMessages.some(
					(msg) =>
						msg.message === data.message &&
						msg.senderEmail === data.senderEmail &&
						msg.time === data.time,
				);

				if (messageExists) {
					return prevMessages;
				}

				const newMessage: Message = {
					id: Date.now().toString(),
					chatId: data.chatId,
					senderEmail: data.senderEmail,
					senderUsername: data.senderUsername,
					receiverEmail: data.receiverEmail,
					receiverUsername: data.receiverUsername,
					message: data.message,
					time: data.time || formatTime12Hour(new Date()),
					isOwn: data.senderEmail === currentUserEmail,
					createdAt: new Date(),
				};

				return [...prevMessages, newMessage];
			});
		};

		// Listen for typing indicators
		const handleUserTyping = (data: any) => {
			if (data.userEmail !== currentUserEmail) {
				setIsTyping(data.isTyping);
			}
		};

		newSocket.on("receive_private_message", handleReceiveMessage);
		newSocket.on("user_typing", handleUserTyping);

		// Cleanup function
		return () => {
			newSocket.off("receive_private_message", handleReceiveMessage);
			newSocket.off("user_typing", handleUserTyping);
			if (chatId) {
				newSocket.emit("leave_private_chat", chatId, currentUserEmail);
			}
			newSocket.disconnect();
		};
	}, [chatId, currentUserEmail, isAuthenticated]);

	// Handle typing indicators
	const handleTyping = () => {
		if (socket && chatId) {
			socket.emit("typing_start", {
				chatId,
				userEmail: currentUserEmail,
				username: currentUsername,
			});

			// Clear existing timeout
			if (typingTimeout) {
				window.clearTimeout(typingTimeout);
			}

			// Set new timeout to stop typing indicator
			const timeout = window.setTimeout(() => {
				socket.emit("typing_stop", {
					chatId,
					userEmail: currentUserEmail,
					username: currentUsername,
				});
			}, 1000);

			setTypingTimeout(timeout);
		}
	};

	const handleOnSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (currentMessage.trim() !== "" && socket && chatId) {
			const messageData = {
				chatId,
				senderEmail: currentUserEmail,
				senderUsername: currentUsername,
				receiverEmail: partnerEmail,
				receiverUsername: partnerUsername,
				message: currentMessage,
				time: formatTime12Hour(new Date()),
			};

			// Send message via socket - the server will echo it back
			socket.emit("send_private_message", messageData);

			// Clear input immediately
			setCurrentMessage("");

			// Stop typing indicator
			socket.emit("typing_stop", {
				chatId,
				userEmail: currentUserEmail,
				username: currentUsername,
			});

			// Clear typing timeout
			if (typingTimeout) {
				window.clearTimeout(typingTimeout);
			}
		}
	};

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated, navigate]);

	if (!isAuthenticated) {
		return null;
	}

	if (isError) {
		return (
			<div className="min-h-screen mira-content">
				<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center max-w-md p-8">
						<div className="w-20 h-20 mx-auto mb-6 mira-glass rounded-2xl flex items-center justify-center">
							<span className="text-3xl">⚠️</span>
						</div>
						<h2 className="mira-title text-xl mb-4">Error Loading Messages</h2>
						<p className="text-sm text-foreground/70 mb-6">
							{error?.message || "Failed to load messages"}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="mira-action-btn px-6 py-3 text-white rounded-xl transition-all"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!partnerEmail || !partnerUsername) {
		return (
			<div className="min-h-screen mira-content">
				<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center text-foreground max-w-md p-8">
						<div className="w-20 h-20 mx-auto mb-6 mira-glass rounded-2xl flex items-center justify-center zen-float">
							<span className="text-3xl">💬</span>
						</div>
						<h2 className="mira-title text-xl mb-4">No chat selected</h2>
						<p className="text-sm text-foreground/70 mb-6">
							Select a user to start messaging
						</p>
						<button
							onClick={() => navigate("/chat")}
							className="mira-action-btn px-6 py-3 text-white rounded-xl transition-all"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							Go to Messages
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen mira-content">
			<div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
				{/* Header */}
				<div className="p-4 mira-glass border-b border-sidebar-border/50 rounded-b-2xl">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate("/chat")}
								className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all md:hidden"
							>
								<ArrowLeft size={20} />
							</button>

							<div className="relative">
								<div className="w-12 h-12 rounded-full mira-glass flex items-center justify-center border-2 border-sidebar-border">
									<span
										className="text-sm font-semibold"
										style={{ color: "oklch(0.55 0.08 145)" }}
									>
										{partnerUsername.charAt(0).toUpperCase()}
									</span>
								</div>
								<div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-sidebar animate-pulse"></div>
							</div>

							<div>
								<h3 className="font-semibold text-foreground">
									{partnerUsername}
								</h3>
								<p className="text-xs text-foreground/60">
									{isTyping
										? "typing..."
										: isConnected
											? "Active now"
											: "Connecting..."}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div
								className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary" : "bg-destructive"}`}
							></div>
							<button className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
								<Phone className="w-4 h-4" />
							</button>
							<button className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
								<Video className="w-4 h-4" />
							</button>
							<button className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
								<MoreVertical className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background/50 to-background">
					{isPending ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
								<h1 className="text-xl font-bold text-foreground mt-4">
									Loading conversation...
								</h1>
							</div>
						</div>
					) : messages.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center p-8 max-w-md">
								<div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center mira-glass">
									<span className="text-3xl">👋</span>
								</div>
								<h3 className="mira-title text-xl mb-4">Start a conversation</h3>
								<p className="text-sm text-foreground/70 leading-relaxed">
									Send your first message to {partnerUsername}
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-6 max-w-5xl mx-auto">
							{messages.map((msg, index) => (
								<div
									key={`${msg.senderEmail}-${msg.time}-${msg.id}`}
									className={`group ${msg.isOwn ? "flex justify-end" : "flex justify-start"} animate-fadeIn`}
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<div className={`flex gap-4 max-w-lg lg:max-w-2xl ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}>
										{/* Avatar */}
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
												<span className="text-lg font-bold text-primary-foreground">
													{msg.isOwn ? currentUsername.charAt(0).toUpperCase() : partnerUsername.charAt(0).toUpperCase()}
												</span>
											</div>
											{!msg.isOwn && (
												<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
											)}
										</div>

										{/* Message Content */}
										<div className={`flex-1 min-w-0 ${msg.isOwn ? "text-right" : "text-left"}`}>
											{/* Header with Author and Time */}
											<div className="flex items-center gap-3 mb-2">
												<span className="font-semibold text-foreground text-sm leading-tight">
													{msg.isOwn ? "You" : msg.senderUsername}
												</span>
												<span className="text-xs text-foreground/50 font-medium bg-background/50 px-2 py-1 rounded-full">
													{msg.time}
												</span>
											</div>

											{/* Message Bubble */}
											<div
												className={`relative inline-block px-5 py-4 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow ${
													msg.isOwn
														? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-none"
														: "mira-glass rounded-bl-none border border-border/50"
												}`}
											>
												{!msg.isOwn && (
													<div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-sidebar-accent/30"></div>
												)}
												{msg.isOwn && (
													<div className="absolute -right-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-primary"></div>
												)}
												<p className="text-base leading-relaxed break-words">
													{msg.message}
												</p>
											</div>

											{/* Message Status for own messages */}
											{msg.isOwn && (
												<div className="flex items-center gap-1 mt-2 justify-end">
													<span className="text-xs text-primary/60">✓ Sent</span>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
							{isTyping && (
								<div className="flex justify-start">
									<div className="flex gap-4 max-w-lg lg:max-w-2xl">
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
												<span className="text-lg font-bold text-primary-foreground">
													{partnerUsername.charAt(0).toUpperCase()}
												</span>
											</div>
											<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<span className="font-semibold text-foreground text-sm">
													{partnerUsername}
												</span>
											</div>
											<div className="mira-glass rounded-2xl rounded-bl-none border border-border/50 px-5 py-4 inline-block shadow-sm">
												<div className="flex space-x-1">
													<div
														className="w-2 h-2 rounded-full animate-bounce"
														style={{ backgroundColor: "oklch(0.55 0.08 145)" }}
													></div>
													<div
														className="w-2 h-2 rounded-full animate-bounce"
														style={{
															backgroundColor: "oklch(0.55 0.08 145)",
															animationDelay: "0.1s",
														}}
													></div>
													<div
														className="w-2 h-2 rounded-full animate-bounce"
														style={{
															backgroundColor: "oklch(0.55 0.08 145)",
															animationDelay: "0.2s",
														}}
													></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				{/* Message Input */}
				<div className="mira-glass border-t border-sidebar-border">
					<div className="container mx-auto p-6">
						<div className="flex items-center gap-3 mb-4">
							<div
								className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-destructive"} ${isConnected ? "animate-pulse" : ""}`}
							></div>
							<span className="text-sm font-medium text-foreground/80">
								{isConnected ? `💬 Connected to ${partnerUsername}` : "🔄 Connecting to chat..."}
							</span>
						</div>

						<form onSubmit={handleOnSubmit} className="flex items-end gap-4">
							<div className="flex-1 relative">
								<Input
									type="text"
									value={currentMessage}
									onChange={(e) => {
										setCurrentMessage(e.target.value);
										handleTyping();
									}}
									placeholder={`Share your thoughts with ${partnerUsername}...`}
									className="mira-search pr-12 h-12 text-base"
								/>
								<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
									<span className="text-xs text-foreground/40">
										{currentMessage.length}/500
									</span>
								</div>
							</div>

							<Button
								type="submit"
								disabled={!currentMessage.trim() || !isConnected}
								className="px-6 h-12 mira-action-btn text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-base shadow-lg hover:shadow-xl"
								style={{
									background: "oklch(0.55 0.08 145)",
									boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
								}}
							>
								<Send size={18} />
								<span>{currentMessage.trim() ? "Send Message" : "Send"}</span>
							</Button>
						</form>

						<div className="mt-3 text-center">
							<span className="text-xs text-foreground/50 font-medium">
								💡 Be thoughtful and respectful in your conversations
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatFeed;
