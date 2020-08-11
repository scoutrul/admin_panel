import createRepo from "@/api/repository";
import TokenStorage from "@/utils/token-storage";

export default (ctx, inject) => {
  const mainAxios = ctx.$axios.create({
    baseURL: ctx.$config.API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const axiosRepo = createRepo(mainAxios);

  const repos = {
    auth: axiosRepo("api/admin/auth"),
    user: axiosRepo("api/admin/user"),
    admin: axiosRepo("api/admin"),
    root: axiosRepo("api"),
    profile: axiosRepo("api/admin/profile"),
  };

  mainAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${TokenStorage.getAccessToken()}`;
    return config;
  });

  mainAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const originalRequest = error.config;

      // Return any error which is not due to authentication back to the calling service
      if (error.response.status !== 401) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      // Logout user if token refresh didn't work or user is disabled
      if (error.config.url == "/api/admin/auth/refresh") {
        TokenStorage.clearToken();
        ctx.app.router.push("/auth");
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      // Try request again with new token
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        return mainAxios
          .post("/api/admin/auth/refresh", {
            refreshToken: TokenStorage.getRefreshToken(),
          })
          .then((res) => {
            if (res.status === 201) {
              TokenStorage.setToken(res.data);
              return mainAxios(originalRequest);
            }
          })
          .catch((err) => {
            TokenStorage.clearToken();
            ctx.app.router.push("/auth");
            return err;
          });
      }
    }
  );

  inject("api", repos);
};
