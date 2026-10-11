import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, Users, Shield, Send, Search, Download, Trash2, 
  AlertTriangle, Phone, CheckCheck, Clock, CheckCircle2,
  Car, MapPin, User, Info, Volume2, VolumeX, RefreshCw
} from 'lucide-react';
import chatService, { ChatEvent, playChatNotificationSound } from '@/services/chatService';
import { ChatConversation, ChatMessage, ChatUser } from '@/types';

export default function AdminMessages() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-fleet-dispatch');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'broadcast' | 'driver' | 'support'>('all');
  const [typingUser, setTypingUser] = useState<ChatUser | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sendType, setSendType] = useState<'text' | 'alert'>('text');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = chatService.getActiveUser();

  // Load conversations
  useEffect(() => {
    const loaded = chatService.getConversations();
    setConversations(loaded);
    if (!loaded.some(c => c.id === activeConvId) && loaded.length > 0) {
      setActiveConvId(loaded[0].id);
    }
  }, []);

  // Real-time listener
  useEffect(() => {
    const unsubscribe = chatService.subscribe((event: ChatEvent) => {
      if (event.type === 'NEW_MESSAGE') {
        setConversations(chatService.getConversations());
        if (event.conversationId === activeConvId) {
          setMessages(chatService.getMessages(activeConvId));
          chatService.markAsRead(activeConvId);
        }
      } else if (event.type === 'TYPING') {
        if (event.conversationId === activeConvId) {
          setTypingUser(event.payload.isTyping ? event.payload.user : null);
        }
      } else if (event.type === 'CONVERSATION_UPDATED') {
        setConversations(chatService.getConversations());
      }
    });

    return () => unsubscribe();
  }, [activeConvId]);

  // Load messages on active conversation change
  useEffect(() => {
    if (activeConvId) {
      setMessages(chatService.getMessages(activeConvId));
      chatService.markAsRead(activeConvId);
      setTypingUser(null);
    }
  }, [activeConvId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !activeConvId) return;

    const text = inputVal.trim();
    setInputVal('');

    if (isTyping) {
      setIsTyping(false);
      chatService.sendTyping(activeConvId, false);
    }

    await chatService.sendMessage(activeConvId, text, sendType);
    if (soundEnabled) {
      playChatNotificationSound();
    }
    setSendType('text');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (!isTyping && activeConvId) {
      setIsTyping(true);
      chatService.sendTyping(activeConvId, true);
      setTimeout(() => {
        setIsTyping(false);
        chatService.sendTyping(activeConvId, false);
      }, 3000);
    }
  };

  const handleExport = () => {
    if (!activeConvId) return;
    const transcript = chatService.exportChatTranscript(activeConvId);
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartMove-Transcript-${activeConvId}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!activeConvId) return;
    if (window.confirm('Are you sure you want to clear message history in this channel?')) {
      chatService.clearMessages(activeConvId);
      setMessages([]);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'broadcast') return c.type === 'broadcast';
    if (filterType === 'driver') return c.type === 'direct';
    if (filterType === 'support') return c.type === 'support';
    return true;
  });

  const participant = activeConv?.participants.find(p => p.role !== 'ADMIN') || activeConv?.participants[0];

  const adminQuickReplies = [
    'Attention all units: Southern Expressway toll gate is clear.',
    'Weather update: Expect heavy showers on Kandy route, drive with caution.',
    'Please submit end-of-shift vehicle inspection log upon arrival.',
    'Speed limit adherence checked: Great job keeping passenger safety #1.'
  ];

  return (
    <div className="h-full flex flex-col gap-6 max-w-[1600px] mx-auto pb-4">
      
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Live Operations Gateway</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Real-Time Dispatch & Messaging
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Instant bi-directional communication between Fleet Dispatch, Drivers, and Passengers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all ${
              soundEnabled
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chime Active' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setConversations(chatService.getConversations())}
            className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Channels</span>
          </button>
        </div>
      </div>

      {/* Main Container - 3 Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px] max-h-[calc(100vh-220px)]">
        
        {/* =========================================
            LEFT COLUMN: CHANNELS & THREADS (4 cols)
            ========================================= */}
        <div className="lg:col-span-4 bg-[#141522]/90 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drivers, channels, riders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {(['all', 'broadcast', 'driver', 'support'] as const).map((ft) => (
                <button
                  key={ft}
                  onClick={() => setFilterType(ft)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    filterType === ft
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {ft === 'all' ? 'All Channels' : ft === 'broadcast' ? 'Broadcast' : ft === 'driver' ? 'Drivers' : 'Support'}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {filteredConversations.map((c) => {
              const isActive = c.id === activeConvId;
              const lastMsgTime = c.lastMessage 
                ? new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 relative ${
                    isActive
                      ? 'bg-purple-600/20 border border-purple-500/30 shadow-lg'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Channel icon / avatar */}
                  <div className="relative flex-shrink-0">
                    {c.type === 'broadcast' ? (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                        <Radio className="w-5 h-5" />
                      </div>
                    ) : c.type === 'support' ? (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                        <Shield className="w-5 h-5" />
                      </div>
                    ) : (
                      <img 
                        src={c.participants.find(p => p.role === 'DRIVER')?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'} 
                        alt={c.title}
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-white/10" 
                      />
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#141522]" />
                  </div>

                  {/* Title & Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-200'}`}>
                        {c.title}
                      </h4>
                      <span className="text-[11px] text-gray-500 whitespace-nowrap">{lastMsgTime}</span>
                    </div>

                    <p className="text-xs text-gray-400 truncate leading-relaxed">
                      {c.lastMessage ? c.lastMessage.content : 'No messages yet'}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        c.type === 'broadcast'
                          ? 'bg-purple-500/20 text-purple-300'
                          : c.type === 'direct'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {c.type}
                      </span>
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================
            CENTER COLUMN: LIVE CHAT THREAD (5 or 8 cols)
            ========================================= */}
        <div className="lg:col-span-5 xl:col-span-5 bg-[#141522]/90 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          
          {/* Thread Header */}
          <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                {activeConv?.type === 'broadcast' ? <Radio className="w-5 h-5 animate-pulse" /> : <Users className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-base truncate">
                  {activeConv?.title || 'Dispatch Thread'}
                </h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time connected • Multi-tab sync ready</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Export Transcript"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Clear Messages"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <Radio className="w-12 h-12 mb-3 text-purple-400 opacity-40 animate-pulse" />
                <p className="font-semibold text-gray-300">Channel Ready</p>
                <p className="text-xs text-gray-500 mt-1">Send a message to text real-time.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.senderId === currentUser.id || m.senderRole === 'ADMIN';
                const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img 
                      src={m.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                      alt={m.senderName}
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10" 
                    />

                    <div className={`max-w-[75%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-xs font-semibold text-gray-300">{m.senderName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          m.senderRole === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : m.senderRole === 'DRIVER'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {m.senderRole}
                        </span>
                      </div>

                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                        m.type === 'alert'
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                          : isMine
                          ? 'bg-purple-600 text-white rounded-tr-sm shadow-purple-600/20'
                          : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                      }`}>
                        {m.type === 'alert' && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>PRIORITY FLEET BROADCAST</span>
                          </div>
                        )}
                        <p>{m.content}</p>
                      </div>

                      <div className="flex items-center gap-1 mt-1 px-1 text-[11px] text-gray-400">
                        <span>{time}</span>
                        {isMine && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

            {/* Typing Indicator */}
            <AnimatePresence>
              {typingUser && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex items-center gap-2 text-xs text-purple-400 italic px-2"
                >
                  <div className="flex gap-2 items-center bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>{typingUser.name} is typing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Dispatch Presets */}
          <div className="p-2.5 px-4 border-t border-white/5 bg-white/[0.01] overflow-x-auto custom-scrollbar flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">Broadcast Presets:</span>
            {adminQuickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => setInputVal(qr)}
                className="text-xs px-3 py-1 rounded-full whitespace-nowrap bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/15 transition-all flex-shrink-0"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex items-center gap-3 bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setSendType(sendType === 'text' ? 'alert' : 'text')}
              className={`p-2.5 rounded-xl transition-all ${
                sendType === 'alert'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                  : 'text-gray-400 hover:text-amber-400 hover:bg-white/10'
              }`}
              title={sendType === 'alert' ? 'High Priority Alert' : 'Click to send as Alert'}
            >
              <AlertTriangle className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={sendType === 'alert' ? 'Send high-priority alert announcement...' : 'Type real-time message to dispatch...'}
              value={inputVal}
              onChange={handleInputChange}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 transition-all"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* =========================================
            RIGHT COLUMN: PARTICIPANT / TELEMETRY CARD (3 cols)
            ========================================= */}
        <div className="lg:col-span-3 xl:col-span-3 bg-[#141522]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto custom-scrollbar">
          
          <div>
            <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              <span>Unit Intelligence</span>
            </h3>

            {participant ? (
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="relative mb-3">
                  <img 
                    src={participant.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'} 
                    alt={participant.name} 
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/50"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#141522]" />
                </div>
                <h4 className="font-bold text-white text-base">{participant.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{participant.subtitle || 'Active Fleet Member'}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {participant.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {participant.role}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Quick Telemetry Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operational Specs</h4>
            
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <Car className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Assigned Coach</p>
                <p className="text-sm font-bold text-white">Volvo 9900 (WP-ND-4521)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Active Corridor</p>
                <p className="text-sm font-bold text-white">Colombo ➔ Kandy (Expressway)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Dispatch Hotline</p>
                <p className="text-sm font-bold text-white">{participant?.phone || '+94 77 123 4567'}</p>
              </div>
            </div>
          </div>

          {/* Live Dispatch Actions */}
          <div className="space-y-2 mt-auto">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Direct Actions</h4>
            <button
              onClick={() => {
                setInputVal('EMERGENCY DISPATCH: Unit please acknowledge immediate status verification.');
                setSendType('alert');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Ping Emergency Check</span>
            </button>
            <button
              onClick={() => {
                setInputVal('Route check: All green. Please proceed to terminal.');
                setSendType('text');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Send All-Clear Signal</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
