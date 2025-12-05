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
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { UserRole } from "@/types/user";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { getLocalStorage } from "@/services/localStorage";

interface AppSidebarProps {
  userRole: UserRole;
  userName: string;
}

const getSidebarItems = (role: UserRole) => {
  const ALL_MENU_ITEMS = [
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

    // {
    //   key: "patients", title: "Patients", icon: Users, subItems: [
    //     { title: "Dashboard", url: "/patients/dashboard" },
    //     { title: "View All", url: "/patients" }
    //   ]
    // },

    {
      key: "providers", title: "Providers", icon: UserCircle, subItems: [
        // { title: "Dashboard", url: "/providers/dashboard" },
        { title: "View All", url: "/providers" }
      ]
    },

    { key: "settings", title: "Settings", url: "/settings", icon: Settings },
  ];
  function generateSidebar(role: string, permissions: any[]) {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ];

    // SPECIAL CASE — SUPER ADMIN
    if (role === "super-admin") {
      return [
        ...baseItems,
        ...ALL_MENU_ITEMS.filter((item) => item.key !== "dashboard") // add everything except duplicate dashboard
      ];
    }
    const allowedPaths = permissions
      .filter((p) => p.can_view)
      .map((p) => p.path.toLowerCase());

    const matchedMenuItems = ALL_MENU_ITEMS.filter((item) => {
      // direct URL match
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

  const user = getLocalStorage("auth_user_2");
  const sidebar = generateSidebar(user.name, user.permissions);
  // const baseItems = [
  //   { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  // ];
  return sidebar;
  // switch (role) {
  //   case "super-admin":
  //     return [
  //       ...baseItems,
  //       { title: "User Management", url: "/users", icon: Users },
  //       {
  //         title: "Organizations",
  //         icon: Building2,
  //         subItems: [
  //           { title: "View All", url: "/organizations" },
  //         ]
  //       },
  //       {
  //         title: "Sponsors",
  //         icon: FileText,
  //         subItems: [
  //           { title: "View All", url: "/sponsors" },
  //         ]
  //       },
  //       {
  //         title: "Sites",
  //         icon: Building2,
  //         subItems: [
  //           { title: "View All", url: "/sites" },
  //         ]
  //       },
  //       {
  //         title: "Trial",
  //         icon: Beaker,
  //         subItems: [
  //           { title: "View All", url: "/trials" },
  //         ]
  //       },
  //       {
  //         title: "Patients",
  //         icon: Users,
  //         subItems: [
  //           { title: "Dashboard", url: "/patients/dashboard" },
  //           { title: "View All", url: "/patients" },
  //         ]
  //       },
  //       {
  //         title: "Providers",
  //         icon: UserCircle,
  //         subItems: [
  //           { title: "Dashboard", url: "/providers/dashboard" },
  //           { title: "View All", url: "/providers" },
  //         ]
  //       },
  //       { title: "Settings", url: "/settings", icon: Settings },
  //     ];
  //   case "multi-site-management":
  //     return [
  //       ...baseItems,
  //       { title: "User Management", url: "/users", icon: Users },
  //       { title: "My Sites", url: "/sites", icon: Building2 },
  //       { title: "Trial", url: "/trials", icon: Beaker },
  //       { title: "Analytics", url: "/analytics", icon: LayoutDashboard },
  //     ];
  //   case "sponsor":
  //     return [
  //       ...baseItems,
  //       { title: "My Trial", url: "/trials", icon: Beaker },
  //       { title: "Matched Sites", url: "/sites", icon: Building2 },
  //       { title: "Reports", url: "/reports", icon: FileText },
  //     ];
  //   case "site":
  //     return [
  //       ...baseItems,
  //       { title: "Trial", url: "/trials", icon: Beaker },
  //       { title: "Patients", url: "/patients", icon: Users },
  //       { title: "Site Enablement", url: "/enablement", icon: Settings },
  //       { title: "Marketplace", url: "/marketplace", icon: Building2 },
  //     ];
  //   case "provider":
  //     return [
  //       ...baseItems,
  //       { title: "My Trial", url: "/trials", icon: Beaker },
  //       { title: "My Patients", url: "/patients", icon: Users },
  //     ];
  //   default:
  //     return baseItems;
  // }
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
      if ('subItems' in item) {
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

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border border-r">
      <SidebarHeader className="p-4 border-sidebar-border border-b">
        {state === "expanded" ? (
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-primary rounded-lg w-8 h-8">
              <Beaker className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">Trial IQ</span>
              <span className="text-sidebar-foreground/60 text-xs">Admin Portal</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center bg-primary mx-auto rounded-lg w-8 h-8">
            <Beaker className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {state === "expanded" && (
            <SidebarGroupLabel className="text-sidebar-foreground/60">
              {getRoleName(userRole)}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {'subItems' in item ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full">
                            <item.icon className="w-4 h-4" />
                            {state === "expanded" && (
                              <>
                                <span className="flex-1 text-left">{item.title}</span>
                                <ChevronDown className="w-4 h-4 group-data-[state=open]/collapsible:rotate-180 transition-transform duration-200" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {state === "expanded" && (
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                                    <NavLink to={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          {state === "expanded" && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
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
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-2">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-8 h-8">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sidebar-foreground text-sm truncate">{userName}</p>
                <p className="text-sidebar-foreground/60 text-xs truncate">{getRoleName(userRole)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start hover:bg-slate-900 w-full text-sidebar-foreground"
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
            className="hover:bg-sidebar-accent mx-auto text-sidebar-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
