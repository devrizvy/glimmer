import { Outlet } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MoreVertical,
  Moon,
  Sun,
  Bell,
} from "lucide-react";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background/90 backdrop-blur-sm">
        {/* Enhanced Header */}
        <header className="zen-header flex h-16 shrink-0 items-center gap-4 px-6">
          <SidebarTrigger className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-all duration-200" />

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/50" />
              <input
                type="text"
                placeholder="Search conversations, notes, or people..."
                className="zen-search w-full h-10 pl-10 pr-4 rounded-full text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="zen-action-btn h-9 w-9 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="zen-action-btn h-9 w-9 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="zen-action-btn h-9 w-9 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <Moon className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-sidebar-border/30 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="zen-action-btn h-9 w-9 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Enhanced Main Content Area */}
        <main className="chat-container flex-1 overflow-hidden flex flex-col">
          {/* Content Container with better spacing for chat */}
          <div className="flex-1 flex flex-col min-h-0 zen-scrollbar">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
