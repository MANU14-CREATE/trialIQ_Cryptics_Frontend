import { LOGIN_USER_API, USER_INFO_API, USER_LOGOUT_API } from "./apiCalls";
import { clearLocalStorage } from "./localStorage";

// Authentication service - implement with your backend
export interface User {
  id: string;
  email: string;
  role: 'super-admin' | 'multi-site-management' | 'sponsor' | 'site' | 'provider';
  all: TransformedUser;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface Module {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  module_id: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  created_at?: string;
  module: Module | null;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
  permissions: RolePermission[];
}

export interface UserInput {
  id: string;
  email: string;
  phone: string | null;
  role_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  role: Role | null;
}

// ------------------------------------------
// OUTPUT TYPE
// ------------------------------------------

export interface TransformedUser {
  id: string;
  email: string;
  phone: string | null;
  role_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;

  name: string;
  description: string;
  entity_type: string;
  entity_id: string | null;

  permissions: Array<{
    name: string;
    path: string;
    description: string;
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
  }>;
}

// ------------------------------------------
// FUNCTION
// ------------------------------------------

export function transformUserRoleObject(input: UserInput | null): TransformedUser | null {
  if (!input || !input.role) return null;

  const role = input.role;
  const permissions = role.permissions || [];

  return {
    id: input.id,
    email: input.email,
    phone: input.phone,
    role_id: input.role_id,
    created_by: input.created_by,
    created_at: input.created_at,
    updated_at: input.updated_at,

    // ---- role fields ----
    name: role.name?.replace(/_/g, "-") || "",
    description: role.description || "",
    entity_type: role.entity_type || "none",
    entity_id: role.entity_id || null,

    // ---- permissions array ----
    permissions: permissions.map((p) => ({
      name: p.module?.name || "",
      path: "/" + (p.module?.name || "").toLowerCase(),
      description: p.module?.description || "",
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete,
    })),
  };
}

// Mock authentication - replace with your backend implementation
class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  async signUp(email: string, password: string, role: string): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const user: User = {
      id: `user_${Date.now()}`,
      email,
      role: role as User['role'],
      all: null
    };

    this.currentUser = user;
    this.notifyListeners();
    localStorage.setItem('auth_user', JSON.stringify(user));

    return { user, error: null };
  }

  // async signIn(email: string, password: string): Promise<AuthResponse> {
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 500));

  //   // Mock validation
  //   if (!email || !password) {
  //     return { user: null, error: 'Invalid credentials' };
  //   }

  //   const user: User = {
  //     id: `user_${Date.now()}`,
  //     email,
  //     role: 'super-admin' // Default role for demo
  //   };

  //   this.currentUser = user;
  //   this.notifyListeners();
  //   localStorage.setItem('auth_user', JSON.stringify(user));

  //   return { user, error: null };
  // }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve) => {
      const payload = { email, password };
      LOGIN_USER_API(payload, (res: any) => {
        if (res?.success) {
          const user: User = {
            id: res.data.user?.id,
            email: res.data.user?.email,
            role: res.data.user?.role.name.replace(/_/g, '-'),// Default role for demo
            all: transformUserRoleObject(res.data.user)
          };
          const newObject = transformUserRoleObject(res.data.user);
          // Save session
          this.currentUser = user;
          // localStorage.setItem('auth_user_2', JSON.stringify(newObject));
          localStorage.setItem('auth_user', JSON.stringify(user));
          localStorage.setItem('access_token', JSON.stringify(res?.data?.accessToken));
          this.notifyListeners();
          resolve({ user, error: null });
        } else {
          const { error } = res?.response?.data
          resolve({
            user: null,
            error: error?.message || "Invalid credentials"
          });
        }
      });
    });
  }

  // async signOut(): Promise<void> {
  //   this.currentUser = null;
  //   this.notifyListeners();
  //   localStorage.removeItem('auth_user');
  // }
  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      USER_LOGOUT_API({}, (res: any) => {
        // Even if API fails, we still log the user out locally.
        this.currentUser = null;
        localStorage.removeItem("auth_user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        clearLocalStorage();
        this.notifyListeners();
        resolve();
      });
    });
  }

  // async getUser(): Promise<User | null> {
  //   if (this.currentUser) return this.currentUser;

  //   const stored = localStorage.getItem('auth_user');
  //   if (stored) {
  //     this.currentUser = JSON.parse(stored);
  //     return this.currentUser;
  //   }

  //   return null;
  // }
  async getUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return new Promise((resolve) => {
      USER_INFO_API({}, (res: any) => {
        if (res?.success) {
          const user = res.data;
          this.currentUser = user;
          localStorage.setItem("auth_user", JSON.stringify(user));
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Password reset requested for:', email);
    return { error: null };
  }

  onAuthChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const authService = new AuthService();
