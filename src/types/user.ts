export type UserRole = 
  | "super-admin" 
  | "multi-site-management" 
  | "sponsor" 
  | "site" 
  | "provider";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}
