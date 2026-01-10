"use client";

import { activeMessages, contactMessage, contactMessageHistory, fetchPeerId, messageContacts, sendMessage } from "@/hooks/messages";
import React, { useState, useRef, useEffect } from "react";
import { Search, Phone, Video, Smile, Paperclip, Send, MessageSquareDot, Plus, ArrowLeft, SquarePen } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { format } from "date-fns";
import { useSocketContext } from "@/context/SocketContextProvider";
import { usePeerContext } from "@/context/CallProvider";

interface Contact {
  email: string;
  firstname: string;
  lastname: string;
  id?: number;
  name?: string;
  role?: string;
  _id?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  avatar?: string;
  isOnline?: boolean;
  isGroup?: boolean;
  status: string;
}

interface Message {
  id: string;
  _id?: string;
  sender: { _id: string; firstname?: string; lastname?: string };
  type?: string;
  url?: string;
  text?: string;
  timestamp?: string;
}

interface Participant {
  _id?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  isOnline?: boolean;
}

interface Conversation {
  _id: string;
  id?: string;
  last_message?: string;
  lastMessage?: string;
  updated_at?: string;
  updatedAt?: string;
  unread?: number;
  participants: Participant[];
}

interface TransformedContact extends Participant {
  conversationId: string;
  lastMessage?: string;
  timestamp: string;
  unread: number;
}

export default function ChatDashboard() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchQuery] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedContact, setSelectedContact, sending, setSending, loggedInUser, messages, setMessages, conversationId, setConversationId, recipientPeerId, setRecipientPeerId, startAudioCall, startVideoCall } = usePeerContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await activeMessages();
        setConversations(response);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    const fetchUpdatedConversation = async () => {
      try {
        const messageHistory = await contactMessageHistory(conversationId);
        setMessages(messageHistory);
        const getPeerIdResponse = await fetchPeerId(selectedContact?._id || "");
        setRecipientPeerId(getPeerIdResponse?.peerId || null);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    fetchUpdatedConversation();
    const interval = setInterval(fetchUpdatedConversation, 5000);
    return () => clearInterval(interval);
  }, [conversationId, selectedContact?._id, setMessages, setRecipientPeerId]);

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);

    try {
      const response = await contactMessage(contact?._id || "");
      setConversationId(response?._id);
      const messageHistory = await contactMessageHistory(response?._id);
      setMessages(messageHistory);
      const getPeerIdResponse = await fetchPeerId(contact?._id || "");
      setRecipientPeerId(getPeerIdResponse?.peerId || null);
    } catch (error) {
      console.log(error);
    }
  };

  const socket = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      if (loggedInUser?.id) {
        socket.emit("join", loggedInUser?.id);
      }
    });

    socket.on("user:online", ({ userId }: { userId: string }) => {
      setConversations((prev: Conversation[] | null) =>
        prev?.map((conv: Conversation) => ({
          ...conv,
          participants: conv.participants?.map((p: Participant) => (String(p._id) === String(userId) ? { ...p, isOnline: true } : p)),
        })) || null
      );
    });

    socket.on("user:offline", ({ userId }: { userId: string }) => {
      setConversations((prev: Conversation[] | null) =>
        prev?.map((conv: Conversation) => ({
          ...conv,
          participants: conv.participants?.map((p: Participant) => (String(p._id) === String(userId) ? { ...p, isOnline: false } : p)),
        })) || null
      );
    });

    return () => {
      socket.off("connect");
      socket.off("user:online");
      socket.off("user:offline");
    };
  }, [loggedInUser, socket]);

  const transformedContacts: TransformedContact[] = conversations?.map((contact: Conversation) => {
    const otherParticipant = contact?.participants?.find((p: Participant) => p._id !== loggedInUser?.id);
    return {
      conversationId: contact?._id,
      lastMessage: contact?.last_message || contact?.lastMessage,
      timestamp: contact?.updated_at || contact?.updatedAt || new Date().toISOString(),
      unread: contact?.unread || 0,
      ...otherParticipant,
    };
  }) || [];

  const filteredContacts = transformedContacts?.filter((contact: TransformedContact) =>
    contact?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages?.filter((message: Message) =>
    chatSearchQuery === "" || (message?.text && message.text.toLowerCase().includes(chatSearchQuery.toLowerCase()))
  );

  const handleSend = async () => {
    if (!selectedContact || !conversationId) return;
    const text = messageInput.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      await sendMessage(conversationId, text, "text", "");
      setMessageInput("");
      const history = await contactMessageHistory(conversationId);
      setMessages(history);
    } catch (error: unknown) {
      console.log(error);
    }
    setSending(false);
  };

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const response = await messageContacts();
        setAllContacts(response);
      } catch (error) {
        console.log("error getting users", error);
      }
    };
    getUsersList();
  }, [isModalOpen]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className={`${isMobile ? (showSidebar ? "w-full" : "w-0 overflow-hidden") : "w-full md:w-1/3 lg:w-1/3"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <ContactModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            contacts={allContacts}
            onSelectContact={(contact: Contact) => {
              handleSelectContact(contact);
              if (isMobile) setShowSidebar(false);
              setIsModalOpen(false);
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full space-x-3 p-4 border-b border-gray-200">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search or start new chat" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <button className="p-2" onClick={() => setIsModalOpen(true)}>
            <SquarePen className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts?.map((contact: TransformedContact) => (
            <div
              key={contact?._id}
              onClick={() => {
                const contactData: Contact = {
                  firstname: contact.firstname || "",
                  lastname: contact.lastname || "",
                  email: "",
                  status: "",
                  _id: contact._id,
                  avatar: contact.avatar,
                  isOnline: contact.isOnline
                };
                handleSelectContact(contactData);
                if (isMobile) setShowSidebar(false);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedContact?._id === contact?._id ? "bg-gray-100" : ""}`}>
              <div className="flex items-center space-x-3 relative">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={contact?.avatar || "/images/Blank_Profile.jpg"} alt={contact?.firstname} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${contact?.isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {contact?.firstname} {contact?.lastname}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {contact.timestamp && format(new Date(contact.timestamp), "eee p")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500 truncate">{contact?.lastMessage}</p>
                    {(contact?.unread ?? 0) > 0 && <span className="ml-2 bg-secondary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">{contact.unread}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedContact ? (
        <div className={`${isMobile ? (showSidebar ? "w-0 overflow-hidden" : "w-full") : "flex-1"} flex flex-col bg-gray-50 transition-all duration-300`}>
          <div className="bg-gray-100 border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && <button onClick={() => setShowSidebar(true)} className="p-2 md:hidden"><ArrowLeft className="w-5 h-5" /></button>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedContact?.avatar || "/images/Blank_Profile.jpg"} alt={selectedContact?.firstname} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedContact?.firstname} {selectedContact?.lastname}</h3>
                  <p className="text-sm text-gray-500">{selectedContact?.isOnline ? "Online" : "Away"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => recipientPeerId && startAudioCall(recipientPeerId)} className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"><Phone className="w-5 h-5" /></button>
                <button onClick={() => recipientPeerId && startVideoCall(recipientPeerId)} className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"><Video className="w-5 h-5" /></button>
                <button onClick={() => setShowChatSearch(!showChatSearch)} className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"><Search className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages?.map((message: Message) => (
              <div key={message?.id} className={`flex ${message?.sender?._id === loggedInUser?.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message?.sender?._id === loggedInUser?.id ? "bg-secondary text-white" : "bg-white text-gray-900 shadow-sm"}`}>
                  {message?.type === "image" && message?.url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={message?.url} alt="Shared image" className="w-full h-48 object-cover rounded mb-2" />
                      {message?.text && <p className="text-sm mt-2">{message?.text}</p>}
                    </>
                  ) : (
                    <p className="text-sm">{message?.text}</p>
                  )}
                  <p className="text-[10px] opacity-70 mt-1">{message.timestamp && format(new Date(message.timestamp), "p")}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-gray-100 border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-200 rounded-full"><Smile className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-gray-200 rounded-full"><Paperclip className="w-5 h-5" /></button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button onClick={handleSend} className="p-2 bg-secondary text-white rounded-full hover:bg-secondary/90"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquareDot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
            <p className="text-gray-500">Pick a contact to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
