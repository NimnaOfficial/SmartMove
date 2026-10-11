import { ChatMessage, ChatConversation, ChatUser } from '@/types';
import authService from './authService';

const CHAT_STORAGE_KEY = 'smartmove_chat_messages';
const CONV_STORAGE_KEY = 'smartmove_chat_conversations';
const CHANNEL_NAME = 'smartmove_live_chat';

// Sound effect synthesizer via Web Audio API (zero external assets needed)
export const playChatNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio autoplay restrictions may ignore if no user interaction yet
  }
};

// Initial system users
export const SYSTEM_USERS: Record<string, ChatUser> = {
  ADMIN: {
    id: 'admin-dispatch',
    name: 'Central Fleet Dispatch',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    status: 'online',
    subtitle: 'Operations Control Center',
    phone: '+94 11 234 5678'
  },
  DRIVER_KAMAL: {
    id: 201,
    name: 'Kamal Perera',
    role: 'DRIVER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'online',
    subtitle: 'Bus WP-ND-4521 (Volvo 9900)',
    phone: '+94 77 123 4567'
  },
  DRIVER_SUNIL: {
    id: 202,
    name: 'Sunil Fernando',
    role: 'DRIVER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'online',
    subtitle: 'Bus CP-NB-7823 (Ashok Leyland)',
    phone: '+94 71 234 5678'
  },
  DRIVER_NIMAL: {
    id: 203,
    name: 'Nimal Silva',
    role: 'DRIVER',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    status: 'away',
    subtitle: 'Shuttle SP-NC-1190 (Toyota Coaster)',
    phone: '+94 76 345 6789'
  },
  PASSENGER_KASUN: {
    id: 'p-101',
    name: 'Kasun Jayawardena',
    role: 'PASSENGER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    status: 'online',
    subtitle: 'Trip Colombo - Kandy (Seat 12A)',
    phone: '+94 70 987 6543'
  },
  PASSENGER_ELENA: {
    id: 'p-102',
    name: 'Elena Rostova',
    role: 'PASSENGER',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    status: 'online',
    subtitle: 'Trip Colombo - Galle (Seat 05B)',
    phone: '+94 72 876 5432'
  }
};

const initialConversations: ChatConversation[] = [
  {
    id: 'conv-fleet-dispatch',
    title: 'Fleet Operations Dispatch (All Units)',
    type: 'broadcast',
    participants: [
      SYSTEM_USERS.ADMIN,
      SYSTEM_USERS.DRIVER_KAMAL,
      SYSTEM_USERS.DRIVER_SUNIL,
      SYSTEM_USERS.DRIVER_NIMAL
    ],
    lastMessage: {
      id: 'm-init-1',
      conversationId: 'conv-fleet-dispatch',
      senderId: 'admin-dispatch',
      senderName: 'Central Fleet Dispatch',
      senderRole: 'ADMIN',
      senderAvatar: SYSTEM_USERS.ADMIN.avatar,
      content: 'Attention all active units: Southern Expressway toll gate clearing smoothly. Maintain scheduled headway.',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      status: 'read',
      type: 'alert'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    pinned: true
  },
  {
    id: 'conv-driver-kamal',
    title: 'Kamal Perera (Bus WP-ND-4521)',
    type: 'direct',
    participants: [SYSTEM_USERS.ADMIN, SYSTEM_USERS.DRIVER_KAMAL],
    lastMessage: {
      id: 'm-init-2',
      conversationId: 'conv-driver-kamal',
      senderId: 201,
      senderName: 'Kamal Perera',
      senderRole: 'DRIVER',
      senderAvatar: SYSTEM_USERS.DRIVER_KAMAL.avatar,
      content: 'Morning Dispatch, all 42 passengers boarded at Colombo Fort. Commencing Trip #1001 right on time.',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      status: 'read',
      type: 'text'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    pinned: true
  },
  {
    id: 'conv-driver-sunil',
    title: 'Sunil Fernando (Bus CP-NB-7823)',
    type: 'direct',
    participants: [SYSTEM_USERS.ADMIN, SYSTEM_USERS.DRIVER_SUNIL],
    lastMessage: {
      id: 'm-init-3',
      conversationId: 'conv-driver-sunil',
      senderId: 202,
      senderName: 'Sunil Fernando',
      senderRole: 'DRIVER',
      senderAvatar: SYSTEM_USERS.DRIVER_SUNIL.avatar,
      content: 'Slight congestion noticed near Kegalle junction. Estimating 10 min variance.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      status: 'read',
      type: 'text'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'conv-support-kasun',
    title: 'Kasun Jayawardena (Passenger Help)',
    type: 'support',
    participants: [SYSTEM_USERS.ADMIN, SYSTEM_USERS.PASSENGER_KASUN],
    lastMessage: {
      id: 'm-init-4',
      conversationId: 'conv-support-kasun',
      senderId: 'p-101',
      senderName: 'Kasun Jayawardena',
      senderRole: 'PASSENGER',
      senderAvatar: SYSTEM_USERS.PASSENGER_KASUN.avatar,
      content: 'Hello, can I verify if luggage storage can accommodate a standard folding bicycle?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'read',
      type: 'text'
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'conv-support-elena',
    title: 'Elena Rostova (Booking Support)',
    type: 'support',
    participants: [SYSTEM_USERS.ADMIN, SYSTEM_USERS.PASSENGER_ELENA],
    lastMessage: {
      id: 'm-init-5',
      conversationId: 'conv-support-elena',
      senderId: 'admin-dispatch',
      senderName: 'Central Fleet Dispatch',
      senderRole: 'ADMIN',
      senderAvatar: SYSTEM_USERS.ADMIN.avatar,
      content: 'Your seat selection 05B has been confirmed. Have a safe journey to Galle!',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'read',
      type: 'text'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

const initialMessages: Record<string, ChatMessage[]> = {
  'conv-fleet-dispatch': [
    {
      id: 'fd-1',
      conversationId: 'conv-fleet-dispatch',
      senderId: 'admin-dispatch',
      senderName: 'Central Fleet Dispatch',
      senderRole: 'ADMIN',
      senderAvatar: SYSTEM_USERS.ADMIN.avatar,
      content: 'Good morning drivers. Weather advisory: mild drizzle reported on Kandy-Colombo route.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'read',
      type: 'alert'
    },
    {
      id: 'fd-2',
      conversationId: 'conv-fleet-dispatch',
      senderId: 201,
      senderName: 'Kamal Perera',
      senderRole: 'DRIVER',
      senderAvatar: SYSTEM_USERS.DRIVER_KAMAL.avatar,
      content: 'Understood Dispatch. Wiper check completed on Volvo 9900.',
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm-init-1',
      conversationId: 'conv-fleet-dispatch',
      senderId: 'admin-dispatch',
      senderName: 'Central Fleet Dispatch',
      senderRole: 'ADMIN',
      senderAvatar: SYSTEM_USERS.ADMIN.avatar,
      content: 'Attention all active units: Southern Expressway toll gate clearing smoothly. Maintain scheduled headway.',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      status: 'read',
      type: 'alert'
    }
  ],
  'conv-driver-kamal': [
    {
      id: 'dk-1',
      conversationId: 'conv-driver-kamal',
      senderId: 'admin-dispatch',
      senderName: 'Central Fleet Dispatch',
      senderRole: 'ADMIN',
      senderAvatar: SYSTEM_USERS.ADMIN.avatar,
      content: 'Kamal, please verify fuel card and tire pressures prior to gate exit.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm-init-2',
      conversationId: 'conv-driver-kamal',
      senderId: 201,
      senderName: 'Kamal Perera',
      senderRole: 'DRIVER',
      senderAvatar: SYSTEM_USERS.DRIVER_KAMAL.avatar,
      content: 'Morning Dispatch, all 42 passengers boarded at Colombo Fort. Commencing Trip #1001 right on time.',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'conv-driver-sunil': [
    {
      id: 'ds-1',
      conversationId: 'conv-driver-sunil',
      senderId: 202,
      senderName: 'Sunil Fernando',
      senderRole: 'DRIVER',
      senderAvatar: SYSTEM_USERS.DRIVER_SUNIL.avatar,
      content: 'Slight congestion noticed near Kegalle junction. Estimating 10 min variance.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'conv-support-kasun': [
    {
      id: 'sk-1',
      conversationId: 'conv-support-kasun',
      senderId: 'p-101',
      senderName: 'Kasun Jayawardena',
      senderRole: 'PASSENGER',
      senderAvatar: SYSTEM_USERS.PASSENGER_KASUN.avatar,
      content: 'Hello, can I verify if luggage storage can accommodate a standard folding bicycle?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'conv-support-elena': [
    {
      id: 'se-1',
      conversationId: 'conv-support-elena',
      senderId: 'p-102',
      senderName: 'Elena Rostova',
      senderRole: 'PASSENGER',
      senderAvatar: SYSTEM_USERS.PASSENGER_ELENA.avatar,
      content: 'Hi support team, I booked seat 05B for Galle express. Just checking confirmation.',
      timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm-init-5',
      conversationId: 'conv-support-elena',
      senderId: 'admin-dispatch',
      senderName: 'Central Fleet Dispatch',
      senderRole: 'ADMIN',
      senderAvatar: SYSTEM_USERS.ADMIN.avatar,
      content: 'Your seat selection 05B has been confirmed. Have a safe journey to Galle!',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'read',
      type: 'text'
    }
  ]
};

// Types for events
export type ChatEventType = 'NEW_MESSAGE' | 'TYPING' | 'READ_RECEIPT' | 'CONVERSATION_UPDATED';

export interface ChatEvent {
  type: ChatEventType;
  conversationId: string;
  payload: any;
}

type ChatListener = (event: ChatEvent) => void;

class RealtimeChatService {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<ChatListener> = new Set();

  constructor() {
    this.initStorage();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingEvent(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === CHAT_STORAGE_KEY || event.key === CONV_STORAGE_KEY) {
          this.notifyListeners({
            type: 'NEW_MESSAGE',
            conversationId: '',
            payload: null
          });
        }
      });
    }
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(CONV_STORAGE_KEY)) {
      localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(initialConversations));
    }
    if (!localStorage.getItem(CHAT_STORAGE_KEY)) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initialMessages));
    }
  }

  private handleIncomingEvent(event: ChatEvent) {
    if (event.type === 'NEW_MESSAGE') {
      playChatNotificationSound();
    }
    this.notifyListeners(event);
  }

  private notifyListeners(event: ChatEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        console.error('Listener callback error', e);
      }
    });
  }

  public subscribe(listener: ChatListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getActiveUser(): ChatUser {
    const stored = authService.getCurrentUser();
    if (stored) {
      const role = stored.role || 'ADMIN';
      return {
        id: stored.userId || (role === 'ADMIN' ? 'admin-dispatch' : 201),
        name: `${stored.firstName || ''} ${stored.lastName || ''}`.trim() || (role === 'ADMIN' ? 'Admin Dispatch' : role === 'DRIVER' ? 'Kamal Perera' : 'Smart Passenger'),
        role: role,
        avatar: role === 'ADMIN' 
          ? SYSTEM_USERS.ADMIN.avatar 
          : role === 'DRIVER' 
          ? SYSTEM_USERS.DRIVER_KAMAL.avatar 
          : SYSTEM_USERS.PASSENGER_KASUN.avatar,
        status: 'online',
        subtitle: role === 'ADMIN' ? 'Fleet Operations Dispatch' : role === 'DRIVER' ? 'Active Driver' : 'Passenger'
      };
    }
    // Default fallback to Admin Dispatch
    return SYSTEM_USERS.ADMIN;
  }

  public getConversations(): ChatConversation[] {
    try {
      const data = localStorage.getItem(CONV_STORAGE_KEY);
      return data ? JSON.parse(data) : initialConversations;
    } catch {
      return initialConversations;
    }
  }

  public getMessages(conversationId: string): ChatMessage[] {
    try {
      const data = localStorage.getItem(CHAT_STORAGE_KEY);
      const all: Record<string, ChatMessage[]> = data ? JSON.parse(data) : initialMessages;
      return all[conversationId] || [];
    } catch {
      return [];
    }
  }

  public async sendMessage(
    conversationId: string, 
    content: string, 
    type: 'text' | 'location' | 'alert' | 'system' = 'text',
    meta?: any
  ): Promise<ChatMessage> {
    const user = this.getActiveUser();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      senderAvatar: user.avatar,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type,
      meta
    };

    // Save message
    const allMessages = this.getAllMessagesRecord();
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = [];
    }
    allMessages[conversationId].push(newMsg);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allMessages));

    // Update conversation metadata
    const convs = this.getConversations();
    const targetConv = convs.find(c => c.id === conversationId);
    if (targetConv) {
      targetConv.lastMessage = newMsg;
      targetConv.updatedAt = newMsg.timestamp;
      // If someone else wrote, unreadCount increments for others
      localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(convs));
    }

    // Broadcast across windows / tabs
    const event: ChatEvent = {
      type: 'NEW_MESSAGE',
      conversationId,
      payload: newMsg
    };
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(event);
    }
    this.notifyListeners(event);

    // Trigger synthetic smart responder if message is to dispatch / driver
    this.handleSmartAutoReply(conversationId, content, user);

    return newMsg;
  }

  public sendTyping(conversationId: string, isTyping: boolean) {
    const user = this.getActiveUser();
    const event: ChatEvent = {
      type: 'TYPING',
      conversationId,
      payload: { user, isTyping }
    };
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(event);
    }
    this.notifyListeners(event);
  }

  public markAsRead(conversationId: string) {
    const convs = this.getConversations();
    const target = convs.find(c => c.id === conversationId);
    if (target && target.unreadCount > 0) {
      target.unreadCount = 0;
      localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(convs));
      const event: ChatEvent = {
        type: 'CONVERSATION_UPDATED',
        conversationId,
        payload: target
      };
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage(event);
      }
      this.notifyListeners(event);
    }
  }

  public clearMessages(conversationId: string) {
    const all = this.getAllMessagesRecord();
    all[conversationId] = [];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(all));
    this.notifyListeners({
      type: 'NEW_MESSAGE',
      conversationId,
      payload: null
    });
  }

  public exportChatTranscript(conversationId: string): string {
    const msgs = this.getMessages(conversationId);
    const conv = this.getConversations().find(c => c.id === conversationId);
    const title = conv?.title || 'SmartMove Chat Transcript';
    
    let transcript = `====================================================\n`;
    transcript += ` SMARTMOVE TRANSPORT SOLUTIONS — LIVE TRANSCRIPT\n`;
    transcript += ` Channel: ${title}\n`;
    transcript += ` Export Date: ${new Date().toLocaleString()}\n`;
    transcript += `====================================================\n\n`;

    msgs.forEach(m => {
      const time = new Date(m.timestamp).toLocaleTimeString();
      transcript += `[${time}] [${m.senderRole}] ${m.senderName}: ${m.content}\n`;
    });

    return transcript;
  }

  private getAllMessagesRecord(): Record<string, ChatMessage[]> {
    try {
      const data = localStorage.getItem(CHAT_STORAGE_KEY);
      return data ? JSON.parse(data) : { ...initialMessages };
    } catch {
      return { ...initialMessages };
    }
  }

  // Automated intelligent conversational simulation for transportation operations
  private handleSmartAutoReply(conversationId: string, userText: string, sender: ChatUser) {
    // Only auto-reply if the sender is not the system recipient
    setTimeout(() => {
      const conv = this.getConversations().find(c => c.id === conversationId);
      if (!conv) return;

      // Determine who should answer
      let responder: ChatUser = SYSTEM_USERS.ADMIN;
      if (sender.role === 'ADMIN') {
        // If Admin is talking, the driver or passenger responds
        if (conversationId === 'conv-driver-kamal') responder = SYSTEM_USERS.DRIVER_KAMAL;
        else if (conversationId === 'conv-driver-sunil') responder = SYSTEM_USERS.DRIVER_SUNIL;
        else if (conversationId === 'conv-support-kasun') responder = SYSTEM_USERS.PASSENGER_KASUN;
        else if (conversationId === 'conv-support-elena') responder = SYSTEM_USERS.PASSENGER_ELENA;
        else responder = SYSTEM_USERS.DRIVER_KAMAL;
      } else {
        // Driver or passenger texting: Central Admin Dispatch answers
        responder = SYSTEM_USERS.ADMIN;
      }

      // 1. Emit typing indicator
      const typingEvent: ChatEvent = {
        type: 'TYPING',
        conversationId,
        payload: { user: responder, isTyping: true }
      };
      if (this.broadcastChannel) this.broadcastChannel.postMessage(typingEvent);
      this.notifyListeners(typingEvent);

      // 2. Generate contextual response
      const lower = userText.toLowerCase();
      let replyContent = '';

      if (sender.role === 'ADMIN') {
        if (lower.includes('speed') || lower.includes('traffic') || lower.includes('location')) {
          replyContent = `Dispatch copy that. Current GPS shows 68 km/h on Expressway, traffic flow is green. All smooth here!`;
        } else if (lower.includes('fuel') || lower.includes('check') || lower.includes('inspection')) {
          replyContent = `Pre-trip check verified. Fuel level at 85%, tire pressures nominal.`;
        } else if (lower.includes('delay') || lower.includes('time') || lower.includes('eta')) {
          replyContent = `Tracking precisely on schedule. Next terminal arrival scheduled in 22 minutes.`;
        } else {
          replyContent = `Received loud and clear, Dispatch! Proceeding as instructed.`;
        }
      } else if (sender.role === 'DRIVER') {
        if (lower.includes('delay') || lower.includes('traffic') || lower.includes('rain')) {
          replyContent = `Noted. Dispatch has marked the route advisory. We have updated passenger terminal displays.`;
        } else if (lower.includes('emergency') || lower.includes('accident') || lower.includes('breakdown')) {
          replyContent = `EMERGENCY ALERT CONFIRMED. Backup fleet unit alerted, road assistance dispatch initiated immediately.`;
        } else if (lower.includes('fuel') || lower.includes('maintenance')) {
          replyContent = `Maintenance ticket generated in Central Ops. Proceed to Colombo Depot bay 4 post-shift.`;
        } else {
          replyContent = `Roger that, unit. Telemetry and route telemetry are live. Safe driving!`;
        }
      } else {
        // Passenger query
        if (lower.includes('where') || lower.includes('bus') || lower.includes('arrive') || lower.includes('time')) {
          replyContent = `Your scheduled coach is approaching terminal gate. Real-time GPS confirms ETA is 7 minutes.`;
        } else if (lower.includes('refund') || lower.includes('cancel') || lower.includes('ticket')) {
          replyContent = `Your booking ticket reference is confirmed. Customer support has verified eligibility for easy schedule adjustment.`;
        } else if (lower.includes('luggage') || lower.includes('bag') || lower.includes('bicycle')) {
          replyContent = `Standard baggage compartments accommodate up to 2 large bags and foldable gear free of charge.`;
        } else {
          replyContent = `SmartMove Central Support is here to help! Our operations team has logged your inquiry.`;
        }
      }

      setTimeout(() => {
        // Stop typing
        const stopTypingEvent: ChatEvent = {
          type: 'TYPING',
          conversationId,
          payload: { user: responder, isTyping: false }
        };
        if (this.broadcastChannel) this.broadcastChannel.postMessage(stopTypingEvent);
        this.notifyListeners(stopTypingEvent);

        // Deliver message
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          conversationId,
          senderId: responder.id,
          senderName: responder.name,
          senderRole: responder.role,
          senderAvatar: responder.avatar,
          content: replyContent,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          type: 'text'
        };

        const all = this.getAllMessagesRecord();
        if (!all[conversationId]) all[conversationId] = [];
        all[conversationId].push(replyMsg);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(all));

        const convs = this.getConversations();
        const convToUpdate = convs.find(c => c.id === conversationId);
        if (convToUpdate) {
          convToUpdate.lastMessage = replyMsg;
          convToUpdate.updatedAt = replyMsg.timestamp;
          localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(convs));
        }

        const newMsgEvent: ChatEvent = {
          type: 'NEW_MESSAGE',
          conversationId,
          payload: replyMsg
        };
        if (this.broadcastChannel) this.broadcastChannel.postMessage(newMsgEvent);
        this.notifyListeners(newMsgEvent);
        playChatNotificationSound();
      }, 1400);

    }, 600);
  }
}

export const chatService = new RealtimeChatService();
export default chatService;
