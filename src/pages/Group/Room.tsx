import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LogOut, Copy, ArrowRight, Users, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

const Room = () => {
	const [roomName, setRoomName] = useState("");
	const [roomId, setRoomId] = useState("");
	const [currentRoom, setCurrentRoom] = useState<any>(null);
	const [recentRooms, setRecentRooms] = useState<any[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuth();
	const username = user?.username || "";

	// Check for active room in localStorage on component mount
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		const savedRoom = localStorage.getItem("currentRoom");
		const savedRoomName = localStorage.getItem("currentRoomName");

		if (savedRoom && savedRoomName) {
			setCurrentRoom({
				id: savedRoom,
				name: savedRoomName,
			});

			// Join the room automatically
			socket.emit("join_room", savedRoom, username);

			// Listen for online users updates
			socket.on("room_users_update", (users: string[]) => {
				setOnlineUsers(users);
			});
		}

		// Load recent rooms from localStorage
		const savedRecentRooms = localStorage.getItem("recentRooms");
		if (savedRecentRooms) {
			try {
				setRecentRooms(JSON.parse(savedRecentRooms));
			} catch (e) {
				console.error("Failed to parse recent rooms", e);
			}
		}
	}, [isAuthenticated, navigate, username]);

	// Save room to recent rooms list
	const addToRecentRooms = (roomData: any) => {
		const updatedRooms = [
			roomData,
			...recentRooms.filter((room) => room.id !== roomData.id),
		].slice(0, 5);

		setRecentRooms(updatedRooms);
		localStorage.setItem("recentRooms", JSON.stringify(updatedRooms));
	};

	// Generate a random room ID
	const generateRoomId = () => {
		return Math.floor(10000000 + Math.random() * 90000000).toString();
	};

	const joinTheRoom = async () => {
		if (roomName.trim() !== "" && roomId.trim() !== "" && username) {
			setLoading(true);
			localStorage.setItem("currentRoom", roomId);
			localStorage.setItem("currentRoomName", roomName);

			socket.emit("join_room", roomId, username);

			setCurrentRoom({
				id: roomId,
				name: roomName,
			});

			addToRecentRooms({
				id: roomId,
				name: roomName,
			});

			navigate(`/group/${roomId}`, {
				state: {
					roomName,
				},
			});

			toast.success(`Successfully joined the room: ${roomName}`);
			setLoading(false);
		} else {
			toast.error("Room Name and Room ID are required!");
		}
	};

	const createNewRoom = async () => {
		if (roomName.trim() !== "" && username) {
			setLoading(true);
			const newRoomId = roomId.trim() !== "" ? roomId : generateRoomId();

			socket.emit("create_room", newRoomId, username);
			socket.emit("join_room", newRoomId, username);

			setCurrentRoom({
				id: newRoomId,
				name: roomName,
			});

			addToRecentRooms({
				id: newRoomId,
				name: roomName,
			});

			navigate(`/group/${newRoomId}`, {
				state: {
					roomName,
				},
			});

			toast.success(`Created and joined new room: ${roomName}`);

			setRoomName("");
			setRoomId("");
			setIsCreating(false);
			setLoading(false);
		} else {
			toast.error("Room Name is required!");
		}
	};

	const joinExistingRoom = (room: any) => {
		if (username) {
			socket.emit("join_room", room.id, username);

			setCurrentRoom(room);
			addToRecentRooms(room);

			navigate(`/group/${room.id}`, {
				state: {
					roomName: room.name,
				},
			});

			toast.success(`Rejoined room: ${room.name}`);
		}
	};

	const leaveRoom = () => {
		if (currentRoom && username) {
			socket.emit("leave_room", currentRoom.id, username);
			socket.off("room_users_update");

			localStorage.removeItem("currentRoom");
			localStorage.removeItem("currentRoomName");

			setCurrentRoom(null);
			setOnlineUsers([]);

			navigate("/group");
			toast.success(`Left room: ${currentRoom.name}`);
		}
	};

	const continueToChat = () => {
		if (currentRoom) {
			navigate(`/group/${currentRoom.id}`, {
				state: {
					roomName: currentRoom.name,
				},
			});
		}
	};

	const copyRoomId = () => {
		if (currentRoom) {
			navigator.clipboard.writeText(currentRoom.id);
			toast.success("Room ID copied to clipboard!");
		}
	};

	if (!isAuthenticated) {
		return null; // Will redirect by useEffect
	}

	return (
		<div className="min-h-screen mira-content px-2 sm:px-0">
			<Toaster position="top-right" />

			{/* Header */}
			<div className="text-center mb-8 pt-8">
				<h1 className="mira-title text-4xl mb-2">Classroom</h1>
				<p className="text-foreground/60">
					Create or join virtual classrooms for learning
				</p>
			</div>

			<div className="flex items-center justify-center py-4 sm:py-8">
				<div className="mira-glass rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
					{currentRoom ? (
						// Already in a room view - Educational themed
						<>
							<div className="text-center mb-6 sm:mb-8">
								<h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
									Current Classroom
								</h1>
								<div className="bg-sidebar-accent/20 p-4 sm:p-6 rounded-xl my-4 border border-sidebar-border">
									<h2 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
										{currentRoom.name}
									</h2>
									<div className="flex items-center justify-center text-xs sm:text-sm text-foreground/60">
										<span>Class ID: {currentRoom.id}</span>
										<Button
										variant="ghost"
										size="icon"
										onClick={copyRoomId}
										className="ml-2 text-primary hover:text-primary/90 transition-colors p-1 rounded"
										title="Copy Class ID"
									>
										<Copy size={12} className="sm:w-3.5 sm:h-3.5" />
									</Button>
									</div>
								</div>

								{/* Online Users */}
								{onlineUsers.length > 0 && (
									<div className="bg-primary/10 p-3 sm:p-4 rounded-xl mb-4">
										<div className="flex items-center justify-center gap-2 text-foreground/80 mb-3">
											<Users size={16} className="sm:w-4 sm:h-4" />
											<span className="text-sm sm:text-base">
												{onlineUsers.length} Students Online
											</span>
										</div>
										<div className="flex flex-wrap justify-center gap-2">
											{onlineUsers.map((user, idx) => (
												<div
													key={idx}
													className={`px-3 py-1 rounded-full text-xs sm:text-sm border ${
														user === username
															? "bg-primary/10 text-primary border-primary/20"
															: "bg-sidebar-accent/30 text-foreground/80 border-sidebar-border"
													}`}
												>
													{user}
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							<div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
								<Button
									onClick={continueToChat}
									className="flex-1 mira-action-btn text-primary-foreground p-3 sm:p-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
									style={{
										background: "oklch(0.55 0.08 145)",
										boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
									}}
								>
									Enter Classroom{" "}
									<ArrowRight size={16} className="sm:w-4 sm:h-4" />
								</Button>

								<Button
									onClick={leaveRoom}
									variant="destructive"
									className="p-3 sm:p-4 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center sm:w-auto"
									title="Leave Classroom"
								>
									<LogOut size={16} className="sm:w-4 sm:h-4" />
									<span className="ml-2 sm:hidden">Leave</span>
								</Button>
							</div>

							<div className="border-t border-sidebar-border pt-4 sm:pt-6 mt-2">
								<h3 className="text-base sm:text-lg font-semibold mb-3 text-foreground">
									Join Another Classroom
								</h3>
								<div className="space-y-4">
									<Input
										onChange={(event) => setRoomName(event.target.value)}
										type="text"
										placeholder="Classroom Name"
										className="mira-search"
									/>
									<Input
										onChange={(event) => setRoomId(event.target.value)}
										type="text"
										placeholder="Class ID"
										className="mira-search"
									/>
									<Button
										onClick={joinTheRoom}
										disabled={loading}
										className="w-full"
									>
										{loading ? "Joining..." : "Join Classroom"}
								</Button>
								</div>
							</div>
						</>
					) : (
						// Not in a room view - Educational themed
						<>
							{/* Toggle between Join and Create */}
							<div className="flex mb-6 sm:mb-8 p-1 bg-sidebar-accent/30 rounded-lg">
								<Button
									onClick={() => setIsCreating(false)}
									variant={!isCreating ? "default" : "ghost"}
									className={`flex-1 ${!isCreating ? "" : "text-foreground/60 hover:text-foreground"}`}
								>
									Join Classroom
								</Button>
								<Button
									onClick={() => setIsCreating(true)}
									variant={isCreating ? "default" : "ghost"}
									className={`flex-1 ${isCreating ? "" : "text-foreground/60 hover:text-foreground"}`}
								>
									Create Classroom
								</Button>
							</div>

							<h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-foreground">
								{isCreating ? "Create a New Classroom" : "Join a Classroom"}
							</h1>

							<div className="space-y-4">
								<Input
									value={roomName}
									onChange={(event) => setRoomName(event.target.value)}
									type="text"
									maxLength={14}
									placeholder="Classroom Name"
									className="mira-search"
								/>

	<Input
									value={roomId}
									onChange={(event) => setRoomId(event.target.value)}
									type="text"
									placeholder={isCreating ? "Class ID (optional - will be generated if empty)" : "Class ID"}
									className="mira-search"
								/>

								<Button
									onClick={isCreating ? createNewRoom : joinTheRoom}
									disabled={loading}
									className="w-full mira-action-btn text-primary-foreground p-3 sm:p-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
								>
									{loading ? (
										"Processing..."
									) : isCreating ? (
										<>
											<Plus size={16} className="sm:w-4 sm:h-4" /> Create
											Classroom
										</>
									) : (
										"Join Classroom"
									)}
								</Button>

								{/* Recent Rooms */}
								{recentRooms.length > 0 && (
									<div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-sidebar-border">
										<h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">
											Recent Classrooms
										</h3>
										<div className="space-y-3">
											{recentRooms.map((room, idx) => (
												<Button
													key={idx}
													onClick={() => joinExistingRoom(room)}
													className="w-full flex items-center justify-between bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-foreground p-3 sm:p-4 rounded-lg border border-sidebar-border transition-colors"
												>
													<div className="text-left min-w-0 flex-1">
														<div className="font-medium text-sm sm:text-base truncate mb-1">
															{room.name}
														</div>
														<div className="text-xs text-foreground/60">
															ID: {room.id}
														</div>
													</div>
													<ArrowRight
														size={16}
														className="sm:w-4 sm:h-4 flex-shrink-0 ml-3 text-foreground/60"
													/>
												</Button>
											))}
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Room;
