import Cookies from "js-cookie";
import axiosInstance from "../../lib/axios";
import api from "@/utils/api";

export const getStaffs = async () => {
  const token = Cookies.get("token");
  const response = await api.get("/api/users?role=STAFF", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
