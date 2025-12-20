import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Users, LogOut, Settings, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSocketChat } from "../../hooks/useSocketChat";
import { Button } from "@/components/ui/button";
import useRoomMessages from "../../hooks/useRoomMessages";
import toast from "react-hot-toast";

interface RoomMessage {
	id: string;
	roomId: string;
	room: string;
	author: string;
	message: string;
	time: string;
	isOwn?: boolean;
	isSystem?: boolean;
	createdAt?: Date;
}

const RoomChat = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();
	const { user, isAuthenticated } = useAuth();
	const username = user?.username || "";
	const userEmail = user?.email || "";

	const [message, setMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Use useSocketChat hook for socket functionality
	const {
		isConnected,
		roomMessages,
		sendRoomMessage,
		joinRoom,
		leaveRoom: socketLeaveRoom,
		getMessagesForRoom,
	} = useSocketChat({
		userEmail,
		username,
		autoConnect: true,
	});

	// Use useRoomMessages hook for initial message loading
	const { isPending, messages: initialMessages, isError, error } = useRoomMessages(id || "");
	const [messages, setMessages] = useState<RoomMessage[]>([]);

	// Get room name from location state or localStorage
	const roomName =
		location.state?.roomName ||
		localStorage.getItem("currentRoomName") ||
		"Neural Hub";

	// Auto-scroll to bottom when messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Join room when connected and room info is available
	useEffect(() => {
		if (isConnected && id && username) {
			console.log("Joining room:", id, "as:", username);
			joinRoom(id);
			toast.success(`Connected to ${roomName}`);
		}
	}, [isConnected, id, username, roomName, joinRoom]);

	// Update messages when initialMessages are loaded (this runs once)
	useEffect(() => {
		if (initialMessages && initialMessages.length > 0) {
			const formattedMessages: RoomMessage[] = initialMessages.map((msg: any) => ({
				id: msg._id || Date.now().toString(),
				roomId: msg.roomId || id || "",
				room: roomName,
				author: msg.author || "Unknown",
				message: msg.message || "",
				time: formatTime12Hour(new Date(msg.createdAt)),
				isOwn: msg.author === username,
				isSystem: false,
				createdAt: new Date(msg.createdAt),
			}));
			setMessages(formattedMessages);
		} else if (!isPending && !isError) {
			// Add welcome message if no messages exist
			const welcomeMessage: RoomMessage = {
				id: Date.now().toString(),
				roomId: id || "",
				room: roomName,
				author: "System",
				message: `🚀 Welcome to the ${roomName} classroom`,
				time: formatTime12Hour(new Date()),
				isSystem: true,
				createdAt: new Date(),
			};
			setMessages([welcomeMessage]);
		}
	}, [initialMessages, id, roomName, username, user?.email, isPending, isError]);

	// Add new socket messages to existing messages
	useEffect(() => {
		const socketMessages = getMessagesForRoom(id || "");
		// Only process if we have new socket messages that aren't already in our state
		if (socketMessages.length > 0) {
			setMessages((prevMessages) => {
				const existingMessageIds = new Set(prevMessages.map(msg => msg.id));
				const newMessages = socketMessages
					.filter(msg => !existingMessageIds.has(msg.id))
					.map((msg) => ({
						id: msg.id,
						roomId: msg.roomId,
						room: roomName,
						author: msg.author,
						message: msg.message,
						time: msg.time,
						isOwn: msg.isOwn || msg.author === username,
						isSystem: msg.isSystem,
						createdAt: msg.createdAt,
					}));

				return [...prevMessages, ...newMessages];
			});
		}
	}, [roomMessages, id, roomName, username, getMessagesForRoom]);

	// Helper function to format time in 12-hour format with AM/PM
	const formatTime12Hour = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	
	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();

		if (message.trim() && id) {
			console.log("Sending room message:", message.trim());
			console.log("Socket connected:", isConnected);

			// Send message via socket service
			sendRoomMessage({
				roomId: id,
				room: roomName,
				message: message.trim(),
			});
			setMessage("");
		} else {
			console.log("Cannot send message - missing data:", { message: message.trim(), id, isConnected });
		}
	};

	const leaveRoom = () => {
		if (id) {
			socketLeaveRoom(id);
		}
		localStorage.removeItem("currentRoom");
		localStorage.removeItem("currentRoomName");
		navigate("/group");
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="flex flex-col h-screen mira-content">
			{/* Classroom Header */}
			<div className="mira-glass border-b border-sidebar-border shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={leaveRoom}
								className="p-2 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-lg transition-colors"
							>
								<ArrowLeft size={24} />
							</Button>

							<div className="flex items-center gap-3">
								<div className="relative">
									<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
										<span className="text-xl font-bold text-primary-foreground">#</span>
									</div>
									<div className="absolute -top-1 -right-1">
										<div className="w-3 h-3 bg-primary rounded-full"></div>
									</div>
								</div>

								<div>
									<h2 className="text-xl font-bold text-foreground flex items-center gap-2">
										<span className="text-primary">#</span>
										{roomName}
									</h2>
									<p className="text-sm text-foreground/60 flex items-center gap-2">
										<div className={`relative flex h-2 w-2 ${isConnected ? "bg-green-500 animate-pulse" : "bg-destructive"}`}>
											<div className="absolute inline-flex h-full w-full rounded-full bg-current"></div>
										</div>
										{isConnected ? "Connected" : "Connecting..."}
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-foreground"
							>
								<Users className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-foreground"
							>
								<Settings className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
							>
								<LogOut className="w-5 h-5" />
							</Button>
						</div>
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
								Loading classroom messages...
							</h1>
						</div>
					</div>
				) : isError ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-center max-w-md">
							<div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center mira-glass">
								<span className="text-3xl">⚠️</span>
							</div>
							<h2 className="mira-title text-xl mb-4">Error Loading Messages</h2>
							<p className="text-sm text-muted-foreground mb-6">
								{error?.message || "Failed to load room messages"}
							</p>
							<Button onClick={() => window.location.reload()} className="px-6 py-3">
								Try Again
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-6 max-w-5xl mx-auto">
						{messages.map((msg, index) => (
							<div
								key={msg.id}
								className={`group ${msg.isSystem ? "flex justify-center" : `${msg.isOwn ? "flex justify-end" : "flex justify-start"} animate-fadeIn`}`}
								style={{ animationDelay: `${index * 50}ms` }}
							>
								{msg.isSystem ? (
									<div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium mira-glass">
										<span className="flex items-center gap-2">
											<Zap className="w-4 h-4" />
											{msg.message}
										</span>
									</div>
								) : (
									<div className={`flex gap-4 max-w-lg lg:max-w-2xl ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}>
										{/* Avatar */}
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
												<span className="text-lg font-bold text-primary-foreground">
													{msg.author.charAt(0).toUpperCase()}
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
													{msg.isOwn ? "You" : msg.author}
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
								)}
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			
			{/* Input Section */}
			<div className="mira-glass border-t border-sidebar-border bg-gradient-to-b from-background/95 to-background/80">
				<div className="container mx-auto p-4">
					{/* Connection Status */}
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<div
								className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-destructive"} ${isConnected ? "animate-pulse" : ""}`}
							></div>
							<span className="text-xs text-muted-foreground">
								{isConnected ? `📚 Connected to ${roomName}` : "🔄 Connecting..."}
							</span>
						</div>
						<div className="text-xs text-muted-foreground">
							{message.length}/500 characters
						</div>
					</div>

					<form onSubmit={handleSendMessage} className="space-y-3">
						<div className="flex items-end gap-2">
							{/* Action Buttons */}
							<div className="flex items-center gap-1">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
									</svg>
								</Button>
							</div>

							{/* Message Input */}
							<div className="flex-1 relative">
								<textarea
									value={message}
									onChange={(e) => {
										if (e.target.value.length <= 500) {
											setMessage(e.target.value);
										}
									}}
									placeholder={`Share your thoughts in ${roomName} classroom...`}
									className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 rounded-xl resize-none mira-glass border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-base placeholder:text-muted-foreground/60 transition-all"
									rows={1}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSendMessage(e);
										}
									}}
									style={{
										height: 'auto',
										minHeight: '44px'
									}}
									onInput={(e) => {
										const target = e.target as HTMLTextAreaElement;
										target.style.height = 'auto';
										target.style.height = Math.min(target.scrollHeight, 128) + 'px';
									}}
								/>
								{message.length > 300 && (
									<div className="absolute right-3 bottom-2">
										<div className={`text-xs font-medium ${message.length >= 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
											{500 - message.length}
										</div>
									</div>
								)}
							</div>

							{/* Send Button */}
							<Button
								type="submit"
								disabled={!message.trim() || !isConnected || message.length >= 500}
								className="h-10 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 active:scale-100"
							>
								<Send size={16} className="transition-transform group-hover:translate-x-0.5" />
								{message.trim() && <span className="hidden sm:inline">Send</span>}
							</Button>
						</div>
					</form>

					{/* Help Text */}
					<div className="mt-2 flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							💡 Press Enter to send, Shift+Enter for new line
						</span>
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							<span>Be respectful and constructive</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoomChat;
