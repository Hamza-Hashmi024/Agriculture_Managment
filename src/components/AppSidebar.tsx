
import {
  Home,
  Users,
  CreditCard,
  Wheat,
  ShoppingCart,
  Receipt,
  Building2,
  TrendingDown,
  Wallet,
  Banknote,
  BarChart3,
  FolderMinus,
  Settings,
  LogOut,
} from "lucide-react";
import { AuthContext } from "@/Context/AuthContext";
import { useContext } from "react";
import { NavLink, useLocation , useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Farmers", url: "/farmers", icon: Users },
  { title: "Advances", url: "/advances", icon: CreditCard },
  { title: "Sales/Lots", url: "/sales", icon: Wheat },
  { title: "Check List", url: "/check-list", icon: Receipt },
  { title: "Buyers", url: "/buyers", icon: ShoppingCart },
  { title: "Receivables", url: "/receivables", icon: Receipt },
  { title: "Vendors", url: "/vendors", icon: Building2 },
  { title: "Payables", url: "/payables", icon: TrendingDown },
  { title: "Expenses", url: "/expenses", icon: Wallet },
  { title: "Cash/Bank", url: "/cash-bank", icon: Banknote },
];

const reportsItems = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Missing Docs", url: "/missing-docs", icon: FolderMinus },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Theme Settings", url: "/theme-settings", icon: Settings },

];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50";
  };

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-6 border-b">
        <div className="text-center">
          <h1 className="text-lg font-bold text-primary">ARHTI BUSINESS</h1>
          <p className="text-sm text-muted-foreground">SYSTEM</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

  <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
