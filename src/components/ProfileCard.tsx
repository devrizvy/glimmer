import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Bell,
	ChevronUp,
	HelpCircle,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const ProfileCard = () => {
	const { logout, user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};
	return (
		<div className="mb-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="w-full h-auto p-3 justify-start hover:bg-sidebar-accent/30 group transition-all duration-300"
					>
						<div className="flex items-center gap-3 w-full">
							<div className="relative">
								<Avatar className="h-10 w-10 avatar-ring ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
									<AvatarImage
										src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
										alt="Profile"
									/>
									<AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">
										{user?.username?.charAt(0).toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div className="status-online absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar"></div>
							</div>
							<div className="flex-1 text-left">
								<div className="flex items-center gap-1">
									<p className="text-sm font-medium text-sidebar-foreground">
										{user?.username || "Guest User"}
									</p>
									<ChevronUp className="w-3 h-3 text-sidebar-foreground/50 group-hover:rotate-180 transition-transform duration-300" />
								</div>
								<p className="text-xs text-sidebar-foreground/60 font-light">
									{user?.email || "Not logged in"}
								</p>
							</div>
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					side="top"
					className="profile-dropdown w-56"
				>
					<DropdownMenuLabel className="text-xs text-sidebar-foreground/60 font-normal">
						My Account
					</DropdownMenuLabel>
					<DropdownMenuSeparator className="bg-sidebar-border/50" />
					<DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer">
						<User className="mr-3 h-4 w-4" />
						<span className="text-sm">Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer">
						<Settings className="mr-3 h-4 w-4" />
						<span className="text-sm">Settings</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer">
						<Bell className="mr-3 h-4 w-4" />
						<span className="text-sm">Notifications</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer">
						<HelpCircle className="mr-3 h-4 w-4" />
						<span className="text-sm">Help & Support</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-sidebar-border/50" />
					<DropdownMenuItem
						onClick={handleLogout}
						className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer"
					>
						<LogOut className="mr-3 h-4 w-4" />
						<span className="text-sm">Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default ProfileCard;
