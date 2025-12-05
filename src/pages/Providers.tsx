import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  speciality: string | null;
  site_id: string | null;
  created_at: string;
  user: {
    name: string;
    email: string;
    phone: string;
  }
}



interface CustomRole {
  id: string;
  name: string;
  description: string;
  entity_type: string;
  entity_id?: string;
  permissions: string[];
  created_at: string;
}

interface Entity {
  id: string;
  name: string;
  entity_id?: string;
}

interface ModuleInfo {
  id: string;
  name: string;
  description: string;
}

interface Permission {
  id: string;
  role_id: string;
  module_id: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  module: ModuleInfo;
}

interface Role {
  id: string;
  name: string;
  description: string;
  entity_id: string | null;
  entity_type: string;
  permissions: Permission[];
}

interface User {
  id: string;
  email: string;
  phone: string | null;
  role: Role;
  name: string;
}

interface InputItem {
  id: string;
  user: User;
  user_id: string;
}

interface ExtractedRole {
  id: string;
  name: string;
  description: string;
  entity_id: string | null;
  entity_type: string;
}

function extractRoles(data: InputItem[]): ExtractedRole[] {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const role = item.user.role;
    return {
      id: item.id || "",
      name: item?.user?.name || "",
      description: role?.description || "",
      entity_id: item?.user_id || null,
      entity_type: role?.entity_type || "",
    };
  });
}

export default function Providers() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Provider | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData, loading: userLoading } = useUserRole();

  const { data: providers, isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => await apiService.getProviders(),
    enabled: !userLoading && !!userData,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await apiService.deleteProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast({ title: "Provider deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingProvider(null);
    setIsOpen(true);
  };

  const handleSort = (field: keyof Provider) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Provider) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />;
  };

  const filteredAndSortedProviders = providers?.providers
    ?.filter((provider) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        // provider.first_name.toLowerCase().includes(searchLower) ||
        provider?.user?.name.toLowerCase().includes(searchLower)
        // provider.email.toLowerCase().includes(searchLower) ||
        // (provider.specialty && provider.specialty.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });

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

  const canManageProviders = userData.role === 'super-admin' || userData.role === 'site';

  return (
    <SidebarProvider>
      <AppSidebar userRole={userData.role} userName={userData.userName} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto p-6 container">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-bold text-3xl">Providers</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Provider
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingProvider ? "Edit Provider" : "Add Provider"}
                    </DialogTitle>
                  </DialogHeader>
                  <ProviderForm
                    provider={editingProvider}
                    onSuccess={() => {
                      setIsOpen(false);
                      queryClient.invalidateQueries({ queryKey: ["providers"] });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
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
                        // onClick={() => handleSort("name")}
                        className="flex items-center hover:text-foreground"
                      >
                        Email
                        {/* {getSortIcon("name")} */}
                      </button>
                    </TableHead>

                    <TableHead>Phone</TableHead>
                    <TableHead>
                      <button
                        // onClick={() => handleSort("name")}
                        className="flex items-center hover:text-foreground"
                      >
                        Specialty
                        {/* {getSortIcon("name")} */}
                      </button>
                    </TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedProviders?.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        {provider?.user?.name}
                      </TableCell>
                      <TableCell>{provider?.user?.email}</TableCell>
                      <TableCell>{provider?.user?.phone || "-"}</TableCell>
                      <TableCell>{provider.speciality || "-"}</TableCell>
                      <TableCell>{provider.site_id || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(provider)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(provider.id)}
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
      </main>
    </SidebarProvider>
  );
}

function ProviderForm({
  provider,
  onSuccess,
}: {
  provider: Provider | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: provider?.user?.name || "",
    password: provider?.last_name || "",
    email: provider?.user?.email || "",
    phone: provider?.user?.phone || "",
    speciality: provider?.speciality || "",
    site_id: provider?.site_id || "",
  });
  const { toast } = useToast();

  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const data = await apiService.getSites()
      return extractRoles(data.sites)
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (provider) {
        return await apiService.updateProvider(provider.id, data);
      } else {
        return await apiService.createProvider(data);
      }
    },
    onSuccess: () => {
      toast({ title: provider ? "Provider updated" : "Provider created" });
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
      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="speciality">Speciality</Label>
        <Input
          id="speciality"
          value={formData.speciality}
          onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="site_id">Site</Label>
        <Select
          value={formData.site_id}
          onValueChange={(value) => setFormData({ ...formData, site_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select site" />
          </SelectTrigger>
          <SelectContent>
            {sites?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : provider ? "Update" : "Create"}
      </Button>
    </form>
  );
}
