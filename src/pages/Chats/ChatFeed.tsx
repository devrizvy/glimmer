import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { usePrivateMessages } from '../../hooks/usePrivateMessages';

interface Message {
  id: string;
  chatId: string;
  senderEmail: string;
  senderUsername: string;
  receiverEmail: string;
  receiverUsername: string;
  message: string;
  time: string;
  isOwn?: boolean;
  createdAt?: Date;
}

const ChatFeed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // get partner email from URL
  const { user, isAuthenticated } = useAuth();

  // Try to get partner info from location.state, else use the URL parameter
  let partnerUsername, partnerEmail;
  if (location.state?.partnerUsername && location.state?.partnerEmail) {
    partnerUsername = location.state.partnerUsername;
    partnerEmail = location.state.partnerEmail;
  } else {
    // For now, we'll use the ID as both email and username
    // In a real implementation, you'd fetch user data from your API
    partnerEmail = id || '';
    partnerUsername = id?.split('@')[0] || 'Unknown User';
  }

  const currentUserEmail = user?.email || '';
  const currentUsername = user?.username || '';

  const [currentMessage, setCurrentMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate chat ID (consistent ordering)
  const chatId = [currentUserEmail, partnerEmail].sort().join("_");

  // Use TanStack Query for initial messages
  const { isPending, messages: initialMessages, isError, error } = usePrivateMessages(chatId);

  // Combine initial messages with real-time socket messages
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const transformedMessages: Message[] = initialMessages.map((msg: any) => ({
        id: msg._id,
        chatId: msg.chatId,
        senderEmail: msg.senderEmail,
        senderUsername: msg.senderUsername,
        receiverEmail: msg.receiverEmail,
        receiverUsername: msg.receiverUsername,
        message: msg.message,
        time: msg.time,
        isOwn: msg.senderEmail === currentUserEmail,
        createdAt: new Date(msg.createdAt),
      }));
      setMessages(transformedMessages);
    }
  }, [initialMessages, currentUserEmail]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket connection setup for real-time messaging
  useEffect(() => {
    if (!chatId || !currentUserEmail || !isAuthenticated) return;

    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Join the private chat
      newSocket.emit("join_private_chat", chatId, currentUserEmail);
      newSocket.emit("user_online", currentUserEmail);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for incoming messages
    const handleReceiveMessage = (data: any) => {
      setMessages((prevMessages) => {
        // Check if message already exists to avoid duplicates
        const messageExists = prevMessages.some(
          (msg) => msg.message === data.message &&
            msg.senderEmail === data.senderEmail &&
            msg.time === data.time
        );

        if (messageExists) {
          return prevMessages;
        }

        const newMessage: Message = {
          id: Date.now().toString(),
          chatId: data.chatId,
          senderEmail: data.senderEmail,
          senderUsername: data.senderUsername,
          receiverEmail: data.receiverEmail,
          receiverUsername: data.receiverUsername,
          message: data.message,
          time: data.time,
          isOwn: data.senderEmail === currentUserEmail,
          createdAt: new Date()
        };

        return [...prevMessages, newMessage];
      });
    };

    // Listen for typing indicators
    const handleUserTyping = (data: any) => {
      if (data.userEmail !== currentUserEmail) {
        setIsTyping(data.isTyping);
      }
    };

    newSocket.on("receive_private_message", handleReceiveMessage);
    newSocket.on("user_typing", handleUserTyping);

    // Cleanup function
    return () => {
      newSocket.off("receive_private_message", handleReceiveMessage);
      newSocket.off("user_typing", handleUserTyping);
      if (chatId) {
        newSocket.emit("leave_private_chat", chatId, currentUserEmail);
      }
      newSocket.disconnect();
    };
  }, [chatId, currentUserEmail, isAuthenticated]);

  // Handle typing indicators
  const handleTyping = () => {
    if (socket && chatId) {
      socket.emit("typing_start", {
        chatId,
        userEmail: currentUserEmail,
        username: currentUsername
      });

      // Clear existing timeout
      if (typingTimeout) {
        window.clearTimeout(typingTimeout);
      }

      // Set new timeout to stop typing indicator
      const timeout = window.setTimeout(() => {
        socket.emit("typing_stop", {
          chatId,
          userEmail: currentUserEmail,
          username: currentUsername
        });
      }, 1000);

      setTypingTimeout(timeout);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() !== "" && socket && chatId) {
      const messageData = {
        chatId,
        senderEmail: currentUserEmail,
        senderUsername: currentUsername,
        receiverEmail: partnerEmail,
        receiverUsername: partnerUsername,
        message: currentMessage,
        time: new Date(Date.now()).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
      };

      // Send message via socket - the server will echo it back
      socket.emit("send_private_message", messageData);

      // Clear input immediately
      setCurrentMessage("");

      // Stop typing indicator
      socket.emit("typing_stop", {
        chatId,
        userEmail: currentUserEmail,
        username: currentUsername
      });

      // Clear typing timeout
      if (typingTimeout) {
        window.clearTimeout(typingTimeout);
      }
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isError) {
    return (
      <div className="min-h-screen zen-pattern">
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-20 h-20 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="zen-title text-xl mb-4">Error Loading Messages</h2>
            <p className="text-sm text-sidebar-foreground/70 mb-6">{error?.message || 'Failed to load messages'}</p>
            <button
              onClick={() => window.location.reload()}
              className="zen-action-btn px-6 py-3 text-white rounded-xl transition-all"
              style={{
                background: 'oklch(0.55 0.08 145)',
                boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!partnerEmail || !partnerUsername) {
    return (
      <div className="min-h-screen zen-pattern">
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center text-sidebar-foreground max-w-md p-8">
            <div className="w-20 h-20 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center zen-float">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="zen-title text-xl mb-4">No chat selected</h2>
            <p className="text-sm text-sidebar-foreground/70 mb-6">Select a user to start messaging</p>
            <button
              onClick={() => navigate('/chat')}
              className="zen-action-btn px-6 py-3 text-white rounded-xl transition-all"
              style={{
                background: 'oklch(0.55 0.08 145)',
                boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
              }}
            >
              Go to Messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen zen-pattern">
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="p-4 glass-panel border-b border-sidebar-border/50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="p-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="relative">
                  <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border-2 border-sidebar-border">
                    <span className="text-sm font-semibold" style={{ color: 'oklch(0.55 0.08 145)' }}>
                      {partnerUsername.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-sidebar animate-pulse"></div>
                </div>

                <div>
                  <h3 className="font-semibold text-sidebar-foreground">{partnerUsername}</h3>
                  <p className="text-xs text-sidebar-foreground/60">
                    {isTyping ? "typing..." : isConnected ? "Active now" : "Connecting..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <button className="p-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                       style={{ borderTopColor: 'oklch(0.55 0.08 145)' }}></div>
                </div>
                <h3 className="zen-title text-lg mb-2">Loading conversation...</h3>
                <p className="text-sm text-sidebar-foreground/70">Please wait while we load your messages</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center zen-float">
                  <span className="text-3xl">👋</span>
                </div>
                <h3 className="zen-title text-xl mb-4">
                  Start a conversation
                </h3>
                <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
                  Send your first message to {partnerUsername}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-6xl mx-auto">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.senderEmail}-${msg.time}-${msg.id}`}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl ${
                    msg.isOwn
                      ? "text-white rounded-br-none"
                      : "glass-panel rounded-bl-none border border-sidebar-border/50"
                  }`}
                  style={msg.isOwn ? {
                    background: 'oklch(0.55 0.08 145)',
                    boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
                  } : {}}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-2 ${
                      msg.isOwn ? 'text-white/70' : 'text-sidebar-foreground/50'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-panel rounded-2xl rounded-bl-none px-5 py-3 max-w-xs border border-sidebar-border/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-bounce"
                           style={{ backgroundColor: 'oklch(0.55 0.08 145)' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce"
                           style={{ backgroundColor: 'oklch(0.55 0.08 145)', animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce"
                           style={{ backgroundColor: 'oklch(0.55 0.08 145)', animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 glass-panel border-t border-sidebar-border/50 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs text-sidebar-foreground/60 font-medium">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>

          <form onSubmit={handleOnSubmit} className="flex gap-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => {
                setCurrentMessage(e.target.value);
                handleTyping();
              }}
              placeholder={`Message ${partnerUsername}...`}
              className="zen-search flex-1 px-4 py-3 text-sidebar-foreground placeholder-sidebar-foreground/40"
            />
            <button
              type="submit"
              disabled={currentMessage.trim() === "" || !isConnected}
              className="zen-action-btn px-6 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              style={{
                background: currentMessage.trim() && isConnected ? 'oklch(0.55 0.08 145)' : 'oklch(0.55 0.08 145 / 0.3)',
                boxShadow: currentMessage.trim() && isConnected ? '0 4px 20px oklch(0.55 0.08 145 / 0.3)' : 'none'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatFeed;