"use client";

import { activeMessages, contactMessage, contactMessageHistory, fetchPeerId, messageContacts, sendMessage, markConversationAsRead, addReaction, removeReaction, getMessageReactions, sendMessageWithFile } from "@/hooks/messages";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, Phone, Video, Smile, Send, MessageSquareDot, Plus, ArrowLeft, SquarePen } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { usePresence } from "@/context/PresenceProvider";
import { usePeerContext } from "@/context/CallProvider";
import MessageBubble from "@/components/messaging/MessageBubble";
import DateSeparator from "@/components/messaging/DateSeparator";
import TypingIndicator from "@/components/messaging/TypingIndicator";
import FileUploadButton from "@/components/messaging/FileUploadButton";

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
  read_at?: string;
  delivered_at?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
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

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
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
  const [uploading, setUploading] = useState(false);
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
  const [isTyping] = useState(false);

  const { selectedContact, setSelectedContact, sending, setSending, loggedInUser, messages, setMessages, conversationId, setConversationId, recipientPeerId, setRecipientPeerId, startAudioCall, startVideoCall } = usePeerContext();
  const { onlineUsers } = usePresence();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Load reactions when messages change
  const loadReactions = useCallback(async () => {
    if (messages.length === 0) return;
    const messageIds = messages.map((m: Message) => m.id || m._id).filter(Boolean);
    const reactionsData = await getMessageReactions(messageIds as string[]);
    setReactions(reactionsData);
  }, [messages]);

  useEffect(() => {
    loadReactions();
  }, [loadReactions]);

  useEffect(() => {
    if (!conversationId) return;
    const fetchUpdatedConversation = async () => {
      try {
        const messageHistory = await contactMessageHistory(conversationId);
        setMessages(messageHistory);
        const getPeerIdResponse = await fetchPeerId(selectedContact?._id || "");
        setRecipientPeerId(getPeerIdResponse?.peerId || null);

        // Mark as read
        await markConversationAsRead(conversationId);
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

      // Mark as read
      if (response?._id) {
        await markConversationAsRead(response._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transformedContacts: TransformedContact[] = conversations?.map((contact: Conversation) => {
    const otherParticipant = contact?.participants?.find((p: Participant) => p._id !== loggedInUser?.id);
    return {
      conversationId: contact?._id,
      lastMessage: contact?.last_message || contact?.lastMessage,
      timestamp: contact?.updated_at || contact?.updatedAt || new Date().toISOString(),
      unread: contact?.unread || 0,
      ...otherParticipant,
      isOnline: otherParticipant?._id ? onlineUsers.has(otherParticipant._id) : false,
    };
  }) || [];

  const filteredContacts = transformedContacts?.filter((contact: TransformedContact) =>
    contact?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = (messages || []).filter((message: Message) =>
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

  const handleFileUpload = async (file: File) => {
    if (!conversationId) return;

    setUploading(true);
    try {
      await sendMessageWithFile(conversationId, "", file);
      const history = await contactMessageHistory(conversationId);
      setMessages(history);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setUploading(false);
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
      loadReactions();
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    try {
      await removeReaction(messageId, emoji);
      loadReactions();
    } catch (error) {
      console.error("Error removing reaction:", error);
    }
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

  // Group messages by date and sender
  const groupedMessages = filteredMessages.reduce((acc: { date: Date; messages: Message[] }[], message: Message, index: number) => {
    const messageDate = new Date(message.timestamp || Date.now());
    const prevMessage = filteredMessages[index - 1];
    const prevDate = prevMessage ? new Date(prevMessage.timestamp || Date.now()) : null;

    // Check if we need a new date group
    if (!prevDate || !isSameDay(messageDate, prevDate)) {
      acc.push({ date: messageDate, messages: [message] });
    } else {
      acc[acc.length - 1].messages.push(message);
    }

    return acc;
  }, []);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${isMobile ? (showSidebar ? "w-full" : "w-0 overflow-hidden") : "w-full md:w-1/3 lg:w-1/3"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="p-4 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
            <button onClick={() => setIsModalOpen(true)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
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

        <div className="flex items-center justify-between w-full space-x-3 p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button className="p-2 hover:bg-gray-200 rounded-full transition" onClick={() => setIsModalOpen(true)}>
            <SquarePen className="w-4 h-4 text-gray-600" />
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
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedContact?._id === contact?._id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}`}>
              <div className="flex items-center space-x-3 relative">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={contact?.avatar || "/images/Blank_Profile.jpg"} alt={contact?.firstname} className="w-12 h-12 rounded-full object-cover bg-gray-200 ring-2 ring-white shadow-sm" />
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${contact?.isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {contact?.firstname} {contact?.lastname}
                    </h3>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {contact.timestamp && (
                        isToday(new Date(contact.timestamp))
                          ? format(new Date(contact.timestamp), "p")
                          : isYesterday(new Date(contact.timestamp))
                            ? "Yesterday"
                            : format(new Date(contact.timestamp), "MMM d")
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500 truncate">{contact?.lastMessage}</p>
                    {(contact?.unread ?? 0) > 0 && <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-medium">{contact.unread}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact ? (
        <div className={`${isMobile ? (showSidebar ? "w-0 overflow-hidden" : "w-full") : "flex-1"} flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 transition-all duration-300`}>
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && <button onClick={() => setShowSidebar(true)} className="p-2 md:hidden hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>}
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedContact?.avatar || "/images/Blank_Profile.jpg"} alt={selectedContact?.firstname} className="w-11 h-11 rounded-full object-cover bg-gray-200 ring-2 ring-white shadow-sm" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${onlineUsers.has(selectedContact?._id || "") ? "bg-green-500" : "bg-gray-400"}`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedContact?.firstname} {selectedContact?.lastname}</h3>
                  <p className="text-sm text-gray-500">{onlineUsers.has(selectedContact?._id || "") ? "Online" : "Away"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => recipientPeerId && startAudioCall(recipientPeerId)} className="p-2.5 hover:bg-gray-100 rounded-full cursor-pointer transition"><Phone className="w-5 h-5 text-gray-600" /></button>
                <button onClick={() => recipientPeerId && startVideoCall(recipientPeerId)} className="p-2.5 hover:bg-gray-100 rounded-full cursor-pointer transition"><Video className="w-5 h-5 text-gray-600" /></button>
                <button onClick={() => setShowChatSearch(!showChatSearch)} className="p-2.5 hover:bg-gray-100 rounded-full cursor-pointer transition"><Search className="w-5 h-5 text-gray-600" /></button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {groupedMessages.map((group: { date: Date; messages: Message[] }, groupIndex: number) => (
              <React.Fragment key={groupIndex}>
                <DateSeparator date={group.date} />
                {group.messages.map((message: Message, msgIndex: number) => {
                  const isOwn = message?.sender?._id === loggedInUser?.id;
                  const prevMsg = group.messages[msgIndex - 1];
                  const nextMsg = group.messages[msgIndex + 1];
                  const showAvatar = !isOwn && (!prevMsg || prevMsg.sender?._id !== message.sender?._id);
                  const isLastInGroup = !nextMsg || nextMsg.sender?._id !== message.sender?._id;
                  const messageId = message.id || message._id || '';

                  return (
                    <MessageBubble
                      key={messageId}
                      id={messageId}
                      text={message.text}
                      type={message.type as 'text' | 'image' | 'file'}
                      fileUrl={message.file_url || message.url}
                      fileName={message.file_name}
                      fileType={message.file_type}
                      timestamp={message.timestamp || new Date().toISOString()}
                      isOwn={isOwn}
                      isRead={!!message.read_at}
                      isDelivered={!!message.delivered_at}
                      senderName={`${message.sender?.firstname || ''} ${message.sender?.lastname || ''}`}
                      senderAvatar={selectedContact?.avatar}
                      reactions={reactions[messageId] || []}
                      showAvatar={showAvatar}
                      isLastInGroup={isLastInGroup}
                      onAddReaction={handleAddReaction}
                      onRemoveReaction={handleRemoveReaction}
                    />
                  );
                })}
              </React.Fragment>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <TypingIndicator userName={`${selectedContact?.firstname}`} />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition"><Smile className="w-5 h-5 text-gray-500" /></button>
              <FileUploadButton onFileSelect={handleFileUpload} uploading={uploading} />
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <button
                onClick={handleSend}
                disabled={sending || !messageInput.trim()}
                className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareDot className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a contact to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
