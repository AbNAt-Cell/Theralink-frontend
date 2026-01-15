-- ============================================
-- MESSAGING COMPLETE FIX
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. First, add the peer_id column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS peer_id TEXT;

-- 2. Drop ALL existing problematic policies to start fresh
DROP POLICY IF EXISTS "Users can view their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view other participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view conversations they are part of" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update conversations they are part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own peer_id" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 3. SIMPLE policies for conversation_participants (no self-reference)
CREATE POLICY "Allow all authenticated to view participants" ON public.conversation_participants
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all authenticated to add participants" ON public.conversation_participants
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. SIMPLE policies for conversations
CREATE POLICY "Allow all authenticated to view conversations" ON public.conversations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all authenticated to create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all authenticated to update conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 5. Policies for messages - keep simple
CREATE POLICY "Allow view messages in conversations" ON public.messages
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow insert own messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Allow update own messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid());

-- 6. Profiles policies
CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

SELECT 'All policies fixed!' as result;
