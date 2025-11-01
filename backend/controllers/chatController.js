const Chat = require('../models/Chat');
const User = require('../models/User');
const { sendNotificationToUser } = require('../services/socketService');

// Get all chats for current user
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
    .populate('participants', 'name email profileImage role')
    .populate('transaction', 'product status')
    .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message
    });
  }
};

// Get or create a chat between two users
exports.getOrCreateChat = async (req, res) => {
  try {
    const { participantId, transactionId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] }
    })
    .populate('participants', 'name email profileImage role')
    .populate('transaction', 'product status');

    if (chat) {
      return res.json({
        success: true,
        data: chat
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.user._id, participantId],
      transaction: transactionId || null,
      messages: []
    });

    chat = await Chat.findById(chat._id)
      .populate('participants', 'name email profileImage role')
      .populate('transaction', 'product status');

    res.status(201).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat',
      error: error.message
    });
  }
};

// Get single chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name email profileImage role')
      .populate('transaction', 'product status')
      .populate('messages.sender', 'name profileImage');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat',
      error: error.message
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message in this chat'
      });
    }

    // Create message
    const message = {
      sender: req.user._id,
      content: content.trim(),
      attachments: attachments || [],
      isRead: false
    };

    chat.messages.push(message);
    chat.lastMessage = content.trim().substring(0, 100);
    chat.lastMessageAt = new Date();

    await chat.save();

    // Populate the new message
    await chat.populate('messages.sender', 'name profileImage');
    const newMessage = chat.messages[chat.messages.length - 1];

    // Emit socket event to other participants
    const otherParticipants = chat.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );

    otherParticipants.forEach(participantId => {
      sendNotificationToUser(participantId.toString(), 'new-message', {
        chatId: chat._id,
        message: newMessage
      });
    });

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Mark all messages not from current user as read
    let updated = false;
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user._id.toString() && !msg.isRead) {
        msg.isRead = true;
        msg.readAt = new Date();
        updated = true;
      }
    });

    if (updated) {
      await chat.save();
    }

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

// Delete/Close chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    chat.isActive = false;
    await chat.save();

    res.json({
      success: true,
      message: 'Chat closed successfully'
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chat',
      error: error.message
    });
  }
};
