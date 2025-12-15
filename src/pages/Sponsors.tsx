import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, FileText, Eye, List, Building2, ToggleLeft, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { SearchBar } from "@/components/SearchBar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "./Organizations";

interface Sponsor {
  id: string;
  name: string;
  entity_id: string | null;
  owner_email: string;
  primary_phone: string | null;
  entity_legal_documents: any | null;
  address: string | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  is_active: boolean;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  sites: [],
  sponsors: []
}

export default function Sponsors() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [viewingSponsor, setViewingSponsor] = useState<Sponsor | null>(null);
  const [assigningTrials, setAssigningTrials] = useState<Sponsor | null>(null);
  const [assigningSites, setAssigningSites] = useState<Sponsor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Sponsor | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData, loading: userLoading } = useUserRole();
  const [sponsorsList, setSponsorsList] = useState([]);
  const [sitesList, setSitesList] = useState([])
  const [trialsList, setTrialsList] = useState([])
  const [hadChanged, setHadChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const [mainSponsors, setMainSponsors] = useState([])

  useEffect(() => {
    const fetchD = async () => {
      try {
        const data = await apiService.getSponsors();
        if (!data) return;
        setSponsorsList(data.sponsors)
        setMainSponsors(data.sponsors)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchD();
  }, [hadChanged])

  useEffect(() => {
    let filtered = [...mainSponsors]; // original list
    const sortByUserName = (list: any, direction = "asc") => {
      return [...list].sort((a, b) => {
        const result = a.user.name.localeCompare(b.user.name);
        return direction === "asc" ? result : -result;
      });
    }
    // 🔍 SEARCH FILTER
    if (debouncedSearch.trim() !== "") {
      filtered = filtered.filter((org) =>
        org.user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // 🔠 SORT
    const sorted = sortByUserName(filtered, sortDirection);

    setSponsorsList(sorted);
  }, [debouncedSearch, sortField, sortDirection]);
  const handleSort = (field: keyof Sponsor) => {
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
        const data = await apiService.getTrials();
        if (!data) return;
        setTrialsList(data.trials)
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



  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!deleteId) return;
    const deleteSponsor = async () => {
      try {
        await apiService.deleteSponsor(deleteId);
        toast({ title: "Sponsor deleted successfully" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setDeleteId(null); // reset
        setHadChanged(!hadChanged)
      }
    };

    deleteSponsor();
  }, [deleteId]);



  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingSponsor(null);
    setIsOpen(true);
  };


  const assignSitesToSponsor = () => {
    try {
      let result: any
      // const data ;
    } catch (error) {

    } finally {

    }
  }
  const getSortIcon = (field: keyof Sponsor) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />;
  };


  const [selectedTrials, setSelectedTrials] = useState<number[]>([]);

  // Toggle selection
  const handleCheckboxChange = (trialId: number) => {
    setSelectedTrials((prev) =>
      prev.includes(trialId)
        ? prev.filter((id) => id !== trialId)
        : [...prev, trialId]
    );
  };

  // Submit selected trials
  const handleAssignTrials = () => {
    if (selectedTrials.length === 0) {
      alert("Please select at least one trial");
      return;
    }

    console.log("Assigned Trials:", selectedTrials);

    // Example API call
    // await api.assignTrials({ trialIds: selectedTrials });

    // Clear selection after assign
    setSelectedTrials([]);
  };


  const [selectedSites, setSelectedSites] = useState<number[]>([]);

  const handleCheckboxChange2 = (siteId: number) => {
    setSelectedSites((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)   // remove
        : [...prev, siteId]                    // add
    );
  };
  useEffect(() => {
    if (!assigningSites?.sites) return;
    const ids = assigningSites.sites.map((s: any) => s.id);
    setSelectedSites(ids);
  }, [assigningSites]);

  const [addSiteLoading, setAddSiteLoading] = useState<boolean>(false);
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
        result = await apiService.assignSiteToSponsor(assigningSites.id, payload)
        if (!result) return;
        toast({
          title: result?.success ? "Site assigned to sponsor successfully" : result?.data?.error?.message,
          variant: result?.success ? "default" : "destructive"
        });
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setAddSiteLoading(false)
        // Reset after submission
        setSelectedSites([]);
        setHadChanged(!hadChanged)
        setAssigningSites(null)
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
              <h1 className="font-bold text-3xl">Sponsors</h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search sponsors..."
              />
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Sponsor
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <div style={{ maxHeight: 750, overflow: 'scroll' }}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSponsor ? "Edit Sponsor" : "Add Sponsor"}
                      </DialogTitle>
                    </DialogHeader>
                    <div style={{ height: 10, margin: '10px 0px' }}></div>
                    <SponsorForm
                      sponsor={editingSponsor}
                      onSuccess={() => {
                        setIsOpen(false);
                      }}
                      setHadChanged={() => setHadChanged(!hadChanged)}
                    />
                  </div>
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
                        // onClick={() => handleSort("entity_id")}
                        className="flex items-center hover:text-foreground"
                      >
                        Sponsor ID
                        {/* {getSortIcon("entity_id")} */}
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
                        // onClick={() => handleSort("owner_email")}
                        className="flex items-center hover:text-foreground"
                      >
                        Owner Email
                        {/* {getSortIcon("owner_email")} */}
                      </button>
                    </TableHead>
                    <TableHead>Primary Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsorsList?.map((sponsor) => (
                    <TableRow key={sponsor?.id}>
                      <TableCell className="font-medium">{sponsor?.id || "-"}</TableCell>
                      <TableCell>{sponsor?.user?.name}</TableCell>
                      <TableCell>{sponsor?.user?.email}</TableCell>
                      <TableCell>{sponsor?.user?.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={sponsor?.is_active ? "default" : "secondary"}>
                          {sponsor?.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingSponsor(sponsor)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAssigningTrials(sponsor)}
                          title="Assign Trials"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAssigningSites(sponsor)}
                          title="Assign Sites"
                        >
                          <Building2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(sponsor)}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          title="Toggle Status"
                        >
                          <ToggleLeft className="w-4 h-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(sponsor.id)}
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

        {/* View Sponsor Details Dialog */}
        <Dialog open={!!viewingSponsor} onOpenChange={() => setViewingSponsor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sponsor Details</DialogTitle>
            </DialogHeader>
            {viewingSponsor && (
              <div className="space-y-4">
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Sponsor Name</Label>
                    <p className="font-medium">{viewingSponsor?.user?.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sponsor ID</Label>
                    <p className="font-medium">{viewingSponsor.id || "-"}</p>
                  </div>
                </div>
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Owner Email</Label>
                    <p className="font-medium">{viewingSponsor?.user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Primary Phone</Label>
                    <p className="font-medium">{viewingSponsor?.user?.phone || "-"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium">{viewingSponsor.address || "-"}</p>
                </div>
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Contact Person</Label>
                    <p className="font-medium">{viewingSponsor.contact_person || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Email</Label>
                    <p className="font-medium">{viewingSponsor.contact_email || "-"}</p>
                  </div>
                </div>
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Contact Phone</Label>
                    <p className="font-medium">{viewingSponsor.contact_phone || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="font-medium">
                      {new Date(viewingSponsor.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Legal Documents</Label>
                  {viewingSponsor.entity_legal_documents &&
                    Array.isArray(viewingSponsor.entity_legal_documents) &&
                    viewingSponsor.entity_legal_documents.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {viewingSponsor.entity_legal_documents.map((doc: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-muted-foreground text-sm">No legal documents uploaded</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Trials Dialog */}
        <Dialog open={!!assigningTrials} onOpenChange={() => setAssigningTrials(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Trials to {assigningTrials?.user?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* {trialsList?.map((trial: any) => (
                <div key={trial.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{trial.name}</p>
                    <p className="text-muted-foreground text-sm">Status: {trial.status}</p>
                  </div>
                  <Checkbox />
                </div>
              ))}
              <Button className="w-full">Assign Trials</Button> */}
              {trialsList?.map((trial: any) => (
                <div
                  key={trial.id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{trial.name}</p>
                    <p className="text-muted-foreground text-sm">
                      Status: {trial.status}
                    </p>
                  </div>

                  <Checkbox
                    checked={selectedTrials.includes(trial.id)}
                    onCheckedChange={() => handleCheckboxChange(trial.id)}
                  />
                </div>
              ))}

              <Button className="w-full" onClick={handleAssignTrials}>
                Assign Trials
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Sites Dialog */}
        <Dialog open={!!assigningSites} onOpenChange={() => setAssigningSites(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign sites to {assigningSites?.user?.name}</DialogTitle>
            </DialogHeader>
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
                    onCheckedChange={() => handleCheckboxChange2(site.id)}
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
      </main>
    </SidebarProvider >
  );
}

function SponsorForm({
  sponsor,
  onSuccess,
  setHadChanged
}: {
  sponsor: Sponsor | null;
  onSuccess: () => void;
  setHadChanged: () => void;
}) {
  const [formData, setFormData] = useState({
    // name: sponsor?.name || "",
    // owner_email: sponsor?.owner_email || "",
    // primary_phone: sponsor?.primary_phone || "",
    entity_legal_documents: []
    // address: sponsor?.address || "",
    // contact_person: sponsor?.contact_person || "",
    // contact_email: sponsor?.contact_email || "",
    // contact_phone: sponsor?.contact_phone || "",
    // is_active: sponsor?.is_active ?? true,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [is_active, setIs_Active] = useState(true);



  const [newDocName, setNewDocName] = useState("");
  const [newDocTags, setNewDocTags] = useState("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [sendDocsItems, setSendDocsItems] = useState(null);
  const [loading, setLoading] = useState(false)
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const { toast } = useToast();
  const [existingDocs, setExistingDocs] = useState([]);
  const [docDeleteFlag, setDocDeleteFlag] = useState(false)



  useEffect(() => {
    const buildDocumentsFormData = (arr: any) => {
      const formD = new FormData();
      // Extract arrays of names + tags
      const names = arr.map((d) => d.documentName);
      const tags = arr.map((d) => d.tags);

      // Add as JSON strings (required by your backend)
      formD.append("document_names", JSON.stringify(names));
      formD.append("document_tags", JSON.stringify(tags));

      // Add individual files as documents[0], documents[1]...
      arr.forEach((item, index) => {
        if (item.document) {
          formD.append(`documents[${index}]`, item.document);
        }
      });
      return formD;
    }
    const data = buildDocumentsFormData(formData.entity_legal_documents)
    setSendDocsItems(data);
  }, [formData.entity_legal_documents])

  useEffect(() => {
    if (sponsor) {
      const { user, address, is_active,
      } = sponsor
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
      setAddress(address)
      setIs_Active(is_active)
    }
  }, [sponsor])

  useEffect(() => {
    if (sponsor) {
      const { id } = sponsor;
      const getDocs = async () => {
        setLoading(true)
        try {
          let result: any;
          result = await apiService.getSponsorDocs(id)
          if (!result) result;
          console.log("---------")
          setExistingDocs(result)
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false)
        }
      };
      getDocs();
    }

  }, [sponsor, docDeleteFlag])

  useEffect(() => {
    if (!triggerSubmit) return;
    const submitData = async () => {
      setLoading(true)
      let result: any;
      let docResult: any;
      try {

        let newItems = {
          name: name,
          email: email,
          password: password,
          phone: phone,
          address: address,
          is_active: is_active
        };
        if (sponsor) {
          if (newItems.password === null || newItems.password === "") {
            delete newItems.password;
          }
          docResult = await apiService.updateSponsor(sponsor.id, newItems);
          docResult = await apiService.createSponsorDocs(sponsor.id, sendDocsItems);
        } else {
          result = await apiService.createSponsor(newItems);
          docResult = await apiService.createSponsorDocs(result.sponsor.id, sendDocsItems);
        }

        toast({
          title: sponsor ? "Sponsor updated" : "Sponsor created"
        });
        onSuccess();
      } catch (error: any) {
        console.log(result);
        toast({
          title: "Error",
          description: result ? result.error.message : " Something went wrong",
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
    setTriggerSubmit(true);
  };

  const handleSingleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocFile(e.target.files[0]);
    }
  };

  const handleAddDocument = () => {
    if (!newDocName.trim()) {
      toast({ title: "Error", description: "Document name is required", variant: "destructive" });
      return;
    }

    const newDoc = {
      documentName: newDocName,
      tags: newDocTags,
      fileName: newDocFile?.name || null,
      fileSize: newDocFile?.size || null,
      fileType: newDocFile?.type || null,
      document: newDocFile
    };

    const updatedDocs = formData.entity_legal_documents
      ? [...(formData.entity_legal_documents as any[]), newDoc]
      : [newDoc];

    setFormData({ ...formData, entity_legal_documents: updatedDocs });

    // Reset fields
    setNewDocName("");
    setNewDocTags("");
    setNewDocFile(null);
    const fileInput = document.getElementById('doc_file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleAddWithoutFile = () => {
    if (!newDocName.trim()) {
      toast({ title: "Error", description: "Document name is required", variant: "destructive" });
      return;
    }

    const newDoc = {
      documentName: newDocName,
      tags: newDocTags,
      fileName: null,
      uploadedAt: new Date().toISOString()
    };

    const updatedDocs = formData.entity_legal_documents
      ? [...(formData.entity_legal_documents as any[]), newDoc]
      : [newDoc];

    setFormData({ ...formData, entity_legal_documents: updatedDocs });

    // Reset fields
    setNewDocName("");
    setNewDocTags("");
  };

  const removeExistingDocument = (index: number) => {
    const updatedDocs = formData.entity_legal_documents
      ? [...(formData.entity_legal_documents as any[])].filter((_, idx) => idx !== index)
      : [];
    setFormData({ ...formData, entity_legal_documents: updatedDocs });
  };

  const deleteExistingDocument = (doc: any) => {
    const deleteData = async () => {
      setLoading(true)
      try {
        let result: any;
        result = await apiService.deleteSponsorDoc(sponsor.id, doc.id)
        toast({
          title: "Document Deleted"
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false)
        setDocDeleteFlag(!docDeleteFlag);
      }
    };
    deleteData()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="email">Owner Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div >
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Primary Phone</Label>
          <Input
            id="phone"
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
          />
        </div>
      </div> */}

      {/* <div>
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input
          id="contact_phone"
          value={formData.contact_phone}
          onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
        />
      </div> */}

      <div className="space-y-3">
        <Label>Entity Legal Documents</Label>
        {/* Existing Documents */}
        <div className="bg-muted/30 p-3 border rounded-lg" style={{ display: existingDocs.length > 0 ? "" : "none" }}>
          <p className="mb-2 font-medium text-sm">Existing Documents:</p>
          <div className="space-y-2">
            {existingDocs.map((doc: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center bg-background p-2 rounded">
                <div className="flex flex-1 items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc?.document_name}</p>
                    {doc.document_tags && <p className="text-muted-foreground text-xs">{doc?.document_tags}</p>}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExistingDocument(doc)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        {formData.entity_legal_documents && Array.isArray(formData.entity_legal_documents) && formData.entity_legal_documents.length > 0 && (
          <div className="bg-muted/30 p-3 border rounded-lg">
            <p className="mb-2 font-medium text-sm">Existing Documents:</p>
            <div className="space-y-2">
              {formData.entity_legal_documents.map((doc: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-background p-2 rounded">
                  <div className="flex flex-1 items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doc.documentName || doc.name}</p>
                      {doc.tags && <p className="text-muted-foreground text-xs">{doc.tags}</p>}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExistingDocument(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Document Form */}
        <div className="space-y-3 p-4 border rounded-lg">
          <div>
            <Label htmlFor="doc_name">Document Name *</Label>
            <Input
              id="doc_name"
              placeholder="Enter document name"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="doc_tags">Tags (comma separated)</Label>
            <Input
              id="doc_tags"
              placeholder="Enter tags"
              value={newDocTags}
              onChange={(e) => setNewDocTags(e.target.value)}
            />
          </div>

          <div>
            <Input
              id="doc_file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleSingleFileUpload}
              className="cursor-pointer"
            />
            <p className="mt-1 text-muted-foreground text-xs">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (max 50MB)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleAddWithoutFile}
            >
              Add Without File
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleAddDocument}
              disabled={!newDocName.trim()}
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Document
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={is_active}
          onCheckedChange={(checked) =>
            setIs_Active(checked)
          }
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : sponsor ? "Update" : "Create"}
      </Button>
    </form>
  );
}
