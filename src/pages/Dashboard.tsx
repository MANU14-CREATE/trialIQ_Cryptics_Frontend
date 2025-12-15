import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Beaker,
  TrendingUp,
  Activity,
  CheckCircle2,
  Briefcase,
  Home,
} from "lucide-react";
import { UserRole } from "@/types/user";
import { DefaultDashboard } from "@/components/dashboards/DefaultDashboard";
import { OrganizationsDashboard } from "@/components/dashboards/OrganizationsDashboard";
import { SponsorsDashboard } from "@/components/dashboards/SponsorsDashboard";
import { PracticesDashboard } from "@/components/dashboards/PracticesDashboard";
import { TrialsDashboard } from "@/components/dashboards/TrialsDashboard";
import { DASHBOARD_API } from "@/services/apiCalls";

type DashboardModule = "default" | "organizations" | "sponsors" | "practices" | "trails";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<UserRole>("super-admin");
  const [userName, setUserName] = useState("Demo User");
  const [selectedModule, setSelectedModule] = useState<DashboardModule>("default");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({})
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getUser();

        if (!user) return;
        console.log("----", user)

        setUserName(user.email);
        setUserRole(user.role as UserRole);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const dashboardModules = [
    {
      id: "default" as DashboardModule,
      label: "Overview",
      icon: Home,
      gradient: "from-primary via-primary-light to-primary",
      iconColor: "text-primary"
    },
    {
      id: "organizations" as DashboardModule,
      label: "Organizations",
      icon: Building2,
      gradient: "from-info via-blue-400 to-info",
      iconColor: "text-info"
    },
    {
      id: "sponsors" as DashboardModule,
      label: "Sponsors",
      icon: Briefcase,
      gradient: "from-success via-emerald-400 to-success",
      iconColor: "text-success"
    },
    {
      id: "practices" as DashboardModule,
      label: "Practices",
      icon: Activity,
      gradient: "from-warning via-amber-400 to-warning",
      iconColor: "text-warning"
    },
    {
      id: "trails" as DashboardModule,
      label: "Trials",
      icon: Beaker,
      gradient: "from-purple-500 via-purple-400 to-purple-600",
      iconColor: "text-purple-500"
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    DASHBOARD_API({
      "auth_token": "UirmCXEy4A"
    }, (res: any) => {
      if (res) {
        setData(res);
      }
    })
  };
  useEffect(() => {
    setLoading(false)
  }, [data]);
  const renderModuleDashboard = () => {
    switch (selectedModule) {
      case "organizations":
        return <OrganizationsDashboard propData={data} />;
      case "sponsors":
        return <SponsorsDashboard propData={data} />;
      case "practices":
        return <PracticesDashboard propData={data} />;
      case "trails":
        return <TrialsDashboard propData={data} />;
      default:
        return <DefaultDashboard propData={data} loading={loading} />;
    }
  };

  const renderRoleSpecificDashboard = () => {
    switch (userRole) {
      case "multi-site-management":
        return <OrganizationsDashboard propData={data} />;
      case "sponsor":
        return (
          <>
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="My Trial" value="15" subtitle="Active clinical trial" icon={Beaker} />
              <MetricCard title="Matched Sites" value="64" subtitle="Eligible locations" icon={Building2} />
              <MetricCard title="Enrolled Patients" value="892" subtitle="Across all trial" icon={Users} />
              <MetricCard title="Completion Rate" value="76%" subtitle="Trial progress" icon={TrendingUp} />
            </div>
          </>
        );
      case "site":
        return (
          <>
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Active Trial" value="8" subtitle="At this site" icon={Beaker} />
              <MetricCard title="Patients" value="124" subtitle="Total enrolled" icon={Users} />
              <MetricCard title="Readiness Score" value="92%" subtitle="Site enablement" icon={CheckCircle2} />
              <MetricCard title="Revenue" value="$284k" subtitle="Projected monthly" icon={TrendingUp} />
            </div>
          </>
        );
      case "provider":
        return (
          <>
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="My Trial" value="5" subtitle="Assigned trial" icon={Beaker} />
              <MetricCard title="My Patients" value="32" subtitle="Under my care" icon={Users} />
              <MetricCard title="Active" value="28" subtitle="Currently enrolled" icon={Activity} />
              <MetricCard title="Completed" value="4" subtitle="Trial completions" icon={CheckCircle2} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar userRole={userRole} userName={userName} />
        <div className="flex flex-col flex-1">
          <header className="top-0 z-10 sticky flex items-center gap-4 bg-background px-6 border-b h-16">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="font-semibold text-2xl">Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {userRole ? (
              <>
                {/* <div className="mb-6">
                  <h2 className="bg-clip-text bg-gradient-primary mb-6 font-bold text-transparent text-2xl">Select Dashboard Module</h2>
                  <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-5">
                    {dashboardModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <Card
                          key={module.id}
                          className={`group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden ${selectedModule === module.id
                            ? "ring-4 ring-primary shadow-glow scale-105"
                            : "hover:shadow-xl"
                            }`}
                          onClick={() => setSelectedModule(module.id)}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                          <CardContent className="relative pt-8 pb-6">
                            <div className="flex flex-col items-center gap-4">
                              <div className={`relative p-5 rounded-2xl bg-gradient-to-br ${module.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                <Icon className="w-8 h-8 text-white" />
                                {selectedModule === module.id && (
                                  <div className="-top-1 -right-1 absolute flex justify-center items-center bg-white shadow-md rounded-full w-4 h-4">
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                  </div>
                                )}
                              </div>
                              <span className={`text-sm font-semibold text-center transition-colors duration-300 ${selectedModule === module.id ? module.iconColor : "text-foreground"
                                }`}>
                                {module.label}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div> */}
                <div className="mb-6">
                  <h2 className="mb-4 font-semibold text-foreground text-lg">Select Dashboard Module</h2>
                  <div className="flex flex-wrap gap-2">
                    {dashboardModules.map((module) => {
                      const Icon = module.icon;
                      const isSelected = selectedModule === module.id;
                      return (
                        <Button
                          key={module.id}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`gap-2 ${isSelected ? "" : "text-muted-foreground"}`}
                          onClick={() => setSelectedModule(module.id)}
                        >
                          <Icon className="w-4 h-4" />
                          {module.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-6">
                  {renderModuleDashboard()}
                </div>
              </>
            ) : (
              renderRoleSpecificDashboard()
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
