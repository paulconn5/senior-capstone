import { useState, useEffect, useRef } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { HiMagnifyingGlass, HiEllipsisVertical, HiPaperAirplane } from 'react-icons/hi2'
import { HiUser } from 'react-icons/hi2'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Messages.css'
import useAuth from '../hooks/useAuth'

const API_BASE = 'https://localhost:7068'

function Messages() {
  const { token, profile } = useAuth()
  const navigate = useNavigate()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [connection, setConnection] = useState(null)
  const messagesEndRef = useRef(null)
  const selectedConversationRef = useRef(null)
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const initialConvo = query.get('convo') ? Number(query.get('convo')) : null

  useEffect(() => {
    selectedConversationRef.current = selectedConversation
  }, [selectedConversation])

  // Load conversations
  useEffect(() => {
    if (!profile || !profile.id) return

    fetch(`${API_BASE}/api/messages/conversations?userId=${profile.id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        setConversations(data)
        if (initialConvo) {
          // ensure the initial conversation exists in list 
          handleSelectConversation(initialConvo)
        }
      })
  }, [profile, token])

  // Set up SignalR connection 
  useEffect(() => {
    if (!profile || !profile.id) return

    const conn = new HubConnectionBuilder()
      .withUrl(`${API_BASE}/chathub`, token ? { accessTokenFactory: () => token } : undefined)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    conn.on('ReceiveMessage', (msg) => {
      if (msg.conversationId === selectedConversationRef.current) {
        setMessages(prev => [...prev, msg])
      }

      setConversations(prev => prev.map(c =>
        c.id === msg.conversationId
          ? {
              ...c,
              lastMessage: msg.content,
              lastMessageAt: msg.sentAt,
              unreadCount: msg.conversationId === selectedConversationRef.current
                ? c.unreadCount
                : (c.unreadCount || 0) + 1
            }
          : c
      ))
    })

    conn.start()
      .then(() => setConnection(conn))
      .catch(err => console.error('SignalR start failed', err))

    return () => { conn.stop().catch(() => {}) }
  }, [profile, token])

  // If connection becomes available and a conversation is already selected, join it
  useEffect(() => {
    if (connection && selectedConversation) {
      connection.invoke('JoinConversation', selectedConversation).catch(err => {
        console.error('JoinConversation failed', err)
      })
    }
  }, [connection, selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSelectConversation = async (convoId) => {
    if (!profile || !profile.id) return

    if (selectedConversation && connection) {
      try { await connection.invoke('LeaveConversation', selectedConversation) } catch (err) {console.error(err)}
    }

    setSelectedConversation(convoId)

    // Fetch message history
    try {
      const res = await fetch(
        `${API_BASE}/api/messages/conversations/${convoId}?userId=${profile.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      )
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      console.error('Failed to load messages', err)
      setMessages([])
    }

    // Reset unread for this conversation
    setConversations(prev => prev.map(c => c.id === convoId ? { ...c, unreadCount: 0 } : c))

    // Join group if connection ready
    if (connection) {
      try { await connection.invoke('JoinConversation', convoId) } catch (err) { console.error('JoinConversation failed', err) }
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !connection || !selectedConversation || !profile || !profile.id) return

    await connection.invoke('SendMessage', {
      senderId: profile.id,
      conversationId: selectedConversation,
      content: messageText
    })

    setMessageText('')
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatMessageTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="messages-page">
      <Navbar />

      <main className="messages-main">
        <div className="messages-container">
          <div className="conversations-sidebar">
            <div className="sidebar-header">
              <h2>Messages</h2>
            </div>

            <div className="search-bar">
              <HiMagnifyingGlass className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="search-input"
              />
            </div>

            <div className="conversations-list">
              {conversations.length === 0 && (
                <div className="no-conversation-selected" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p>No conversations yet</p>
                </div>
              )}
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="conversation-avatar">
                    <div className="avatar-placeholder">
                      <HiUser />
                    </div>
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/mentor/${conversation.otherUserId}`)
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {conversation.otherUserName}
                      </h3>
                      <span className="conversation-time">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="conversation-preview">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && <div className="unread-badge"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="chat-area">
            {selectedConv ? (
              <>
                <div className="chat-header">
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      <div className="avatar-placeholder">
                        <HiUser />
                      </div>
                    </div>
                    <div>
                      <h2
                        onClick={() => navigate(`/mentor/${selectedConv.otherUserId}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {selectedConv.otherUserName}
                      </h2>
                    </div>
                  </div>
                  <button className="more-options">
                    <HiEllipsisVertical />
                  </button>
                </div>

                <div className="messages-area">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === profile.id ? 'message-sent' : 'message-received'}`}
                    >
                      <div className="message-bubble">
                        <p>{message.content}</p>
                      </div>
                      <span className="message-time">{formatMessageTime(message.sentAt)}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="message-input-area" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="message-input"
                  />
                  <button type="submit" className="send-button">
                    <HiPaperAirplane />
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation-selected">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Messages
