import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Users, CheckCircle2, Clock, Activity } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { DashboardData } from "./support";

export function TrialsDashboard({ propData }) {
  const { data: trails } = useQuery({
    queryKey: ["trails-dashboard"],
    queryFn: () => apiService.getTrials(),
  });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setData(propData)
  }, [propData]);

  // Mock data for qualification levels
  const qualificationData = [
    { level: "90-100%", count: data?.qualification_levels?.["90-100"] ?? 10, color: "hsl(var(--success))" },
    { level: "80-89%", count: data?.qualification_levels?.["80-89"] ?? 1, color: "hsl(var(--primary))" },
    { level: "70-79%", count: data?.qualification_levels?.["70-79"] ?? 2, color: "hsl(var(--warning))" },
    { level: "60-69%", count: data?.qualification_levels?.["69 and below"] ?? 9, color: "hsl(var(--destructive))" },
  ];

  // Mock patient status data across all practices
  // const patientStatusData = [
  //   { status: "Eligible", count: data?.patient_status_overview?.contacted_patients ?? 842, icon: Activity, color: "text-primary" },
  //   { status: "Contacted", count: data?.patient_status_overview ?? 456, icon: Clock, color: "text-warning" },
  //   { status: "Screened", count: data?.patient_status_overview ?? 324, icon: Users, color: "text-secondary" },
  //   { status: "Enrolled", count: data?.patient_status_overview ?? 178, icon: CheckCircle2, color: "text-success" },
  //   { status: "Remaining", count: data?.patient_status_overview ?? 664, icon: Activity, color: "text-muted-foreground" },
  // ];
  const patientStatusData = [
    { status: "Contacted", count: data?.patient_status_overview?.contacted_patients ?? 842, icon: Activity, color: "text-primary" },
    { status: "Identified", count: data?.patient_status_overview?.identified_patients ?? 456, icon: Clock, color: "text-warning" },
    { status: "Screened", count: data?.patient_status_overview?.screened_patients ?? 324, icon: Users, color: "text-secondary" },
    { status: "Enrolled", count: data?.patient_status_overview?.enrolled_patients ?? 178, icon: CheckCircle2, color: "text-success" },
    // { status: "Remaining", count: data?.patient_status_overview ?? 664, icon: Activity, color: "text-muted-foreground" },
  ];

  // Mock status bifurcation data for chart
  const bifurcationData = [
    { trial: "Trial A", eligible: 120, contacted: 80, screened: 60, enrolled: 32 },
    { trial: "Trial B", eligible: 95, contacted: 65, screened: 48, enrolled: 28 },
    { trial: "Trial C", eligible: 150, contacted: 110, screened: 85, enrolled: 45 },
    { trial: "Trial D", eligible: 88, contacted: 55, screened: 42, enrolled: 25 },
  ];

  const calculateWidth = (wid: any) => {
    return `${(wid / 48) * 100}%`
  }
  return (
    <>
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Total Trial"
          value={data?.trials?.total_trials || "0"}
          subtitle="Active clinical trial"
          icon={Beaker}
        />
        <MetricCard
          title="High Qualification"
          value={data?.trials?.high_qualification_trials || "0"}
          subtitle="90%+ match rate"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Total Patients"
          value={data?.trials?.total_patients || "0"}
          subtitle="Across all statuses"
          icon={Users}
        />
        <MetricCard
          title="Enrollment Rate"
          value={data?.trials?.enrollment_rate || "0"}
          subtitle="Eligible to enrolled"
          icon={Activity}
        />
      </div>

      <div className="gap-4 grid md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Qualification Levels</CardTitle>
            <CardDescription>Trials by match qualification percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualificationData.map((item) => (
                <div key={item.level} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.level} qualification</span>
                    <Badge variant="outline">{item.count} trials</Badge>
                  </div>
                  <div className="bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: calculateWidth(item.count),
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Status Overview</CardTitle>
            <CardDescription>Total patients across all practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patientStatusData.map((item) => (
                <div key={item.status} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="font-medium text-sm">{item.status}</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold text-base">
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Status-wise Bifurcation</CardTitle>
          <CardDescription>Patient funnel across top trials</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={bifurcationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trial" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="eligible" fill="hsl(var(--primary))" name="Eligible" />
              <Bar dataKey="contacted" fill="hsl(var(--warning))" name="Contacted" />
              <Bar dataKey="screened" fill="hsl(var(--secondary))" name="Screened" />
              <Bar dataKey="enrolled" fill="hsl(var(--success))" name="Enrolled" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trial Performance Summary</CardTitle>
          <CardDescription>Key metrics and conversion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="mb-1 text-muted-foreground text-sm">Contact Rate</div>
              <div className="font-bold text-2xl">{data?.trial_performance_summary?.contact_rate ?? "0%"}</div>
              <div className="text-muted-foreground text-xs">Eligible to Contacted</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="mb-1 text-muted-foreground text-sm">Screen Rate</div>
              <div className="font-bold text-2xl">{data?.trial_performance_summary?.screen_rate ?? "0%"}</div>
              <div className="text-muted-foreground text-xs">Contacted to Screened</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="mb-1 text-muted-foreground text-sm">Conversion Rate</div>
              <div className="font-bold text-2xl">{data?.trial_performance_summary?.enrollment_rate ?? "0%"}</div>
              <div className="text-muted-foreground text-xs">Screened to Enrolled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
