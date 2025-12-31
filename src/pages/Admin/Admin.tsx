import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Users,
	MessageSquare,
	Shield,
	Ban,
	ShieldCheck,
	Trash2,
	UserCog,
	RefreshCw,
	Search,
	Coins,
	Check,
	X,
} from "lucide-react";
import { adminApi, type AdminUser, type AdminRoom } from "@/services/adminService";
import toast from "react-hot-toast";

const Admin = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"users" | "rooms">("users");
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [rooms, setRooms] = useState<AdminRoom[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
	const [editingCreditsEmail, setEditingCreditsEmail] = useState<string | null>(null);
	const [tempCredits, setTempCredits] = useState<string>("");

	// Check if user is admin
	useEffect(() => {
		if (user?.role !== "admin") {
			toast.error("Access denied. Admin privileges required.");
			navigate("/");
		}
	}, [user, navigate]);

	// Fetch users
	const fetchUsers = async () => {
		setLoading(true);
		const response = await adminApi.getAllUsers();
		console.log("Admin component - Users API response:", response);
		if (response.success) {
			setUsers(Array.isArray(response.data) ? response.data : []);
		} else {
			toast.error(response.error || "Failed to fetch users");
		}
		setLoading(false);
	};

	// Fetch rooms
	const fetchRooms = async () => {
		setLoading(true);
		const response = await adminApi.getAllRooms();
		console.log("Admin component - Rooms API response:", response);
		if (response.success) {
			setRooms(Array.isArray(response.data) ? response.data : []);
		} else {
			toast.error(response.error || "Failed to fetch rooms");
		}
		setLoading(false);
	};

	// Initial data fetch
	useEffect(() => {
		if (user?.role === "admin") {
			if (activeTab === "users") {
				fetchUsers();
			} else {
				fetchRooms();
			}
		}
	}, [activeTab, user]);

	// Toggle room selection
	const toggleRoomSelection = (roomId: string) => {
		const newSelected = new Set(selectedRooms);
		if (newSelected.has(roomId)) {
			newSelected.delete(roomId);
		} else {
			newSelected.add(roomId);
		}
		setSelectedRooms(newSelected);
	};

	// Update user status
	const updateUserStatus = async (email: string, status: "ACTIVE" | "BLOCKED") => {
		const response = await adminApi.updateUserStatus(email, { status });
		if (response.success) {
			toast.success(`User ${status === "ACTIVE" ? "unblocked" : "blocked"} successfully`);
			fetchUsers();
		} else {
			toast.error(response.error || "Failed to update user status");
		}
	};

	// Update user role
	const updateUserRole = async (email: string, role: "user" | "admin") => {
		const response = await adminApi.updateUserRole(email, { role });
		if (response.success) {
			toast.success(`User role changed to ${role}`);
			fetchUsers();
		} else {
			toast.error(response.error || "Failed to update user role");
		}
	};

	// Delete user
	const deleteUser = async (email: string) => {
		if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

		const response = await adminApi.deleteUser(email);
		if (response.success) {
			toast.success("User deleted successfully");
			fetchUsers();
		} else {
			toast.error(response.error || "Failed to delete user");
		}
	};

	// Delete rooms
	const deleteSelectedRooms = async () => {
		if (selectedRooms.size === 0) {
			toast.error("No rooms selected");
			return;
		}

		if (!confirm(`Are you sure you want to delete ${selectedRooms.size} room(s)?`)) return;

		const response = await adminApi.deleteMultipleRooms(Array.from(selectedRooms));
		if (response.success) {
			toast.success("Rooms deleted successfully");
			setSelectedRooms(new Set());
			fetchRooms();
		} else {
			toast.error(response.error || "Failed to delete rooms");
		}
	};

	// Start editing credits
	const startEditingCredits = (email: string, currentCredits: number) => {
		setEditingCreditsEmail(email);
		setTempCredits(currentCredits.toString());
	};

	// Save credits
	const saveCredits = async (email: string) => {
		const credits = parseInt(tempCredits, 10);
		if (isNaN(credits) || credits < 0) {
			toast.error("Please enter a valid credit amount (>= 0)");
			return;
		}

		const response = await adminApi.updateUserCredits(email, { credits });
		if (response.success) {
			toast.success(response.message || "Credits updated successfully");
			setEditingCreditsEmail(null);
			setTempCredits("");
			fetchUsers();
		} else {
			toast.error(response.error || "Failed to update credits");
		}
	};

	// Cancel editing credits
	const cancelEditingCredits = () => {
		setEditingCreditsEmail(null);
		setTempCredits("");
	};

	// Filter users
	const filteredUsers = users.filter(
		(u) =>
			u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (user?.role !== "admin") {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
								<Shield className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold">Admin Panel</h1>
								<p className="text-xs text-muted-foreground">Manage users and rooms</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={activeTab === "users" ? fetchUsers : fetchRooms}>
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Tabs */}
				<div className="flex gap-2 mb-6">
					<Button
						variant={activeTab === "users" ? "default" : "outline"}
						onClick={() => setActiveTab("users")}
						className="flex items-center gap-2"
					>
						<Users className="w-4 h-4" />
						Users
					</Button>
					<Button
						variant={activeTab === "rooms" ? "default" : "outline"}
						onClick={() => setActiveTab("rooms")}
						className="flex items-center gap-2"
					>
						<MessageSquare className="w-4 h-4" />
						Rooms
					</Button>
				</div>

				{/* Users Tab */}
				{activeTab === "users" && (
					<div className="space-y-4">
						{/* Search Bar */}
						<Card>
							<CardContent className="p-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<input
										type="text"
										placeholder="Search by email or username..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-border/50 rounded-lg bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Users List */}
						<Card>
							<CardContent className="p-0">
								{loading ? (
									<div className="p-8 text-center text-muted-foreground">
										<RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
										Loading users...
									</div>
								) : filteredUsers.length === 0 ? (
									<div className="p-8 text-center text-muted-foreground">
										<Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
										{searchQuery ? "No users found" : "No users registered"}
									</div>
								) : (
									<div className="divide-y divide-border/50">
										{filteredUsers.map((userItem) => (
											<div
												key={userItem.email}
												className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4"
											>
												<div className="flex items-center gap-4 flex-1 min-w-0">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
														<span className="text-sm font-semibold text-primary">
															{userItem.username.charAt(0).toUpperCase()}
														</span>
													</div>
													<div className="min-w-0 flex-1">
														<p className="font-medium truncate">{userItem.username}</p>
														<p className="text-sm text-muted-foreground truncate">{userItem.email}</p>
													</div>
													<div className="flex items-center gap-2 flex-shrink-0">
														{/* Credits Badge */}
														{editingCreditsEmail === userItem.email ? (
															<div className="flex items-center gap-1">
																<input
																	type="number"
																	min="0"
																	value={tempCredits}
																	onChange={(e) => setTempCredits(e.target.value)}
																	className="w-16 px-2 py-1 text-xs border border-primary/50 rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
																	onKeyDown={(e) => {
																		if (e.key === "Enter") saveCredits(userItem.email);
																		if (e.key === "Escape") cancelEditingCredits();
																	}}
																	autoFocus
																/>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => saveCredits(userItem.email)}
																	className="h-6 w-6 p-0 text-green-500 hover:text-green-600 hover:bg-green-500/10"
																>
																	<Check className="w-3 h-3" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={cancelEditingCredits}
																	className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
																>
																	<X className="w-3 h-3" />
																</Button>
															</div>
														) : (
															<button
																onClick={() => startEditingCredits(userItem.email, userItem.credits ?? 10)}
																className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
																	(userItem.credits ?? 10) >= 3
																		? "bg-teal-500/20 text-teal-500 hover:bg-teal-500/30"
																		: "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
																}`}
															>
																<Coins className="w-3 h-3" />
																{userItem.credits ?? 10}
															</button>
														)}
														<span
															className={`px-2 py-1 rounded-full text-xs font-medium ${
																userItem.role === "admin"
																	? "bg-purple-500/20 text-purple-500"
																	: "bg-muted text-muted-foreground"
															}`}
														>
															{userItem.role}
														</span>
														<span
															className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
																userItem.status === "ACTIVE"
																	? "bg-green-500/20 text-green-500"
																	: "bg-red-500/20 text-red-500"
															}`}
														>
															{userItem.status === "ACTIVE" ? (
																<ShieldCheck className="w-3 h-3" />
															) : (
																<Ban className="w-3 h-3" />
															)}
															{userItem.status}
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2 flex-shrink-0">
													{userItem.status === "ACTIVE" ? (
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateUserStatus(userItem.email, "BLOCKED")}
															className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
														>
															<Ban className="w-4 h-4" />
														</Button>
													) : (
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateUserStatus(userItem.email, "ACTIVE")}
															className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
														>
															<ShieldCheck className="w-4 h-4" />
														</Button>
													)}
													<Button
														variant="outline"
														size="sm"
														onClick={() => updateUserRole(userItem.email, userItem.role === "admin" ? "user" : "admin")}
													>
														<UserCog className="w-4 h-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => deleteUser(userItem.email)}
														className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Rooms Tab */}
				{activeTab === "rooms" && (
					<div className="space-y-4">
						{/* Actions */}
						{selectedRooms.size > 0 && (
							<Card className="border-primary/50 bg-primary/5">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<p className="text-sm">
											<span className="font-medium">{selectedRooms.size}</span> room(s) selected
										</p>
										<Button variant="destructive" size="sm" onClick={deleteSelectedRooms}>
											<Trash2 className="w-4 h-4 mr-2" />
											Delete Selected
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Rooms List */}
						<Card>
							<CardContent className="p-0">
								{loading ? (
									<div className="p-8 text-center text-muted-foreground">
										<RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
										Loading rooms...
									</div>
								) : rooms.length === 0 ? (
									<div className="p-8 text-center text-muted-foreground">
										<MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
										No rooms found
									</div>
								) : (
									<div className="divide-y divide-border/50">
										{rooms.map((room) => (
											<div
												key={room._id}
												className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4"
											>
												<div className="flex items-center gap-4 flex-1 min-w-0">
													<input
														type="checkbox"
														checked={selectedRooms.has(room.roomId)}
														onChange={() => toggleRoomSelection(room.roomId)}
														className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary"
													/>
													<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
														<MessageSquare className="w-5 h-5 text-accent" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="font-medium truncate">{room.name}</p>
														<p className="text-sm text-muted-foreground">ID: {room.roomId}</p>
													</div>
													<div className="flex items-center gap-2 flex-shrink-0">
														<span className="text-sm text-muted-foreground">
															{room.messageCount} messages
														</span>
													</div>
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														if (confirm(`Delete all messages in room ${room.name}?`)) {
															adminApi.deleteRoom(room.roomId).then((response) => {
																if (response.success) {
																	toast.success("Room messages deleted");
																	fetchRooms();
																} else {
																	toast.error(response.error || "Failed to delete room");
																}
															});
														}
													}}
													className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default Admin;
