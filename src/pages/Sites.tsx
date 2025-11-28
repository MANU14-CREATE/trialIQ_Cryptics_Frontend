import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, ToggleLeft, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { SearchBar } from "@/components/SearchBar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Site {
  id: string;
  name: string;
  entity_id: string | null;
  owner_email: string;
  primary_phone: string | null;
  address: string | null;
  organization_id: string | null;
  location: string | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  is_active: boolean;
  user: {
    name: string;
    email: string;
    phone: string;
  }
  contact_person_email: string;
  contact_person_phone: string;
  contact_person_name: string;
  contact_person_location: string;
}

export default function Sites() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [viewingSite, setViewingSite] = useState<Site | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Site | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData, loading: userLoading } = useUserRole();

  // const { data: sites, isLoading } = useQuery({
  //   queryKey: ["sites"],
  //   queryFn: async () => await apiService.getSites(),
  //   enabled: !userLoading && !!userData,
  // });

  const [trialsList, setTrialsList] = useState([])
  const [loading, setLoading] = useState(true);
  const [hadChanged, setHadChanged] = useState(false);
  const [sitesList, setSitesList] = useState([])
  const [sponsorsList, setSponsorsList] = useState([]);


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



  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await apiService.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      toast({ title: "Site deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingSite(null);
    setIsOpen(true);
  };

  const handleSort = (field: keyof Site) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Site) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />;
  };

  // const filteredAndSortedSites = sites
  //   ?.filter((site) => {
  //     const searchLower = searchTerm.toLowerCase();
  //     return (
  //       site.name.toLowerCase().includes(searchLower) ||
  //       (site.entity_id && site.entity_id.toLowerCase().includes(searchLower)) ||
  //       (site.location && site.location.toLowerCase().includes(searchLower))
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
              <h1 className="font-bold text-3xl">Sites (Doctor's Offices)</h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search sites..."
              />
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSite ? "Edit Site" : "Add Site"}</DialogTitle>
                  </DialogHeader>
                  <SiteForm
                    site={editingSite}
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
                        // onClick={() => handleSort("name")}
                        className="flex items-center hover:text-foreground"
                      >
                        Name
                        {/* {getSortIcon("name")} */}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        // onClick={() => handleSort("entity_id")}
                        className="flex items-center hover:text-foreground"
                      >
                        Entity ID
                        {/* {getSortIcon("entity_id")} */}
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
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sitesList?.map((site) => (
                    <TableRow key={site?.id}>
                      <TableCell className="font-medium">{site?.user?.name}</TableCell>
                      <TableCell className="font-mono text-sm">{site?.id || "-"}</TableCell>
                      <TableCell>{site?.user?.email}</TableCell>
                      <TableCell>{site?.user?.phone || "-"}</TableCell>
                      <TableCell>{site.address || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={site.is_active ? "default" : "secondary"}>
                          {site.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingSite(site)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(site)}
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
                          onClick={() => deleteMutation.mutate(site.id)}
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

        {/* View Site Details Dialog */}
        <Dialog open={!!viewingSite} onOpenChange={() => setViewingSite(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Site Details</DialogTitle>
            </DialogHeader>
            {viewingSite && (
              <div className="space-y-4">
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Site Name</Label>
                    <p className="mt-1 font-medium">{viewingSite.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Entity ID</Label>
                    <p className="mt-1 font-medium">{viewingSite.entity_id || "-"}</p>
                  </div>
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Owner Email</Label>
                    <p className="mt-1 font-medium">{viewingSite.owner_email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Primary Phone</Label>
                    <p className="mt-1 font-medium">{viewingSite.primary_phone || "-"}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="mt-1 font-medium">{viewingSite.address || "-"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="mt-1 font-medium">{viewingSite.location || "-"}</p>
                </div>

                <div className="gap-4 grid grid-cols-2 pt-4 border-t">
                  <div>
                    <Label className="text-muted-foreground">Contact Person</Label>
                    <p className="mt-1 font-medium">{viewingSite.contact_person || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Email</Label>
                    <p className="mt-1 font-medium">{viewingSite.contact_email || "-"}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Contact Phone</Label>
                  <p className="mt-1 font-medium">{viewingSite.contact_phone || "-"}</p>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={viewingSite.is_active ? "default" : "secondary"}>
                      {viewingSite.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t text-muted-foreground text-xs">
                  Created on {new Date(viewingSite.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  );
}

function SiteForm(
  {
    site, onSuccess, setHadChanged }:
    {
      site: Site | null; onSuccess: () => void,
      setHadChanged: () => void;
    }
) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [organization_id, setOrganization_id] = useState(site ? site.organization_id : "");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");
  const [contactPersonEmail, setContactPersonEmail] = useState("");
  const [contactPersonLocation, setContactPersonLocation] = useState("");
  const [isActive, setIsActive] = useState(true);



  const { toast } = useToast();

  const { userData, loading: userLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([])
  const [triggerSubmit, setTriggerSubmit] = useState(false);

  useEffect(() => {
    const fetchOrganizationsData = async () => {
      try {
        const data = await apiService.getOrganizations();
        if (!data) return;
        setOrganizations(data.organizations)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizationsData();
  }, [])

  useEffect(() => {
    if (site) {
      const { user, address, is_active,
        contact_person_name, contact_person_email, contact_person_phone,
        contact_person_location, organization_id
      } = site;
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
      setAddress(address)
      setDescription(description)
      setIsActive(is_active)
      setContactPersonEmail(contact_person_email)
      setContactPersonName(contact_person_name)
      setContactPersonPhone(contact_person_phone)
      setContactPersonLocation(contact_person_location)
      setOrganization_id(organization_id);
    }
  }, [site])

  useEffect(() => {
    if (!triggerSubmit) return;
    const submitData = async () => {
      setLoading(true)
      try {
        let result: any;
        let newItems = {
          name: name,
          email: email,
          password: password,
          organization_id: organization_id,
          phone: phone,
          address: address,
          contact_person_name: contactPersonName,
          contact_person_phone: contactPersonPhone,
          contact_person_email: contactPersonEmail,
          is_active: isActive,
          contact_person_location: contactPersonLocation,

        };
        if (site) {
          delete newItems.password
          result = await apiService.updateSite(site.id, newItems);
        } else {
          result = await apiService.createSite(newItems);
        }
        toast({
          title: site ? "Site updated" : "Site created"
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
    setTriggerSubmit(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Entity Name *</Label>
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
        <div style={{ display: site ? "none" : "" }}>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={site ? false : true}
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

      <div>
        <Label htmlFor="organization_id">Organization</Label>
        <Select
          value={organization_id}
          onValueChange={setOrganization_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations?.map((org: any) => (
              <SelectItem key={org.id} value={org.id}>
                {org.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="contactPersonName">Contact Person Name</Label>
          <Input
            id="contactPersonName"
            value={contactPersonName}
            onChange={(e) => setContactPersonName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contactPersonEmail">Contact Email</Label>
          <Input
            id="contactPersonEmail"
            type="email"
            value={contactPersonEmail}
            onChange={(e) => setContactPersonEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contactPersonPhone">Contact Phone</Label>
          <Input
            id="contactPersonPhone"
            type="phone"
            value={contactPersonPhone}
            onChange={(e) => setContactPersonPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contactPersonLocation">Contact Location</Label>
        <Input
          id="contactPersonLocation"
          value={contactPersonLocation}
          onChange={(e) => setContactPersonLocation(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : site ? "Update" : "Create"}
      </Button>
    </form>
  );
}
