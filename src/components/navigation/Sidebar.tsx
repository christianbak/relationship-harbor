
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  onToggle: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}

const NavItem = ({ icon, label, to, end = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-md transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive
            ? "bg-primary text-white font-medium"
            : "text-sidebar-foreground"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center">
            <span className="text-white font-semibold text-lg">CM</span>
          </div>
          <h1 className="text-lg font-semibold">CRM App</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          <NavItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            to="/dashboard"
            end
          />
          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Customers"
            to="/customers"
          />
          <NavItem
            icon={<FileText className="h-5 w-5" />}
            label="Documents"
            to="/documents"
          />
          <NavItem
            icon={<Calendar className="h-5 w-5" />}
            label="Calendar"
            to="/calendar"
          />
        </div>
        
        <div className="mt-8">
          <p className="px-4 text-xs font-medium uppercase text-gray-400 mb-2">
            Configuration
          </p>
          <div className="space-y-1">
            <NavItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              to="/settings"
            />
            <NavItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
              to="/support"
            />
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t">
        <div className="bg-sidebar-accent rounded-md p-3">
          <p className="text-sm font-medium">Need help?</p>
          <p className="text-xs text-gray-500 mt-1">
            Check our documentation or contact support
          </p>
          <button className="mt-2 text-xs text-primary font-medium">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
