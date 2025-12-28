import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
  Shield,
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
    badge: "New",
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
    label: "Admin",
    to: "/admin",
    icon: Shield,
    description: "Admin panel",
    badge: null,
    adminOnly: true,
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
    adminOnly: true,
  },
];

export function AppSidebar() {
  const { user } = useAuth();

  // Filter Support items based on user role
  const filteredSupport = Support.filter((item) => {
    if ((item as any).adminOnly) {
      return user?.role === "admin";
    }
    return true;
  });

  return (
    <Sidebar className="mira-sidebar border-r">
      <div className="mira-sidebar-content h-full flex flex-col">
        {/* Header with branding */}
        <SidebarHeader className="p-6 pb-4">
          <NavLink to={"/"}>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mira-glass">
                  <Waves className="w-6 h-6 text-primary mira-icon" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary status-online"></div>
              </div>
              <div>
                <h1 className="mira-title text-lg font-semibold">Glimmer</h1>
                <p className="text-sidebar-foreground/60 text-xs font-medium tracking-wide">
                  Where ideas illuminate together
                </p>
              </div>
            </div>
          </NavLink>
          <div className="mira-separator mt-4"></div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <SidebarContent className="flex-1 px-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium tracking-wider uppercase mb-3">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item, index) => (
                  <SidebarMenuItem key={item.label}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `mira-menu-item flex items-center gap-3 w-full relative h-11 px-3 rounded-lg border transition-all duration-200 ${
                          isActive
                            ? "active"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`
                      }
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <>
                        <span className="mira-icon relative">
                          <item.icon className="w-4 h-4" />
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="mira-badge text-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium tracking-wider uppercase mb-3">
              Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {Tools.map((item, index) => (
                  <SidebarMenuItem key={item.label}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `mira-menu-item flex items-center gap-3 w-full relative h-11 px-3 rounded-lg border transition-all duration-200 ${
                          isActive
                            ? "active"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`
                      }
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <>
                        <span className="mira-icon relative">
                          <item.icon className="w-4 h-4" />
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="mira-badge text-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium tracking-wider uppercase mb-3">
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {filteredSupport.map((item, index) => (
                  <SidebarMenuItem key={item.label}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `mira-menu-item flex items-center gap-3 w-full relative h-11 px-3 rounded-lg border transition-all duration-200 ${
                          isActive
                            ? "active"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`
                      }
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <>
                        <span className="mira-icon relative">
                          <item.icon className="w-4 h-4" />
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="mira-badge text-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Profile Section */}
        <SidebarFooter className="p-4 mt-auto border-t">
          <div className="mira-separator mb-4"></div>

          {/* User Profile */}
          <ProfileCard></ProfileCard>

          {/* Quote */}
          <div className="flex items-start gap-2 text-muted-foreground text-xs mt-4">
            <Feather className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-medium italic leading-relaxed">
              "Where ideas illuminate together"
            </p>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
