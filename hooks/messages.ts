import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const storePeerId = async (peerId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ peer_id: peerId })
    .eq("id", user.id);

  if (error) {
    console.error("Error storing peer ID:", error);
    throw error;
  }
};

export const fetchPeerId = async (userId: string) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("peer_id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching peer ID:", error);
    return null;
  }
  return { peerId: data.peer_id };
};

export const activeMessages = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get conversation IDs where the user is a participant
  const { data: userConversations, error: convError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", user.id);

  if (convError || !userConversations || userConversations.length === 0) {
    return [];
  }

  const conversationIds = userConversations.map((c: any) => c.conversation_id);

  // Get all conversations the user is part of
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .in("id", conversationIds)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching active messages:", error);
    return [];
  }

  // Get all participants for these conversations
  const { data: allParticipants } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      user_id,
      profiles:user_id (
        id,
        first_name,
        last_name,
        email,
        avatar_url
      )
    `)
    .in("conversation_id", conversationIds);

  // Group participants by conversation
  const participantsByConvo: Record<string, any[]> = {};
  allParticipants?.forEach((p: any) => {
    if (!participantsByConvo[p.conversation_id]) {
      participantsByConvo[p.conversation_id] = [];
    }
    if (p.profiles) {
      participantsByConvo[p.conversation_id].push({
        ...p.profiles,
        _id: p.profiles.id,
        firstname: p.profiles.first_name,
        lastname: p.profiles.last_name,
        avatar: p.profiles.avatar_url || "/images/Blank_Profile.jpg"
      });
    }
  });

  return conversations.map((conv: any) => ({
    ...conv,
    _id: conv.id,
    participants: participantsByConvo[conv.id] || []
  }));
};

export const contactMessage = async (recipientId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // First, try to find an existing conversation between the two users
  const { data: existingConversations } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      conversations:conversation_id (*)
    `)
    .eq("user_id", user.id);

  // Check if any of these conversations also have the recipient
  if (existingConversations && existingConversations.length > 0) {
    const conversationIds = existingConversations.map((c: any) => c.conversation_id);

    const { data: recipientConvos } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", recipientId)
      .in("conversation_id", conversationIds);

    if (recipientConvos && recipientConvos.length > 0) {
      // Found existing conversation
      const existingConvoId = recipientConvos[0].conversation_id;
      const { data: convo } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", existingConvoId)
        .single();

      return { ...convo, _id: convo?.id };
    }
  }

  // No existing conversation found, create a new one
  const { data, error } = await supabase
    .from("conversations")
    .insert({})
    .select()
    .single();

  if (error) throw error;

  // Add participants
  const { error: participantError } = await supabase
    .from("conversation_participants")
    .insert([
      { conversation_id: data.id, user_id: user.id },
      { conversation_id: data.id, user_id: recipientId }
    ]);

  if (participantError) {
    console.error("Error adding participants:", participantError);
  }

  return { ...data, _id: data.id };
};

export const contactMessageHistory = async (conversationId: string) => {
  if (!conversationId) return [];

  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching message history:", error);
    return [];
  }

  return data.map((m: any) => ({
    ...m,
    id: m.id,
    _id: m.id,
    text: m.content,
    type: m.type,
    timestamp: new Date(m.created_at).toISOString(),
    sender: {
      ...m.sender,
      _id: m.sender?.id,
      firstname: m.sender?.first_name,
      lastname: m.sender?.last_name,
    }
  }));
};

export const sendMessage = async (conversationId: string, text: string, type: string = "text", url: string = "") => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: text,
      type: type,
      url: url,
    })
    .select()
    .single();

  if (error) throw error;

  // Update conversation last_message and updatedAt
  await supabase
    .from("conversations")
    .update({
      last_message: text,
      updated_at: new Date().toISOString()
    })
    .eq("id", conversationId);

  return data;
};

export const messageContacts = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(50);

  if (error) return [];
  return data.map((p: any) => ({
    ...p,
    _id: p.id,
    firstname: p.first_name,
    lastname: p.last_name,
    avatar: p.avatar_url,
  }));
};

export const deleteMessage = async (id: string) => {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
};

export const deleteConvo = async (id: string) => {
  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) throw error;
};

// Legacy placeholders
export const messages = async () => { return { conversations: [] }; };
export const message = async (id: string) => { return null; };

// ============================================
// MESSAGING ENHANCEMENTS
// ============================================

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("id", messageId);

  if (error) console.error("Error marking message as read:", error);
};

// Mark all messages in conversation as read
export const markConversationAsRead = async (conversationId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  if (error) console.error("Error marking conversation as read:", error);
};

// Add reaction to message
export const addReaction = async (messageId: string, emoji: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("message_reactions")
    .insert({
      message_id: messageId,
      user_id: user.id,
      emoji: emoji
    });

  if (error && error.code !== '23505') throw error; // Ignore duplicate key errors
};

// Remove reaction from message
export const removeReaction = async (messageId: string, emoji: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("message_reactions")
    .delete()
    .eq("message_id", messageId)
    .eq("user_id", user.id)
    .eq("emoji", emoji);

  if (error) throw error;
};

// Get reactions for messages
export const getMessageReactions = async (messageIds: string[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || messageIds.length === 0) return {};

  const { data, error } = await supabase
    .from("message_reactions")
    .select("*")
    .in("message_id", messageIds);

  if (error) {
    console.error("Error fetching reactions:", error);
    return {};
  }

  // Group reactions by message
  const reactionsByMessage: Record<string, { emoji: string; count: number; userReacted: boolean }[]> = {};

  data.forEach((r: any) => {
    if (!reactionsByMessage[r.message_id]) {
      reactionsByMessage[r.message_id] = [];
    }

    const existing = reactionsByMessage[r.message_id].find(e => e.emoji === r.emoji);
    if (existing) {
      existing.count++;
      if (r.user_id === user.id) existing.userReacted = true;
    } else {
      reactionsByMessage[r.message_id].push({
        emoji: r.emoji,
        count: 1,
        userReacted: r.user_id === user.id
      });
    }
  });

  return reactionsByMessage;
};

// Upload file attachment
export const uploadMessageFile = async (file: File, conversationId: string): Promise<{ url: string; fileName: string; fileType: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const fileExt = file.name.split('.').pop();
  const fileName = `${conversationId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("message-attachments")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("message-attachments")
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    fileName: file.name,
    fileType: file.type
  };
};

// Send message with file
export const sendMessageWithFile = async (
  conversationId: string,
  text: string,
  file: File
) => {
  const { url, fileName, fileType } = await uploadMessageFile(file, conversationId);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const messageType = fileType.startsWith('image/') ? 'image' : 'file';

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: text,
      type: messageType,
      url: url,
      file_url: url,
      file_name: fileName,
      file_type: fileType,
    })
    .select()
    .single();

  if (error) throw error;

  // Update conversation last_message
  await supabase
    .from("conversations")
    .update({
      last_message: text || `📎 ${fileName}`,
      updated_at: new Date().toISOString()
    })
    .eq("id", conversationId);

  return data;
};
