const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserChats,
  getOrCreateChat,
  getChatById,
  sendMessage,
  markAsRead,
  deleteChat
} = require('../controllers/chatController');

// All routes require authentication
router.use(protect);

// Get all chats for current user
router.get('/', getUserChats);

// Get or create a chat
router.post('/create', getOrCreateChat);

// Get single chat by ID
router.get('/:id', getChatById);

// Send a message
router.post('/:chatId/messages', sendMessage);

// Mark messages as read
router.put('/:chatId/read', markAsRead);

// Delete/close chat
router.delete('/:chatId', deleteChat);

module.exports = router;
