import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Users,
  Beaker,
  TrendingUp,
  Activity,
  FileText,
} from "lucide-react";
import { DashboardData } from "./support";

export function DefaultDashboard({ propData, loading }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setData(propData)
  }, [propData]);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gradient-to-br from-primary via-primary-light to-primary p-8 rounded-2xl">
          <Skeleton className="bg-white/20 mb-6 w-64 h-8" />
          <div className="gap-6 grid md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="bg-white/10 h-32" />
            ))}
          </div>
        </div>
        <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section with Key Metrics */}
      <div className="relative bg-gradient-to-br from-primary via-primary-light to-primary shadow-glow p-8 rounded-2xl overflow-hidden text-white">
        <div className="top-0 right-0 absolute bg-white/10 blur-3xl -mt-32 -mr-32 rounded-full w-64 h-64" />
        <div className="bottom-0 left-0 absolute bg-white/5 blur-2xl -mb-24 -ml-24 rounded-full w-48 h-48" />
        <div className="z-10 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-bold text-3xl">System Overview</h2>
              <p className="text-white/80 text-sm">Real-time clinical trial management</p>
            </div>
          </div>
          <div className="gap-6 grid md:grid-cols-4">
            <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 border border-white/20 rounded-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-white/80 text-sm">Total Trials</span>
              </div>
              <div className="font-bold text-3xl">{data?.total_trials}</div>
            </div>
            <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 border border-white/20 rounded-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Beaker className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-white/80 text-sm">Active Trials</span>
              </div>
              <div className="font-bold text-3xl">{data?.system_overview?.active_trials}</div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>{data?.system_overview?.active_trial_growth}</span>
              </div>
            </div>
            <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 border border-white/20 rounded-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-white/80 text-sm">Total Patients</span>
              </div>
              <div className="font-bold text-3xl">{data?.system_overview?.total_patients}</div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>{data?.system_overview?.total_patients_growth}</span>
              </div>
            </div>
            <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 border border-white/20 rounded-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-white/80 text-sm">Enrollment Rate</span>
              </div>
              <div className="font-bold text-3xl">{data?.trials?.enrollment_rate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
        {/* Patient Pipeline */}
        <Card className="group relative hover:shadow-xl overflow-hidden transition-all duration-300">
          <div className="top-0 right-0 absolute bg-gradient-primary opacity-5 -mt-16 -mr-16 rounded-full w-32 h-32 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-primary shadow-md p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span>Patient Pipeline</span>
            </CardTitle>
            <CardDescription>Real-time enrollment tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="group/item hover:bg-secondary/30 p-3 rounded-lg transition-all duration-200 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-info shadow-md rounded-full w-10 h-10 font-bold text-white text-xs">
                      {data?.patient_pipeline?.identified_patients}
                    </div>
                    <div>
                      <Badge variant="info" className="mb-1">Identified</Badge>
                      <div className="text-muted-foreground text-xs">Pre-screening phase</div>
                    </div>
                  </div>
                  <span className="font-bold text-info text-lg">{data?.patient_pipeline?.identified_patients_percent}%</span>
                </div>
                <Progress value={parseInt(data?.patient_pipeline?.identified_patients_percent || "0")} className="h-2" variant="info" />
              </div>

              <div className="group/item hover:bg-primary/5 p-3 rounded-lg transition-all duration-200 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-warning shadow-md rounded-full w-10 h-10 font-bold text-white text-xs">
                      {data?.patient_pipeline?.contacted_patients}
                    </div>
                    <div>
                      <Badge variant="warning" className="mb-1">Contacted</Badge>
                      <div className="text-muted-foreground text-xs">Initial outreach</div>
                    </div>
                  </div>
                  <span className="font-bold text-warning text-lg">{data?.patient_pipeline?.contacted_patients_percent}%</span>
                </div>
                <Progress value={parseInt(data?.patient_pipeline?.contacted_patients_percent || "0")} className="h-2" variant="warning" />
              </div>

              <div className="group/item hover:bg-primary/5 p-3 rounded-lg transition-all duration-200 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary shadow-md rounded-full w-10 h-10 font-bold text-white text-xs">
                      {data?.patient_pipeline?.screened_patients}
                    </div>
                    <div>
                      <Badge variant="default" className="mb-1">Screened</Badge>
                      <div className="text-muted-foreground text-xs">Under evaluation</div>
                    </div>
                  </div>
                  <span className="font-bold text-primary text-lg">{data?.patient_pipeline?.screened_patients_percent}%</span>
                </div>
                <Progress value={parseInt(data?.patient_pipeline?.screened_patients_percent || "0")} className="h-2" variant="primary" />
              </div>

              <div className="group/item hover:bg-success/10 p-3 rounded-lg transition-all duration-200 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-success shadow-md rounded-full w-10 h-10 font-bold text-white text-xs">
                      {data?.patient_pipeline?.enrolled_patients}
                    </div>
                    <div>
                      <Badge variant="success" className="mb-1">Enrolled</Badge>
                      <div className="text-muted-foreground text-xs">Active participants</div>
                    </div>
                  </div>
                  <span className="font-bold text-success text-lg">{data?.patient_pipeline?.enrolled_patients_percent}%</span>
                </div>
                <Progress value={parseInt(data?.patient_pipeline?.enrolled_patients_percent || "0")} className="h-2" variant="success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Sites */}
        <Card className="group relative hover:shadow-xl overflow-hidden transition-all duration-300">
          <div className="top-0 right-0 absolute bg-gradient-success opacity-5 -mt-16 -mr-16 rounded-full w-32 h-32 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-gradient-success shadow-md p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>Leading sites by enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.top_performers?.slice(0, 4).map((site, index) => (
                <div
                  key={site.site_id}
                  className={`group/rank hover:scale-105 transition-all duration-300 cursor-pointer p-4 rounded-xl ${index === 0
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary'
                    : 'bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary/70'
                    } shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${index === 0
                        ? 'bg-primary text-white shadow-glow'
                        : 'bg-gradient-secondary text-white shadow-md'
                        } font-bold text-lg`}>
                        {index + 1}
                      </div>
                      {index === 0 && (
                        <div className="-top-1 -right-1 absolute flex justify-center items-center bg-warning rounded-full w-5 h-5">
                          <span className="text-xs">🏆</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{site.site_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">{site.enrolled_patients} patients</span>
                        <Badge variant="success" className="text-xs">{site.performance_change}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trial Performance */}
        <Card className="group relative hover:shadow-xl overflow-hidden transition-all duration-300">
          <div className="top-0 right-0 absolute bg-gradient-to-br from-info/20 to-info/5 -mt-16 -mr-16 rounded-full w-32 h-32 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-info to-blue-500 shadow-md p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span>Trial Performance</span>
            </CardTitle>
            <CardDescription>Conversion metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-3 bg-gradient-to-r from-success/10 to-transparent p-4 border border-success/20 hover:border-success/40 rounded-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-success rounded-lg w-8 h-8">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Contact Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-success text-2xl">{data?.trial_performance_summary?.contact_rate}</span>
                    <Badge variant="success" className="text-xs">Good</Badge>
                  </div>
                </div>
                <Progress value={parseInt(data?.trial_performance_summary?.contact_rate || "0")} className="h-2.5" variant="success" />
              </div>

              <div className="space-y-3 bg-gradient-to-r from-info/10 to-transparent p-4 border border-info/20 hover:border-info/40 rounded-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-info rounded-lg w-8 h-8">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Screen Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-info text-2xl">{data?.trial_performance_summary?.screen_rate}</span>
                    <Badge variant="info" className="text-xs">Excellent</Badge>
                  </div>
                </div>
                <Progress value={parseInt(data?.trial_performance_summary?.screen_rate || "0")} className="h-2.5" variant="info" />
              </div>

              <div className="space-y-3 bg-gradient-to-r from-warning/10 to-transparent p-4 border border-warning/20 hover:border-warning/40 rounded-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-warning rounded-lg w-8 h-8">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Enrollment Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-warning text-2xl">{data?.trial_performance_summary?.enrollment_rate}</span>
                    <Badge variant="warning" className="text-xs">Monitor</Badge>
                  </div>
                </div>
                <Progress value={parseInt(data?.trial_performance_summary?.enrollment_rate || "0")} className="h-2.5" variant="warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matched Trials Table */}
      <Card className="group relative hover:shadow-xl overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gradient-accent shadow-md p-2 rounded-lg">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <span>Matched Trials</span>
          </CardTitle>
          <CardDescription>Top trials with matched patients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trial ID</TableHead>
                <TableHead>Trial Name</TableHead>
                <TableHead>Matched Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Match Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.matched_trials?.map((trial) => (
                <TableRow key={trial.trial_id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{trial.trial_id}</TableCell>
                  <TableCell className="font-medium">{trial.trial_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      {trial.matched_patients}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        trial.status === "Recruiting"
                          ? "success"
                          : trial.status === "Active, not recruiting"
                            ? "default"
                            : "outline"
                      }
                    >
                      {trial.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{trial.match_score}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}