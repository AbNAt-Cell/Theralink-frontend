"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { message } from "@/hooks/messages";
import { getStoredUser } from "@/hooks/auth";
import { useSocketContext } from "@/context/SocketContextProvider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Email {
  id: number;
  userId: string;
  sender: string;
  subject: string;
  body: string;
  category?: string;
  time: string;
  isChecked: boolean;
  isStarred: boolean;
}

export default function Page() {
  const socket = useSocketContext()
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [Message, setMessage] = useState<string>();
  const pathname = usePathname();

  let conversationId: string | null = null;
  conversationId = pathname.substring(pathname.lastIndexOf("/") + 1) || null;

  // No need for this since it has already been wrapped with the context provider
  // useEffect(() => {
  //   const socketInstance = io(
  //     process.env.NEXT_PUBLIC_API_URL ||
  //       "https://theralink-backend.onrender.com"
  //   );
  //   setSocket(socketInstance);
  //   return () => {
  //     socketInstance.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await message(conversationId);
        setEmails(response.Messages);
        console.log("Fetched messages:", response);
      } catch (error) {
        setError("Failed to fetch messages");
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  const sendMessage = async() => {
    const user = getStoredUser();
    if (!user || !user.id) {
      setError("User not found");
      return;
    } else if (!socket) {
      setError("Socket not initialized");
      return;
    }
    try {
      socket?.emit("send_dm", {
        userId: user.id,
        toUserId: conversationId,
        message: message,
      });
    }catch (error) {
      setError("Failed to send message");
      console.error("Error sending message:", error);
    }
  }

  return (
    <div>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-8 px-3">
          <h1 className="text-2xl font-bold">Messages</h1>
        </CardHeader>
        <CardContent className="flex gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div>
              {emails?.map((email) => (
                <div
                  key={email.id}
                  className={`text-white border-b py-2 ${
                    email.userId === conversationId
                      ? "bg-gray-500 flex justify-start"
                      : "bg-blue-500 flex justify-end"
                  }`}
                >
                  <p>{email?.body}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={Message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
