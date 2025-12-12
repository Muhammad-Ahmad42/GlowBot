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


// WebRTC Signaling Types
export interface CallRequestData {
  offer: any;
  callerId: string;
  connectionId: string;
}

export interface CallAcceptedData {
  answer: any;
  connectionId: string;
}

export interface IceCandidateData {
  candidate: any;
  connectionId: string;
}

export interface EndCallData {
  connectionId: string;
  userId: string;
}

type MessageCallback = (message: ChatMessage) => void;
type TypingCallback = (data: { userId: string }) => void;
type CallRequestCallback = (data: CallRequestData) => void;
type CallAcceptedCallback = (data: CallAcceptedData) => void;
type CallRejectedCallback = (data: { connectionId: string, userId: string }) => void;
type IceCandidateCallback = (data: IceCandidateData) => void;
type EndCallCallback = (data: EndCallData) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: MessageCallback[] = [];
  private typingListeners: TypingCallback[] = [];
  private stopTypingListeners: TypingCallback[] = [];
  
  // WebRTC Listeners
  private callRequestListeners: CallRequestCallback[] = [];
  private callAcceptedListeners: CallAcceptedCallback[] = [];
  private callRejectedListeners: CallRejectedCallback[] = [];
  private iceCandidateListeners: IceCandidateCallback[] = [];
  private endCallListeners: EndCallCallback[] = [];

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

    // --- WebRTC Events ---
    this.socket.on('call_request', (data: CallRequestData) => {
      this.callRequestListeners.forEach(callback => callback(data));
    });

    this.socket.on('call_accepted', (data: CallAcceptedData) => {
      this.callAcceptedListeners.forEach(callback => callback(data));
    });

    this.socket.on('call_rejected', (data: { connectionId: string, userId: string }) => {
      this.callRejectedListeners.forEach(callback => callback(data));
    });

    this.socket.on('ice_candidate', (data: IceCandidateData) => {
      this.iceCandidateListeners.forEach(callback => callback(data));
    });

    this.socket.on('end_call', (data: EndCallData) => {
      this.endCallListeners.forEach(callback => callback(data));
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

  joinUserChannel(userId: string): void {
    if (!this.socket) this.connect();
    this.socket?.emit('join_user_channel', { userId });
  }

  onExpertsUpdated(callback: () => void): () => void {
    const handler = () => callback();
    this.socket?.on('experts_updated', handler);
    return () => {
      this.socket?.off('experts_updated', handler);
    };
  }

  onRequestStatusUpdated(callback: (data: any) => void): () => void {
    const handler = (data: any) => callback(data);
    this.socket?.on('request_status_updated', handler);
    return () => {
      this.socket?.off('request_status_updated', handler);
    };
  }

  // --- WebRTC Signaling Methods ---

  sendCallRequest(connectionId: string, offer: any, callerId: string): void {
    this.socket?.emit('call_request', { connectionId, offer, callerId });
  }

  sendCallAccepted(connectionId: string, answer: any, userId: string): void {
    this.socket?.emit('call_accepted', { connectionId, answer, userId });
  }

  sendCallRejected(connectionId: string, userId: string): void {
    this.socket?.emit('call_rejected', { connectionId, userId });
  }

  sendIceCandidate(connectionId: string, candidate: any, userId: string): void {
    this.socket?.emit('ice_candidate', { connectionId, candidate, userId });
  }

  sendEndCall(connectionId: string, userId: string): void {
    this.socket?.emit('end_call', { connectionId, userId });
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

  // --- WebRTC Listener Registrations ---

  onCallRequest(callback: CallRequestCallback): () => void {
    this.callRequestListeners.push(callback);
    return () => {
      this.callRequestListeners = this.callRequestListeners.filter(cb => cb !== callback);
    };
  }

  onCallAccepted(callback: CallAcceptedCallback): () => void {
    this.callAcceptedListeners.push(callback);
    return () => {
      this.callAcceptedListeners = this.callAcceptedListeners.filter(cb => cb !== callback);
    };
  }

  onCallRejected(callback: CallRejectedCallback): () => void {
    this.callRejectedListeners.push(callback);
    return () => {
      this.callRejectedListeners = this.callRejectedListeners.filter(cb => cb !== callback);
    };
  }

  onIceCandidate(callback: IceCandidateCallback): () => void {
    this.iceCandidateListeners.push(callback);
    return () => {
      this.iceCandidateListeners = this.iceCandidateListeners.filter(cb => cb !== callback);
    };
  }

  onEndCall(callback: EndCallCallback): () => void {
    this.endCallListeners.push(callback);
    return () => {
      this.endCallListeners = this.endCallListeners.filter(cb => cb !== callback);
    };
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Singleton instance
export const socketService = new SocketService();
