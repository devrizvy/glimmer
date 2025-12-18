import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
	Users,
	NotebookPen,
	Sparkles,
	Waves,
	Feather,
	Settings,
	HelpCircle,
	MessageCircle,
	UserPlus,
	BookOpen,
	BarChart3,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarHeader,
	SidebarFooter,
} from "@/components/ui/sidebar";
import ProfileCard from "./ProfileCard";

const navigationItems = [
	{
		label: "Chats",
		to: "/chat",
		icon: MessageCircle,
		description: "One-on-one conversations",
		badge: "2",
	},
	{
		label: "People",
		to: "/chat/users",
		icon: UserPlus,
		description: "Find and connect with users",
		badge: null,
	},
	{
		label: "Classroom",
		to: "/group",
		icon: Users,
		description: "Community circles",
		badge: null,
	},
	// {
	//   label: "Favorites",
	//   to: "/favorites",
	//   icon: Star,
	//   description: "Cherished moments",
	//   badge: "3"
	// },
];
const Tools = [
	{
		label: "AI Summary",
		to: "/ai-summary",
		icon: Sparkles,
		description: "Wisdom insights",
		badge: "New",
	},
	{
		label: "Notes",
		to: "/notes",
		icon: NotebookPen,
		description: "Personal reflections",
		badge: "12",
	},
];
const Support = [
	{
		label: "Settings",
		to: "/settings",
		icon: Settings,
		description: "Customize your experience",
		badge: null,
	},
	{
		label: "Docs",
		to: "/docs",
		icon: BookOpen,
		description: "Documentation & guides",
		badge: null,
	},
	{
		label: "FAQ",
		to: "/faq",
		icon: HelpCircle,
		description: "Common questions",
		badge: null,
	},
	{
		label: "Overview",
		to: "/overview",
		icon: BarChart3,
		description: "Platform analytics",
		badge: null,
	},
];

export function AppSidebar() {
	return (
		<Sidebar className="zen-sidebar border-r border-sidebar-border/50">
			<div className="zen-sidebar-content h-full flex flex-col">
				{/* Header with zen branding */}
				<SidebarHeader className="p-6 pb-4">
					<div className="flex items-center gap-3 mb-2">
						<div className="relative">
							<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
								<Waves className="w-6 h-6 text-primary zen-icon" />
							</div>
							<div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/60 animate-pulse"></div>
						</div>
						<div>
							<h1 className="zen-title text-lg font-light">zenWhisper</h1>
							<p className="text-sidebar-foreground/60 text-xs font-light tracking-wide">
								Find your inner peace
							</p>
						</div>
					</div>
					<div className="zen-separator mt-4"></div>
				</SidebarHeader>

				{/* Navigation Menu */}
				<SidebarContent className="flex-1 px-4">
					<SidebarGroup>
						<SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-light tracking-widest uppercase mb-4">
							Workspace
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="space-y-1">
								{navigationItems.map((item, index) => (
									<SidebarMenuItem key={item.label}>
										<NavLink
											to={item.to}
											className={({ isActive }) =>
												`zen-menu-item flex items-center gap-4 w-full relative h-12 px-4 border border-transparent transition-all duration-300 ${
													isActive
														? "text-primary font-medium active zen-menu-item"
														: "text-sidebar-foreground/80 hover:text-sidebar-foreground"
												}`
											}
											style={{
												animationDelay: `${index * 100}ms`,
											}}
										>
											{({ isActive }) => (
												<>
													<span className="zen-icon relative">
														<item.icon className="w-5 h-5 transition-all duration-300" />
														{isActive && (
															<div className="absolute inset-0 w-5 h-5 bg-primary/20 rounded-full blur-md"></div>
														)}
													</span>
													<div className="flex-1 flex items-center justify-between">
														<span className="text-sm font-light tracking-wide">
															{item.label}
														</span>
														{item.badge && (
															<span className="zen-badge">{item.badge}</span>
														)}
													</div>
													{isActive && (
														<div className="absolute right-2 w-1 h-6 bg-primary rounded-full"></div>
													)}
												</>
											)}
										</NavLink>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-light tracking-widest uppercase mb-4">
							Tools
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="space-y-1">
								{Tools.map((item, index) => (
									<SidebarMenuItem key={item.label}>
										<NavLink
											to={item.to}
											className={({ isActive }) =>
												`zen-menu-item flex items-center gap-4 w-full relative h-12 px-4 border border-transparent transition-all duration-300 ${
													isActive
														? "text-primary font-medium active zen-menu-item"
														: "text-sidebar-foreground/80 hover:text-sidebar-foreground"
												}`
											}
											style={{
												animationDelay: `${index * 100}ms`,
											}}
										>
											{({ isActive }) => (
												<>
													<span className="zen-icon relative">
														<item.icon className="w-5 h-5 transition-all duration-300" />
														{isActive && (
															<div className="absolute inset-0 w-5 h-5 bg-primary/20 rounded-full blur-md"></div>
														)}
													</span>
													<div className="flex-1 flex items-center justify-between">
														<span className="text-sm font-light tracking-wide">
															{item.label}
														</span>
														{item.badge && (
															<span className="zen-badge">{item.badge}</span>
														)}
													</div>
													{isActive && (
														<div className="absolute right-2 w-1 h-6 bg-primary rounded-full"></div>
													)}
												</>
											)}
										</NavLink>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-light tracking-widest uppercase mb-4">
							Support
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="space-y-1">
								{Support.map((item, index) => (
									<SidebarMenuItem key={item.label}>
										<NavLink
											to={item.to}
											className={({ isActive }) =>
												`zen-menu-item flex items-center gap-4 w-full relative h-12 px-4 border border-transparent transition-all duration-300 ${
													isActive
														? "text-primary font-medium active zen-menu-item"
														: "text-sidebar-foreground/80 hover:text-sidebar-foreground"
												}`
											}
											style={{
												animationDelay: `${index * 100}ms`,
											}}
										>
											{({ isActive }) => (
												<>
													<span className="zen-icon relative">
														<item.icon className="w-5 h-5 transition-all duration-300" />
														{isActive && (
															<div className="absolute inset-0 w-5 h-5 bg-primary/20 rounded-full blur-md"></div>
														)}
													</span>
													<div className="flex-1 flex items-center justify-between">
														<span className="text-sm font-light tracking-wide">
															{item.label}
														</span>
														{item.badge && (
															<span className="zen-badge">{item.badge}</span>
														)}
													</div>
													{isActive && (
														<div className="absolute right-2 w-1 h-6 bg-primary rounded-full"></div>
													)}
												</>
											)}
										</NavLink>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				{/* Profile Section */}
				<SidebarFooter className="p-4 mt-auto border-t border-sidebar-border/30">
					<div className="zen-separator mb-4"></div>

					{/* User Profile */}
					<ProfileCard></ProfileCard>

					{/* Zen Quote */}
					<div className="flex items-center gap-2 text-sidebar-foreground/50 text-xs">
						<Feather className="w-4 h-4 " />
						<p className="font-light italic leading-relaxed">
							"In the stillness of mind, wisdom whispers"
						</p>
					</div>
				</SidebarFooter>
			</div>
		</Sidebar>
	);
}
