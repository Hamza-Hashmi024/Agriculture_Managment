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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

// Add `roles` array: "admin" or "user" or both
const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, roles: ["admin", "user", "manager"] },
  { title: "Farmers", url: "/farmers", icon: Users, roles: ["admin", "user", "manager"] },
  { title: "Advances", url: "/advances", icon: CreditCard, roles: ["admin", "user", "manager"] },
  { title: "Sales/Lots", url: "/sales", icon: Wheat, roles: ["admin", "user", "manager"] },
  { title: "Buyers", url: "/buyers", icon: ShoppingCart, roles: ["admin", "user", "manager"] },
  { title: "Receivables", url: "/receivables", icon: Receipt, roles: ["admin", "user", "manager"] },
  { title: "Vendors", url: "/vendors", icon: Building2, roles: ["admin"] },
  { title: "Payables", url: "/payables", icon: TrendingDown, roles: ["admin"] },
  { title: "Expenses", url: "/expenses", icon: Wallet, roles: ["admin", "user", "manager"] },
  { title: "Employer", url: "/employees", icon: Users ,  roles: ["admin", "user", "manager"]},
  { title: "Cash/Bank", url: "/cash-bank", icon: Banknote, roles: ["admin"] },
];

const reportsItems = [
  { title: "Reports", url: "/reports", icon: BarChart3, roles: ["admin"] }, // admin-only
  { title: "Missing Docs", url: "/missing-docs", icon: FolderMinus, roles: ["admin"] }, // admin-only
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings, roles: ["admin"] }, // admin-only
  { title: "Theme Settings", url: "/theme-settings", icon: Settings, roles: ["admin", "user"] },
];

export function AppSidebar() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
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

  const renderItems = (items: typeof navigationItems) =>
    items
      .filter((item) => item.roles.includes(user?.role || "user"))
      .map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClassName(
                item.url
              )}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ));

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
            <SidebarMenu>{renderItems(navigationItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(reportsItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(settingsItems)}</SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}