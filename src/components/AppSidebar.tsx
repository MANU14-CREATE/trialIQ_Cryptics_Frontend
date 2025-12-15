import { useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Beaker,
  UserCircle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { UserRole } from "@/types/user";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getLocalStorage } from "@/services/localStorage";
import { LucideIcon } from "lucide-react";

interface AppSidebarProps {
  userRole: UserRole;
  userName: string;
}

interface SubItem {
  title: string;
  url: string;
}

interface MenuItem {
  key?: string;
  title: string;
  url?: string;
  icon: LucideIcon;
  subItems?: SubItem[];
}

const ALL_MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { key: "users", title: "User Management", url: "/users", icon: Users },
  {
    key: "organizations", title: "Organizations", icon: Building2, subItems: [
      { title: "View All", url: "/organizations" }
    ]
  },
  {
    key: "sponsors", title: "Sponsors", icon: FileText, subItems: [
      { title: "View All", url: "/sponsors" }
    ]
  },
  {
    key: "sites", title: "Sites", icon: Building2, subItems: [
      { title: "View All", url: "/sites" }
    ]
  },
  {
    key: "trials", title: "Trials", icon: Beaker, subItems: [
      { title: "View All", url: "/trials" }
    ]
  },
  // { key: "patient-management", title: "Patient Management", url: "/patient-management", icon: ClipboardList },
  {
    key: "providers", title: "Providers", icon: UserCircle, subItems: [
      { title: "View All", url: "/providers" }
    ]
  },
  // { key: "settings", title: "Settings", url: "/settings", icon: Settings },
];

const getSidebarItems = (role: UserRole): MenuItem[] => {
  const baseItems: MenuItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  ];

  function generateSidebar(roleName: string, permissions: any[]): MenuItem[] {
    // SPECIAL CASE — SUPER ADMIN
    if (roleName === "super-admin") {
      return [
        ...baseItems,
        ...ALL_MENU_ITEMS.filter((item) => item.key !== "dashboard")
      ];
    }

    if (!permissions || !Array.isArray(permissions)) {
      return baseItems;
    }

    const allowedPaths = permissions
      .filter((p) => p.can_view)
      .map((p) => p.path?.toLowerCase());

    const matchedMenuItems = ALL_MENU_ITEMS.filter((item) => {
      // direct URL match
      if (item.url === "/patient-management" && allowedPaths.includes('/patients')) {
        return true;
      }
      if (item.url && allowedPaths.includes(item.url)) {
        return true;
      }

      // subitems match
      if (item.subItems) {
        return item.subItems.some((sub) => allowedPaths.includes(sub.url));
      }

      return false;
    });

    return [...baseItems, ...matchedMenuItems];
  }

  try {
    const user = getLocalStorage("auth_user");
    if (user?.all?.name && user?.all?.permissions) {
      return generateSidebar(user.all.name, user.all.permissions);
    }
  } catch (error) {
    console.error("Error getting sidebar items from localStorage:", error);
  }

  // Fallback to role-based menu
  switch (role) {
    case "super-admin":
      return [
        ...baseItems,
        ...ALL_MENU_ITEMS.filter((item) => item.key !== "dashboard")
      ];
    case "multi-site-management":
      return [
        ...baseItems,
        { title: "User Management", url: "/users", icon: Users },
        { title: "My Sites", url: "/sites", icon: Building2 },
        { title: "Trials", url: "/trials", icon: Beaker },
      ];
    case "sponsor":
      return [
        ...baseItems,
        { title: "My Trials", url: "/trials", icon: Beaker },
        { title: "Matched Sites", url: "/sites", icon: Building2 },
        { title: "Reports", url: "/reports", icon: FileText },
      ];
    case "site":
      return [
        ...baseItems,
        { title: "Trials", url: "/trials", icon: Beaker },
        { title: "Patients", url: "/patients", icon: Users },
        { title: "Site Enablement", url: "/enablement", icon: Settings },
      ];
    case "provider":
      return [
        ...baseItems,
        { title: "My Trials", url: "/trials", icon: Beaker },
        { title: "My Patients", url: "/patients", icon: Users },
      ];
    default:
      return baseItems;
  }
};

export function AppSidebar({ userRole, userName }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const items = getSidebarItems(userRole);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;

  // Auto-expand the module based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeModule = items.find(item => {
      if (item.subItems) {
        return item.subItems.some(sub => currentPath.startsWith(sub.url.split('/').slice(0, 2).join('/')));
      }
      return false;
    });

    if (activeModule && !openItems.includes(activeModule.title)) {
      setOpenItems(prev => [...prev, activeModule.title]);
    }
  }, [location.pathname, items]);

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleSignOut = async () => {
    await authService.signOut();
    navigate("/login");
  };

  const getRoleName = (role: UserRole) => {
    const roleNames = {
      "super-admin": "Super Admin",
      "multi-site-management": "Multi-Site Manager",
      sponsor: "Sponsor",
      site: "Site Admin",
      provider: "Provider",
    };
    return roleNames[role];
  };

  // Check if any subItem is active for a menu item
  const isMenuActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some((sub) => isActive(sub.url));
    }
    return item.url ? isActive(item.url) : false;
  };

  return (
    <Sidebar collapsible="icon" className="bg-white border-sidebar-border border-r">
      <SidebarHeader className="p-5 border-sidebar-border border-b">
        {state === "expanded" ? (
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-gradient-to-br from-accent to-primary rounded-xl w-10 h-10 text-white">
              <Beaker className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-base">Trial IQ</span>
              <span className="text-muted-foreground text-xs">Admin Portal</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center bg-gradient-to-br from-accent to-primary mx-auto rounded-xl w-10 h-10 text-white">
            <Beaker className="w-5 h-5" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.subItems ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <button
                            className={cn(
                              "flex items-center gap-3 px-4 py-3.5 rounded-xl w-full text-left transition-all duration-200",
                              isMenuActive(item)
                                ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <item.icon className="w-5 h-5" />
                            {state === "expanded" && (
                              <>
                                <span className="flex-1 font-medium text-base">{item.title}</span>
                                <ChevronDown className="w-4 h-4 group-data-[state=open]/collapsible:rotate-180 transition-transform duration-200" />
                              </>
                            )}
                          </button>
                        </CollapsibleTrigger>
                        {state === "expanded" && (
                          <CollapsibleContent>
                            <SidebarMenuSub className="space-y-1 mt-1 ml-8 pl-4 border-muted border-l-2">
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <NavLink
                                    to={subItem.url}
                                    className={cn(
                                      "block py-2 text-sm transition-colors",
                                      isActive(subItem.url)
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {subItem.title}
                                  </NavLink>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.url || "/"}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200",
                          isActive(item.url || "")
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {state === "expanded" && (
                          <>
                            <span className="flex-1 font-medium text-base">{item.title}</span>
                            {isActive(item.url || "") && <ChevronRight className="w-4 h-4" />}
                          </>
                        )}
                      </NavLink>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-sidebar-border border-t">
        {state === "expanded" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="flex justify-center items-center bg-accent/10 rounded-full w-10 h-10">
                <UserCircle className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-foreground text-sm truncate">{userName}</p>
                <p className="text-muted-foreground text-xs truncate">{getRoleName(userRole)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start hover:bg-muted w-full text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 w-4 h-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted mx-auto text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}