import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight, X, FileText, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
interface Organization {
  id: string;
  name: string;
  entity_id: string | null;
  entity_owner_email: string;
  entity_primary_phone: string | null;
  entity_legal_documents: any | null;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  created_at: string;
  is_active: boolean;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  contact_person_email: string;
  contact_person_phone: string;
  contact_person_name: string;
}

export default function Organizations() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [viewingOrg, setViewingOrg] = useState<Organization | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Organization | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData, loading: userLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([])
  const [mainOrganizations, setMainOrganizations] = useState([])
  const [hadChanged, setHadChanged] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchOrganizationsData = async () => {
      try {
        const data = await apiService.getOrganizations();
        if (!data) return;
        setOrganizations(data.organizations)
        setMainOrganizations(data.organizations)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizationsData();
  }, [hadChanged])
  const [deleteId, setDeleteId] = useState<string | null>(null);





  useEffect(() => {
    if (!deleteId) return;
    const deleteOrg = async () => {
      try {
        await apiService.deleteOrganization(deleteId);
        toast({ title: "Organization deleted successfully" });
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

    deleteOrg();
  }, [deleteId]);

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingOrg(null);
    setIsOpen(true);
  };

  const handleView = (org: Organization) => {
    setViewingOrg(org);
    setIsViewOpen(true);
  };


  useEffect(() => {
    let filtered = [...mainOrganizations]; // original list
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

    setOrganizations(sorted);
  }, [debouncedSearch, sortField, sortDirection]);


  const handleSort = (field: keyof Organization) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Organization) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />;
  };
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };


  // const filteredAndSortedOrganizations = organizations?.filter((org) => {
  //   const searchLower = searchTerm?.toLowerCase();
  //   return (
  //     org?.name?.toLowerCase().includes(searchLower) ||
  //     (org?.entity_id && org?.entity_id?.toLowerCase().includes(searchLower)) ||
  //     (org?.entity_owner_email && org?.entity_owner_email?.toLowerCase().includes(searchLower))
  //   );
  // })
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
              <h1 className="font-bold text-3xl">Organizations</h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search organizations..."
              />
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOrg ? "Edit Organization" : "Add Organization"}
                    </DialogTitle>
                  </DialogHeader>
                  <OrganizationForm
                    organization={editingOrg}
                    onSuccess={() => {
                      setIsOpen(false);
                      // queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
                        onClick={() => handleSort("name")}
                        className="flex items-center hover:text-foreground"
                      >
                        Entity Name
                        {getSortIcon("name")}
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
                        // onClick={() => handleSort("entity_owner_email")}
                        className="flex items-center hover:text-foreground"
                      >
                        Owner Email
                        {/* {getSortIcon("entity_owner_email")} */}
                      </button>
                    </TableHead>
                    <TableHead>Primary Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations?.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org?.user?.name}</TableCell>
                      <TableCell>{org?.user?.id || "-"}</TableCell>
                      <TableCell>{org?.user?.email}</TableCell>
                      <TableCell>{org?.user?.phone || "-"}</TableCell>
                      <TableCell>{org.address || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={org.is_active ? "default" : "secondary"}>
                          {org.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(org)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(org)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(org.id)}
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

          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Organization Details</DialogTitle>
              </DialogHeader>
              {viewingOrg && <OrganizationDetails organization={viewingOrg} />}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </SidebarProvider>
  );
}

function OrganizationDetails({ organization }: { organization: Organization }) {
  return (
    <div className="space-y-6">
      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label className="text-muted-foreground">Entity Name</Label>
          <p className="mt-1 font-medium">{organization?.user?.name}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Entity ID</Label>
          <p className="mt-1 font-medium">{organization?.id || "-"}</p>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label className="text-muted-foreground">Entity Owner Email</Label>
          <p className="mt-1 font-medium">{organization?.user?.email}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Entity Primary Phone</Label>
          <p className="mt-1 font-medium">{organization?.user?.phone || "-"}</p>
        </div>
      </div>

      <div>
        <Label className="text-muted-foreground">Entity Address</Label>
        <p className="mt-1 font-medium">{organization.address || "-"}</p>
      </div>

      {organization.description && (
        <div>
          <Label className="text-muted-foreground">Description</Label>
          <p className="mt-1 font-medium">{organization.description}</p>
        </div>
      )}

      <div className="gap-4 grid grid-cols-2 pt-4 border-t">
        <div>
          <Label className="text-muted-foreground">Contact Name</Label>
          <p className="mt-1 font-medium">{organization?.contact_person_name || "-"}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Contact Email</Label>?
          <p className="mt-1 font-medium">{organization?.contact_person_email || "-"}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Contact Phone</Label>
          <p className="mt-1 font-medium">{organization?.contact_person_phone || "-"}</p>
        </div>
      </div>

      <div className="pt-4 border-t text-muted-foreground text-xs">
        Created on {new Date(organization?.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
}
interface DocumentItem {
  name: string;
  tags: string;
  file: File | null;
  existing: boolean;
}

interface Props {
  existingDocuments?: any[]; // from API
  onClick: (formData: FormData) => void;
}

const DocumentUploader: React.FC<Props> = ({ existingDocuments = [], onClick }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Load existing docs for edit mode
  useEffect(() => {
    if (existingDocuments && Array.isArray(existingDocuments)) {
      setDocuments(
        existingDocuments.map((doc: any) => ({
          name: doc.documentName || doc.name || "",
          tags: doc.tags || "",
          file: null,
          existing: true
        }))
      );
    }
  }, [existingDocuments]);

  const addDocument = () => {
    setDocuments([
      ...documents,
      { name: "", tags: "", file: null, existing: false }
    ]);
  };

  const updateField = (index: number, key: "name" | "tags", value: string) => {
    const copy = [...documents];
    copy[index][key] = value;
    setDocuments(copy);
  };

  const updateFile = (index: number, file: File | null) => {
    const copy = [...documents];
    copy[index].file = file;
    copy[index].existing = false; // replace existing doc with new one
    setDocuments(copy);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const formData = new FormData();

    // Files
    documents.forEach((doc, idx) => {
      if (doc.file) {
        formData.append(`documents[${idx}]`, doc.file);
      }
    });

    // names
    formData.append(
      "document_names",
      JSON.stringify(documents.map(doc => doc.name))
    );

    // tags
    formData.append(
      "document_tags",
      JSON.stringify(documents.map(doc => doc.tags))
    );

    onClick(formData);
  };

  return (
    <div className="space-y-4">

      {/* Existing + New Docs */}
      {documents.map((doc, idx) => (
        <div
          key={idx}
          className="space-y-3 bg-gray-50 shadow-sm p-4 border rounded-md"
        >
          <div className="flex justify-between">
            <span className="font-semibold text-sm">
              Document {idx + 1} {doc.existing && "(Existing)"}
            </span>
            <button
              type="button"
              className="text-red-600 text-sm"
              onClick={() => removeDocument(idx)}
            >
              Remove
            </button>
          </div>

          {/* Document Name */}
          <input
            className="p-2 border rounded w-full"
            placeholder="Enter document name"
            value={doc.name}
            onChange={(e) => updateField(idx, "name", e.target.value)}
          />

          {/* Tags */}
          <input
            className="p-2 border rounded w-full"
            placeholder="Enter tags (comma separated)"
            value={doc.tags}
            onChange={(e) => updateField(idx, "tags", e.target.value)}
          />

          {/* File Upload (only allowed for new/updated docs) */}
          {!doc.existing && (
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => updateFile(idx, e.target.files?.[0] || null)}
            />
          )}

          {doc.existing && (
            <p className="text-gray-500 text-xs">
              Existing document will be kept unless you upload a new file.
            </p>
          )}
        </div>
      ))}

      {/* Add New */}
      <button
        className="bg-purple-600 px-4 py-2 rounded-md text-white"
        type="button"
        onClick={addDocument}
      >
        + Add Document
      </button>

      {/* Submit */}
      <button
        className="block bg-green-600 px-4 py-2 rounded-md text-white"
        onClick={handleSubmit}
      >
        Submit Documents
      </button>

    </div>
  );
};

function OrganizationForm({
  organization,
  onSuccess,
  setHadChanged
}: {
  organization: Organization | null;
  onSuccess: () => void;
  setHadChanged: () => void;
}) {
  const [formData, setFormData] = useState({
    entity_legal_documents: [],
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");
  const [contactPersonEmail, setContactPersonEmail] = useState("");
  const [isActive, setIsActive] = useState(true);


  const [newDocName, setNewDocName] = useState("");
  const [newDocTags, setNewDocTags] = useState("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [sendDocsItems, setSendDocsItems] = useState(null);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false)


  const [triggerSubmit, setTriggerSubmit] = useState(false);
  useEffect(() => {
    if (organization) {
      console.log(organization)
      const { user, address, description, is_active,
        contact_person_name, contact_person_email, contact_person_phone,
      } = organization;
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
      setAddress(address)
      setDescription(description)
      setIsActive(is_active)
      setContactPersonEmail(contact_person_email)
      setContactPersonName(contact_person_name)
      setContactPersonPhone(contact_person_phone)
    }
  }, [organization])


  useEffect(() => {
    if (organization) {
      const { id } = organization;
      const getDocs = async () => {
        setLoading(true)
        try {
          let result: any;
          result = await apiService.getOrganizationDocs(id)
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
  }, [organization])

  useEffect(() => {
    if (!triggerSubmit) return;
    const submitData = async () => {
      setLoading(true)
      try {
        let result: any;
        let docResult: any;
        let newItems = {
          name: name,
          email: email,
          password: password,
          phone: phone,
          address: address,
          description: description,
          contact_person_name: contactPersonName,
          contact_person_phone: contactPersonPhone,
          contact_person_email: contactPersonEmail,
          is_active: isActive
        };
        if (organization) {
          // result = await apiService.updateOrganization(organization.id, newItems);
          docResult = await apiService.updateOrganizationDocs(organization.id, sendDocsItems);
        } else {
          result = await apiService.createOrganization(newItems);
          docResult = await apiService.createOrganizationDocs(result.organization.id, sendDocsItems);
        }

        toast({
          title: organization ? "Organization updated" : "Organization created"
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


  const handleAddWithoutFile = () => {
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
  };

  const removeExistingDocument = (index: number) => {
    const updatedDocs = formData.entity_legal_documents
      ? [...(formData.entity_legal_documents as any[])].filter((_, idx) => idx !== index)
      : [];
    setFormData({ ...formData, entity_legal_documents: updatedDocs });
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
          <Label htmlFor="email">Entity Owner Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ display: organization ? "none" : "" }}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Entity Owner Phone </Label>
          <Input
            id="phone"
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Entity Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>



      <div className="space-y-3">
        <Label>Organisation Legal Documents</Label>

        {/* Existing Documents */}
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
            <Label htmlFor="doc_name">Document name *</Label>
            <Input
              id="doc_name"
              placeholder="Enter document name"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="doc_tags">Tags (e.g., BAA, MNDA)</Label>
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

      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="contactPersonName">Contact Name</Label>
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
            value={contactPersonPhone}
            onChange={(e) => setContactPersonPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) =>
            setIsActive(checked)
          }
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : organization ? "Update" : "Create"}
      </Button>
    </form>
  );
}
