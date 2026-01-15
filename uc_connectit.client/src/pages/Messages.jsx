import { useState } from 'react'
import { HiMagnifyingGlass, HiEllipsisVertical, HiPaperAirplane } from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import './Messages.css'

function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [messageText, setMessageText] = useState('')

  const conversations = [
    {
      id: 1,
      name: 'David Miller',
      photo: 'https://via.placeholder.com/50',
      preview: 'I\'d be happy to help you explore...',
      time: '5m ago',
      unread: true,
      online: true
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      photo: 'https://via.placeholder.com/50',
      preview: 'Let\'s schedule a call for next week ...',
      time: '1h ago',
      unread: false,
      online: false
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      photo: 'https://via.placeholder.com/50',
      preview: 'I can share some design resources ...',
      time: '3h ago',
      unread: false,
      online: false
    },
    {
      id: 4,
      name: 'Priya Patel',
      photo: 'https://via.placeholder.com/50',
      preview: 'Great meeting you at the networki...',
      time: '1d ago',
      unread: false,
      online: false
    }
  ]

  const messages = [
    {
      id: 1,
      sender: 'other',
      text: 'Hi Daniel! I saw your mentorship request. I\'d be happy to help you explore cybersecurity career paths and co-op opportunities. What specific areas of cybersecurity interest you most?',
      time: '9:15 AM'
    },
    {
      id: 2,
      sender: 'me',
      text: 'Hi David! Thank you so much for reaching out. I\'m interested in learning more about network security and ethical hacking. I\'m also really struggling to find a co-op and would love guidance on what companies look for.',
      time: '9:22 AM'
    },
    {
      id: 3,
      sender: 'other',
      text: 'Those are great areas to focus on! Network security and ethical hacking are in high demand. At Great American Insurance Group, we have several entry-level positions for students like you. Let\'s schedule a call this week to discuss your goals and I can share some insights about our co-op program.',
      time: '9:28 AM'
    },
    {
      id: 4,
      sender: 'me',
      text: 'That would be amazing! I\'m available any day after 3pm. Looking forward to learning from your experience.',
      time: '9:35 AM'
    },
    {
      id: 5,
      sender: 'other',
      text: 'Perfect! How about Thursday at 4pm? I\'ll send you a calendar invite. In the meantime, check out SANS and CompTIA certifications - they\'re great starting points for cybersecurity.',
      time: '9:40 AM'
    }
  ]

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageText.trim()) {
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="messages-page">
      <Navbar />

      <main className="messages-main">
        <div className="messages-container">
          {/* Conversations Sidebar */}
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
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="conversation-avatar">
                    <img src={conversation.photo} alt={conversation.name} />
                    {conversation.online && <span className="online-indicator"></span>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3>{conversation.name}</h3>
                      <span className="conversation-time">{conversation.time}</span>
                    </div>
                    <p className="conversation-preview">{conversation.preview}</p>
                  </div>
                  {conversation.unread && <div className="unread-badge"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {selectedConv ? (
              <>
                <div className="chat-header">
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      <img src={selectedConv.photo} alt={selectedConv.name} />
                      {selectedConv.online && <span className="online-indicator"></span>}
                    </div>
                    <div>
                      <h2>{selectedConv.name}</h2>
                      <p className="online-status">
                        {selectedConv.online ? 'Online' : 'Offline'}
                      </p>
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
                      className={`message ${message.sender === 'me' ? 'message-sent' : 'message-received'}`}
                    >
                      <div className="message-bubble">
                        <p>{message.text}</p>
                      </div>
                      <span className="message-time">{message.time}</span>
                    </div>
                  ))}
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
