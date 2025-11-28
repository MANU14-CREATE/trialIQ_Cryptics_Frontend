import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Building2, Users, ChevronDown, ChevronUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockSites } from "@/services/mockData";
import { DashboardData } from "./support";

export function PracticesDashboard({ propData }) {
  const [threshold, setThreshold] = useState([90]);
  const [expandedPractice, setExpandedPractice] = useState<string | null>(null);
  const [showReadiness, setShowReadiness] = useState<string | null>(null);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setData(propData)
  }, [propData]);

  const sites = mockSites;

  const readinessData = data?.practices?.readiness_score_trend.map((item) => { return ({ month: item.month, score: item.readiness_score }) }) ?? [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 88 },
    { month: "Jun", score: 87 },
  ];

  const providerData = data?.practices?.provider_count_trend.map((item) => { return ({ month: item.month, count: item.provider_count }) }) ?? [
    { month: "Jan", count: 24 },
    { month: "Feb", count: 28 },
    { month: "Mar", count: 32 },
    { month: "Apr", count: 35 },
    { month: "May", count: 38 },
    { month: "Jun", count: 42 },
  ];

  const practiceDetails = [
    { id: "1", name: "Practice A", trials: 5, readiness: 92, providers: 12 },
    { id: "2", name: "Practice B", trials: 3, readiness: 88, providers: 8 },
    { id: "3", name: "Practice C", trials: 7, readiness: 85, providers: 15 },
  ];

  const mockTrials = [
    { name: "Trial A", nct: "NCT001", status: "Active" },
    { name: "Trial B", nct: "NCT002", status: "Recruiting" },
  ];

  const mockProviders = [
    { name: "Dr. Smith", specialty: "Cardiology" },
    { name: "Dr. Jones", specialty: "Neurology" },
  ];

  const matchedTrials = 12;

  return (
    <>
      <div className="gap-4 grid md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Matched Trials</CardTitle>
            <CardDescription>Above {threshold[0]}% threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{matchedTrials}</div>
            <div className="mt-4">
              <Label>Threshold: {threshold[0]}%</Label>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                max={100}
                min={50}
                step={5}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
        <MetricCard
          title="Total Practices"
          value={sites.length.toString()}
          subtitle="Active practice sites"
          icon={Building2}
        />
        <MetricCard
          title="Total Providers"
          value="42"
          subtitle="Across all practices"
          icon={Users}
        />
      </div>

      <div className="gap-4 grid md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Readiness Score Trend</CardTitle>
            <CardDescription>Overall readiness over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} name="Readiness %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Count Trend</CardTitle>
            <CardDescription>Number of providers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={providerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Providers" />
                {/* <Line type="monotone" dataKey="count" stroke="hsl(var(--secondary))" strokeWidth={2} name="Providers" /> */}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Overview</CardTitle>
          <CardDescription>Detailed practice statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practice Name</TableHead>
                <TableHead>Trials</TableHead>
                <TableHead>Readiness Score</TableHead>
                <TableHead>Providers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {practiceDetails.map((practice, i) => (
                <>
                  <TableRow key={practice.id + i}>
                    <TableCell className="font-medium">{practice.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setExpandedPractice(expandedPractice === practice.id ? null : practice.id)}
                      >
                        {practice.trials} trials
                        {expandedPractice === practice.id ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setShowReadiness(practice.id)}
                      >
                        {practice.readiness}%
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{practice.providers} providers</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  {expandedPractice === practice.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/50">
                        <div className="space-y-2 p-4">
                          <h4 className="font-semibold text-sm">Assigned Trials:</h4>
                          {mockTrials.map((trial, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span>{trial.name} ({trial.nct})</span>
                              <span className="text-muted-foreground">{trial.status}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!showReadiness} onOpenChange={() => setShowReadiness(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Site Readiness Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Infrastructure</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary w-[95%] h-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Staff Training</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary w-[88%] h-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Documentation</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary w-[92%] h-full" />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h4 className="mb-3 font-semibold">Providers at this site:</h4>
              <div className="space-y-2">
                {mockProviders.map((provider, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">{provider.name}</span>
                    <span className="text-muted-foreground text-sm">{provider.specialty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
