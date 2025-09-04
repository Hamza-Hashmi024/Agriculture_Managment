import axios from "axios";
import { Base_Url } from "@/Globle/Base_URL";

let accessToken: string | null = localStorage.getItem("accessToken");
let refreshToken: string | null = localStorage.getItem("refreshToken");
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const api = axios.create({
  baseURL: `${Base_Url}/api`,
});

export const setTokens = (at: string | null, rt: string | null) => {
  accessToken = at;
  refreshToken = rt;
  if (at) localStorage.setItem("accessToken", at); else localStorage.removeItem("accessToken");
  if (rt) localStorage.setItem("refreshToken", rt); else localStorage.removeItem("refreshToken");
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const processQueue = (error: any, token: string | null = null) => {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // if unauthorized & not already retried
    if (err.response?.status === 401 && !original._retry) {
      if (!refreshToken) {
        processQueue(err, null);
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // wait for ongoing refresh
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${Base_Url}/api/auth/refresh`, { refreshToken });
        setTokens(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        setTokens(null, null);
        // let caller handle (AuthContext will logout)
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;