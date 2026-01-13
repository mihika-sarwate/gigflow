import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { addNotification } from '../store/slices/notificationSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO');
      // Join user's personal room
      socket.emit('join', user._id);
    });

    // Listen for hire notifications
    socket.on('hired', (data) => {
      console.log('Received hire notification:', data);
      
      // Add to notifications store
      dispatch(addNotification({
        type: 'hired',
        message: data.message,
        gigTitle: data.gigTitle,
        gigId: data.gigId,
        bidId: data.bidId,
      }));

      // Show toast notification
      toast.success(data.message, {
        duration: 6000,
        icon: '🎉',
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user, dispatch]);

  return children;
};

export default SocketProvider;
