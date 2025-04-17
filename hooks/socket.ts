import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

type Data = object | string | number | boolean | null | undefined;

export const useSocket = ({ userId }: { userId: string | null }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL ||
        'https://theralink-backend.onrender.com'
    );
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!userId || !socket) return;
    socket.emit('register_user', {
      userId: userId,
    });

    socket?.on('connect_error', (error: Error) => {
      return error;
    });

    return () => {
      socket.off('connect_error');
    };
  }, [userId, socket]);

  return;
};

export const useSocketSendDm = ({
  userId,
  toUserId,
  data,
}: {
  userId: string;
  toUserId: string;
  data: Data;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL ||
        'https://theralink-backend.onrender.com'
    );
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  try {
    if (!socket || !userId || !toUserId) return;
    socket.emit('send_dm', {
      userId: userId,
      toUserId: toUserId,
      data: data,
    });
  } catch (error) {
    console.error('Error sending DM:', error);
  }
  return;
};

export const useSocketReceiveDm = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL ||
        'https://theralink-backend.onrender.com'
    );
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.off('receive_dm');
    socket.on('receive_dm', (message: Data) => {
      return message;
    });

    return () => {
      socket.off('receive_dm');
    };
  }, [socket]);
  return;
};
