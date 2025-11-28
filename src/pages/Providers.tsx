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
  specialty: string | null;
  site_id: string | null;
  created_at: string;
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
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const filteredAndSortedProviders = providers
    ?.filter((provider) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        provider.first_name.toLowerCase().includes(searchLower) ||
        provider.last_name.toLowerCase().includes(searchLower) ||
        provider.email.toLowerCase().includes(searchLower) ||
        (provider.specialty && provider.specialty.toLowerCase().includes(searchLower))
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold">Providers</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    <Plus className="mr-2 h-4 w-4" />
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
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("first_name")} className="hover:bg-transparent p-0 h-auto font-semibold">
                        Name {getSortIcon("first_name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("email")} className="hover:bg-transparent p-0 h-auto font-semibold">
                        Email {getSortIcon("email")}
                      </Button>
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("specialty")} className="hover:bg-transparent p-0 h-auto font-semibold">
                        Specialty {getSortIcon("specialty")}
                      </Button>
                    </TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredAndSortedProviders?.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        {provider.first_name} {provider.last_name}
                      </TableCell>
                      <TableCell>{provider.email}</TableCell>
                      <TableCell>{provider.phone || "-"}</TableCell>
                      <TableCell>{provider.specialty || "-"}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(provider)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(provider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
    first_name: provider?.first_name || "",
    last_name: provider?.last_name || "",
    email: provider?.email || "",
    phone: provider?.phone || "",
    specialty: provider?.specialty || "",
    site_id: provider?.site_id || "",
  });
  const { toast } = useToast();

  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => await apiService.getSites(),
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
          />
        </div>
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
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Input
          id="specialty"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
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
