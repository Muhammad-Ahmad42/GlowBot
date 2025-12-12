import { create } from "zustand";
import { BASE_URL } from "../res/api";

export interface ConnectionRequest {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  expertId: string;
  expert?: {
    _id: string;
    name: string;
    specialty: string;
    imageUrl?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  _id?: string;
  connectionId: string;
  senderId: string;
  senderType: 'user' | 'dermatologist';
  text: string;
  image?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
}

interface ConnectionState {
  connections: ConnectionRequest[];
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
  fetchMyConnections: (userId: string) => Promise<void>;
  sendConnectionRequest: (userId: string, userName: string, userAvatar: string | undefined, userEmail: string, expertId: string, message?: string) => Promise<ConnectionRequest>;
  getConnectionStatus: (expertId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
  getConnectionByExpert: (expertId: string) => ConnectionRequest | undefined;
  fetchMessages: (connectionId: string) => Promise<void>;
  sendMessage: (connectionId: string, text: string, senderId: string, image?: string) => Promise<void>;
  disconnectExpert: (connectionId: string) => Promise<void>;
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  connections: [],
  messages: {},
  loading: false,

  disconnectExpert: async (connectionId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/connections/${connectionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to disconnect');
      
      set((state) => ({
        connections: state.connections.filter(c => c.id !== connectionId)
      }));
    } catch (error) {
        console.error('Error disconnecting:', error);
        throw error;
    }
  },

  fetchMyConnections: async (userId: string) => {
    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/connections/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch connections');
      
      const data = await response.json();
      const connections: ConnectionRequest[] = data.map((item: any) => ({
        id: item._id,
        _id: item._id,
        userId: item.userId,
        userName: item.userName,
        userAvatar: item.userAvatar,
        expertId: item.expertId?._id || item.expertId,
        expert: item.expertId ? {
          _id: item.expertId._id,
          name: item.expertId.name,
          specialty: item.expertId.specialty,
          imageUrl: item.expertId.imageUrl,
        } : undefined,
        status: item.status,
        message: item.message,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      
      set({ connections, loading: false });
    } catch (error) {
      console.error('Error fetching connections:', error);
      set({ loading: false });
    }
  },

  sendConnectionRequest: async (userId, userName, userAvatar, userEmail, expertId, message) => {
    try {
      const response = await fetch(`${BASE_URL}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          userAvatar,
          userEmail,
          expertId,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          // Request already exists
          return errorData.request;
        }
        throw new Error(errorData.error || 'Failed to send connection request');
      }

      const newRequest = await response.json();
      const connection: ConnectionRequest = {
        id: newRequest._id,
        _id: newRequest._id,
        userId: newRequest.userId,
        userName: newRequest.userName,
        userAvatar: newRequest.userAvatar,
        expertId: newRequest.expertId,
        status: newRequest.status,
        message: newRequest.message,
        createdAt: newRequest.createdAt,
      };

      set((state) => ({
        connections: [...state.connections, connection]
      }));

      return connection;
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  },

  getConnectionStatus: (expertId: string) => {
    const connection = get().connections.find(c => c.expertId === expertId);
    return connection?.status || 'none';
  },

  getConnectionByExpert: (expertId: string) => {
    return get().connections.find(c => c.expertId === expertId);
  },

  fetchMessages: async (connectionId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${connectionId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      const messages: ChatMessage[] = data.map((item: any) => ({
        id: item._id,
        _id: item._id,
        connectionId: item.connectionId,
        senderId: item.senderId,
        senderType: item.senderType,
        text: item.text || '',
        image: item.image,
        timestamp: item.timestamp,
        status: item.status,
      }));
      
      set((state) => ({
        messages: { ...state.messages, [connectionId]: messages }
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  sendMessage: async (connectionId, text, senderId, image) => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${connectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          senderType: 'user',
          text,
          image,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const savedMessage = await response.json();
      const newMessage: ChatMessage = {
        id: savedMessage._id,
        _id: savedMessage._id,
        connectionId: savedMessage.connectionId,
        senderId: savedMessage.senderId,
        senderType: savedMessage.senderType,
        text: savedMessage.text || '',
        image: savedMessage.image,
        timestamp: savedMessage.timestamp,
        status: savedMessage.status,
      };
      
      set((state) => {
        const existingMessages = state.messages[connectionId] || [];
        return {
          messages: { ...state.messages, [connectionId]: [...existingMessages, newMessage] }
        };
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
}));
