import { useEffect } from "react";

const useAuth = () => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/secure");
        if (res.status == 200) return true;
        else return false;
      } catch (error) {
        return false;
      }
    };
    checkAuth();
  });
};
