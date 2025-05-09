
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Settings, 
  FileText, 
  PieChart,
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const DashboardSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="bg-white dark:bg-healthmate-700 rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="w-10 h-10 bg-healthmate-100 dark:bg-healthmate-600 rounded-full flex items-center justify-center">
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user?.name || "User"} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-healthmate-500 dark:text-healthmate-300 font-medium">
              {user?.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-medium text-healthmate-700 dark:text-white truncate">
            {user?.name || "User"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2",
                pathname === item.href 
                  ? "bg-healthmate-50 dark:bg-healthmate-600 text-healthmate-700 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-healthmate-600/50"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
