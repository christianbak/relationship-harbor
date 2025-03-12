
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
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
import { Search, MenuIcon, BellIcon, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ onToggleSidebar, sidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still log out on the client side
      logout();
      navigate("/login");
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <header className="bg-white shadow-sm z-10 border-b">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-md text-gray-700 focus:outline-none"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </motion.button>
          
          <div className="relative ml-4 md:ml-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-primary w-2 h-2 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <span className="text-sm font-medium hidden md:block">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
