import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Users, LogOut, Settings, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRoomMessages from "../../hooks/useRoomMessages";

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
			// Join the room
			newSocket.emit("join_room", id, username);
		});

		newSocket.on("disconnect", () => {
			setIsConnected(false);
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

	// Update messages when initialMessages are loaded
	useEffect(() => {
		if (initialMessages && initialMessages.length > 0) {
			const formattedMessages: RoomMessage[] = initialMessages.map((msg: any) => ({
				id: msg._id || Date.now().toString(),
				roomId: msg.roomId || id || "",
				room: msg.room || roomName,
				author: msg.author || "Unknown",
				message: msg.message || "",
				time: msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
				time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
				time:
					new Date(Date.now()).getHours().toString().padStart(2, "0") +
					":" +
					new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
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
			<div className="flex-1 overflow-y-auto p-4">
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
					<div className="space-y-4 max-w-4xl mx-auto">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`${msg.isSystem ? "flex justify-center" : `flex gap-3 animate-fadeIn ${msg.isOwn ? "justify-end" : "justify-start"}`}`}
							>
								{msg.isSystem ? (
									<div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium">
										<span className="flex items-center gap-2">
											<Zap className="w-4 h-4" />
											{msg.message}
										</span>
									</div>
								) : (
									<>
										{!msg.isOwn && (
											<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
												<span className="text-lg font-bold text-primary-foreground">
													{msg.author.charAt(0).toUpperCase()}
												</span>
											</div>
										)}
										<div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "order-first" : ""}`}>
											<div className={`flex items-baseline gap-2 mb-1 ${msg.isOwn ? "justify-end" : ""}`}>
												<span className="font-semibold text-foreground text-sm">
													{msg.isOwn ? "You" : msg.author}
												</span>
												<span className="text-xs text-foreground/50">
													{msg.time}
												</span>
											</div>
											<div
												className={`inline-block px-4 py-3 rounded-lg ${
													msg.isOwn
														? "bg-primary text-primary-foreground rounded-br-sm"
														: "bg-sidebar-accent/30 text-foreground rounded-bl-sm border border-sidebar-border"
												}`}
											>
												<p className="leading-relaxed">{msg.message}</p>
											</div>
										</div>
										{msg.isOwn && (
											<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 order-last">
												<span className="text-lg font-bold text-primary-foreground">
													{msg.author.charAt(0).toUpperCase()}
												</span>
											</div>
										)}
									</>
								)}
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Online Students Bar */}
			{onlineUsers.length > 0 && (
				<div className="mira-glass border-t border-sidebar-border px-4 py-3">
					<div className="container mx-auto">
						<div className="flex items-center gap-3 overflow-x-auto">
							<span className="text-sm text-foreground/60 whitespace-nowrap font-medium">
								Online Students:
							</span>
							<div className="flex gap-2 flex-wrap">
								{onlineUsers.map((user, idx) => (
									<div
										key={idx}
										className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
											user === username
												? "bg-primary/10 text-primary border-primary/20"
												: "bg-sidebar-accent/30 text-foreground/70 border-sidebar-border"
										}`}
									>
										<div className="w-2 h-2 bg-primary rounded-full"></div>
										<span>{user === username ? `${user} (you)` : user}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Input Section */}
			<div className="mira-glass border-t border-sidebar-border">
				<div className="container mx-auto p-4">
					<div className="flex items-center gap-2 mb-2">
						<div
							className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary" : "bg-destructive"} ${isConnected ? "animate-pulse" : ""}`}
						></div>
						<span className="text-xs text-foreground/60">
							{isConnected ? "Connected to classroom" : "Connecting..."}
						</span>
					</div>

					<form onSubmit={handleSendMessage} className="flex items-end gap-3">
						<div className="flex-1">
							<Input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder={`Type your message in ${roomName} classroom...`}
								className="mira-search"
							/>
						</div>

						<Button
							type="submit"
							disabled={!message.trim() || !isConnected}
							className="px-6 py-3 bottom-0 mira-action-btn text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							<Send size={18} />
							<span>Send</span>
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default RoomChat;
