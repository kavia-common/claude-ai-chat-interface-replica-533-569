const chatService = require('../services/chat');

/**
 * ChatController - Handles HTTP requests for chat operations
 */
class ChatController {
  /**
   * PUBLIC_INTERFACE
   * Create a new chat
   */
  createChat(req, res) {
    try {
      const { title } = req.body;
      const chat = chatService.createChat(title);
      return res.status(201).json(chat);
    } catch (error) {
      console.error('Error creating chat:', error);
      return res.status(500).json({ error: 'Failed to create chat' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get all chats
   */
  getAllChats(req, res) {
    try {
      const chats = chatService.getAllChats();
      return res.status(200).json(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      return res.status(500).json({ error: 'Failed to fetch chats' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get a specific chat by ID
   */
  getChatById(req, res) {
    try {
      const { chatId } = req.params;
      const chat = chatService.getChatById(chatId);
      
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      return res.status(200).json(chat);
    } catch (error) {
      console.error('Error fetching chat:', error);
      return res.status(500).json({ error: 'Failed to fetch chat' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update a chat
   */
  updateChat(req, res) {
    try {
      const { chatId } = req.params;
      const { title } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      const chat = chatService.updateChat(chatId, title);
      
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      return res.status(200).json(chat);
    } catch (error) {
      console.error('Error updating chat:', error);
      return res.status(500).json({ error: 'Failed to update chat' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a chat
   */
  deleteChat(req, res) {
    try {
      const { chatId } = req.params;
      const deleted = chatService.deleteChat(chatId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting chat:', error);
      return res.status(500).json({ error: 'Failed to delete chat' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get messages for a chat
   */
  getMessages(req, res) {
    try {
      const { chatId } = req.params;
      const chat = chatService.getChatById(chatId);
      
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      const messages = chatService.getMessages(chatId);
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
}

module.exports = new ChatController();
