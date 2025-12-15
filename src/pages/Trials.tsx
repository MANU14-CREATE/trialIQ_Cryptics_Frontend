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
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "./Organizations";

interface Trial {
  id: string;
  nct_id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  sponsors: [],
  sites: []
}
function TrialEditor({ initialData, onSave }) {
  const [formData, setFormData] = useState(initialData);

  // -------------------------
  // Generic Updaters
  // -------------------------
  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const updatePrimaryOutcome = (field, value) => {
    const updated = [...formData.Overview.primary_outcome];
    updated[0][field] = value;
    updateNested("Overview", "primary_outcome", updated);
  };

  const updateProcedure = (idx, key, value) => {
    const updated = [...formData.procedures];
    updated[idx][key] = value;
    update("procedures", updated);
  };

  const updateContact = (idx, key, value) => {
    const updated = [...formData.contacts];
    updated[idx][key] = value;
    update("contacts", updated);
  };

  const updatePreScreeningQuestion = (idx, key, value) => {
    const updated = [...formData["pre-screening"].prescreening_questions];
    updated[idx][key] = value;
    updateNested("pre-screening", "prescreening_questions", updated);
  };

  // -------------------------
  // Render
  // -------------------------

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">
          Edit Trial – {formData.nctId}
        </h2>

        <Button onClick={() => onSave(formData)}>
          <Save className="mr-2 w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="prescreening">Pre-Screening</TabsTrigger>
        </TabsList>

        {/* ========================================================= */}
        {/*                     OVERVIEW TAB                         */}
        {/* ========================================================= */}

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="gap-4 grid">

            {/* NCT ID / Status */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <Label>NCT ID</Label>
                <Input
                  value={formData.nctId}
                  onChange={(e) => update("nctId", e.target.value)}
                  disabled
                />
              </div>

              <div>
                <Label>Overall Status</Label>
                <Select
                  value={formData.overallStatus}
                  onValueChange={(val) => update("overallStatus", val)}
                >
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

            {/* Titles */}
            <div>
              <Label>Brief Title</Label>
              <Input
                value={formData.briefTitle}
                onChange={(e) => update("briefTitle", e.target.value)}
              />
            </div>

            <div>
              <Label>Official Title</Label>
              <Textarea
                rows={3}
                value={formData.officialTitle}
                onChange={(e) => update("officialTitle", e.target.value)}
              />
            </div>

            {/* Phase / Study Type / PI */}
            <div className="gap-4 grid grid-cols-3">
              <div>
                <Label>Phase</Label>
                <Input
                  value={formData.phase}
                  onChange={(e) => update("phase", e.target.value)}
                />
              </div>

              <div>
                <Label>Study Type</Label>
                <Input
                  value={formData.study_type}
                  onChange={(e) => update("study_type", e.target.value)}
                />
              </div>

              <div>
                <Label>Principal Investigator</Label>
                <Input
                  value={formData.pi}
                  onChange={(e) => update("pi", e.target.value)}
                />
              </div>
            </div>

            {/* Sponsor / Treatment */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <Label>Sponsor</Label>
                <Input
                  value={formData.sponsor}
                  onChange={(e) => update("sponsor", e.target.value)}
                />
              </div>

              <div>
                <Label>Intervention / Treatment</Label>
                <Input
                  value={formData.intervention_treatment}
                  onChange={(e) =>
                    update("intervention_treatment", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Enrollment */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <Label>Enrollment</Label>
                <Input
                  value={formData.enrollment}
                  onChange={(e) => update("enrollment", e.target.value)}
                />
              </div>

              <div>
                <Label>Enrollment Available</Label>
                <Input
                  value={formData.enrollment_available}
                  onChange={(e) =>
                    update("enrollment_available", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Dates */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <Label>Study Start Date</Label>
                <Input
                  type="date"
                  value={formData.study_start}
                  onChange={(e) => update("study_start", e.target.value)}
                />
              </div>

              <div>
                <Label>Estimated Completion</Label>
                <Input
                  value={formData.estimated_completion}
                  onChange={(e) =>
                    update("estimated_completion", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Link */}
            <div>
              <Label>Link to ClinicalTrials.gov</Label>
              <Input
                value={formData.link_to_ctgov}
                onChange={(e) => update("link_to_ctgov", e.target.value)}
              />
            </div>

            {/* Study Description */}
            <div>
              <Label>Study Description</Label>
              <Textarea
                rows={6}
                value={formData.Overview.study_description}
                onChange={(e) =>
                  updateNested("Overview", "study_description", e.target.value)
                }
              />
            </div>

            {/* Study Design / Duration */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <Label>Study Design</Label>
                <Input
                  value={formData.Overview.study_design}
                  onChange={(e) =>
                    updateNested("Overview", "study_design", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Duration</Label>
                <Input
                  value={formData.Overview.duration}
                  onChange={(e) =>
                    updateNested("Overview", "duration", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Primary Outcome */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Primary Outcome</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Measure</Label>
                  <Input
                    value={formData.Overview.primary_outcome[0].measure}
                    onChange={(e) =>
                      updatePrimaryOutcome("measure", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={formData.Overview.primary_outcome[0].description}
                    onChange={(e) =>
                      updatePrimaryOutcome("description", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Time Frame</Label>
                  <Input
                    value={formData.Overview.primary_outcome[0].timeFrame}
                    onChange={(e) =>
                      updatePrimaryOutcome("timeFrame", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card> */}
            {/* Primary Outcomes (Multiple) */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Outcomes</CardTitle>
                <CardDescription>
                  Add one or more primary outcome measures.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">

                {formData.Overview.primary_outcome.map((outcome, index) => (
                  <Card key={index} className="space-y-4 p-4 border">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">Outcome #{index + 1}</h4>

                      {index > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updated = [...formData.Overview.primary_outcome];
                            updated.splice(index, 1);
                            updateNested("Overview", "primary_outcome", updated);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Measure */}
                    <div className="space-y-2">
                      <Label>Measure</Label>
                      <Input
                        value={outcome.measure}
                        onChange={(e) => {
                          const updated = [...formData.Overview.primary_outcome];
                          updated[index].measure = e.target.value;
                          updateNested("Overview", "primary_outcome", updated);
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={outcome.description}
                        onChange={(e) => {
                          const updated = [...formData.Overview.primary_outcome];
                          updated[index].description = e.target.value;
                          updateNested("Overview", "primary_outcome", updated);
                        }}
                      />
                    </div>

                    {/* Time Frame */}
                    <div className="space-y-2">
                      <Label>Time Frame</Label>
                      <Input
                        value={outcome.timeFrame}
                        onChange={(e) => {
                          const updated = [...formData.Overview.primary_outcome];
                          updated[index].timeFrame = e.target.value;
                          updateNested("Overview", "primary_outcome", updated);
                        }}
                      />
                    </div>
                  </Card>
                ))}

                {/* Add New Outcome */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...formData.Overview.primary_outcome];
                    updated.push({
                      measure: "",
                      description: "",
                      timeFrame: "",
                    });
                    updateNested("Overview", "primary_outcome", updated);
                  }}
                >
                  <Plus className="mr-2 w-4 h-4" /> Add Outcome
                </Button>
              </CardContent>
            </Card>


            {/* Location */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <Label>Closest Location</Label>
                <Input
                  value={formData.Overview.Closest_location}
                  onChange={(e) =>
                    updateNested("Overview", "Closest_location", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Distance</Label>
                <Input
                  value={formData.Overview.location_distance_miles}
                  onChange={(e) =>
                    updateNested(
                      "Overview",
                      "location_distance_miles",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* IPD / Drug / Device */}
            <div className="gap-4 grid grid-cols-3">
              <div>
                <Label>IPD Sharing</Label>
                <Select
                  value={formData.Overview.ipd}
                  onValueChange={(val) =>
                    updateNested("Overview", "ipd", val)
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>US Regulated Drug</Label>
                <Select
                  value={formData.Overview.us_regulated_drug}
                  onValueChange={(val) =>
                    updateNested("Overview", "us_regulated_drug", val)
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>US Regulated Device</Label>
                <Select
                  value={formData.Overview.us_regulated_device}
                  onValueChange={(val) =>
                    updateNested("Overview", "us_regulated_device", val)
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/*                         CRITERIA                         */}
        {/* ========================================================= */}

        <TabsContent value="criteria" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inclusion Criteria</CardTitle>
              <CardDescription>List each entry on a new line</CardDescription>
            </CardHeader>

            <CardContent>
              <Textarea
                className="font-mono text-sm"
                rows={12}
                value={formData.criteria.inclusion_criteria.join("\n")}
                onChange={(e) =>
                  updateNested(
                    "criteria",
                    "inclusion_criteria",
                    e.target.value.split("\n")
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exclusion Criteria</CardTitle>
              <CardDescription>List each entry on a new line</CardDescription>
            </CardHeader>

            <CardContent>
              <Textarea
                className="font-mono text-sm"
                rows={14}
                value={formData.criteria.exclusion_criteria.join("\n")}
                onChange={(e) =>
                  updateNested(
                    "criteria",
                    "exclusion_criteria",
                    e.target.value.split("\n")
                  )
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/*                        PROCEDURES                        */}
        {/* ========================================================= */}

        <TabsContent value="procedures" className="space-y-4 mt-4">
          {formData.procedures.map((p, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{p.participant_group}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label>Participant Group</Label>
                  <Input
                    value={p.participant_group}
                    onChange={(e) =>
                      updateProcedure(idx, "participant_group", e.target.value)
                    }
                  />
                </div>

                {/* Key with slash */}
                <div>
                  <Label>Intervention / Treatment</Label>
                  <Textarea
                    rows={4}
                    value={p["intervention/treatment"]}
                    onChange={(e) =>
                      updateProcedure(
                        idx,
                        "intervention/treatment",
                        e.target.value
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ========================================================= */}
        {/*                         CONTACTS                         */}
        {/* ========================================================= */}

        <TabsContent value="contacts" className="space-y-4 mt-4">
          {formData.contacts.map((c, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>Contact #{idx + 1}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={c.name}
                      onChange={(e) =>
                        updateContact(idx, "name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={c.title}
                      onChange={(e) =>
                        updateContact(idx, "title", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={c.phone}
                      onChange={(e) =>
                        updateContact(idx, "phone", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      value={c.email}
                      onChange={(e) =>
                        updateContact(idx, "email", e.target.value)
                      }
                    />
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  <Plus className="mr-2 w-4 h-4" /> Add Contact
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ========================================================= */}
        {/*                     PRE-SCREENING                        */}
        {/* ========================================================= */}

        <TabsContent value="prescreening" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pre-Screening Info</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Instructions</Label>
                <Textarea
                  rows={4}
                  value={formData["pre-screening"].prescreening_info}
                  onChange={(e) =>
                    updateNested(
                      "pre-screening",
                      "prescreening_info",
                      e.target.value
                    )
                  }
                />
              </div>

              <Label className="font-semibold text-lg">
                Pre-Screening Questions
              </Label>

              {formData["pre-screening"].prescreening_questions.map(
                (q, idx) => (
                  <Card key={idx} className="border">
                    <CardContent className="space-y-4 pt-4">
                      <div>
                        <Label>Question</Label>
                        <Textarea
                          rows={3}
                          value={q.question}
                          onChange={(e) =>
                            updatePreScreeningQuestion(
                              idx,
                              "question",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <Label>Answer Type</Label>
                        <Select
                          value={q.type}
                          onValueChange={(val) =>
                            updatePreScreeningQuestion(idx, "type", val)
                          }
                        >
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
                )
              )}

              <Button variant="outline" size="sm">
                <Plus className="mr-2 w-4 h-4" /> Add Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
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

  const [trialData, setTrialData] = useState({} as any)
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [mainTrials, setMainTrials] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getTrials();
        if (!data) return;
        setTrialsList(data.trials)
        setMainTrials(data.trials)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hadChanged])
  useEffect(() => {
    let filtered = [...mainTrials]; // original list
    const sortByUserName = (list: any, direction = "asc") => {
      return [...list].sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return direction === "asc" ? result : -result;
      });
    }
    // 🔍 SEARCH FILTER
    if (debouncedSearch.trim() !== "") {
      filtered = filtered.filter((org) =>
        org.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // 🔠 SORT
    const sorted = sortByUserName(filtered, sortDirection);

    setTrialsList(sorted);
  }, [debouncedSearch, sortField, sortDirection]);
  const handleSort = (field: keyof Trial) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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



  const fetchTrialDetails = async (trial: any, type: any) => {
    setViewingTrial(trial);
    try {
      const data = await apiService.fetchTrial({
        "auth_token": "UirmCXEy4A",
        "trial_id": type === "edit" ? trial?.nctId : trial?.nct_id
      });
      if (!data) return;
      setTrialData(data)
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editTrialDetails = async (trialDet: any) => {
    setViewingTrial(trialDet);
    try {
      const data = await apiService.editTrial({
        "auth_token": "UirmCXEy4A",
        "trial_id": trialDet?.nctId,
        "trial_body": {
          "additionalProp1": trialDet
        }
      });
      if (!data) return;
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
      setEditingDetails(null)
      fetchTrialDetails(trialDet, "edit")
    }
  };


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
      setHadChanged(!hadChanged)
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


  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [addSponsorLoading, setAddSponsorLoading] = useState<boolean>(false);

  // Submit handler
  const handleAssignSponsor = () => {
    if (!selectedSponsor) {
      alert("Please select a sponsor");
      return;
    }

    const payload = {
      "sponsor_id": selectedSponsor,
      "can_edit": canEdit
    };


    const callApi = async () => {
      let result: any;
      try {
        setAddSponsorLoading(true)
        result = await apiService.assignSponsorToTrial(assigningSponsors.id, payload)
        if (!result) return;
        toast({
          title: result?.success ? "Sponsor assigned to trial successfully" : result?.data?.error?.message,
          variant: result?.success ? "default" : "destructive"
        });
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setAddSponsorLoading(false)
        // Reset after submission
        setSelectedSponsor(null);
        setCanEdit(false);
        setHadChanged(!hadChanged)
        setAssigningSponsors(null)
      }
    }
    callApi()
  };

  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [addSiteLoading, setAddSiteLoading] = useState<boolean>(false);

  // Single select handler
  const handleCheckboxChange = (siteId: number) => {
    setSelectedSites((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId) // remove if already selected
        : [...prev, siteId] // add new
    );
  };
  useEffect(() => {
    if (!assigningSites?.sites) return;
    const ids = assigningSites.sites.map((s: any) => s.id);
    setSelectedSites(ids);
  }, [assigningSites]);

  // Submit handler
  const handleAssignSites = () => {
    if (!selectedSites) {
      alert("Please select a site");
      return;
    }
    const payload = {
      "site_ids": selectedSites
    };
    const callApi = async () => {
      let result: any;
      try {
        setAddSiteLoading(true)
        result = await apiService.assignSiteToTrial(assigningSites.id, payload)
        if (!result) return;
        toast({
          title: result?.success ? "Site assigned to trial successfully" : result?.data?.error?.message,
          variant: result?.success ? "default" : "destructive"
        });
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setAddSiteLoading(false)
        // Reset after submission
        setSelectedSites([]);
        setCanEdit(false);
        setHadChanged(!hadChanged)
        setAssigningSites(null)
      }
    }
    callApi()
  };
  const getSortIcon = (field: keyof Trial) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />;
  };


  const [deleteLoading, setDeleteLoading] = useState(false)
  const handleDeleteSponsor = (id: any) => {
    if (!id) {
      alert("Please select a sponsor");
      return;
    }
    const payload = {
      "sponsor_id": id,
    };

    const callApi = async () => {
      let result: any;
      setDeleteLoading(true)
      try {
        result = await apiService.deleteSponsorToTrial(assigningSponsors.id, payload)
        if (!result) return;
        toast({
          title: result?.success ? "Sponsor removed from trial" : result?.data?.error?.message,
          variant: result?.success ? "default" : "destructive"
        });
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setDeleteLoading(false)
        setCanEdit(false);
        setHadChanged(!hadChanged)
        setAssigningSponsors(null)
      }
    }
    callApi()
  };

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
                    }}
                    setHadChanged={() => setHadChanged(!hadChanged)}
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
                        onClick={() => handleSort("name")}
                        className="flex items-center hover:text-foreground"
                      >
                        Name
                        {getSortIcon("name")}
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
                          onClick={() => fetchTrialDetails(trial, "fetch")}
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
                          onClick={() => handleEdit(trial)}
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
                  <Button variant="outline" size="sm"
                    disabled={trialData && trialData[0] ? true : false}
                    onClick={() => {
                      setEditingDetails(viewingTrial);
                      setViewingTrial(null);
                    }}>
                    <Pencil className="mr-2 w-4 h-4" />
                    Edit Details
                  </Button>
                  {/* <Button variant="default" size="sm">
                    <Download className="mr-2 w-4 h-4" />
                    Export PDF
                  </Button> */}
                </div>
              </div>
            </DialogHeader>
            {
              trialData && trialData[0] ?
                <>
                  <div className="space-y-6 mt-6">
                    <p className="text-muted-foreground text-xs">
                      {trialData[0].error}
                    </p>
                  </div>
                </>
                :
                <>
                  {viewingTrial && trialData && (
                    <div className="space-y-6 mt-6">
                      {/* Title Section */}
                      <div>
                        <h2 className="mb-2 font-semibold text-xl">{trialData.briefTitle}</h2>
                        <p className="text-muted-foreground text-xs">
                          {trialData.officialTitle}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <Badge variant="destructive" className="px-3 py-1 text-xs">
                            {trialData.overallStatus}
                          </Badge>
                          <Badge className="bg-green-600 hover:bg-green-700 px-3 py-1 text-sx text-white">
                            Phase: {trialData.phase}
                          </Badge>
                          <Badge variant="secondary" className="px-3 py-1 text-sx">
                            {trialData.study_type}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="gap-4 grid grid-cols-3">
                        <Card className="bg-gradient-to-br from-purple-50 dark:from-purple-950/30 to-purple-100 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                          <CardContent className="pt-6">
                            <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Enrollment Required</p>
                            <p className="font-bold text-purple-900 dark:text-purple-100 text-3xl">
                              {trialData.enrollment}
                            </p>
                            <p className="text-purple-600 text-sm">Target</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 dark:from-green-900/30 to-green-100 dark:to-green-900/10">
                          <CardContent className="pt-6">
                            <p className="font-semibold text-green-700 text-sm">Enrollment Available</p>
                            <p className="font-bold text-green-900 text-3xl">{trialData.enrollment_available}</p>
                            <p className="text-green-600 text-sm">Spots available</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 dark:from-blue-900/30 to-blue-100 dark:to-blue-900/10">
                          <CardContent className="pt-6">
                            <p className="font-semibold text-blue-700 text-sm">Last Updated</p>
                            <p className="font-bold text-blue-900 text-3xl">{trialData.last_updated}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Overview Section */}
                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h3 className="font-bold text-xl">Overview</h3>

                        <Card>
                          <CardHeader>
                            <CardTitle>Study Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">

                            <div className="mt-2">
                              <p className="font-medium text-muted-foreground text-sm">Sponsor</p>
                              <p className="text-base">{trialData.sponsor}</p>
                            </div>

                            <div>
                              <p className="font-medium text-muted-foreground text-sm">Principal Investigator (PI)</p>
                              <p className="text-base">{trialData.pi}</p>
                            </div>

                            <div>
                              <p className="font-medium text-muted-foreground text-sm">Study Description</p>
                              <p className="mt-1 text-base">{trialData?.Overview?.study_description}</p>
                            </div>

                            <div className="gap-4 grid grid-cols-3">
                              <div>
                                <p className="font-medium text-muted-foreground text-sm">Study Design</p>
                                <p className="mt-1 text-base">{trialData?.Overview?.study_design}</p>
                              </div>

                              <div>
                                <p className="font-medium text-muted-foreground text-sm">Duration</p>
                                <p className="mt-1 text-base">{trialData?.Overview?.duration}</p>
                              </div>

                              <div>
                                <p className="font-medium text-muted-foreground text-sm">Location</p>
                                <p className="mt-1 text-base">{trialData?.Overview?.Closest_location}</p>
                                <p className="text-muted-foreground text-xs">{trialData?.Overview?.location_distance_miles}</p>
                              </div>
                            </div>

                            <div>
                              <p className="font-medium text-muted-foreground text-sm">Intervention/Treatment</p>
                              <p className="mt-1 text-base">{trialData.intervention_treatment}</p>
                            </div>

                            <div>
                              <p className="font-medium text-muted-foreground text-sm">ClinicalTrials.gov Link</p>
                              <a
                                href={trialData.link_to_ctgov}
                                target="_blank"
                                className="inline-block mt-1 text-primary hover:underline"
                              >
                                {trialData.link_to_ctgov}
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Primary Outcome */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Primary Outcome</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {trialData?.Overview?.primary_outcome.map((item, i) => (
                            <><div key={i} className="space-y-3" style={{
                              border: '1px solid #dcdcdc87',
                              borderRadius: 10,
                              padding: 10,
                              marginBottom: 10
                            }}>
                              <p><strong>Measure:</strong> {item.measure}</p>
                              <p><strong>Description:</strong> {item.description}</p>
                              <p><strong>Time Frame:</strong> {item.timeFrame}</p>
                            </div >
                            </>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Secondary Outcomes */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Secondary Outcomes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {trialData?.Overview?.secondary_outcomes.map((item, i) => (
                            <div key={i}>
                              <p className="font-semibold">{item.measure}</p>
                              <p>{item.description}</p>
                              <Badge variant="outline" className="mt-2">{item.timeFrame}</Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Criteria Section */}
                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h3 className="font-bold text-xl">Eligibility Criteria</h3>

                        <Card>
                          <CardHeader>
                            <CardTitle>Inclusion Criteria</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 pl-6 list-disc">
                              {trialData?.criteria?.inclusion_criteria.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Exclusion Criteria</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 pl-6 list-disc">
                              {trialData?.criteria?.exclusion_criteria.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Procedures Section */}
                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h3 className="font-bold text-xl">Study Procedures</h3>
                        <div className="gap-4 grid grid-cols-2">
                          {trialData?.procedures?.map((p, i) => (
                            <Card key={i}>
                              <CardHeader>
                                <CardTitle>{p?.participant_group}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>{p["intervention/treatment"]}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Contacts Section */}
                      <Separator className="my-6" />

                      <h3 className="font-bold text-xl">Study Contacts</h3>
                      {trialData?.contacts?.map((c, i) => (
                        <Card key={i}>
                          <CardContent className="pt-6">
                            <p><strong>Name:</strong> {c.name}</p>
                            <p><strong>Phone:</strong> {c.phone}</p>
                            <p><strong>Email:</strong> {c.email}</p>
                            <p><strong>Title:</strong> {c.title}</p>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Pre-Screening Section */}
                      <Separator className="my-6" />

                      <h3 className="font-bold text-xl">Pre-Screening</h3>

                      <Card>
                        <CardHeader>
                          <CardTitle>Pre-Screening Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{trialData["pre-screening"]?.prescreening_info}</p>

                          {trialData["pre-screening"]?.prescreening_questions.map((q, i) => (
                            <Card key={i} className="mb-3">
                              <CardContent className="pt-4">
                                <p className="font-medium">{q.question}</p>
                                <Badge variant="outline" className="mt-2">{q.type === "yes_no" ? "Yes / No" : q.type}</Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
            }

          </DialogContent>
        </Dialog>

        {/* Edit Trial Details Dialog - Editable */}
        <Dialog open={!!editingDetails} onOpenChange={() => setEditingDetails(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            {editingDetails && (
              <TrialEditor initialData={trialData} onSave={(it: any) => editTrialDetails(it)} />
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Sites Dialog */}
        <Dialog open={!!assigningSites} onOpenChange={() => setAssigningSites(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Sites to {assigningSites?.name}</DialogTitle>
            </DialogHeader>
            {/* <div className="space-y-4">
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
            </div> */}
            <div className="space-y-4">
              {sitesList?.map((site: any) => (
                <div
                  key={site.id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{site.user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {site.address || "No location"}
                    </p>
                  </div>

                  <Checkbox
                    checked={selectedSites.includes(site.id)}
                    onCheckedChange={() => handleCheckboxChange(site.id)}
                  />
                </div>
              ))}

              <Button
                className="w-full"
                onClick={handleAssignSites}
                disabled={addSiteLoading}
              >
                {addSiteLoading ? "Saving..." : "Assign"}
              </Button>
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
              {/* <div className="space-y-4">
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
              </div> */}
              <div className="space-y-4">
                <Label>Assign New Sponsor</Label>

                <div className="flex items-center gap-3">

                  {/* Sponsor Select */}
                  <Select
                    value={selectedSponsor ?? ""}
                    onValueChange={(value) => setSelectedSponsor(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sponsorsList?.map((sponsor: any) => (
                        <SelectItem key={sponsor.id} value={String(sponsor.id)}>
                          {sponsor.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Can Edit Checkbox */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="canEdit"
                      checked={canEdit}
                      onCheckedChange={(checked) => setCanEdit(Boolean(checked))}
                    />
                    <Label htmlFor="canEdit" className="text-sm">
                      Can Edit
                    </Label>
                  </div>

                  {/* Submit */}
                  <Button onClick={handleAssignSponsor} disabled={addSponsorLoading}>
                    {addSponsorLoading ? "Saving..." : "Assign"}
                  </Button>

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
                      {assigningSponsors?.sponsors.map((item: any) =>
                      (
                        <TableRow>
                          <TableCell className="font-medium">{item?.sponsor?.user?.name}</TableCell>
                          <TableCell>
                            <Badge variant={item?.can_edit ? "default" : "outline"} >✓</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant={deleteLoading ? "ghost" : "default"} size="icon"
                              disabled={deleteLoading}
                              onClick={() => handleDeleteSponsor(item?.sponsor_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                      )}
                      {/* <TableRow>
                        <TableCell className="font-medium">Manasvi malav</TableCell>
                        <TableCell>
                          <Badge variant="default">✓</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow> */}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider >
  );
}

function TrialForm(
  { trial, onSuccess, setHadChanged }:
    {
      trial: Trial | null;
      onSuccess: () => void;
      setHadChanged: () => void;
    }
) {
  const [formData, setFormData] = useState({
    nct_id: trial?.nct_id || "",
    name: trial?.name || "",
    description: trial?.description || "",
    status: trial?.status || "Active",
    start_date: trial ? new Date(trial?.start_date).toISOString().split("T")[0] : "",
    end_date: trial ? new Date(trial?.end_date).toISOString().split("T")[0] : "",
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [triggerSubmit, setTriggerSubmit] = useState(false);


  useEffect(() => {
    if (!triggerSubmit) return;
    const submitData = async () => {
      setLoading(true)
      try {
        let result: any;
        let sendItems = {
          nct_id: formData.nct_id,
          name: formData.name,
          description: formData.description,
          status: formData.status,
          start_date: new Date(formData.start_date).toISOString(),
          end_date: new Date(formData.end_date).toISOString()
        }
        if (trial) {
          result = await apiService.updateTrial(trial.id, sendItems);
        } else {
          result = await apiService.createTrial(sendItems);
        }
        toast({
          title: trial ? "Trial updated" : "Trial created"
        });
        onSuccess();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false)
        setTriggerSubmit(false); // reset trigger
        setHadChanged()
      }
    };
    submitData();
  }, [triggerSubmit]); // runs when triggered


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriggerSubmit(true)
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : trial ? "Update" : "Create"}
      </Button>
    </form>
  );
}
