import { NavLink } from "react-router";
import {
  MessageSquare,
  Star,
  Users,
  NotebookPen,
  Sparkles,
  Info,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { label: "Home", to: "/", icon: MessageSquare },
  { label: "Favorites", to: "favorites", icon: Star },
  { label: "Groups", to: "groups", icon: Users },
  { label: "AI Summary", to: "ai-summary", icon: Sparkles },
  { label: "Notes", to: "notes", icon: NotebookPen },
  { label: "About", to: "about", icon: Info },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        isActive ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
