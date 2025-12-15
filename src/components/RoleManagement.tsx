import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Building2, User, Building, Stethoscope, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PermissionItem = {
  module_name: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

interface Props {
  value: PermissionItem[];              // initial permissions
  onChange: (updated: PermissionItem[]) => void; // callback to parent
}

const PermissionTable: React.FC<Props> = ({ value, onChange }) => {
  const permissions = value;

  // ------------------------------
  // Update a field for a module row
  // ------------------------------
  const updatePermission = (index: number, key: keyof PermissionItem, val: boolean) => {
    const updated = [...permissions];
    (updated[index][key] as boolean) = val;
    onChange(updated);
  };

  // ------------------------------
  // Select All / Deselect All
  // ------------------------------
  const allSelected = permissions.every(
    (p) => p.can_view && p.can_create && p.can_edit && p.can_delete
  );

  const toggleSelectAll = () => {
    const updated = permissions.map((p) => ({
      ...p,
      can_view: !allSelected,
      can_create: !allSelected,
      can_edit: !allSelected,
      can_delete: !allSelected,
    }));

    onChange(updated);
  };

  return (
    <>

      <div className="bg-white p-4 border rounded-lg w-full">
        {/* Header Row */}

        <div className="flex justify-between items-start mb-4">
          <h2 className="text-sm">Module Permissions</h2>

          <Button variant="outline" size="sm" onClick={toggleSelectAll}>
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        {/* Permission Table */}
        <div className="h-[200px] overflow-y-auto">
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Module</TableHead>
                <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Create</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {permissions.map((perm, index) => (
                <TableRow key={index}>
                  <TableCell className="capitalize">{perm.module_name}</TableCell>

                  {/* VIEW */}
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={perm.can_view}
                      onChange={() => updatePermission(index, "can_view", !perm.can_view)}
                      className="w-4 h-4 accent-purple-600"
                    />
                  </TableCell>

                  {/* CREATE */}
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={perm.can_create}
                      onChange={() => updatePermission(index, "can_create", !perm.can_create)}
                      className="w-4 h-4 accent-purple-600"
                    />
                  </TableCell>

                  {/* EDIT */}
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={perm.can_edit}
                      onChange={() => updatePermission(index, "can_edit", !perm.can_edit)}
                      className="w-4 h-4 accent-purple-600"
                    />
                  </TableCell>
                  {/* DELETE */}
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={perm.can_delete}
                      onChange={() => updatePermission(index, "can_delete", !perm.can_delete)}
                      className="w-4 h-4 accent-purple-600"
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>
    </>
  );
};

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




const AVAILABLE_PERMISSIONS = [
  { value: "manage_users", label: "Manage Users" },
  { value: "manage_sites", label: "Manage Sites" },
  { value: "manage_trials", label: "Manage Trials" },
  { value: "manage_patients", label: "Manage Patients" },
  { value: "manage_providers", label: "Manage Providers" },
  { value: "view_reports", label: "View Reports" },
  { value: "manage_settings", label: "Manage Settings" },
  { value: "manage_schedules", label: "Manage Schedules" },
];

// Mock data
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
  permissions: string[];
  created_at: string;
}
function transformRoleList(data: RoleInput[]): RoleOutput[] {
  return data.map((role) => {
    const permissionStrings: string[] = [];

    role.permissions.forEach((p) => {
      const moduleName = p.module.name.toLowerCase().replace(/\s+/g, "_");

      if (p.can_view) permissionStrings.push(`view_${moduleName}`);
      if (p.can_create) permissionStrings.push(`create_${moduleName}`);
      if (p.can_edit) permissionStrings.push(`edit_${moduleName}`);
      if (p.can_delete) permissionStrings.push(`delete_${moduleName}`);
    });

    return {
      id: role.id,
      name: role.name.replace(/_/g, " "), // optional formatting
      description: role.description,
      entity_type: role.entity_type,
      entity_id: role.entity_id,
      permissions: permissionStrings,
      created_at: role.created_at,
    };
  });
}
const mockEntities: Record<string, Entity[]> = {
  organizations: [{ id: "org1", name: "Health Organization A", entity_id: "ORG001" }],
  sponsors: [{ id: "spon1", name: "Pharma Sponsor Inc", entity_id: "SPON001" }],
  sites: [{ id: "site1", name: "Research Site 1", entity_id: "SITE001" }],
  providers: [{ id: "prov1", name: "Dr. John Smith", entity_id: "john.smith@example.com" }],
};
export function generateDefaultPermissions(modules: any[]) {
  return modules
    .filter((m) => m.name !== "Modules") // exclude EXACT match
    .map((module) => ({
      module_name: module.name.toLowerCase(),
      module_id: module.id,
      can_view: false,
      can_create: false,
      can_edit: false,
      can_delete: false,
    }));
}


function convertModulePermissions(modules: any[], data: any[]) {
  const permissionMap = new Map(
    data.map(item => [item.module_id, item])
  );
  return modules.map(module => {
    const perm = permissionMap.get(module.module_id);
    return {
      module_name: module.module_name,
      module_id: module.module_id,
      can_view: perm?.can_view ?? false,
      can_create: perm?.can_create ?? false,
      can_edit: perm?.can_edit ?? false,
      can_delete: perm?.can_delete ?? false,
    };
  });
}


export function RoleManagement() {
  const [roles, setRoles] = useState<CustomRole[]>(mockRoles);
  const [rolesData, setRolesData] = useState<any>(mockRoles);
  const [checkUpdated, setCheckUpdate] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<string>("organizations");

  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRoleEntityType, setNewRoleEntityType] = useState("");
  const [newRoleEntityId, setNewRoleEntityId] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [listAvailable, setListAvailable] = useState({
    organizations: [],
    sponsors: [],
    sites: [],
    providers: [],
    module: []
  })


  const [rolePermissions, setRolePermissions] = useState([]);
  const [actionType, setActionType] = useState("create");
  const [currentId, setCurrentId] = useState("");
  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const data = await apiService.getRoles();
        const result = transformRoleList(data);
        if (!data) return;
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
            organizations: extractRoles(data.organizations as any),
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
            sponsors: extractRoles(data.sponsors as any),
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
            sites: extractRoles(data.sites as any),
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
            providers: extractRoles(data.providers as any),
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

  useEffect(() => {
    console.log(newRoleEntityId)
    console.log(entities)
  }, [entities])


  useEffect(() => {

    const fetchModulesData = async () => {
      try {
        const data = await apiService.getModules();
        if (!data) return;
        const modules = generateDefaultPermissions(data.modules as any)
        setListAvailable(prev => (
          {
            ...prev,
            module: modules,
          }
        ))
        setRolePermissions(modules)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModulesData();
  }, [])


  const fetchEntities = (entityType: string) => {
    if (!entityType) {
      setEntities([]);
      return;
    }
    setEntities(listAvailable[entityType] || []);
  };

  const createRole = () => {
    if (!newRoleName || !newRoleEntityType || !newRoleEntityId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const cleanPermissions = (permissions: any[]) => {
      return permissions
        .map((p) => {
          // extract only true permission fields
          const filtered: any = { module_id: p.module_id };

          if (p.can_view) filtered.can_view = true;
          if (p.can_create) filtered.can_create = true;
          if (p.can_edit) filtered.can_edit = true;
          if (p.can_delete) filtered.can_delete = true;

          // if only module_id exists (no true permissions) → return null
          return Object.keys(filtered).length > 1 ? filtered : null;
        })
        .filter(Boolean); // remove nulls
    }
    const newRole = {
      name: newRoleName,
      description: newRoleDescription,
      entity_type: newRoleEntityType.slice(0, -1),
      entity_id: newRoleEntityId,
      permissions: cleanPermissions(rolePermissions),
    };
    const sendReq = async () => {
      try {
        const data = await apiService.createRoles(newRole);
        if (!data) return;
        toast({
          title: "Success",
          description: "Role created successfully",
        });
        resetForm();
        setTimeout(() => {
          setIsCreateDialogOpen(false);
          setCheckUpdate(!checkUpdated)
        }, 1000);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }

    }
    sendReq()
  };
  const createRoleAndPermission = () => {
    if (!newRoleName || !newRoleEntityType || !newRoleEntityId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const cleanPermissions = (permissions: any[]) => {
      return permissions
        .map((p) => {
          // extract only true permission fields
          const filtered: any = { module_id: p.module_id };

          if (p.can_view) filtered.can_view = true;
          if (p.can_create) filtered.can_create = true;
          if (p.can_edit) filtered.can_edit = true;
          if (p.can_delete) filtered.can_delete = true;

          // if only module_id exists (no true permissions) → return null
          return Object.keys(filtered).length > 1 ? filtered : null;
        })
        .filter(Boolean); // remove nulls
    }
    const newRole = {
      name: newRoleName,
      description: newRoleDescription,
      entity_type: newRoleEntityType.slice(0, -1),
      entity_id: newRoleEntityId,
    };

    const sendPermissionEdit = async () => {
      try {
        const dat = await apiService.editRole(currentId, newRole);
        const data = await apiService.editPermissionsRole(currentId, { permissions: cleanPermissions(rolePermissions) });
        if (!data) return;
        toast({
          title: "Success",
          description: "Role permissions updated successfully",
        });
        resetForm();
        setTimeout(() => {
          setIsCreateDialogOpen(false);
          setCheckUpdate(!checkUpdated)
        }, 100);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }

    }
    sendPermissionEdit();
  };

  const deleteRole = (roleId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this role?");
    if (!confirmed) return;
    const deleteData = async () => {
      try {
        setLoading(true);
        const message = await apiService.deleteRole(roleId);
        if (!message) return;
        toast({
          title: "Success",
          description: message,
        });
        setCheckUpdate(!checkUpdated)
      } catch (error) {
        console.error("error:", error);
      } finally {
        setLoading(false);
      }
    };

    deleteData();
  };


  const editRole = (roleId: string) => {
    setCurrentId(roleId);
    setIsCreateDialogOpen(true)
    setActionType("edit")
    const fetchModulesData = async () => {
      try {
        const data = await apiService.getRole(roleId);
        if (!data) return;
        const { entity_type, description, name, permissions, entity_id
        } = data as any;
        setNewRoleName(name);
        setNewRoleDescription(description)
        setNewRoleEntityType(`${entity_type}s`)
        setNewRoleEntityId(entity_id)
        fetchEntities(`${entity_type}s`)
        const converted = convertModulePermissions(listAvailable.module, permissions);
        setRolePermissions(converted)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModulesData();
  };




  const resetForm = () => {
    setNewRoleName("");
    setNewRoleDescription("");
    setNewRoleEntityType("");
    setNewRoleEntityId("");
    setNewRolePermissions([]);
    setRolePermissions([]);
    setEntities([]);
  };

  const togglePermission = (permission: string) => {
    setNewRolePermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const getRolesByEntityType = (entityType: string) => {
    return rolesData.filter(role => (role.entity_type + "s") === entityType);
  };

  const ENTITY_TYPES = [
    { value: "organizations", label: "Organizations", icon: Building2, gradient: "from-blue-500 to-cyan-500" },
    { value: "sponsors", label: "Sponsors", icon: Building, gradient: "from-purple-500 to-pink-500" },
    { value: "sites", label: "Sites", icon: Building, gradient: "from-green-500 to-emerald-500" },
    { value: "providers", label: "Providers", icon: Stethoscope, gradient: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="bg-clip-text bg-gradient-to-r from-primary to-primary/60 font-bold text-transparent text-2xl">
            Role Management
          </h2>
          <p className="mt-1 text-muted-foreground">
            Create and manage custom roles for different entity types
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      <Tabs value={selectedEntityType} onValueChange={setSelectedEntityType}>
        <TabsList className="grid grid-cols-4 w-full">
          {ENTITY_TYPES.map(entity => (
            <TabsTrigger key={entity.value} value={entity.value} className="gap-2">
              <entity.icon className="w-4 h-4" />
              {entity.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ENTITY_TYPES.map(entity => (
          <TabsContent key={entity.value} value={entity.value} className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${entity.gradient}`}>
                    <entity.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{entity.label} Roles</h3>
                    <p className="text-muted-foreground text-sm">
                      Manage roles for {entity.label.toLowerCase()} users
                    </p>
                  </div>
                </div>

                <div className="gap-4 grid">
                  {getRolesByEntityType(entity.value).map(role => (
                    <Card key={role.id} className="p-4 hover-card">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{role.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {entity?.label}
                            </Badge>
                          </div>
                          {role.description && (
                            <p className="mb-3 text-muted-foreground text-sm">
                              {role.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map(permission => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {AVAILABLE_PERMISSIONS.find(p => p.value === permission)?.label || permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editRole(role.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRole(role.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {getRolesByEntityType(entity.value).length === 0 && (
                    <div className="py-8 text-muted-foreground text-center">
                      No roles created yet for {entity.label.toLowerCase()}s
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{actionType === "create" ? "Create " : "Edit "} New Role</DialogTitle>
            <DialogDescription>
              Define a custom role with specific permissions for an entity type
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type *</Label>
              <Select
                value={newRoleEntityType}
                onValueChange={(value) => {
                  setNewRoleEntityType(value);
                  setNewRoleEntityId("");
                  fetchEntities(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map(entity => (
                    <SelectItem key={entity.value} value={entity.value}>
                      <div className="flex items-center gap-2">
                        <entity.icon className="w-4 h-4" />
                        {entity.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newRoleEntityType && (
              <div className="space-y-2">
                <Label htmlFor="entity">Select {ENTITY_TYPES.find(e => e.value === newRoleEntityType)?.label} *</Label>
                <Select
                  value={newRoleEntityId}
                  onValueChange={setNewRoleEntityId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${newRoleEntityType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.entity_id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="e.g., Site Coordinator"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Describe the role and its responsibilities"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              {/* <div className="flex justify-between items-center">
                <Label>Permissions</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newRolePermissions.length === AVAILABLE_PERMISSIONS.length) {
                      setNewRolePermissions([]);
                    } else {
                      setNewRolePermissions(AVAILABLE_PERMISSIONS.map(p => p.value));
                    }
                  }}
                >
                  {newRolePermissions.length === AVAILABLE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div> */}
              <PermissionTable
                value={rolePermissions}
                onChange={(updated) => setRolePermissions(updated)}
              />

              {/* <div className="gap-3 grid grid-cols-2">
                {AVAILABLE_PERMISSIONS.map(permission => (
                  <div key={permission.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.value}
                      checked={newRolePermissions.includes(permission.value)}
                      onCheckedChange={() => togglePermission(permission.value)}
                    />
                    <label
                      htmlFor={permission.value}
                      className="peer-disabled:opacity-70 font-medium text-sm leading-none cursor-pointer peer-disabled:cursor-not-allowed"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={actionType === "create" ? createRole : createRoleAndPermission}>{actionType === "create" ? "Create " : "Edit "} Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
