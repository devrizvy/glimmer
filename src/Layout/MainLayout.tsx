import { Outlet, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
	const { theme, toggleTheme } = useTheme();
	const { isAuthenticated, isLoading } = useAuth();

	// Show loading screen while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen mira-content flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return (
		<>
			<AppSidebar />
			<SidebarInset className="mira-content">
				{/* Enhanced Header */}
				<header className="mira-header flex h-16 shrink-0 items-center gap-4 px-6 border-b">
					<SidebarTrigger className="mira-action-btn text-muted-foreground hover:text-foreground p-2 rounded-lg" />

					{/* Search Bar */}
					<div className="flex-1 max-w-md">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search conversations, notes, or people..."
								className="pl-10 pr-4 mira-search"
							/>
						</div>
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="mira-action-btn text-muted-foreground hover:text-foreground"
						>
							<Plus className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="mira-action-btn text-muted-foreground hover:text-foreground relative"
						>
							<Bell className="w-4 h-4" />
							<span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							className="mira-action-btn text-muted-foreground hover:text-foreground"
						>
							{theme === 'dark' ? (
								<Sun className="w-4 h-4" />
							) : (
								<Moon className="w-4 h-4" />
							)}
						</Button>
						<div className="h-6 w-px bg-border mx-2" />
						<Button
							variant="ghost"
							size="icon"
							className="mira-action-btn text-muted-foreground hover:text-foreground"
						>
							<MoreVertical className="w-4 h-4" />
						</Button>
					</div>
				</header>

				{/* Enhanced Main Content Area */}
				<main className="flex-1 overflow-hidden flex flex-col">
					{/* Content Container with better spacing for chat */}
					<div className="flex-1 flex flex-col min-h-0 mira-scrollbar">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</>
	);
}
