import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Search, Eye, Link as LinkIcon } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useNavigate } from "react-router-dom";
export interface Sponsor {
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
  primary_phone: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  entity_legal_documents: any[];  // You can replace any[] with a proper document type if needed
  is_active: boolean;
  created_at: string;
}

function convertSponsorData(data: any[]) {
  console.log(data)
  return data.map((item) => {
    const user = item?.user;
    const role = user?.role;

    return {
      id: user?.id || "",
      name: role?.name || "",                          // (You can replace with sponsor name if available)
      entity_id: role?.entity_id || null,
      owner_email: user?.email || "",
      primary_phone: user?.phone || "",

      // fields not present → assigning default or null
      address: "",                                     // no address in input
      contact_person: "",                              // no contact person in input  
      contact_email: "",                               // no contact email  
      contact_phone: "",                               // no contact phone
      entity_legal_documents: [],                      // no documents in input
      is_active: true,                                 // default  

      created_at: item?.created_at || null,
    };
  });
}

export function SponsorsDashboard({ propData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [showTrials, setShowTrials] = useState(false);
  const [showReadiness, setShowReadiness] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchSponsersData = async () => {
      try {
        const data = await apiService.getSponsors();
        if (!data) return;
        const newData = convertSponsorData(data.sponsors);
        setData(newData)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsersData();
  }, []);



  const { data: sponsors } = useQuery({
    queryKey: ["sponsors-dashboard"],
    queryFn: () => apiService.getSponsors2(),
  });


  // Mock sponsor trials for demo
  const sponsorTrials = selectedSponsor ? [
    { trails: { id: '1', name: 'Sample Trial', nct_id: 'NCT12345', status: 'active' } }
  ] : [];

  const filteredSponsors = sponsors?.filter((sponsor: { name: string; }) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgReadinessScore = 85.2;

  // Mock readiness data
  const readinessData = [
    { practice: "Practice A", score: 92 },
    { practice: "Practice B", score: 88 },
    { practice: "Practice C", score: 85 },
    { practice: "Practice D", score: 78 },
  ];

  return (
    <>
      <div className="gap-4 grid md:grid-cols-2 mb-6">
        <MetricCard
          title="Total Sponsors"
          value={data?.length.toString() || "0"}
          subtitle="Active sponsor organizations"
          icon={Building2}
        />
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowReadiness(true)}>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Avg Site Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{avgReadinessScore}%</div>
            <p className="text-muted-foreground text-xs">Across all practices</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sponsor Statistics</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sponsors..."
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
                <TableHead>Sponsor Name</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Trials</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((sponsor: { id: string | number | bigint | ((prevState: string) => string); name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal; entity_id: any; owner_email: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal; }) => (
                <TableRow key={sponsor.id as any}>
                  <TableCell className="font-medium">{sponsor.name}</TableCell>
                  <TableCell className="font-mono text-sm">{sponsor.entity_id || "-"}</TableCell>
                  <TableCell>{sponsor.owner_email}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSelectedSponsor(sponsor.id as any);
                        setShowTrials(true);
                      }}
                    >
                      View Trials
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSponsor(sponsor.id as any);
                        setShowTrials(true);
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

      <Dialog open={showTrials} onOpenChange={setShowTrials}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sponsor Trials</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {sponsorTrials?.map((item: any) => (
              <Card key={item.trails.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/trails?id=${item.trails.id}`)}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold">
                        {item.trails.name}
                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        NCT ID: {item.trails.nct_id || "N/A"}
                      </p>
                    </div>
                    <div className="bg-primary/10 px-3 py-1 rounded-full font-medium text-sm capitalize">
                      {item.trails.status || "Active"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReadiness} onOpenChange={setShowReadiness}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Practice Site Readiness Scores</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practice Name</TableHead>
                <TableHead>Readiness Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readinessData.map((practice, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{practice.practice}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${practice.score}%` }}
                        />
                      </div>
                      <span className="w-12 font-medium text-sm">{practice.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {practice.score >= 90 ? "Excellent" : practice.score >= 80 ? "Good" : "Fair"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}
