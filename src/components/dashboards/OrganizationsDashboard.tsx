import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Search, Eye } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { mockOrganizations, mockSites } from "@/services/mockData";
import { DashboardData } from "./support";
import { apiService, OrganizationListItem } from "@/services/api";
export function convertOrganizationData(data: any[]) {
  console.log(data)
  return data.map((item) => {
    const user = item?.user;
    const role = user?.role;

    return {
      id: user?.id || "",
      name: role?.name?.replace(/_/g, " ") || "Unknown Organization",
      entity_id: role?.entity_id || null,
      entity_owner_email: user?.email || "",
      entity_primary_phone: user?.phone || "",
      description: role?.description || "",

      contact_email: user?.email || "",
      contact_phone: user?.phone || "",
      address: "",                    // No address → default empty string
      entity_legal_documents: [],     // No documents → empty array
      is_active: true,                // Default value
      created_at: item?.created_at || null,
    };
  });
}

export function OrganizationsDashboard({ propData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [showPractices, setShowPractices] = useState(false);
  const [showTrials, setShowTrials] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState([]);

  useEffect(() => {
    const fetchOrganisationsData = async () => {
      try {
        const data = await apiService.getOrganizations();
        console.log(data.organizations)
        if (!data) return;
        const newData = convertOrganizationData(data.organizations);
        console.log(newData);
        setOrgData(newData)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganisationsData();
  }, []);

  useEffect(() => {
    setData(propData)
  }, [propData]);



  const organizations = mockOrganizations;
  const allSites = mockSites;

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const practicesData = selectedOrg
    ? allSites.filter(s => s.organization_id === selectedOrg)
    : [];

  const totalSites = allSites.length;
  const totalTrials = 15; // Mock data
  const avgReadinessScore = 87.5;

  // Mock trial data
  const mockTrialData = [
    { trails: { name: "COVID-19 Vaccine Study", nct_id: "NCT12345" } },
    { trails: { name: "Diabetes Treatment Trial", nct_id: "NCT67890" } },
  ];

  return (
    <>
      <div className="gap-4 grid md:grid-cols-3 mb-6">
        <MetricCard
          title="Total Organizations"
          value={orgData.length.toString()}
          subtitle="MOM entities"
          icon={Building2}
        />
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowPractices(true)}>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Derived Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalSites}</div>
            <p className="text-muted-foreground text-xs">Click to view breakdown</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowTrials(true)}>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Total Trials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{data?.total_trials}</div>
            <p className="text-muted-foreground text-xs">Across all practices</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Average Site Readiness Score</CardTitle>
          <CardDescription>Across practices with active scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-primary text-4xl">{avgReadinessScore}%</div>
          <div className="space-y-2 mt-4">
            <div className="bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${avgReadinessScore}%` }} />
            </div>
            <p className="text-muted-foreground text-sm">Excellent performance</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Statistics</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgData.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="font-mono text-sm">{org.entity_id || "-"}</TableCell>
                  <TableCell>{org.entity_owner_email}</TableCell>
                  <TableCell>{allSites.filter(s => s.organization_id === org.id).length}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedOrg(org.id);
                        setShowPractices(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showPractices} onOpenChange={setShowPractices}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>MOMs and Children Practices</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {practicesData.map((practice) => (
              <div key={practice.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{practice.name}</h3>
                <p className="text-muted-foreground text-sm">{practice.location}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTrials} onOpenChange={setShowTrials}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trials and Patient Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {mockTrialData.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{item.trails.name}</CardTitle>
                  <CardDescription>NCT ID: {item.trails.nct_id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="gap-4 grid grid-cols-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Eligible</p>
                      <p className="font-semibold text-lg">24</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contacted</p>
                      <p className="font-semibold text-lg">18</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Screened</p>
                      <p className="font-semibold text-lg">12</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Enrolled</p>
                      <p className="font-semibold text-lg">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
