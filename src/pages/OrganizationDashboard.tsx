import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, TrendingUp, CalendarIcon, Filter } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface Site {
  id: string;
  name: string;
  organization_id: string;
  organization: {
    name: string;
  };
}

interface Trial {
  id: string;
  name: string;
  status: string;
  patients: Array<{
    status: string;
  }>;
}

export default function OrganizationDashboard() {
  const { userData, loading: userLoading } = useUserRole();
  const [practicesModalOpen, setPracticesModalOpen] = useState(false);
  const [trialsModalOpen, setTrialsModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // Fetch organizations with their sites (practices)
  const { data: organizations } = useQuery({
    queryKey: ["organizations-with-sites"],
    queryFn: async () => {
      const orgs = await apiService.getOrganizations();
      const sites = await apiService.getSites();
      return orgs.map(org => ({
        ...org,
        sites: sites.filter(s => s.organization_id === org.id)
      }));
    },
  });

  // Fetch all sites with organization info
  const { data: allSites } = useQuery({
    queryKey: ["all-sites-with-org", selectedOrgId, dateRange],
    queryFn: async () => {
      const sites = await apiService.getSites();
      const orgs = await apiService.getOrganizations();
      
      return sites
        .filter(site => {
          if (selectedOrgId !== "all" && site.organization_id !== selectedOrgId) return false;
          return true;
        })
        .map(site => ({
          ...site,
          organizations: orgs.find(o => o.id === site.organization_id)
        }));
    },
  });

  // Fetch all trials
  const { data: trials } = useQuery({
    queryKey: ["trials", dateRange],
    queryFn: async () => {
      return await apiService.getTrials();
    },
  });

  // Fetch all patients grouped by status
  const { data: patients } = useQuery({
    queryKey: ["patients-all", selectedOrgId, dateRange],
    queryFn: async () => {
      const allPatients = await apiService.getPatients();
      
      if (selectedOrgId !== "all" && allSites) {
        const orgSiteIds = allSites
          .filter(site => site.organization_id === selectedOrgId)
          .map(site => site.id);
        
        return allPatients.filter(p => orgSiteIds.includes(p.site_id));
      }
      
      return allPatients;
    },
  });

  // Calculate metrics
  const totalPractices = allSites?.length || 0;
  const totalTrials = trials?.length || 0;

  // Group patients by status (for now showing all patients, can be filtered by trial later)
  const trialsWithPatientCounts = trials?.map(trial => {
    // For now, showing all patients since there's no direct trial-patient relationship
    // You may need to add a trial_id to patients table or create a junction table
    const allPatientsByStatus = patients?.reduce((acc, patient) => {
      acc[patient.status || 'unknown'] = (acc[patient.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      ...trial,
      patientCounts: allPatientsByStatus,
      totalPatients: patients?.length || 0
    };
  }) || [];

  // Calculate average site readiness (placeholder - you may need to add actual readiness scores)
  const averageReadiness = 85; // Placeholder value

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <SidebarProvider>
      <AppSidebar userRole={userData.role} userName={userData.userName} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          </div>

          {/* Filters Section */}
          <div className="flex flex-wrap items-end gap-4 mb-6 p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filters:</span>
            </div>

            {/* Organization Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1.5 block">Organization</label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="flex-1 min-w-[280px]">
              <label className="text-sm font-medium mb-1.5 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOrgId("all");
                setDateRange({
                  from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                  to: new Date(),
                });
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Derived Practices Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setPracticesModalOpen(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Derived Practices
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPractices}</div>
                <p className="text-xs text-muted-foreground">
                  Click to view MOMs and practices
                </p>
              </CardContent>
            </Card>

            {/* Total Trials Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setTrialsModalOpen(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Trials
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTrials}</div>
                <p className="text-xs text-muted-foreground">
                  Click to view trial details
                </p>
              </CardContent>
            </Card>

            {/* Average Site Readiness Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Site Readiness
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageReadiness}%</div>
                <p className="text-xs text-muted-foreground">
                  Across active practices
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Practices Modal */}
          <Dialog open={practicesModalOpen} onOpenChange={setPracticesModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>MOMs and Children Practices</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {organizations?.map((org) => (
                  <div key={org.id} className="space-y-2">
                    <h3 className="font-semibold text-lg">{org.name}</h3>
                    {org.sites && org.sites.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Practice Name</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {org.sites.map((site: any) => (
                            <TableRow key={site.id}>
                              <TableCell>{site.name}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">Active</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground">No practices found</p>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Trials Modal */}
          <Dialog open={trialsModalOpen} onOpenChange={setTrialsModalOpen}>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Trials and Patient Status</DialogTitle>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trial Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Patients</TableHead>
                    <TableHead className="text-right">Active</TableHead>
                    <TableHead className="text-right">Screening</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Withdrawn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialsWithPatientCounts.length > 0 ? (
                    trialsWithPatientCounts.map((trial) => (
                      <TableRow key={trial.id}>
                        <TableCell className="font-medium">{trial.name}</TableCell>
                        <TableCell>
                          <Badge variant={trial.status === 'active' ? 'default' : 'secondary'}>
                            {trial.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {trial.totalPatients}
                        </TableCell>
                        <TableCell className="text-right">
                          {trial.patientCounts['active'] || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {trial.patientCounts['screening'] || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {trial.patientCounts['completed'] || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {trial.patientCounts['withdrawn'] || 0}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No trials found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </SidebarProvider>
  );
}