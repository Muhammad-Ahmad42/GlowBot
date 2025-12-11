import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../res/api';

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

type MessageCallback = (message: ChatMessage) => void;
type TypingCallback = (data: { userId: string }) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: MessageCallback[] = [];
  private typingListeners: TypingCallback[] = [];
  private stopTypingListeners: TypingCallback[] = [];

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('new_message', (message: ChatMessage) => {
      this.messageListeners.forEach(callback => callback(message));
    });

    this.socket.on('user_typing', (data: { userId: string }) => {
      this.typingListeners.forEach(callback => callback(data));
    });

    this.socket.on('user_stopped_typing', (data: { userId: string }) => {
      this.stopTypingListeners.forEach(callback => callback(data));
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(connectionId: string, userId: string): void {
    if (!this.socket) this.connect();
    this.socket?.emit('join_room', { connectionId, userId });
  }

  leaveRoom(connectionId: string): void {
    this.socket?.emit('leave_room', { connectionId });
  }

  sendMessage(connectionId: string, senderId: string, senderType: 'user' | 'dermatologist', text: string, image?: string): void {
    this.socket?.emit('send_message', { connectionId, senderId, senderType, text, image });
  }

  sendTyping(connectionId: string, userId: string): void {
    this.socket?.emit('typing', { connectionId, userId });
  }

  sendStopTyping(connectionId: string, userId: string): void {
    this.socket?.emit('stop_typing', { connectionId, userId });
  }

  markMessagesSeen(connectionId: string, messageIds: string[], viewerId: string): void {
    this.socket?.emit('message_seen', { connectionId, messageIds, viewerId });
  }

  onMessage(callback: MessageCallback): () => void {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
    };
  }

  onTyping(callback: TypingCallback): () => void {
    this.typingListeners.push(callback);
    return () => {
      this.typingListeners = this.typingListeners.filter(cb => cb !== callback);
    };
  }

  onStopTyping(callback: TypingCallback): () => void {
    this.stopTypingListeners.push(callback);
    return () => {
      this.stopTypingListeners = this.stopTypingListeners.filter(cb => cb !== callback);
    };
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Singleton instance
export const socketService = new SocketService();
