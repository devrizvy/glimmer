import { NavLink } from "react-router";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import {
  Star,
  Users,
  NotebookPen,
  Sparkles,
  Info,
  Waves,
  Feather,
  User,
  Settings,
  LogOut,
  ChevronUp,
  Bell,
  HelpCircle,
  MessageCircle,
  UserPlus,
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

const navigationItems = [
  {
    label: "Chats",
    to: "/chat",
    icon: MessageCircle,
    description: "One-on-one conversations",
    badge: "2"
  },
  {
    label: "Users",
    to: "/chat/users",
    icon: UserPlus,
    description: "Find and connect with users",
    badge: null
  },
  {
    label: "Classroom",
    to: "/group",
    icon: Users,
    description: "Community circles",
    badge: null
  },
  {
    label: "Favorites",
    to: "/favorites",
    icon: Star,
    description: "Cherished moments",
    badge: "3"
  },
  {
    label: "AI Summary",
    to: "/ai-summary",
    icon: Sparkles,
    description: "Wisdom insights",
    badge: "New"
  },
  {
    label: "Notes",
    to: "/notes",
    icon: NotebookPen,
    description: "Personal reflections",
    badge: "12"
  },
  {
    label: "About",
    to: "/about",
    icon: Info,
    description: "The zen path",
    badge: null
  },
];

export function AppSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              Navigation
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
                          ? 'text-primary font-medium active zen-menu-item'
                          : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
                      }`
                    }
                    style={{
                      animationDelay: `${index * 100}ms`
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
                          <span className="text-sm font-light tracking-wide">{item.label}</span>
                          {item.badge && (
                            <span className="zen-badge">
                              {item.badge}
                            </span>
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
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="status-online absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-sidebar-foreground">
                          {user?.username || 'Guest User'}
                        </p>
                        <ChevronUp className="w-3 h-3 text-sidebar-foreground/50 group-hover:rotate-180 transition-transform duration-300" />
                      </div>
                      <p className="text-xs text-sidebar-foreground/60 font-light">
                        {user?.email || 'Not logged in'}
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

          {/* Zen Quote */}
          <div className="flex items-center gap-2 text-sidebar-foreground/50 text-xs">
            <Feather className="w-4 h-4 flex-shrink-0" />
            <p className="font-light italic leading-relaxed">
              "In the stillness of mind, wisdom whispers"
            </p>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
