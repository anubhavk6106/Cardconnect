import { useState, useEffect, useContext, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'

const NotificationBell = () => {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const socketRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (user) {
      // Request browser notification permission once
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission()
      }

      fetchNotifications()
      initializeSocket()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initializeSocket = () => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],  // ensure WS only
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    })

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id)
      socketRef.current.emit('register', user._id)
    })

    // Listen for different notification types
    const events = [
      'new_transaction_request',
      'transaction_approved',
      'transaction_rejected',
      'transaction_completed'
    ]

    events.forEach(event => {
      socketRef.current.on(event, handleNewNotification)
    })
  }

  const handleNewNotification = (data) => {
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('CardConnect', {
        body: data.message || 'You have a new notification',
        icon: '/logo.png'
      })
    }

    // Refresh notifications
    fetchNotifications()
  }

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications')
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`)
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all')
      fetchNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation()
    try {
      await axios.delete(`/api/notifications/${notificationId}`)
      fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction_request': return '📝'
      case 'transaction_approved': return '✅'
      case 'transaction_rejected': return '❌'
      case 'transaction_completed': return '💰'
      default: return '🔔'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now - notifDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return notifDate.toLocaleDateString()
  }

  if (!user) return null

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className="bell-button" 
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification._id)
                    if (notification.link) window.location.href = notification.link
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                  </div>
                  <button 
                    className="delete-notification"
                    onClick={(e) => deleteNotification(notification._id, e)}
                    aria-label="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
