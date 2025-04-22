import { useUser } from "@/providers/UserProvider";
import { useDisconnect } from "@reown/appkit/react";
import axios from "axios";
import { useMemo } from "react";

declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

export function useHttp() {
  const { setAccessToken, setUser, user, accessToken } = useUser();
  const { disconnect } = useDisconnect();

  return useMemo(() => {
    const http = axios.create({
      baseURL: "/api",
    });

    http.interceptors.request.use((req) => {
      req.headers.setAuthorization(`Bearer ${accessToken}`);

      return req;
    });

    http.interceptors.response.use(
      (res) => {
        return res.data;
      },
      function (error) {
        if (error.status === 401) {
          setAccessToken(null);
          setUser(null);

          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");

          disconnect();
        }

        return Promise.reject(error);
      }
    );

    return http;
  }, [user, accessToken, disconnect]);
}
