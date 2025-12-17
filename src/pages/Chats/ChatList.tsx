import { useState, useEffect } from 'react';
import { Search, MessageCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserChats } from '../../hooks/usePrivateMessages';

interface ChatUser {
  email: string;
  username: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  unreadCount?: number;
}

const ChatList = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Use TanStack Query for user chats
  const { isPending, chats, isError, error, refetch } = useUserChats(user?.email || '');

  // Transform backend chats to frontend format
  const chatUsers: ChatUser[] = chats.map((chat: any) => ({
    email: chat.partnerEmail,
    username: chat.partnerUsername,
    lastMessage: chat.lastMessage,
    lastMessageTime: chat.lastMessageTime,
    isOnline: false, // TODO: Implement real-time online status with socket
    isTyping: false, // TODO: Implement real-time typing status with socket
    unreadCount: 0, // TODO: Implement unread count logic
  }));

  const handleChatSelect = (chat: ChatUser) => {
    navigate(`/chat/${chat.email}`, {
      state: {
        partnerUsername: chat.username,
        partnerEmail: chat.email
      }
    });
  };

  const filteredUsers = chatUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isPending) {
    return (
      <div className="min-h-screen zen-pattern">
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                   style={{ borderTopColor: 'oklch(0.55 0.08 145)' }}></div>
            </div>
            <h3 className="zen-title text-xl mb-2">Loading your conversations...</h3>
            <p className="text-sm text-sidebar-foreground/70">Please wait while we load your messages</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen zen-pattern">
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="zen-title text-xl mb-4">Error Loading Chats</h2>
            <p className="text-sm text-sidebar-foreground/70 mb-6">{error?.message || 'Failed to load chats'}</p>
            <button
              onClick={() => refetch()}
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

  return (
    <div className="min-h-screen zen-pattern">
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border/50 glass-panel border-b rounded-b-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center zen-float">
                  <MessageCircle className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.55 0.08 145)', animation: 'pulse 2s infinite' }}></div>
              </div>
              <div>
                <h2 className="zen-title text-2xl">Messages</h2>
                <p className="text-xs text-sidebar-foreground/60 font-light tracking-wide">Your conversations</p>
              </div>
            </div>

            {/* Users button */}
            <button
              onClick={() => navigate('/chat/users')}
              className="zen-action-btn flex items-center gap-2 px-4 py-2 text-primary-foreground rounded-xl transition-all"
              style={{
                background: 'oklch(0.55 0.08 145)',
                boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
              }}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Find Users</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="zen-search w-full pl-10 pr-4 py-3 text-sidebar-foreground placeholder-sidebar-foreground/40"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center zen-float">
                  <MessageCircle className="w-8 h-8" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <h3 className="zen-title text-xl mb-4">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </h3>
                <p className="text-sm text-sidebar-foreground/70 mb-6 leading-relaxed">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Start a new conversation to see it here'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => navigate('/chat/users')}
                    className="zen-action-btn px-6 py-3 text-primary-foreground rounded-xl transition-all"
                    style={{
                      background: 'oklch(0.55 0.08 145)',
                      boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
                    }}
                  >
                    Find Users to Chat With
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.email}
                  onClick={() => handleChatSelect(user)}
                  className="glass-panel rounded-xl p-4 hover:scale-[1.02] cursor-pointer transition-all animate-fadeIn group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border-2 border-sidebar-border">
                        <span className="text-sm font-semibold" style={{ color: 'oklch(0.55 0.08 145)' }}>
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-sidebar animate-pulse"></div>
                      )}
                      {user.isTyping && (
                        <div className="absolute bottom-0 right-0 w-3 h-3">
                          <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-sidebar-foreground truncate">{user.username}</h3>
                        {user.lastMessageTime && (
                          <span className="text-xs text-sidebar-foreground/50 ml-2">{user.lastMessageTime}</span>
                        )}
                      </div>
                      <p className="text-sm text-sidebar-foreground/70 truncate leading-relaxed">
                        {user.isTyping ? 'typing...' : user.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(user.unreadCount && user.unreadCount > 0) && (
                        <div className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                             style={{ backgroundColor: 'oklch(0.55 0.08 145)' }}>
                          {user.unreadCount}
                        </div>
                      )}

                      <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <MessageCircle className="w-4 h-4" style={{ color: 'oklch(0.55 0.08 145)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;