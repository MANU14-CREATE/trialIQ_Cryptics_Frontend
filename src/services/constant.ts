
import axios, { AxiosInstance } from "axios";
import { getLocalStorage, saveLocalStorage } from "./localStorage";
const BASE_URL = "http://3.150.127.59:4000/api";
const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 120000,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];


const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

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
    ORGANIZATION_DOCUMENTS_BY_ID_API: (orgId: any) => `${BASE_URL}/organizations/${orgId}/documents/`,
    ORGANIZATION_DOCUMENT_BY_ID_API: (orgId: any, docId: any) => `${BASE_URL}/organizations/${orgId}/documents/${docId}`,

    // Sponsors
    SPONSORS_API: `${BASE_URL}/sponsors`,
    SPONSOR_BY_ID_API: (id: any) => `${BASE_URL}/sponsors/${id}`,
    SPONSOR_DOUMENTS_BY_ID_API: (spoId: any) => `${BASE_URL}/sponsors/${spoId}/documents`,
    SPONSOR_DOUMENT_BY_ID_API: (spoId: any, docId: any) => `${BASE_URL}/sponsors/${spoId}/documents/${docId}`,
    
    // Sites
    SITES_API: `${BASE_URL}/sites`,
    SITE_BY_ID_API: (id: any) => `${BASE_URL}/sites/${id}`,

    // Providers
    PROVIDERS_API: `${BASE_URL}/providers`,
    PROVIDER_BY_ID_API: (id: any) => `${BASE_URL}/providers/${id}`,

    // trials
    TRIALS_API: `${BASE_URL}/trials`,
    TRIALS_BY_ID_API: (id: any) => `${BASE_URL}/trials/${id}`,
    ASSIGN_SPONSOR_TO_TRIALS: (id: any) => `${BASE_URL}/trials/${id}/sponsors`,
    ASSIGN_SITE_TO_TRIALS: (id: any) => `${BASE_URL}/trials/${id}/sites`,
};


axiosInstance.interceptors.request.use(
    async (config: any) => {
        const token = getLocalStorage("access_token");

        const skipAuth =
            config.url === PATHS.USER_LOGIN_API ||
            config.url === PATHS.USER_REGISTER_API;

        if (!skipAuth && token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // if no response (network) or originalRequest is undefined, bail out
        if (!originalRequest || !error.response) return Promise.reject(error);

        // only handle 401s
        const status = error.response?.status;
        if (status !== 401) return Promise.reject(error);

        // avoid infinite loop: if this request is refresh call, reject
        // use includes to be robust (originalRequest.url might be '/auth/refresh' or full path)
        if (originalRequest.url && originalRequest.url.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        // if request already retried, reject
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // If a refresh is already in progress, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token: string) => {
                    originalRequest._retry = true;
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        // start refresh flow
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // IMPORTANT: call refresh with plain axios to avoid interceptor recursion.
            // Provide full URL or baseURL + relative path.
            const refreshResponse = await axios.post(
                PATHS.USER_REFRESH_API,
                {},
                { baseURL: BASE_URL, withCredentials: true, timeout: 15000 }
            );

            // adjust to match your backend: check property name
            const newToken =
                refreshResponse?.data?.access_token ??
                refreshResponse?.data?.accessToken ??
                refreshResponse?.data?.token;

            if (!newToken) {
                throw new Error("Refresh did not return an access token");
            }

            // persist token and set default header so future requests automatically use it
            saveLocalStorage("access_token", newToken);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            // resolve queued requests with new token
            processQueue(null, newToken);

            // retry original request with new token
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // reject all queued requests
            processQueue(refreshError, null);

            // cleanup stored token if refresh fails
            saveLocalStorage("access_token", null);
            // optionally: dispatch logout logic here

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);


const authorizeRequest = () => {
    const token = getLocalStorage("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// -------------------------
// API OBJECT (GET, POST, PATCH, DELETE, DOWNLOAD…)
// -------------------------
export const API = {
    GET(url: string, body = {}, params = {}, cb: Function) {
        axiosInstance
            .get(url, {
                headers: authorizeRequest(),
                data: body,
                params,
            })
            .then((res) => cb(res.data))
            .catch((err) => {
                console.error("ERROR:", err);
                cb(null);
            });
    },

    POST(url: string, body = {}, params = {}, cb: Function) {
        axiosInstance
            .post(url, body, {
                headers: authorizeRequest(),
                params,
            })
            .then((res) => cb(res.data))
            .catch((err) => {
                console.error("ERROR:", err);
                cb(null);
            });
    },

    PATCH(url: string, body = {}, params = {}, cb: Function) {
        axiosInstance
            .patch(url, body, {
                headers: authorizeRequest(),
                params,
            })
            .then((res) => cb(res.data))
            .catch((err) => {
                console.error("ERROR:", err);
                cb(null);
            });
    },

    PUT(url: string, body = {}, params = {}, cb: Function) {
        axiosInstance
            .put(url, body, {
                headers: authorizeRequest(),
                params,
            })
            .then((res) => cb(res.data))
            .catch((err) => {
                console.error("ERROR:", err);
                cb(null);
            });
    },

    DELETE(url: string, params = {}, cb: Function) {
        axiosInstance
            .delete(url, {
                headers: authorizeRequest(),
                params,
            })
            .then((res) => cb(res.data))
            .catch((err) => {
                console.error("ERROR:", err);
                cb(null);
            });
    },

    GENERAL(url: string, method = "GET", body = {}, params = {}, headers = {}, cb: Function) {
        axios({
            url,
            method,
            data: body,
            params,
            headers,
        })
            .then((res) => cb(res.data))
            .catch((err) => {
                console.error("ERROR:", err);
                cb(null);
            });
    },

    DOWNLOAD(url: string, body = {}, params = {}, cb: Function) {
        axiosInstance
            .get(url, {
                responseType: "blob",
                headers: authorizeRequest(),
                data: body,
                params,
            })
            .then((res) => cb(res.data))
            .catch((err) => console.error("ERROR:", err));
    },
};

export default axiosInstance;
