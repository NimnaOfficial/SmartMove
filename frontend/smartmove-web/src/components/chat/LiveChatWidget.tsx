import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, X, Minimize2, Maximize2, 
  Volume2, VolumeX, Download, Radio, Users, 
  Search, Shield, AlertTriangle, CheckCheck
} from 'lucide-react';
import chatService, { ChatEvent, playChatNotificationSound } from '@/services/chatService';
import { ChatConversation, ChatMessage, ChatUser } from '@/types';

interface LiveChatWidgetProps {
  theme?: 'dark' | 'light';
  defaultConversationId?: string;
}

export default function LiveChatWidget({ 
  theme = 'dark',
  defaultConversationId = 'conv-fleet-dispatch' 
}: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>(defaultConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<ChatUser | null>(null);
  const [sendType, setSendType] = useState<'text' | 'alert'>('text');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = chatService.getActiveUser();

  // Load conversations on mount
  useEffect(() => {
    const loadedConvs = chatService.getConversations();
    setConversations(loadedConvs);
    if (!loadedConvs.some(c => c.id === activeConvId) && loadedConvs.length > 0) {
      setActiveConvId(loadedConvs[0].id);
    }
  }, []);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribe = chatService.subscribe((event: ChatEvent) => {
      if (event.type === 'NEW_MESSAGE') {
        const updatedConvs = chatService.getConversations();
        setConversations(updatedConvs);
        
        if (event.conversationId === activeConvId) {
          const freshMsgs = chatService.getMessages(activeConvId);
          setMessages(freshMsgs);
          chatService.markAsRead(activeConvId);
        }
      } else if (event.type === 'TYPING') {
        if (event.conversationId === activeConvId) {
          if (event.payload.isTyping) {
            setTypingUser(event.payload.user);
          } else {
            setTypingUser(null);
          }
        }
      } else if (event.type === 'CONVERSATION_UPDATED') {
        setConversations(chatService.getConversations());
      }
    });

    return () => unsubscribe();
  }, [activeConvId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      const msgs = chatService.getMessages(activeConvId);
      setMessages(msgs);
      chatService.markAsRead(activeConvId);
      setTypingUser(null);
    }
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, typingUser]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !activeConvId) return;

    const text = inputVal.trim();
    setInputVal('');
    
    // Stop typing indicator
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

  const quickReplies = currentUser.role === 'ADMIN' ? [
    'Route cleared, proceed with schedule',
    'Caution: Heavy rain advisory in effect',
    'Please report fuel status & passengers count',
    'Standby for next dispatch instruction'
  ] : currentUser.role === 'DRIVER' ? [
    'On schedule, heading to next stop',
    'Minor traffic delay: approx 10 mins',
    'Arrived safely at terminal platform',
    'All passengers boarded, departing now'
  ] : [
    'Where is the bus right now?',
    'What is the arrival time at my stop?',
    'Is luggage space available on this coach?',
    'Thank you for the quick support!'
  ];

  const handleExport = () => {
    if (!activeConvId) return;
    const transcript = chatService.exportChatTranscript(activeConvId);
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartMove-Chat-${activeConvId}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* =========================================================
          OPENED CHAT WINDOW (Ethereal Floating Glass Panel)
          ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto mb-4 flex flex-col overflow-hidden rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border transition-all duration-300 ${
              isDark 
                ? 'bg-[#12131c]/95 border-white/10 text-gray-200 backdrop-blur-2xl' 
                : 'bg-white/95 border-gray-200 text-gray-800 backdrop-blur-2xl'
            } ${
              isExpanded 
                ? 'w-[92vw] sm:w-[840px] h-[82vh] max-h-[780px]' 
                : 'w-[92vw] sm:w-[460px] h-[640px]'
            }`}
          >
            {/* Top Bar Header */}
            <div className={`p-4 px-5 flex items-center justify-between border-b ${
              isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50/80'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 flex-shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#12131c]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base truncate leading-snug">
                      {activeConv?.title || 'Live Dispatch'}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Real-time channel • {activeConv?.participants.length || 2} active</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={soundEnabled ? 'Mute notification sound' : 'Unmute sound'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                </button>
                <button
                  onClick={handleExport}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Export Chat Transcript"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-2 rounded-xl transition-colors hidden sm:block ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={isExpanded ? 'Collapse view' : 'Expand view'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channels & Conversations Tab Pill Carousel */}
            <div className={`p-2 border-b overflow-x-auto custom-scrollbar flex items-center gap-1.5 ${
              isDark ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50/50'
            }`}>
              {filteredConversations.map((c) => {
                const isActive = c.id === activeConvId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                      isActive
                        ? isDark
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c.type === 'broadcast' && <Radio className="w-3 h-3" />}
                    {c.type === 'direct' && <Users className="w-3 h-3" />}
                    {c.type === 'support' && <Shield className="w-3 h-3" />}
                    <span className="max-w-[130px] truncate">{c.title.split('(')[0]}</span>
                    {c.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Chat Body: Messages Scrollable List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-40 animate-bounce" />
                  <p className="text-sm font-semibold">No messages in this channel yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Start texting real-time below.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === currentUser.id || m.senderRole === currentUser.role;
                  const timeFormatted = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <img 
                        src={m.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                        alt={m.senderName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10" 
                      />

                      {/* Bubble */}
                      <div className={`max-w-[78%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        {/* Sender info */}
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-xs font-semibold text-gray-400">
                            {m.senderName}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                            m.senderRole === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : m.senderRole === 'DRIVER'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {m.senderRole}
                          </span>
                        </div>

                        {/* Content Box */}
                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-md break-words ${
                          m.type === 'alert'
                            ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                            : isMine
                            ? isDark
                              ? 'bg-purple-600 text-white rounded-tr-sm shadow-purple-600/20'
                              : 'bg-blue-600 text-white rounded-tr-sm shadow-blue-600/20'
                            : isDark
                            ? 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                            : 'bg-gray-100 text-gray-800 rounded-tl-sm border border-gray-200'
                        }`}>
                          {m.type === 'alert' && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>OPERATIONS NOTICE</span>
                            </div>
                          )}
                          <p>{m.content}</p>
                        </div>

                        {/* Timestamp & read receipts */}
                        <div className="flex items-center gap-1 mt-1 px-1 text-[11px] text-gray-400">
                          <span>{timeFormatted}</span>
                          {isMine && (
                            <CheckCheck className={`w-3.5 h-3.5 ${m.status === 'read' ? 'text-blue-400' : 'text-gray-400'}`} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Typing indicator */}
              <AnimatePresence>
                {typingUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex items-center gap-2 text-xs text-purple-400 italic px-2"
                  >
                    <div className="flex gap-1 items-center bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                      <span>{typingUser.name} is typing...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Response Pills */}
            <div className={`p-2 px-3 border-t overflow-x-auto custom-scrollbar flex items-center gap-1.5 ${
              isDark ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'
            }`}>
              <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap flex-shrink-0">
                Quick:
              </span>
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputVal(qr)}
                  className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-all border flex-shrink-0 ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Bottom Message Input Bar */}
            <form onSubmit={handleSendMessage} className={`p-3 px-4 border-t flex items-center gap-2 ${
              isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}>
              {/* Alert Mode Toggle */}
              <button
                type="button"
                onClick={() => setSendType(sendType === 'text' ? 'alert' : 'text')}
                className={`p-2 rounded-xl transition-all ${
                  sendType === 'alert'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : isDark 
                    ? 'text-gray-400 hover:text-amber-400 hover:bg-white/10'
                    : 'text-gray-500 hover:text-amber-600 hover:bg-gray-100'
                }`}
                title={sendType === 'alert' ? 'High Priority Alert active' : 'Click to send as Alert'}
              >
                <AlertTriangle className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={sendType === 'alert' ? 'Type priority alert broadcast...' : 'Type real-time message...'}
                value={inputVal}
                onChange={handleInputChange}
                className={`flex-1 bg-transparent px-3 py-2 text-sm outline-none rounded-xl border ${
                  sendType === 'alert'
                    ? 'border-amber-500/50 text-amber-200 placeholder:text-amber-400/50'
                    : isDark
                    ? 'border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50'
                    : 'border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500'
                }`}
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  sendType === 'alert'
                    ? 'bg-amber-500 text-black hover:scale-105 shadow-md shadow-amber-500/30'
                    : isDark
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 shadow-lg shadow-purple-600/30'
                    : 'bg-blue-600 text-white hover:scale-105 shadow-lg shadow-blue-600/30'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          FLOATING LAUNCHER BUTTON / BADGE
          ========================================================= */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto h-14 px-5 rounded-full flex items-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.5)] border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 border-white/20 text-white shadow-purple-600/30'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-white/40 text-white shadow-blue-600/30'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg border-2 border-white">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-extrabold tracking-wide uppercase leading-tight">Live Dispatch</p>
          <p className="text-[10px] text-white/80 font-medium">Text Real Time</p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </motion.button>

    </div>
  );
}
