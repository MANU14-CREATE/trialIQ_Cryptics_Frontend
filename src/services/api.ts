// API Service Layer - implement with your backend
import Sponsors from '@/pages/Sponsors';
import { ASSIGN_SITE_TO_TRIAL_API, ASSIGN_SPONSOR_TO_TRIAL_API, CREATE_ORGANISATION_API, CREATE_ORGANISATION_DOCUMENTS_API, CREATE_PROVIDER_API, CREATE_ROLES_API, CREATE_SITE_API, CREATE_SPONSOR_API, CREATE_SPONSOR_DOC_API, CREATE_TRIAL_API, CREATE_USERS_API, DELETE_ORGANISATION_API, DELETE_ORGANISATION_DOC_API, DELETE_PROVIDER_API, DELETE_ROLES_API, DELETE_SITE_API, DELETE_SPONSOR, DELETE_SPONSOR_SINGLE_DOC_API, DELETE_TRIAL_API, DELETE_USERS_API, EDIT_ROLES_API, EDIT_ROLES_PERMISSIONS_API, EDIT_TRIAL_DETAILS_API, FETCH_TRIAL_DETAILS_API, GET_ORGANISATION_DOCUMENTS_API, GET_ROLES_API, MODULES_API, ORGANISATION_API, PROVIDER_API, ROLES_API, SITES_API, SPONSOR_DOC_API, SPONSORS_API, TRIALS_API, UPDATE_ORGANISATION_API, UPDATE_ORGANISATION_DOCUMENT_API, UPDATE_PROVIDER_API, UPDATE_SITE_API, UPDATE_SPONSOR_API, UPDATE_TRIAL_API, UPDATE_USERS_API, USERS_API } from './apiCalls';
import {
  mockOrganizations,
  mockSponsors,
  mockSites,
  mockTrials,
  mockProviders,
  mockPatients,
  mockUsers
} from './mockData';

// Configure your backend API base URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface SponsorResponse {
  sponsors: any[]; // or proper type
}
export interface OrganizationListItem {
  id: string;
  name: string;
  entity_id: string | null;
  entity_owner_email: string;
  entity_primary_phone: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  entity_legal_documents: any[];
  is_active: boolean;
  created_at: string | null;
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
}

interface InputItem {
  id: string;
  user: User;
}

interface ExtractedRole {
  id: string;
  name: string;
  description: string;
  entity_id: string | null;
  entity_type: string;
}
class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Replace with your actual API implementation
    // For now, returns mock data
    console.log(`API Call: ${endpoint}`, options);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock data based on endpoint
    return this.getMockData(endpoint) as T;
  }

  private getMockData(endpoint: string): any {
    if (endpoint.includes('/organizations')) return mockOrganizations;
    if (endpoint.includes('/sponsors')) return mockSponsors;
    if (endpoint.includes('/sites')) return mockSites;
    if (endpoint.includes('/trials')) return mockTrials;
    if (endpoint.includes('/providers')) return mockProviders;
    if (endpoint.includes('/patients')) return mockPatients;
    if (endpoint.includes('/users')) return mockUsers;
    return [];
  }

  // Organizations
  // async getOrganizations() {
  //   return this.request<typeof mockOrganizations>('/organizations');
  // }

  async getOrganizations(): Promise<{ organizations: any[] }> {
    return new Promise((resolve) => {
      ORGANISATION_API({}, (res: any) => {
        if (res?.data) {
          resolve(res.data as { organizations: any[] });
        } else {
          resolve({ organizations: [] });
        }
      });
    });
  }


  // async createOrganization(data: any) {
  //   console.log('Create organization:', data);
  //   return { id: Date.now().toString(), ...data };
  // }


  async createOrganization(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_ORGANISATION_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async uploadOrganizationDoc(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_ORGANISATION_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  // async updateOrganization(id: string, data: any) {
  //   console.log('Update organization:', id, data);
  //   return { id, ...data };
  // }

  async updateOrganization(id: string, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_ORGANISATION_API(id, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }



  // async deleteOrganization(id: string) {
  //   console.log('Delete organization:', id);
  //   return { success: true };
  // }

  async deleteOrganization(id: string) {
    return new Promise((resolve, reject) => {
      DELETE_ORGANISATION_API(id, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async getOrganizationDocs(orgId: string) {
    return new Promise((resolve, reject) => {
      GET_ORGANISATION_DOCUMENTS_API(orgId, (res: any) => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      });
    });
  }

  async createOrganizationDocs(orgId: string, data: any) {
    return new Promise((resolve, reject) => {
      CREATE_ORGANISATION_DOCUMENTS_API(orgId, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async updateOrganizationDocs(orgId: string, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_ORGANISATION_DOCUMENT_API(orgId, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async deleteOrganizationDoc(orgId: string, docId: string) {
    return new Promise((resolve, reject) => {
      DELETE_ORGANISATION_DOC_API(orgId, docId, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  // Sponsors
  // async getSponsors() {
  //   return this.request<typeof mockSponsors>('/sponsors');
  // }
  async getSponsors2() {
    return this.request<typeof mockSponsors>('/sponsors');
  }

  async getSponsors(): Promise<{ sponsors: any[] }> {
    return new Promise((resolve) => {
      SPONSORS_API({}, (res: any) => {
        if (res?.data) {
          resolve(res.data as { sponsors: any[] });
        } else {
          resolve({ sponsors: [] });
        }
      });
    });
  }
  // async createSponsor(data: any) {
  //   console.log('Create sponsor:', data);
  //   return { id: Date.now().toString(), ...data };
  // }

  async createSponsor(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_SPONSOR_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve(res);
        }
      });
    });
  }
  async updateSponsor(spoId: any, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_SPONSOR_API(spoId, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async createSponsorDocs(spoId: any, data: any) {
    return new Promise((resolve, reject) => {
      CREATE_SPONSOR_DOC_API(spoId, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async getSponsorDocs(orgId: string) {
    return new Promise((resolve, reject) => {
      SPONSOR_DOC_API(orgId, (res: any) => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      });
    });
  }
  async deleteSponsor(id: string) {
    return new Promise((resolve, reject) => {
      DELETE_SPONSOR(id, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async deleteSponsorDoc(orgId: string, docId: string) {
    return new Promise((resolve, reject) => {
      DELETE_SPONSOR_SINGLE_DOC_API(orgId, docId, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }


  // async updateSponsor(id: string, data: any) {
  //   console.log('Update sponsor:', id, data);
  //   return { id, ...data };
  // }

  // async deleteSponsor(id: string) {
  //   console.log('Delete sponsor:', id);
  //   return { success: true };
  // }

  // Sites
  // async getSites() {
  //   return this.request<typeof mockSites>('/sites');
  // }
  async getSites(): Promise<{ sites: any[] }> {
    return new Promise((resolve) => {
      SITES_API({}, (res: any) => {
        if (res?.data) {
          resolve(res.data as { sites: any[] });
        } else {
          resolve({ sites: [] });
        }
      });
    });
  }

  // async createSite(data: any) {
  //   console.log('Create site:', data);
  //   return { id: Date.now().toString(), ...data };
  // }

  async createSite(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_SITE_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  // async updateSite(id: string, data: any) {
  //   console.log('Update site:', id, data);
  //   return { id, ...data };
  // }
  async updateSite(id: string, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_SITE_API(id, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  // async deleteSite(id: string) {
  //   console.log('Delete site:', id);
  //   return { success: true };
  // }
  async deleteSite(id: string) {
    return new Promise((resolve, reject) => {
      DELETE_SITE_API(id, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  // Trials
  // async getTrials() {
  //   return this.request<typeof mockTrials>('/trials');
  // }

  async getTrials(): Promise<{ trials: [] }> {
    return new Promise((resolve) => {
      TRIALS_API((res: any) => {
        if (res?.data) {
          resolve(res.data as { trials: [] });
        } else {
          resolve({ trials: [] });
        }
      });
    });
  }

  async createTrial(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_TRIAL_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async fetchTrial(data: any) {
    return new Promise((resolve, reject) => {
      FETCH_TRIAL_DETAILS_API(data, (res: any) => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      });
    });
  }
  async editTrial(data: any) {
    return new Promise((resolve, reject) => {
      EDIT_TRIAL_DETAILS_API(data, (res: any) => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      });
    });
  }

  async updateTrial(id: string, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_TRIAL_API(id, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async deleteTrial(id: string) {
    return new Promise((resolve, reject) => {
      DELETE_TRIAL_API(id, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async assignSponsorToTrial(id: string, data: any) {
    return new Promise((resolve, reject) => {
      ASSIGN_SPONSOR_TO_TRIAL_API(id, data, (res: any) => {
        if (res) {
          resolve(res);
        } else {
          resolve(res.data);
        }
      });
    });
  }
   async assignSiteToTrial(id: string, data: any) {
    return new Promise((resolve, reject) => {
      ASSIGN_SITE_TO_TRIAL_API(id, data, (res: any) => {
        if (res) {
          resolve(res);
        } else {
          resolve(res.data);
        }
      });
    });
  }


  // async createTrial(data: any) {
  //   console.log('Create trial:', data);
  //   return { id: Date.now().toString(), ...data };
  // }

  // async updateTrial(id: string, data: any) {
  //   console.log('Update trial:', id, data);
  //   return { id, ...data };
  // }

  // async deleteTrial(id: string) {
  //   console.log('Delete trial:', id);
  //   return { success: true };
  // }

  // Providers
  // async getProviders() {
  //   return this.request<typeof mockProviders>('/providers');
  // }
  async getProviders(): Promise<{ providers: any[] }> {
    return new Promise((resolve) => {
      PROVIDER_API({}, (res: any) => {
        if (res?.data) {
          resolve(res.data as { providers: any[] });
        } else {
          resolve({ providers: [] });
        }
      });
    });
  }

  // async createProvider(data: any) {
  //   console.log('Create provider:', data);
  //   return { id: Date.now().toString(), ...data };
  // }
  async createProvider(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_PROVIDER_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async updateProvider(id: string, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_PROVIDER_API(id, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async deleteProvider(id: string) {
    return new Promise((resolve, reject) => {
      DELETE_PROVIDER_API(id, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  // async updateProvider(id: string, data: any) {
  //   console.log('Update provider:', id, data);
  //   return { id, ...data };
  // }

  // async deleteProvider(id: string) {
  //   console.log('Delete provider:', id);
  //   return { success: true };
  // }

  // Patients
  async getPatients() {
    return this.request<typeof mockPatients>('/patients');
  }

  async createPatient(data: any) {
    console.log('Create patient:', data);
    return { id: Date.now().toString(), ...data };
  }

  async updatePatient(id: string, data: any) {
    console.log('Update patient:', id, data);
    return { id, ...data };
  }

  async deletePatient(id: string) {
    console.log('Delete patient:', id);
    return { success: true };
  }

  // Users
  // async getUsers() {
  //   return this.request<typeof mockUsers>('/users');
  // }
  async getUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      USERS_API({}, (res: any) => {
        if (res && res.data && res.data.users) {
          resolve(res.data.users);
        } else {
          resolve([]);
        }
      });
    });
  }

  // async createUser(data: any) {
  //   console.log('Create user:', data);
  //   return { id: Date.now().toString(), ...data };
  // }

  async createUser(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_USERS_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }


  // async updateUser(id: string, data: any) {
  //   console.log('Update user:', id, data);
  //   return { id, ...data };
  // }

  async updateUser(id: any, data: any) {
    return new Promise((resolve, reject) => {
      UPDATE_USERS_API(id, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  // async deleteUser(id: string) {
  //   console.log('Delete user:', id);
  //   return { success: true };
  // }
  async deleteUser(id: any) {
    return new Promise((resolve, reject) => {
      DELETE_USERS_API(id, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async getUserRole(userId: string) {
    console.log('Get user role:', userId);
    return { role: 'super-admin' };
  }

  async getRoles(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      ROLES_API({}, (res: any) => {
        if (res && res.data && res.data.roles) {
          resolve(res.data.roles);
        } else {
          resolve([]);
        }
      });
    });
  }
  async getRole(roleId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      GET_ROLES_API(roleId, (res: any) => {
        if (res && res.data) {
          resolve(res.data.role);
        } else {
          resolve([]);
        }
      });
    });
  }
  async editRole(roleId: string, data: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      EDIT_ROLES_API(roleId, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async editPermissionsRole(roleId: string, data: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      EDIT_ROLES_PERMISSIONS_API(roleId, data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }
  async deleteRole(roleId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      DELETE_ROLES_API(roleId, (res: any) => {
        if (res) {
          resolve(res.message);
        } else {
          resolve([]);
        }
      });
    });
  }
  async createRoles(data: any) {
    return new Promise((resolve, reject) => {
      CREATE_ROLES_API(data, (res: any) => {
        if (res && res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  async getModules(): Promise<{ modules: any[] }> {
    return new Promise((resolve) => {
      MODULES_API({}, (res: any) => {
        if (res?.data) {
          resolve(res.data as { modules: any[] });
        } else {
          resolve({ modules: [] });
        }
      });
    });
  }

}

export const apiService = new ApiService();
