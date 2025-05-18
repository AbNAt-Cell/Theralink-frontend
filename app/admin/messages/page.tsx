'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  // SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  SendHorizontal,
  Paperclip,
  Plus,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EmailInbox from './EmailInbox';
import { User, userSearch } from '@/hooks/user';
import { messages } from '@/hooks/messages';
import axiosInstance from '@/lib/axios';
import { useSocketContext } from '@/context/SocketContextProvider';
import { getStoredUser } from '@/hooks/auth';
// import { useSocketSendDm } from '@/lib/socket';
interface Conversation {
  id: string;
  lastMessage: string;
  participants: { userId: string }[];
}
interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: boolean;
}
interface Email {
  id: string;
  useId: string;
  participants: { user: Participant }[];
  lastMessage: string;
  category?: string;
  updatedAt: string;
  isChecked: boolean;
  isStarred: boolean;
}

const AdminMessagingPage = () => {
  const user = getStoredUser();
  const socket = useSocketContext();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  // messaging and coversation states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await messages();
        setEmails(response.conversations);
        console.log('Fetched messages:', response);
      } catch (error) {
        setError('Failed to fetch messages');
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  function sendMessage() {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const files = formData.getAll('files');
      const socketData = {
        conversationId: conversationId,
        body,
        toUserId: selectedUser?.id,
        userId: user?.id,
        image: files,
      };
      // console.log("socketData:", socketData)
      socket?.emit('send_dm', socketData);
    };
  }

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const users = await userSearch({ email: searchQuery });
        setSearchResults(users);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };
    // adding debouncing when a user is searching
    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const createConversation = async (patientId: string) => {
    try {
      const response = await axiosInstance.post(
        `/api/conversations/${patientId}`,
        { lastMessage: 'New conversation' },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      const conversation: Conversation = response.data.conversation;
      setConversationId(conversation.id);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  };

  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.email);
    setSearchResults([]);
    try {
      await createConversation(user.id);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to start conversation');
    }
  };

  useEffect(() => {
    if (socket) {
      socket?.off('receive_dm'); // Clear previous listener
      socket?.on('receive_dm', (message) => {
        // setChat((prev) => ({
        //   ...prev,
        //   messages: [
        //     ...prev?.messages,
        //     {
        //       text: message.text,
        //       receiverid: message?.receiverid,
        //       sender: {
        //         name: message?.sender?.name,
        //         username: message?.sender?.username,
        //         image: message?.sender?.image,
        //         id: message?.sender?.id,
        //       },
        //     },
        //   ],
        // }));
        console.log(message);
      });
    }
    return () => {
      socket?.off('receive_dm');
    };
  }, [socket]);

  return (
    <div className='container max-w-[1350px] mx-auto p-6 space-y-6'>
      <Card className='border-0 shadow-none bg-transparent'>
        <CardContent className='flex gap-4'>
          <div className='w-80'>
            <Card className='w-full max-w-5xl p-0'>
              <CardHeader className='pb-8 px-3'>
                <Dialog
                  open={isNewMessageOpen}
                  onOpenChange={setIsNewMessageOpen}
                >
                  <DialogTrigger asChild>
                    <Button size='lg' className='w-full gap-2'>
                      <Plus className='mr-2 h-4 w-4' />
                      Compose
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[625px]'>
                    <DialogHeader>
                      <DialogTitle>New Message</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={sendMessage()}>
                      <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4 relative'>
                          <label htmlFor='to' className='text-right'>
                            To
                          </label>
                          <Input
                            id='to'
                            className='col-span-3'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Enter email'
                          />
                          {/* Dropdown for search results */}
                          {searchResults.length > 0 && (
                            <div className='col-span-3 absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
                              {searchResults.map((user) => (
                                <div
                                  key={user.id}
                                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                                  onClick={() => handleSelectUser(user)}
                                >
                                  {user.email}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <label htmlFor='body' className='text-right'>
                            Body
                          </label>
                          <Textarea
                            id='body'
                            value={body}
                            name='body'
                            onChange={(e) => setBody(e.target.value)}
                            className='col-span-3'
                            rows={5}
                          />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <label htmlFor='files' className='text-right'>
                            Attachments
                          </label>
                          <div className='col-span-3 flex items-center gap-2'>
                            <Input
                              id='files'
                              type='file'
                              multiple
                              className='hidden'
                            />
                            <Button
                              variant='outline'
                              onClick={() =>
                                document.getElementById('files')?.click()
                              }
                            >
                              <Paperclip className='mr-2 h-4 w-4' />
                              Select Files
                            </Button>
                            <span className='text-sm text-muted-foreground'>
                              No files selected
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='outline'
                          onClick={() => setIsNewMessageOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant='secondary'>Save Draft</Button>
                        <Button onClick={() => sendMessage()}>Send</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className='px-3'>
                <div className='flex flex-col gap-3'>
                  <p className='font-bold'>Staff</p>
                  <div className='flex flex-col gap-1'>
                    <button className='w-full flex flex-row justify-between gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[#E7EEFF] text-[#1C5AEB]'>
                      <div className='flex items-center gap-2'>
                        <Inbox className='h-4 w-4' />
                        Inbox
                      </div>
                      <p className='text-xs font-semibold'>500</p>
                    </button>
                    <button className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700'>
                      <SendHorizontal className='h-4 w-4' />
                      Sent
                    </button>
                    <button className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-red-600'>
                      <Trash2 className='h-4 w-4' />
                      Trash
                    </button>
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <p className='font-bold'>Client</p>
                  <div className='flex flex-col gap-1'>
                    <button className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-900'>
                      <Inbox className='h-4 w-4' />
                      Inbox
                    </button>
                    <button className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700'>
                      <SendHorizontal className='h-4 w-4' />
                      Sent
                    </button>
                    <button className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-red-600'>
                      <Trash2 className='h-4 w-4' />
                      Trash
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='flex-1'>
            <div className='rounded-md border'>
              <EmailInbox emails={emails} error={error} loading={loading} />
            </div>
            <div className='mt-4 flex items-center justify-between px-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                  Rows per page
                </span>
                <Select defaultValue='10'>
                  <SelectTrigger className='w-16'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5</SelectItem>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='20'>20</SelectItem>
                    <SelectItem value='50'>50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center gap-4'>
                <span className='text-sm text-muted-foreground'>1-1 of 1</span>
                <div className='flex gap-1'>
                  <Button variant='ghost' size='icon' disabled>
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon' disabled>
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessagingPage;
