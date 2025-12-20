import { useState, useEffect } from "react";
import { ArrowLeft, Search, MessageCircle, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useUsers from "../../hooks/useUsers";

const UsersList = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");

	// Use TanStack Query for users
	const { data: users, refetch, isLoading, error } = useUsers();

	const handleUserSelect = (selectedUser: any) => {
		navigate(`/chat/${selectedUser.email}`, {
			state: {
				partnerUsername: selectedUser.username || selectedUser.name || selectedUser.email,
				partnerEmail: selectedUser.email,
			},
		});
	};

	// Filter out current user from the list
	const filteredUsers = (Array.isArray(users) ? users : []).filter((u) => u.email !== user?.email);

	// Further filter by search query
	const searchFilteredUsers = filteredUsers.filter(
		(user) =>
			(user.username || user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
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

	return (
		<div className="min-h-screen mira-content">
			<div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
				{/* Header */}
				<div className="p-6 border-b border-sidebar-border/50 mira-glass  rounded-b-2xl">
					<div className="flex items-center gap-3 mb-4">
						<button
							onClick={() => navigate("/chat")}
							className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all"
						>
							<ArrowLeft size={20} />
						</button>
						<div className="relative">
							<div className="w-12 h-12 rounded-xl mira-glass flex items-center justify-center zen-float">
								<UserCircle
									className="w-6 h-6"
									style={{ color: "oklch(0.55 0.08 145)" }}
								/>
							</div>
						</div>
						<div>
							<h2 className="mira-title text-xl">Find People</h2>
							<p className="text-xs text-foreground/60 font-light tracking-wide">
								Connect with new people
							</p>
						</div>
					</div>

					{/* Search */}
					<div className="relative">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
						<input
							type="text"
							placeholder="Search by name or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="mira-search w-full pl-12 pr-4 py-3 text-foreground placeholder-sidebar-foreground/40"
						/>
					</div>
				</div>

				{/* Users List */}
				<div className="flex-1 overflow-y-auto p-6">
					{error ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="w-16 h-16 mx-auto mb-4 mira-glass rounded-2xl flex items-center justify-center">
									<span className="text-2xl">⚠️</span>
								</div>
								<h3 className="mira-title text-lg mb-2">Failed to load users</h3>
								<p className="text-sm text-foreground/70 mb-6">
									Something went wrong. Please try again.
								</p>
								<button
									onClick={() => refetch()}
									className="mira-action-btn px-6 py-3 text-primary-foreground rounded-xl transition-all"
									style={{
										background: "oklch(0.55 0.08 145)",
										boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
									}}
								>
									Retry
								</button>
							</div>
						</div>
					) : searchFilteredUsers.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center max-w-md">
								<div className="w-20 h-20 mx-auto mb-6 mira-glass rounded-2xl flex items-center justify-center zen-float">
									<UserCircle
										className="w-8 h-8"
										style={{ color: "oklch(0.55 0.08 145)" }}
									/>
								</div>
								<h3 className="mira-title text-xl mb-4">
									{searchQuery
										? "No users found"
										: isLoading
											? "Loading..."
											: "No other users available"}
								</h3>
								<p className="text-sm text-foreground/70 leading-relaxed">
									{searchQuery
										? "Try different search terms"
										: "Check back later for more users"}
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-4 max-w-4xl mx-auto">
							{searchFilteredUsers.map((user, index) => (
								<div
									key={user._id}
									onClick={() => handleUserSelect(user)}
									className="mira-glass rounded-2xl p-5 hover:scale-[1.02] cursor-pointer transition-all animate-fadeIn group"
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<div className="flex items-center gap-4">
										<div className="relative">
											<div className="w-14 h-14 rounded-full mira-glass flex items-center justify-center border-2 border-sidebar-border">
												<span
													className="text-lg font-semibold"
													style={{ color: "oklch(0.55 0.08 145)" }}
												>
													{(user.username || user.name || user.email.charAt(0)).charAt(0).toUpperCase()}
												</span>
											</div>
											<div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-sidebar animate-pulse"></div>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h3 className="font-semibold text-foreground truncate">
													{user.username || user.name || user.email}
												</h3>
												<span
													className="text-xs px-3 py-1 rounded-full font-medium"
													style={{
														backgroundColor: "oklch(0.55 0.08 145 / 0.2)",
														color: "oklch(0.55 0.08 145)",
													}}
												>
													Available
												</span>
											</div>
											<p className="text-sm text-foreground/70 truncate">
												{user.email}
											</p>
										</div>

										<div className="flex items-center gap-2">
											<button className="p-3 mira-glass rounded-xl hover:scale-110 transition-all group-hover:opacity-100 opacity-0">
												<MessageCircle
													size={18}
													style={{ color: "oklch(0.55 0.08 145)" }}
												/>
											</button>
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

export default UsersList;
