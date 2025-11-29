import Cookies from "js-cookie";
import axiosInstance from "../lib/axios";
import api from "@/utils/api";

export const messages = async () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get("/api/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const message = async (conversationId: string | null) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get(`/api/message/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const messageContacts = async () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get("/api/auth/messaging", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const activeMessages = async () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get("/api/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const contactMessage = async (recipientId: any) => {
  if (!recipientId) {
    throw new Error("Conversation ID is required");
  }
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.post(
    `/api/conversations`,
    { recipientId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const storePeerId = async (peerId: any) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.post(
    `/api/call/peer`,
    { peerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchPeerId = async (recipientId: any) => {
  if (!recipientId) {
    throw new Error("Recipient ID is required");
  }
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get(`/api/call/peer/${recipientId}`);
  return response.data;
};

export const contactMessageHistory = async (conversationId: any) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get(`/api/messages/${conversationId}`);
  return response.data;
};

export const usersList = async () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  const response = await api.get("/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendMessage = async (conversationId: string, text: string, type: string, url: string) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }

  const response = await api.post(
    "/api/messages",
    {
      conversationId,
      text,
      type,
      url,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteMessage = async (id: any) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }

  const response = await api.delete(`/api/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteConvo = async (id: any) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token is required");
  }

  const response = await api.delete(`/api/conversations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
