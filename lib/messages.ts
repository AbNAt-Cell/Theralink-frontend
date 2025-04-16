import axiosInstance from "./axios";
import Cookies from "js-cookie";

export const messages = async () => {
  const response = await axiosInstance.get("/api/conversations", {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  return response.data;
};

export const message = async (conversationId: string | null) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  const response = await axiosInstance.get(`/api/message/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  return response.data;
};
