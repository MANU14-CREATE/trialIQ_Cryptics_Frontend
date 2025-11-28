import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, Users, Building2, Save, Download, DollarSign, UserCheck, Calendar, Target, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";

interface Trial {
  id: string;
  nct_id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export default function Trials() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTrial, setEditingTrial] = useState<Trial | null>(null);
  const [viewingTrial, setViewingTrial] = useState<Trial | null>(null);
  const [editingDetails, setEditingDetails] = useState<Trial | null>(null);
  const [assigningSites, setAssigningSites] = useState<Trial | null>(null);
  const [assigningSponsors, setAssigningSponsors] = useState<Trial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Trial | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData, loading: userLoading } = useUserRole();

  const [trialsList, setTrialsList] = useState([])
  const [loading, setLoading] = useState(true);
  const [hadChanged, setHadChanged] = useState(false);
  const [sitesList, setSitesList] = useState([])
  const [sponsorsList, setSponsorsList] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getTrials();
        if (!data) return;
        setTrialsList(data.trials)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hadChanged])
  useEffect(() => {
    const fetchD = async () => {
      try {
        const data = await apiService.getSites();
        if (!data) return;
        setSitesList(data.sites)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchD();
  }, [hadChanged])



  useEffect(() => {
    const fetchD = async () => {
      try {
        const data = await apiService.getSponsors();
        if (!data) return;
        setSponsorsList(data.sponsors)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchD();
  }, [hadChanged])

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await apiService.deleteTrial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trials"] });
      toast({ title: "Trial deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (trial: Trial) => {
    setEditingTrial(trial);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingTrial(null);
    setIsOpen(true);
  };

  const handleSort = (field: keyof Trial) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Trial) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />;
  };

  // const filteredAndSortedTrials = trials
  //   ?.filter((trial) => {
  //     const searchLower = searchTerm.toLowerCase();
  //     return (
  //       trial.name.toLowerCase().includes(searchLower) ||
  //       trial.nct_id.toLowerCase().includes(searchLower) ||
  //       (trial.status && trial.status.toLowerCase().includes(searchLower))
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (!sortField) return 0;
  //     const aValue = a[sortField] || "";
  //     const bValue = b[sortField] || "";
  //     const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  //     return sortDirection === "asc" ? comparison : -comparison;
  //   });

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
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
        <div className="mx-auto p-6 container">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-bold text-3xl">Trials</h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search trials..."
              />
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Trial
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingTrial ? "Edit Trial" : "Add Trial"}</DialogTitle>
                  </DialogHeader>
                  <TrialForm
                    trial={editingTrial}
                    onSuccess={() => {
                      setIsOpen(false);
                      queryClient.invalidateQueries({ queryKey: ["trials"] });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-card border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        // onClick={() => handleSort("nct_id")}
                        className="flex items-center hover:text-foreground"
                      >
                        Trial NCT ID
                        {/* {getSortIcon("nct_id")} */}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        // onClick={() => handleSort("name")}
                        className="flex items-center hover:text-foreground"
                      >
                        Name
                        {/* {getSortIcon("name")} */}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        // onClick={() => handleSort("created_at")}
                        className="flex items-center hover:text-foreground"
                      >
                        Created Date
                        {/* {getSortIcon("created_at")} */}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        // onClick={() => handleSort("status")}
                        className="flex items-center hover:text-foreground"
                      >
                        Status
                        {/* {getSortIcon("status")} */}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialsList?.map((trial) => (
                    <TableRow key={trial.id}>
                      <TableCell className="font-medium">{trial?.nct_id}</TableCell>
                      <TableCell>{trial.name}</TableCell>
                      <TableCell>
                        {new Date(trial.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={trial.status === "active" ? "default" : "secondary"}>
                          {trial.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingTrial(trial)}
                          title="View Summary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAssigningSponsors(trial)}
                          title="Assign Sponsors"
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAssigningSites(trial)}
                          title="Assign Sites"
                        >
                          <Building2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingDetails(trial)}
                          title="Edit Details"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(trial.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* View Trial Summary Dialog - Read Only */}
        <Dialog open={!!viewingTrial} onOpenChange={() => setViewingTrial(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="mb-2 text-2xl">Trial Summary - {viewingTrial?.nct_id}</DialogTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingDetails(viewingTrial);
                    setViewingTrial(null);
                  }}>
                    <Pencil className="mr-2 w-4 h-4" />
                    Edit Details
                  </Button>
                  <Button variant="default" size="sm">
                    <Download className="mr-2 w-4 h-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </DialogHeader>
            {viewingTrial && (
              <div className="space-y-6 mt-6">
                <div>
                  <h2 className="mb-2 font-bold text-3xl">{viewingTrial.name}</h2>
                  <p className="text-muted-foreground text-lg">
                    Microbiome Health Sciences • Phase III • Dr. Maria Alvarez, MD, PhD
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="destructive" className="px-3 py-1 text-sm">High</Badge>
                    <Badge className="bg-green-600 hover:bg-green-700 px-3 py-1 text-white text-sm">Enrolling</Badge>
                    <Badge variant="secondary" className="px-3 py-1 text-sm">94% AI Match</Badge>
                  </div>
                </div>

                <div className="gap-4 grid grid-cols-3">
                  <Card className="bg-gradient-to-br from-purple-50 dark:from-purple-950/30 to-purple-100 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                        <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Enrollment</p>
                      </div>
                      <p className="mb-3 font-bold text-purple-900 dark:text-purple-100 text-4xl">18/60</p>
                      <Progress value={30} className="bg-purple-200 dark:bg-purple-900 mb-2 h-2" />
                      <p className="font-medium text-purple-600 dark:text-purple-400 text-sm">30% Complete</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 dark:from-green-950/30 to-green-100 dark:to-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-700 dark:text-green-400" />
                        <p className="font-semibold text-green-700 dark:text-green-300 text-sm">Est. Revenue</p>
                      </div>
                      <p className="mb-3 font-bold text-green-900 dark:text-green-100 text-4xl">$185,000</p>
                      <p className="font-medium text-green-600 dark:text-green-400 text-sm">Total contract</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 dark:from-blue-950/30 to-blue-100 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Available</p>
                      </div>
                      <p className="mb-3 font-bold text-blue-900 dark:text-blue-100 text-4xl">23</p>
                      <p className="font-medium text-blue-600 dark:text-blue-400 text-sm">Ready to contact</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">Patient Engagement Funnel</CardTitle>
                      <p className="text-muted-foreground text-sm">Last updated: 2 days ago</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="gap-6 grid grid-cols-4">
                      <div className="space-y-3 text-center">
                        <p className="font-bold text-gray-700 dark:text-gray-300 text-5xl">78</p>
                        <p className="font-medium text-muted-foreground text-sm">Contacted</p>
                        <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-full h-2"></div>
                      </div>
                      <div className="space-y-3 text-center">
                        <p className="font-bold text-blue-600 dark:text-blue-400 text-5xl">45</p>
                        <p className="font-medium text-muted-foreground text-sm">Screened</p>
                        <div className="bg-blue-500 rounded-full w-full h-2"></div>
                      </div>
                      <div className="space-y-3 text-center">
                        <p className="font-bold text-green-600 dark:text-green-400 text-5xl">18</p>
                        <p className="font-medium text-muted-foreground text-sm">Enrolled</p>
                        <div className="bg-green-500 rounded-full w-full h-2"></div>
                      </div>
                      <div className="space-y-3 text-center">
                        <p className="font-bold text-orange-600 dark:text-orange-400 text-5xl">42</p>
                        <p className="font-medium text-muted-foreground text-sm">Remaining</p>
                        <div className="bg-orange-500 rounded-full w-full h-2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="gap-4 grid grid-cols-2">
                  <Card className="bg-gradient-to-br from-blue-50 dark:from-blue-950/30 to-blue-100 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Start Date</p>
                      </div>
                      <p className="font-bold text-blue-900 dark:text-blue-100 text-3xl">16/10/2025</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 dark:from-red-950/30 to-red-100 dark:to-red-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-red-700 dark:text-red-400" />
                        <p className="font-semibold text-red-700 dark:text-red-300 text-sm">Est. Completion</p>
                      </div>
                      <p className="font-bold text-red-900 dark:text-red-100 text-3xl">31/10/2025</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-6" />

                {/* Overview Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl">Overview</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle>Study Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="gap-6 grid grid-cols-2">
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Brief Title</p>
                          <p className="mt-1 text-base">Multi-Center Study of Panosyl-Isomaltooligosaccharides Adjunctive to PPI Therapy to Treat GERD</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Phase</p>
                          <Badge className="mt-1">Phase III</Badge>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Official Title</p>
                        <p className="mt-1 text-base">A Multi-Center Study of Panosyl-Isomaltooligosaccharides (PIMO) Adjunctive to Proton Pump Inhibitor (PPI) Therapy to Treat Gastroesophageal Reflux Disease (GERD) in Subjects Who Are PPI-Responders or PPI-Partial Responders</p>
                      </div>

                      <div className="gap-4 grid grid-cols-3">
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Study Type</p>
                          <p className="mt-1 text-base">Interventional</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Enrollment Available</p>
                          <p className="mt-1 font-semibold text-base">2,321</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Last Updated</p>
                          <p className="mt-1 text-base">2025-11-06</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Intervention/Treatment</p>
                        <p className="mt-1 text-base">Drug: MHS-1031, Other: Placebo</p>
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Link to ClinicalTrials.gov</p>
                        <a href="https://clinicaltrials.gov/study/NCT05556824" target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-primary hover:underline">
                          https://clinicaltrials.gov/study/NCT05556824
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Study Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed">
                        This multi-center, randomized, double-blind, placebo-controlled Phase III clinical trial aims to evaluate the efficacy and safety of Panosyl-Isomaltooligosaccharides (PIMO) as an adjunctive therapy to Proton Pump Inhibitors (PPIs) in treating Gastroesophageal Reflux Disease (GERD). The study will enroll 247 adult participants who are PPI-responders or PPI-partial responders.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="gap-4 grid grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Study Design</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base">Randomized, Double-Blind, Placebo-Controlled, Multi-Center Phase III Trial</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Duration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base">8 weeks of treatment with a follow-up period of 4 weeks</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Primary Outcome</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Measure</p>
                        <p className="mt-1 font-semibold text-base">Heartburn-free days/week</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Description</p>
                        <p className="mt-1 text-base">The difference between baseline weekly average heartburn-free days and weekly average heartburn-free days during Treatment Phase Weeks 1-4 and Weeks 5-8.</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Time Frame</p>
                        <Badge variant="outline" className="mt-1">4 and 8 weeks</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Location Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="gap-4 grid grid-cols-2">
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Closest Location</p>
                          <p className="mt-1 text-base">A and U Family Medicine (NCR), Sugar Land, Texas, 77479</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Distance</p>
                          <p className="mt-1 text-base">~10 miles away</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="gap-4 grid grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="font-medium text-muted-foreground text-sm">IPD Sharing</p>
                        <p className="mt-2 font-bold text-2xl">No</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="font-medium text-muted-foreground text-sm">US Regulated Drug</p>
                        <p className="mt-2 font-bold text-green-600 text-2xl">Yes</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="font-medium text-muted-foreground text-sm">US Regulated Device</p>
                        <p className="mt-2 font-bold text-2xl">No</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Criteria Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl">Eligibility Criteria</h3>

                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="bg-green-50 dark:bg-green-950/20">
                      <CardTitle className="text-green-900 dark:text-green-100">Inclusion Criteria</CardTitle>
                      <CardDescription>Requirements for patient eligibility</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3 pl-5 list-disc">
                        <li className="text-base">Capable of understanding and complying with protocol requirements</li>
                        <li className="text-base">Subject signs and dates electronic and written informed consent forms</li>
                        <li className="text-base">Ability to complete all required online questionnaires</li>
                        <li className="text-base">Access to computer/tablet/phone with internet access</li>
                        <li className="text-base">Males or females ≥18 and ≤75 years of age, BMI ≥ 18 and &lt; 35 kg/m²</li>
                        <li className="text-base">Female subjects must use appropriate contraception methods</li>
                        <li className="text-base">Must be on stable doses of medications for chronic conditions</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader className="bg-red-50 dark:bg-red-950/20">
                      <CardTitle className="text-red-900 dark:text-red-100">Exclusion Criteria</CardTitle>
                      <CardDescription>Conditions that disqualify patient participation</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3 pl-5 list-disc">
                        <li className="text-base">Current use of mouthwash or unwilling to discontinue</li>
                        <li className="text-base">Recent teeth whitening or ongoing use</li>
                        <li className="text-base">Current use of H2RAs</li>
                        <li className="text-base">Recent surgical procedures requiring general anesthesia</li>
                        <li className="text-base">History of cancer within preceding 5 years</li>
                        <li className="text-base">Untreated peptic/gastric ulcer or H. pylori</li>
                        <li className="text-base">History of ulcerative colitis or Crohn's disease</li>
                        <li className="text-base">Chronic viral infections (HBV, HCV, HIV)</li>
                        <li className="text-base">Significant heart, kidney, liver or lung morbidity</li>
                        <li className="text-base">History of Long QT Syndrome</li>
                        <li className="text-base">Current neurological or psychiatric disorders</li>
                        <li className="text-base">Known substance abuse within 1 year</li>
                        <li className="text-base">Active tobacco or nicotine use</li>
                        <li className="text-base">Alcohol abuse</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-6" />

                {/* Procedures Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl">Study Procedures</h3>

                  <div className="gap-4 grid grid-cols-2">
                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
                        <CardTitle className="text-blue-900 dark:text-blue-100">Active Comparator Group</CardTitle>
                        <CardDescription>Study drug treatment</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-base leading-relaxed">
                          Study medication will be supplied as a syrup in individual sachets containing 1g (1.5 mL) of MHS-1031. Subjects will be randomized in 2:1 fashion to either study drug (2) or placebo (1)
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800">
                      <CardHeader className="bg-gray-50 dark:bg-gray-950/20">
                        <CardTitle className="text-gray-900 dark:text-gray-100">Placebo Comparator Group</CardTitle>
                        <CardDescription>Placebo treatment</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-base leading-relaxed">
                          Matching placebo is an oral solution formulated to have a degree of sweetness and acidity similar to the study medication and will be provided in equivalent sachets containing 1.5g (1.5 mL).
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contacts Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl">Study Contacts</h3>

                  <Card className="border-purple-200 dark:border-purple-800">
                    <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
                      <CardTitle className="text-purple-900 dark:text-purple-100">Primary Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="gap-6 grid grid-cols-2">
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Name</p>
                          <p className="mt-1 font-semibold text-lg">Tina Higginbotham</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Title</p>
                          <p className="mt-1 text-lg">Study Coordinator</p>
                        </div>
                      </div>
                      <div className="gap-6 grid grid-cols-2 mt-4">
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Phone</p>
                          <a href="tel:650-897-8099" className="inline-block mt-1 text-primary text-lg hover:underline">650-897-8099</a>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground text-sm">Email</p>
                          <a href="mailto:thigginbotham@microbiomehealthsciences.com" className="inline-block mt-1 text-primary text-lg hover:underline break-all">thigginbotham@microbiomehealthsciences.com</a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-6" />

                {/* Pre-Screening Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl">Pre-Screening</h3>

                  <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader className="bg-orange-50 dark:bg-orange-950/20">
                      <CardTitle className="text-orange-900 dark:text-orange-100">Pre-Screening Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4 font-medium text-base">
                        Please ask the patient the following, if they answer NO to any of these questions, they are not eligible for the study.
                      </p>

                      <div className="space-y-4 mt-6">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                              <Badge variant="secondary" className="px-3 py-1 text-base shrink-0">Q1</Badge>
                              <div className="flex-1">
                                <p className="font-medium text-base">
                                  Are you willing and able to remain in the U.S. (or avoid travel that crosses &gt;2 hour time zones) during the study period, and maintain study-related restrictions?
                                </p>
                                <Badge variant="outline" className="mt-2">Yes/No</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                              <Badge variant="secondary" className="px-3 py-1 text-base shrink-0">Q2</Badge>
                              <div className="flex-1">
                                <p className="font-medium text-base">
                                  Are you currently using any investigational products or participating in another clinical trial?
                                </p>
                                <Badge variant="outline" className="mt-2">Yes/No</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Trial Details Dialog - Editable */}
        <Dialog open={!!editingDetails} onOpenChange={() => setEditingDetails(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl">Edit Trial Details - {editingDetails?.nct_id}</DialogTitle>
                <Button variant="default" size="sm">
                  <Save className="mr-2 w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </DialogHeader>
            {editingDetails && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="criteria">Criteria</TabsTrigger>
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="prescreening">Pre-Screening</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="gap-4 grid">
                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label>NCT ID</Label>
                        <Input defaultValue="NCT05556824" />
                      </div>
                      <div className="space-y-2">
                        <Label>Overall Status</Label>
                        <Select defaultValue="RECRUITING">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RECRUITING">Recruiting</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Brief Title</Label>
                      <Input defaultValue="Multi-Center Study of Panosyl-Isomaltooligosaccharides Adjunctive to PPI Therapy to Treat GERD" />
                    </div>

                    <div className="space-y-2">
                      <Label>Official Title</Label>
                      <Textarea
                        rows={3}
                        defaultValue="A Multi-Center Study of Panosyl-Isomaltooligosaccharides (PIMO) Adjunctive to Proton Pump Inhibitor (PPI) Therapy to Treat Gastroesophageal Reflux Disease (GERD) in Subjects Who Are PPI-Responders or PPI-Partial Responders"
                      />
                    </div>

                    <div className="gap-4 grid grid-cols-3">
                      <div className="space-y-2">
                        <Label>Phase</Label>
                        <Input defaultValue="Phase III" />
                      </div>
                      <div className="space-y-2">
                        <Label>Study Type</Label>
                        <Input defaultValue="Interventional" />
                      </div>
                      <div className="space-y-2">
                        <Label>Principal Investigator</Label>
                        <Input defaultValue="Dr. Maria Alvarez, MD, PhD" />
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label>Sponsor</Label>
                        <Input defaultValue="Microbiome Health Sciences" />
                      </div>
                      <div className="space-y-2">
                        <Label>Intervention/Treatment</Label>
                        <Input defaultValue="Drug: MHS-1031, Other: Placebo" />
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label>Enrollment</Label>
                        <Input type="number" defaultValue="247" />
                      </div>
                      <div className="space-y-2">
                        <Label>Enrollment Available</Label>
                        <Input type="number" defaultValue="2321" />
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label>Study Start Date</Label>
                        <Input type="date" defaultValue="2023-03-03" />
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Completion</Label>
                        <Input defaultValue="2026-03" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Link to ClinicalTrials.gov</Label>
                      <Input defaultValue="https://clinicaltrials.gov/study/NCT05556824" />
                    </div>

                    <div className="space-y-2">
                      <Label>Study Description</Label>
                      <Textarea
                        rows={6}
                        defaultValue="This multi-center, randomized, double-blind, placebo-controlled Phase III clinical trial aims to evaluate the efficacy and safety of Panosyl-Isomaltooligosaccharides (PIMO) as an adjunctive therapy to Proton Pump Inhibitors (PPIs) in treating Gastroesophageal Reflux Disease (GERD). The study will enroll 247 adult participants who are PPI-responders or PPI-partial responders. Participants will be randomly assigned in a 2:1 ratio to receive either PIMO or a placebo for a duration of 8 weeks."
                      />
                    </div>

                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label>Study Design</Label>
                        <Input defaultValue="Randomized, Double-Blind, Placebo-Controlled, Multi-Center Phase III Trial" />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input defaultValue="8 weeks of treatment with a follow-up period of 4 weeks" />
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Primary Outcome</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Measure</Label>
                          <Input defaultValue="Heartburn-free days/week" />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea rows={3} defaultValue="The difference between baseline weekly average heartburn-free days and weekly average heartburn-free days during Treatment Phase Weeks 1-4 and Weeks 5-8" />
                        </div>
                        <div className="space-y-2">
                          <Label>Time Frame</Label>
                          <Input defaultValue="4 and 8 weeks" />
                        </div>
                      </CardContent>
                    </Card>

                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label>Closest Location</Label>
                        <Input defaultValue="A and U Family Medicine (NCR), Sugar Land, Texas, 77479" />
                      </div>
                      <div className="space-y-2">
                        <Label>Distance</Label>
                        <Input defaultValue="~10 miles away" />
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-3">
                      <div className="space-y-2">
                        <Label>IPD Sharing</Label>
                        <Select defaultValue="No">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>US Regulated Drug</Label>
                        <Select defaultValue="Yes">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>US Regulated Device</Label>
                        <Select defaultValue="No">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Criteria Tab */}
                <TabsContent value="criteria" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inclusion Criteria</CardTitle>
                      <CardDescription>Criteria that patients must meet to be eligible</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        rows={12}
                        className="font-mono text-sm"
                        defaultValue="• In the opinion of the investigator or sub-investigators, the subject is capable of understanding and complying with protocol requirements&#10;• Subject signs and dates an electronic (Screening Phase Part 1) and site-specific written informed consent form&#10;• Ability to complete all required online nightly RESQ-eD questionnaires&#10;• Access to a computer/tablet/phone with internet access and active email account&#10;• Males or females ≥18 and ≤75 years of age, with a BMI ≥ 18 and < 35 kg/m2&#10;• Female subjects must be postmenopausal or surgically sterile or use contraception&#10;• Must be on stable doses of medications, if any, prescribed for chronic conditions other than GERD"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exclusion Criteria</CardTitle>
                      <CardDescription>Criteria that disqualify patients from participation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        rows={15}
                        className="font-mono text-sm"
                        defaultValue="• Current use of any mouthwash or unwilling to discontinue use&#10;• Teeth whitening within 7 days of Screening Call&#10;• Current use of histamine 2 receptor antagonists (H2RAs)&#10;• Surgical procedure requiring general anesthesia within 60 days&#10;• History of cancer diagnosis and/or treatment within the preceding five years&#10;• History of untreated peptic or gastric ulcer, Zollinger-Ellison syndrome&#10;• History of ulcerative colitis or Crohn's disease&#10;• Acute or chronic hepatitis B virus (HBV), hepatitis C virus (HCV), or HIV infection&#10;• Significant current morbidity of the heart, kidney, liver or lung&#10;• History of Long QT Syndrome or Torsades de pointes (TdP)&#10;• Current neurological or psychiatric disorder&#10;• Known or suspected alcoholism, drug addiction&#10;• Active history of tobacco or nicotine use averaging more than 1 cigar/cigarette per week&#10;• Alcohol abuse (>14 drinks/week or 4 drinks/day for men, 7 drinks/week or 3 drinks/day for women)"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Procedures Tab */}
                <TabsContent value="procedures" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Comparator Group</CardTitle>
                      <CardDescription>Intervention/Treatment for active participants</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        rows={4}
                        defaultValue="Study medication will be supplied as a syrup in individual sachets containing 1g (1.5 mL) of MHS-1031. Subjects will be randomized in 2:1 fashion to either study drug (2) or placebo (1)"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Placebo Comparator Group</CardTitle>
                      <CardDescription>Intervention/Treatment for placebo participants</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        rows={4}
                        defaultValue="Matching placebo is an oral solution formulated to have a degree of sweetness and acidity similar to the study medication and will be provided in equivalent sachets containing 1.5g (1.5 mL) of the oral placebo solution."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contacts Tab */}
                <TabsContent value="contacts" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Contacts</CardTitle>
                      <CardDescription>Contact information for study coordinators and personnel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="gap-4 grid grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input defaultValue="Tina Higginbotham" />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input defaultValue="Study Coordinator" />
                        </div>
                      </div>
                      <div className="gap-4 grid grid-cols-2">
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input defaultValue="650-897-8099" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input defaultValue="thigginbotham@microbiomehealthsciences.com" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 w-4 h-4" />
                        Add Contact
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pre-Screening Tab */}
                <TabsContent value="prescreening" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pre-Screening Information</CardTitle>
                      <CardDescription>Instructions and questions for initial patient screening</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Pre-Screening Info</Label>
                        <Textarea
                          rows={3}
                          defaultValue="Please ask the patient the following, if they answer NO to any of these questions, they are not eligible for the study."
                        />
                      </div>

                      <div className="space-y-4 mt-6">
                        <Label className="font-semibold text-lg">Pre-Screening Questions</Label>

                        <Card className="border-2">
                          <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                              <Label>Question 1</Label>
                              <Textarea
                                rows={3}
                                defaultValue="Are you willing and able to remain in the U.S. (or avoid travel that crosses >2 hour time zones) during the study period, and maintain study-related restrictions (e.g., discontinue certain types of mouthwash/teeth-whitening products) if applicable?"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Answer Type</Label>
                              <Select defaultValue="yes_no">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes_no">Yes/No</SelectItem>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2">
                          <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                              <Label>Question 2</Label>
                              <Textarea
                                rows={2}
                                defaultValue="Are you currently using any investigational products or participating in another clinical trial?"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Answer Type</Label>
                              <Select defaultValue="yes_no">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes_no">Yes/No</SelectItem>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>

                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 w-4 h-4" />
                          Add Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Sites Dialog */}
        <Dialog open={!!assigningSites} onOpenChange={() => setAssigningSites(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Sites to {assigningSites?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {sitesList?.map((site: any) => (
                <div key={site.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{site.user.name}</p>
                    <p className="text-muted-foreground text-sm">{site.address || "No location"}</p>
                  </div>
                  <Checkbox />
                </div>
              ))}
              <Button className="w-full">Assign Sites</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Sponsors Dialog */}
        <Dialog open={!!assigningSponsors} onOpenChange={() => setAssigningSponsors(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Sponsors to {assigningSponsors?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Assign New Sponsor</Label>
                <div className="flex gap-3">
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sponsorsList?.map((sponsor: any) => (
                        <SelectItem key={sponsor.id} value={sponsor.id}>
                          {sponsor.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox id="canEdit" />
                    <Label htmlFor="canEdit" className="text-sm">Can Edit</Label>
                  </div>
                  <Button>Assign</Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Assigned Sponsors</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sponsor</TableHead>
                        <TableHead>Can Edit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Manasvi malav</TableCell>
                        <TableCell>
                          <Badge variant="default">✓</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  );
}

function TrialForm({ trial, onSuccess }: { trial: Trial | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    nct_id: trial?.nct_id || "",
    name: trial?.name || "",
    description: trial?.description || "",
    status: trial?.status || "active",
    start_date: trial?.start_date || "",
    end_date: trial?.end_date || "",
  });
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (trial) {
        return await apiService.updateTrial(trial.id, data);
      } else {
        return await apiService.createTrial(data);
      }
    },
    onSuccess: () => {
      toast({ title: trial ? "Trial updated" : "Trial created" });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nct_id">NCT ID *</Label>
        <Input
          id="nct_id"
          value={formData.nct_id}
          onChange={(e) => setFormData({ ...formData, nct_id: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : trial ? "Update" : "Create"}
      </Button>
    </form>
  );
}
