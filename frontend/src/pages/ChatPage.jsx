import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchChats();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupSocket = () => {
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
    
    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected for chat');
    });

    socketRef.current.on('new-message', (data) => {
      // If the message is for the currently selected chat, add it
      if (selectedChat && data.chatId === selectedChat._id) {
        setMessages(prev => [...prev, data.message]);
        markAsRead(data.chatId);
      }
      // Refresh chat list to show new message preview
      fetchChats();
    });
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('/api/chat');
      setChats(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const { data } = await axios.get(`/api/chat/${chat._id}`);
      setMessages(data.data.messages || []);
      // Mark messages as read
      markAsRead(chat._id);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const markAsRead = async (chatId) => {
    try {
      await axios.put(`/api/chat/${chatId}/read`);
      fetchChats(); // Refresh to update unread counts
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      const { data } = await axios.post(`/api/chat/${selectedChat._id}/messages`, {
        content: newMessage
      });

      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
      fetchChats(); // Refresh chat list
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAvailableUsers = async () => {
    try {
      // Fetch card owners and buyers for chat
      const { data: cardsData } = await axios.get('/api/cards');
      
      // Get unique card owners
      const cardOwners = cardsData
        .filter(card => card.owner && card.owner._id !== user._id)
        .map(card => card.owner)
        .filter((owner, index, self) => 
          index === self.findIndex(o => o._id === owner._id)
        );
      
      setAvailableUsers(cardOwners);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const startNewChat = async (userId) => {
    try {
      const { data } = await axios.post('/api/chat/create', {
        participantId: userId
      });
      
      setShowNewChatModal(false);
      setSearchQuery('');
      await fetchChats();
      selectChat(data.data);
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat');
    }
  };

  const openNewChatModal = () => {
    fetchAvailableUsers();
    setShowNewChatModal(true);
  };

  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user._id);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Chat List Sidebar */}
        <div className="chat-list">
          <div className="chat-list-header">
            <h2>💬 Messages</h2>
            <button 
              className="btn-new-chat"
              onClick={openNewChatModal}
              title="Start new chat"
            >
              ➕ New Chat
            </button>
          </div>
          <div className="chat-list-items">
            {chats.length === 0 ? (
              <div className="no-chats">
                <p>No conversations yet</p>
                <small>Start a chat from a transaction</small>
              </div>
            ) : (
              chats.map(chat => {
                const otherUser = getOtherParticipant(chat);
                const unreadCount = chat.messages?.filter(
                  m => m.sender !== user._id && !m.isRead
                ).length || 0;

                return (
                  <div
                    key={chat._id}
                    className={`chat-list-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                    onClick={() => selectChat(chat)}
                  >
                    <div className="chat-avatar">
                      {otherUser?.profileImage ? (
                        <img src={otherUser.profileImage} alt={otherUser.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {otherUser?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name-row">
                        <h4>{otherUser?.name}</h4>
                        {unreadCount > 0 && (
                          <span className="unread-badge">{unreadCount}</span>
                        )}
                      </div>
                      <p className="last-message">{chat.lastMessage || 'No messages yet'}</p>
                      <small className="chat-time">{formatTime(chat.lastMessageAt)}</small>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="chat-messages-container">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar">
                    {getOtherParticipant(selectedChat)?.profileImage ? (
                      <img src={getOtherParticipant(selectedChat).profileImage} alt="" />
                    ) : (
                      <div className="avatar-placeholder">
                        {getOtherParticipant(selectedChat)?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{getOtherParticipant(selectedChat)?.name}</h3>
                    <small>{getOtherParticipant(selectedChat)?.role}</small>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div
                    key={message._id || index}
                    className={`message ${message.sender === user._id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <small className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </small>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-form" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? '⏳' : '➤'}
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a chat from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content new-chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👥 Start New Chat</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowNewChatModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="search-users">
                <input
                  type="text"
                  placeholder="Search card owners by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="users-list">
                {filteredUsers.length === 0 ? (
                  <div className="no-users">
                    <p>No users found</p>
                    <small>Try searching with a different query</small>
                  </div>
                ) : (
                  filteredUsers.map(otherUser => (
                    <div
                      key={otherUser._id}
                      className="user-item"
                      onClick={() => startNewChat(otherUser._id)}
                    >
                      <div className="user-avatar">
                        {otherUser.profileImage ? (
                          <img src={otherUser.profileImage} alt={otherUser.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {otherUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-info">
                        <h4>{otherUser.name}</h4>
                        <p>{otherUser.email}</p>
                        <span className="user-role-badge">{otherUser.role}</span>
                      </div>
                      <button className="btn-chat-start">💬 Chat</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
