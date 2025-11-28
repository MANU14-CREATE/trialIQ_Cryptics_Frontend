import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManagement } from "@/components/RoleManagement";
interface RoleInput {
  id: string;
  name: string;
  description: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  permissions: {
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
    module: {
      name: string;
    };
  }[];
}

interface RoleOutput {
  id: string;
  name: string;
  description: string;
  entity_type: string | null;
  entity_id: string | null;
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
  user_id:string;
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
      id: item?.id || "",
      name: item?.user?.name || "",
      description: role?.description || "",
      entity_id: item?.user_id || null,
      entity_type: role?.entity_type || "",
    };
  });
}
function groupRolesByEntityType(data: any[]) {
  return data.reduce((acc, role) => {
    const entity = role.entity_type?.toLowerCase() || "unknown";

    if (!acc[entity]) acc[entity] = [];

    acc[entity].push({
      id: role.id,
      name: role.name.replace(/_/g, " "),
      description: role.description,
      entity_type: role.entity_type,
      entity_id: role.entity_id,
    });

    return acc;
  }, {} as Record<string, any[]>);
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
const mockRoles: CustomRole[] = [
  {
    id: "1",
    name: "Site Coordinator",
    description: "Manages site operations and staff",
    entity_type: "site",
    entity_id: "site1",
    permissions: ["manage_users", "manage_patients", "view_reports"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Research Director",
    description: "Oversees all trials and research activities",
    entity_type: "organization",
    entity_id: "org1",
    permissions: ["manage_trials", "manage_sites", "view_reports", "manage_settings"],
    created_at: new Date().toISOString(),
  },
];
export default function UserManagement() {
  const { userData } = useUserRole();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { toast } = useToast();

  const [rolesData, setRolesData] = useState<any>(mockRoles);
  const [checkUpdated, setCheckUpdate] = useState(false);

  const [listAvailable, setListAvailable] = useState({
    organization: [],
    sponsor: [],
    site: [],
    provider: [],
    module: []
  })

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const data = await apiService.getRoles();
        if (!data) return;
        const result = groupRolesByEntityType(data);
        console.log(result)
        setRolesData(result)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRolesData();
  }, [toast, checkUpdated])


  useEffect(() => {
    const fetchOrganizationsData = async () => {
      try {
        const data = await apiService.getOrganizations();
        if (!data) return;
        setListAvailable(prev => (
          {
            ...prev,
            organization: extractRoles(data.organizations as any),
          }
        ))
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizationsData();
  }, [])

  useEffect(() => {
    const fetchSponsorsData = async () => {
      try {
        const data = await apiService.getSponsors();
        if (!data) return;
        setListAvailable(prev => (
          {
            ...prev,
            sponsor: extractRoles(data.sponsors as any),
          }
        ))
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorsData();
  }, [])

  useEffect(() => {
    const fetchSitesData = async () => {
      try {
        const data = await apiService.getSites();
        if (!data) return;
        setListAvailable(prev => (
          {
            ...prev,
            site: extractRoles(data.sites as any),
          }
        ))
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitesData();
  }, [])
  useEffect(() => {
    const fetchProvidersData = async () => {
      try {
        const data = await apiService.getProviders();
        if (!data) return;
        setListAvailable(prev => (
          {
            ...prev,
            provider: extractRoles(data.providers as any),
          }
        ))
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvidersData();
  }, [])


  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.id, userData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await apiService.createUser(userData);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      setIsOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiService.deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!userData) return null;

  return (
    <SidebarProvider>
      <AppSidebar userRole={userData.role} userName={userData.userName} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto p-6 container">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-bold text-3xl">User Management</h1>
            </div>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddUser}>
                      <UserPlus className="mr-2 w-4 h-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                      <DialogDescription>
                        {editingUser ? "Update user information" : "Create a new user account"}
                      </DialogDescription>
                    </DialogHeader>
                    <UserForm
                      user={editingUser}
                      listAvailable={listAvailable}
                      rolesData={rolesData}
                      onSubmit={handleSaveUser}
                      onCancel={() => {
                        setIsOpen(false);
                        setEditingUser(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="bg-card border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                         <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        {/* <TableHead>Entity Type</TableHead> */}
                        <TableHead>Role</TableHead>
                        {/* <TableHead>Status</TableHead> */}
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user?.id}>
                          <TableCell>{user?.id}</TableCell>
                          <TableCell>{user?.name}</TableCell>
                          <TableCell>{user?.email}</TableCell>
                          <TableCell>{user?.phone ?? "-"}</TableCell>
                          {/* <TableCell>
                            <Badge variant="outline">{user?.entity_type || "N/A"}</Badge>
                          </TableCell> */}
                          <TableCell>
                            <Badge>{user?.role?.name}</Badge>
                          </TableCell>
                          {/* <TableCell>
                            <Badge variant={user?.is_active ? "default" : "secondary"}>
                              {user?.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell> */}
                          <TableCell>
                            {new Date(user?.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user?.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="roles">
              <RoleManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarProvider>
  );
}

interface UserFormProps {
  user?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  listAvailable: any,
  rolesData: any
}

const ENTITY_TYPES = [
  { value: "organization", label: "Organization" },
  { value: "sponsor", label: "Sponsor" },
  { value: "site", label: "Site" },
  { value: "provider", label: "Provider" },
];
const ENTITY_ROLES: Record<string, { value: string; label: string }[]> = {
  organization: [
    { value: "super-admin", label: "Super Admin" },
    { value: "multi-site-management", label: "Multi-Site Management" },
  ],
  sponsor: [
    { value: "sponsor", label: "Sponsor Admin" },
    { value: "sponsor-coordinator", label: "Sponsor Coordinator" },
  ],
  site: [
    { value: "site", label: "Site Admin" },
    { value: "site-coordinator", label: "Site Coordinator" },
  ],
  provider: [
    { value: "provider", label: "Provider" },
    { value: "provider-assistant", label: "Provider Assistant" },
  ],
};

// Mock entities data - replace with actual API call
const mockEntities: Record<string, any[]> = {
  organization: [
    { id: "org1", name: "Health Organization A" },
    { id: "org2", name: "Clinical Research Group" },
  ],
  sponsor: [
    { id: "spon1", name: "Pharma Sponsor Inc" },
    { id: "spon2", name: "BioTech Research" },
  ],
  site: [
    { id: "site1", name: "Research Site 1" },
    { id: "site2", name: "Medical Center Site" },
  ],
  provider: [
    { id: "prov1", name: "Dr. John Smith" },
    { id: "prov2", name: "Dr. Sarah Johnson" },
  ],
};

function UserForm({ user, onSubmit, onCancel, listAvailable, rolesData }: UserFormProps) {

  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const [availableEntities, setAvailableEntities] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    if (entityType) {
      setAvailableEntities(listAvailable[entityType] || []);
      setAvailableRoles(rolesData[entityType] || []);
    } else {
      setAvailableEntities([]);
      setAvailableRoles([]);
    }
  }, [entityType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSubmit({
        email: email,
        role_id: roleId,
        entity_id: entityId,
        name: name
      });
    }
    else {
      onSubmit({
        email: email,
        password: password,
        role_id: roleId,
        entity_id: entityId,
        name: name
      });
    }
  };
  useEffect(() => {
    if (user) {
      console.log(user)
      console.log(listAvailable)
      const { name, email, role } = user;
      console.log(name, email, role.entity_id, role.entity_type)
      setEntityType(role.entity_type);
      setEntityId(role.entity_id);
      setEmail(email);
      setName(name);
      setRoleId(role.id);
    }
  }, [user])


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="entity_type">Entity Type</Label>
        <Select
          value={entityType}
          onValueChange={(value) => setEntityType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover">
            {ENTITY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {entityType && (
        <div>
          <Label htmlFor="entity_id">Select {ENTITY_TYPES.find(t => t.value === entityType)?.label}</Label>
          <Select
            value={entityId}
            onValueChange={(value) => setEntityId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${entityType}`} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {availableEntities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {entityId && (
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={roleId}
            onValueChange={(value) => setRoleId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {availableRoles.map((role) => (
                <SelectItem key={role.value} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label htmlFor="name">User Name</Label>
        <Input
          id="name"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {!user && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <p className="mt-1 text-muted-foreground text-xs">
            Minimum 8 characters
          </p>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!roleId || !entityId || !email || !name || (!user && !password)}>
          {user ? "Update User" : "Create User"}
        </Button>
      </DialogFooter>
    </form>
  );
}
