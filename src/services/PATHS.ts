const BASE_URL = "http://3.150.127.59:4000/api";
export const PATHS = {
    DASHBOARD_API: "https://api.trialiq.ai/admin/dashboard",
    // Auth
    USER_LOGIN_API: `${BASE_URL}/auth/login`,
    USER_REGISTER_API: `${BASE_URL}/auth/register`,
    USER_REFRESH_API: `${BASE_URL}/auth/refresh`,
    USER_LOGOUT_API: `${BASE_URL}/auth/logout`,

    // Users
    USER_ME_API: `${BASE_URL}/users/me`,
    USERS_API: `${BASE_URL}/users`,
    USER_BY_ID_API: (id: any) => `${BASE_URL}/users/${id}`,

    // Modules
    MODULES_API: `${BASE_URL}/modules`,
    MODULE_BY_ID_API: (id: any) => `${BASE_URL}/modules/${id}`,

    // Roles
    ROLES_API: `${BASE_URL}/roles`,
    ROLE_BY_ID_API: (id: any) => `${BASE_URL}/roles/${id}`,
    ROLE_PERMISSIONS_API: (id: any) => `${BASE_URL}/roles/${id}/permissions`,

    // Organizations
    ORGANIZATIONS_API: `${BASE_URL}/organizations`,
    ORGANIZATION_BY_ID_API: (id: any) => `${BASE_URL}/organizations/${id}`,

    // Sponsors
    SPONSORS_API: `${BASE_URL}/sponsors`,
    SPONSOR_BY_ID_API: (id: any) => `${BASE_URL}/sponsors/${id}`,

    // Sites
    SITES_API: `${BASE_URL}/sites`,
    SITE_BY_ID_API: (id: any) => `${BASE_URL}/sites/${id}`,

    // Providers
    PROVIDERS_API: `${BASE_URL}/providers`,
    PROVIDER_BY_ID_API: (id: any) => `${BASE_URL}/providers/${id}`,
};