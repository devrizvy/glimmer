import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Users, LogOut, Settings, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from '../../contexts/AuthContext';

interface RoomMessage {
  id: string;
  roomId: string;
  room: string;
  author: string;
  message: string;
  time: string;
  isOwn?: boolean;
  isSystem?: boolean;
  createdAt?: Date;
}

const RoomChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const username = user?.username || '';

  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get room name from location state or localStorage
  const roomName = location.state?.roomName || localStorage.getItem('currentRoomName') || 'Neural Hub';

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket connection setup
  useEffect(() => {
    if (!id || !username || !isAuthenticated) {
      navigate('/group');
      return;
    }

    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Join the room
      newSocket.emit("join_room", id, username);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for room messages
    const handleRoomMessage = (data: any) => {
      const newMessage: RoomMessage = {
        id: Date.now().toString(),
        roomId: data.roomId,
        room: data.room,
        author: data.author,
        message: data.message,
        time: data.time,
        isOwn: data.author === username,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
    };

    // Listen for system messages (user joined/left)
    const handleSystemMessage = (data: any) => {
      const systemMessage: RoomMessage = {
        id: Date.now().toString(),
        roomId: id,
        room: roomName,
        author: 'System',
        message: data.message,
        time: data.time,
        isSystem: true,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);
    };

    // Listen for online users updates
    const handleUsersUpdate = (users: string[]) => {
      setOnlineUsers(users);
    };

    newSocket.on("receive_room_message", handleRoomMessage);
    newSocket.on("joining_message", handleSystemMessage);
    newSocket.on("leave_message", handleSystemMessage);
    newSocket.on("room_users_update", handleUsersUpdate);

    // Cleanup
    return () => {
      newSocket.off("receive_room_message", handleRoomMessage);
      newSocket.off("joining_message", handleSystemMessage);
      newSocket.off("leave_message", handleSystemMessage);
      newSocket.off("room_users_update", handleUsersUpdate);
      if (id) {
        newSocket.emit("leave_room", id, username);
      }
      newSocket.disconnect();
    };
  }, [id, username, roomName, isAuthenticated, navigate]);

  // Load initial messages
  useEffect(() => {
    // In a real implementation, you'd fetch messages from your API here
    // For now, we'll simulate some initial messages
    const mockMessages: RoomMessage[] = [
      {
        id: '1',
        roomId: id || '',
        room: roomName,
        author: 'System',
        message: `🚀 Welcome to the ${roomName} Neural Network`,
        time: '10:00 AM',
        isSystem: true,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        roomId: id || '',
        room: roomName,
        author: 'NeuralBot',
        message: 'Initializing quantum communication protocols... ⚡',
        time: '10:01 AM',
        isOwn: false,
        createdAt: new Date(Date.now() - 3000000)
      }
    ];
    setMessages(mockMessages);
    setLoading(false);
  }, [id, roomName]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && socket && id) {
      const messageData = {
        roomId: id,
        room: roomName,
        author: username,
        message: message.trim(),
        time: new Date(Date.now()).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
      };

      // Send message via socket - the server will echo it back to all clients
      socket.emit("send_room_message", messageData);
      setMessage('');
    }
  };

  const leaveRoom = () => {
    if (socket && id) {
      socket.emit("leave_room", id, username);
    }
    localStorage.removeItem('currentRoom');
    localStorage.removeItem('currentRoomName');
    navigate('/group');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen zen-pattern">
      {/* Classroom Header */}
      <div className="glass-panel border-b border-sidebar-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={leaveRoom}
                  className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        #
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
                      <span className="text-blue-600">#</span>
                      {roomName}
                    </h2>
                    <p className="text-sm text-sidebar-foreground/60 flex items-center gap-2">
                      <div className="relative flex h-2 w-2">
                        <div className="absolute inline-flex h-full w-full rounded-full bg-green-500"></div>
                      </div>
                      {onlineUsers.length} {onlineUsers.length === 1 ? 'student' : 'students'} online
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg transition-colors">
                  <Users className="w-5 h-5" />
                </button>
                <button className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <h1 className="text-xl font-bold text-sidebar-foreground mt-4">
                  Loading classroom...
                </h1>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${msg.isSystem ? 'flex justify-center' : 'flex gap-3 animate-fadeIn'}`}
                >
                  {msg.isSystem ? (
                    <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium">
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {msg.message}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-white">
                          {msg.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-sidebar-foreground text-sm">{msg.author}</span>
                          <span className="text-xs text-sidebar-foreground/50">{msg.time}</span>
                        </div>
                        <div
                          className={`inline-block px-4 py-3 rounded-lg ${
                            msg.isOwn
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-sidebar-accent/30 text-sidebar-foreground rounded-bl-sm border border-sidebar-border"
                          }`}
                        >
                          <p className="leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Online Students Bar */}
        {onlineUsers.length > 0 && (
          <div className="glass-panel border-t border-sidebar-border px-4 py-3">
            <div className="container mx-auto">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-sm text-sidebar-foreground/60 whitespace-nowrap font-medium">Online Students:</span>
                <div className="flex gap-2 flex-wrap">
                  {onlineUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        user === username
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-sidebar-accent/30 text-sidebar-foreground/70 border-sidebar-border"
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {user === username ? `${user} (you)` : user}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="glass-panel border-t border-sidebar-border">
          <div className="container mx-auto p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
              <span className="text-xs text-sidebar-foreground/60">
                {isConnected ? 'Connected to classroom' : 'Connecting...'}
              </span>
            </div>

            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Type your message in ${roomName} classroom...`}
                  className="w-full px-4 py-3 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!message.trim() || !isConnected}
                className="px-6 py-3 bottom-0 zen-action-btn text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                style={{
                  background: 'oklch(0.55 0.08 145)',
                  boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
                }}
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
    </div>
  );
};

export default RoomChat;