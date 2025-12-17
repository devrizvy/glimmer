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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Messages</h2>
          <p className="text-red-400/60 mb-4">{error?.message || 'Failed to load messages'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!partnerEmail || !partnerUsername) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center text-sidebar-foreground max-w-md p-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-sidebar-accent/50 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h1 className="text-xl font-bold mb-2">No chat selected</h1>
          <p className="text-sm text-sidebar-foreground/60 mb-4">Select a user to start messaging</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900/50 backdrop-blur-xl border-b border-sidebar-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/chat')}
                className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-all md:hidden"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-sidebar-border">
                  <span className="text-sm font-semibold text-primary">
                    {partnerUsername.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
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
              <button className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-all">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-all">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-primary/60">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-sidebar-accent/50 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
                <h3 className="text-lg font-semibold text-sidebar-foreground mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm text-sidebar-foreground/60">
                  Send your first message to {partnerUsername}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-8xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={`${msg.senderEmail}-${msg.time}-${msg.id}`}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.isOwn
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-br-none"
                        : "bg-sidebar-accent text-sidebar-foreground rounded-bl-none border border-sidebar-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isOwn ? 'text-primary-foreground/70' : 'text-sidebar-foreground/50'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-sidebar-accent text-sidebar-foreground rounded-2xl rounded-bl-none px-4 py-3 max-w-xs border border-sidebar-border/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-sidebar-foreground/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-sidebar-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-sidebar-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-slate-900/50 backdrop-blur-xl border-t border-sidebar-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs text-sidebar-foreground/60">
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
              className="flex-1 px-4 py-3 bg-sidebar-accent/50 border border-sidebar-border rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all"
            />
            <button
              type="submit"
              disabled={currentMessage.trim() === "" || !isConnected}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatFeed;