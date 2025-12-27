import { useState, useEffect, useCallback, useRef } from "react";
import socketService, {
	type PrivateMessage,
	type RoomMessage,
} from "../services/socketService";

interface UseSocketChatOptions {
	userEmail: string;
	username: string;
	autoConnect?: boolean;
}

export const useSocketChat = ({
	userEmail,
	username,
	autoConnect = true,
}: UseSocketChatOptions) => {
	const [isConnected, setIsConnected] = useState(false);
	const [privateMessages, setPrivateMessages] = useState<
		Record<string, PrivateMessage[]>
	>({});
	const [roomMessages, setRoomMessages] = useState<
		Record<string, RoomMessage[]>
	>({});
	const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
	const [typingUsers, setTypingUsers] = useState<
		Record<string, { username: string; isTyping: boolean }>
	>({});
	const [connectionError, setConnectionError] = useState<string | null>(null);

	const typingTimeoutRef = useRef<number | null>(null);

	// Connect to socket
	const connect = useCallback(async () => {
		try {
			setConnectionError(null);
			await socketService.connect(userEmail);
			setIsConnected(true);
		} catch (error) {
			setConnectionError(
				error instanceof Error ? error.message : "Connection failed",
			);
			setIsConnected(false);
		}
	}, [userEmail, username]);

	// Disconnect from socket
	const disconnect = useCallback(() => {
		socketService.disconnect();
		setIsConnected(false);
	}, []);

	// Auto-connect on mount
	useEffect(() => {
		if (autoConnect && userEmail && username) {
			connect();
		}

		return () => {
			disconnect();
		};
	}, [autoConnect, userEmail, username, connect, disconnect]);

	// Set up event listeners
	useEffect(() => {
		if (!isConnected) return;

		// Private message listeners
		const handlePrivateMessage = (message: PrivateMessage) => {
			const chatId = message.chatId;
			setPrivateMessages((prev) => ({
				...prev,
				[chatId]: [...(prev[chatId] || []), message],
			}));
		};

		const handleUserStatusChange = (data: {
			userEmail: string;
			status: string;
		}) => {
			setOnlineUsers((prev) => {
				const newUsers = new Set(prev);
				if (data.status === "online") {
					newUsers.add(data.userEmail);
				} else {
					newUsers.delete(data.userEmail);
				}
				return newUsers;
			});
		};

		const handleUserTyping = (data: {
			userEmail: string;
			username: string;
			isTyping: boolean;
		}) => {
			setTypingUsers((prev) => ({
				...prev,
				[data.userEmail]: { username: data.username, isTyping: data.isTyping },
			}));
		};

		// Room message listeners
		const handleRoomMessage = (message: RoomMessage) => {
			const roomId = message.roomId;
			setRoomMessages((prev) => ({
				...prev,
				[roomId]: [...(prev[roomId] || []), message],
			}));
		};

		const handleJoiningMessage = (_message: {
			author: string;
			message: string;
			time: string;
		}) => {
			// This could be displayed as a system message in the current room
		};

		const handleLeaveMessage = (_message: {
			author: string;
			message: string;
			time: string;
		}) => {
			// This could be displayed as a system message in the current room
		};

		// Register listeners
		socketService.onReceivePrivateMessage(handlePrivateMessage);
		socketService.onUserStatusChange(handleUserStatusChange);
		socketService.onUserTyping(handleUserTyping);
		socketService.onReceiveRoomMessage(handleRoomMessage);
		socketService.onJoiningMessage(handleJoiningMessage);
		socketService.onLeaveMessage(handleLeaveMessage);

		// Cleanup
		return () => {
			socketService.off("receive_private_message", handlePrivateMessage);
			socketService.off("user_status_change", handleUserStatusChange);
			socketService.off("user_typing", handleUserTyping);
			socketService.off("receive_room_message", handleRoomMessage);
			socketService.off("joining_message", handleJoiningMessage);
			socketService.off("leave_message", handleLeaveMessage);
		};
	}, [isConnected]);

	// Private chat actions
	const sendPrivateMessage = useCallback(
		(data: {
			chatId: string;
			receiverEmail: string;
			receiverUsername: string;
			message: string;
		}) => {
			const messageData = {
				chatId: data.chatId,
				senderEmail: userEmail,
				senderUsername: username,
				receiverEmail: data.receiverEmail,
				receiverUsername: data.receiverUsername,
				message: data.message,
				time: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}),
			};

			socketService.sendPrivateMessage(messageData);

			// Add to local state immediately for better UX
			const message: PrivateMessage = {
				...messageData,
				id: Date.now().toString(),
				isOwn: true,
				createdAt: new Date(),
			};

			setPrivateMessages((prev) => ({
				...prev,
				[data.chatId]: [...(prev[data.chatId] || []), message],
			}));
		},
		[userEmail, username],
	);

	const joinPrivateChat = useCallback(
		(chatId: string) => {
			socketService.joinPrivateChat(chatId, userEmail);
		},
		[userEmail],
	);

	const startTyping = useCallback(
		(chatId: string) => {
			socketService.startTyping({
				chatId,
				userEmail,
				username,
			});

			// Clear existing timeout
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			// Auto-stop typing after 3 seconds
			typingTimeoutRef.current = setTimeout(() => {
				socketService.stopTyping({
					chatId,
					userEmail,
					username,
				});
			}, 3000);
		},
		[userEmail, username],
	);

	const stopTyping = useCallback(
		(chatId: string) => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			socketService.stopTyping({
				chatId,
				userEmail,
				username,
			});
		},
		[userEmail, username],
	);

	// Room chat actions
	const joinRoom = useCallback(
		(roomId: string) => {
			socketService.joinRoom(roomId, username);
		},
		[username],
	);

	const leaveRoom = useCallback(
		(roomId: string) => {
			socketService.leaveRoom(roomId, username);
		},
		[username],
	);

	const sendRoomMessage = useCallback(
		(data: { roomId: string; room: string; message: string }) => {
			const messageData = {
				roomId: data.roomId,
				room: data.room,
				author: username,
				message: data.message,
				time: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}),
			};

			socketService.sendRoomMessage(messageData);

			// Add to local state immediately for better UX
			const message: RoomMessage = {
				...messageData,
				id: Date.now().toString(),
				isOwn: true,
				createdAt: new Date(),
			};

			setRoomMessages((prev) => ({
				...prev,
				[data.roomId]: [...(prev[data.roomId] || []), message],
			}));
		},
		[username],
	);

	// Utility functions
	const isUserOnline = useCallback(
		(userEmail: string) => {
			return onlineUsers.has(userEmail);
		},
		[onlineUsers],
	);

	const getUserTypingStatus = useCallback(
		(userEmail: string) => {
			return typingUsers[userEmail];
		},
		[typingUsers],
	);

	const getMessagesForChat = useCallback(
		(chatId: string) => {
			return privateMessages[chatId] || [];
		},
		[privateMessages],
	);

	const getMessagesForRoom = useCallback(
		(roomId: string) => {
			return roomMessages[roomId] || [];
		},
		[roomMessages],
	);

	return {
		// Connection state
		isConnected,
		connectionError,
		connect,
		disconnect,

		// Private chat
		privateMessages,
		sendPrivateMessage,
		joinPrivateChat,
		startTyping,
		stopTyping,

		// Room chat
		roomMessages,
		joinRoom,
		leaveRoom,
		sendRoomMessage,

		// User status
		onlineUsers,
		typingUsers,
		isUserOnline,
		getUserTypingStatus,

		// Utilities
		getMessagesForChat,
		getMessagesForRoom,
	};
};
