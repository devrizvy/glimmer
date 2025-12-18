import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Users, LogOut, Settings, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

	const [socket, setSocket] = useState<any>(null);
	const [message, setMessage] = useState("");
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

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

	// Socket connection setup
	useEffect(() => {
		if (!id || !username || !isAuthenticated) {
			navigate("/group");
			return;
		}

		const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
		setSocket(newSocket);

		newSocket.on("connect", () => {
			setIsConnected(true);
			toast.success(`Connected to ${roomName}`);
			// Join the room
			newSocket.emit("join_room", id, username);
		});

		newSocket.on("disconnect", () => {
			setIsConnected(false);
			toast.error("Connection lost. Trying to reconnect...");
		});

		// Listen for room messages
		const handleRoomMessage = (data: any) => {
			const newMessage: RoomMessage = {
				id: Date.now().toString(),
				roomId: data.roomId,
				room: data.room,
				author: data.author,
				message: data.message,
				time: data.time,
				isOwn: data.author === username,
				createdAt: new Date(),
			};

			setMessages((prev) => [...prev, newMessage]);
		};

		// Listen for system messages (user joined/left)
		const handleSystemMessage = (data: any) => {
			const systemMessage: RoomMessage = {
				id: Date.now().toString(),
				roomId: id,
				room: roomName,
				author: "System",
				message: data.message,
				time: data.time,
				isSystem: true,
				createdAt: new Date(),
			};

			setMessages((prev) => [...prev, systemMessage]);
		};

		// Listen for online users updates
		const handleUsersUpdate = (users: string[]) => {
			setOnlineUsers(users);
		};

		newSocket.on("receive_room_message", handleRoomMessage);
		newSocket.on("joining_message", handleSystemMessage);
		newSocket.on("leave_message", handleSystemMessage);
		newSocket.on("room_users_update", handleUsersUpdate);

		// Cleanup
		return () => {
			newSocket.off("receive_room_message", handleRoomMessage);
			newSocket.off("joining_message", handleSystemMessage);
			newSocket.off("leave_message", handleSystemMessage);
			newSocket.off("room_users_update", handleUsersUpdate);
			if (id) {
				newSocket.emit("leave_room", id, username);
			}
			newSocket.disconnect();
		};
	}, [id, username, roomName, isAuthenticated, navigate]);

	// Helper function to format time in 12-hour format with AM/PM
	const formatTime12Hour = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	// Update messages when initialMessages are loaded
	useEffect(() => {
		if (initialMessages && initialMessages.length > 0) {
			const formattedMessages: RoomMessage[] = initialMessages.map((msg: any) => ({
				id: msg._id || Date.now().toString(),
				roomId: msg.roomId || id || "",
				room: msg.room || roomName,
				author: msg.author || "Unknown",
				message: msg.message || "",
				time: msg.time || formatTime12Hour(new Date(msg.createdAt)),
				isOwn: msg.author === username,
				isSystem: msg.author === "System",
				createdAt: new Date(msg.createdAt),
			}));
			setMessages(formattedMessages);
		} else {
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
	}, [initialMessages, id, roomName, username]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();

		if (message.trim() && socket && id) {
			const messageData = {
				roomId: id,
				room: roomName,
				author: username,
				message: message.trim(),
				time: formatTime12Hour(new Date()),
			};

			// Send message via socket - the server will echo it back to all clients
			socket.emit("send_room_message", messageData);
			setMessage("");
		}
	};

	const leaveRoom = () => {
		if (socket && id) {
			socket.emit("leave_room", id, username);
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
										<div className="relative flex h-2 w-2">
											<div className="absolute inline-flex h-full w-full rounded-full bg-primary"></div>
										</div>
										{onlineUsers.length}{" "}
										{onlineUsers.length === 1 ? "student" : "students"} online
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

			{/* Online Students Bar */}
			{onlineUsers.length > 0 && (
				<div className="mira-glass border-t border-sidebar-border px-6 py-4">
					<div className="container mx-auto">
						<div className="flex items-center gap-4 overflow-x-auto">
							<div className="flex items-center gap-2 text-sm font-medium text-foreground/80 whitespace-nowrap">
								<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
								<span>{onlineUsers.length} {onlineUsers.length === 1 ? "Student" : "Students"} Online</span>
							</div>
							<div className="flex gap-2 flex-wrap">
								{onlineUsers.map((user, idx) => (
									<div
										key={idx}
										className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
											user === username
												? "bg-primary/10 text-primary border border-primary/30 shadow-sm"
												: "mira-glass text-foreground/80 border border-border/50"
										}`}
									>
										<div className={`w-2.5 h-2.5 rounded-full ${
											user === username ? "bg-primary" : "bg-green-500 animate-pulse"
										}`}></div>
										<span className="font-medium">{user === username ? "You" : user}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Input Section */}
			<div className="mira-glass border-t border-sidebar-border">
				<div className="container mx-auto p-6">
					<div className="flex items-center gap-3 mb-4">
						<div
							className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-destructive"} ${isConnected ? "animate-pulse" : ""}`}
						></div>
						<span className="text-sm font-medium text-foreground/80">
							{isConnected ? `📚 Connected to ${roomName}` : "🔄 Connecting to classroom..."}
						</span>
					</div>

					<form onSubmit={handleSendMessage} className="flex items-end gap-4">
						<div className="flex-1 relative">
							<Input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder={`Share your thoughts in ${roomName} classroom...`}
								className="mira-search pr-12 h-12 text-base"
							/>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
								<span className="text-xs text-foreground/40">
									{message.length}/500
								</span>
							</div>
						</div>

						<Button
							type="submit"
							disabled={!message.trim() || !isConnected}
							className="px-6 h-12 mira-action-btn text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-base shadow-lg hover:shadow-xl"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							<Send size={18} />
							<span>{message.trim() ? "Send Message" : "Send"}</span>
						</Button>
					</form>

					<div className="mt-3 text-center">
						<span className="text-xs text-foreground/50 font-medium">
							💡 Be respectful and constructive in your educational discussions
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoomChat;
