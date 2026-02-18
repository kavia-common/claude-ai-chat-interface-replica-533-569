/**
 * ChatService - Manages chats and messages with in-memory storage
 * PUBLIC_INTERFACE
 */
class ChatService {
  constructor() {
    // In-memory storage
    this.chats = new Map();
    this.messages = new Map();
    this.chatIdCounter = 1;
    this.messageIdCounter = 1;
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new chat
   * @param {string} title - Chat title
   * @returns {Object} Created chat object
   */
  createChat(title = 'New Chat') {
    const chatId = `chat_${this.chatIdCounter++}`;
    const chat = {
      id: chatId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0
    };
    this.chats.set(chatId, chat);
    this.messages.set(chatId, []);
    return chat;
  }

  /**
   * PUBLIC_INTERFACE
   * Get all chats
   * @returns {Array} Array of chat objects
   */
  getAllChats() {
    return Array.from(this.chats.values()).sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  /**
   * PUBLIC_INTERFACE
   * Get a specific chat by ID
   * @param {string} chatId - Chat ID
   * @returns {Object|null} Chat object or null if not found
   */
  getChatById(chatId) {
    return this.chats.get(chatId) || null;
  }

  /**
   * PUBLIC_INTERFACE
   * Update chat title
   * @param {string} chatId - Chat ID
   * @param {string} title - New title
   * @returns {Object|null} Updated chat object or null if not found
   */
  updateChat(chatId, title) {
    const chat = this.chats.get(chatId);
    if (!chat) return null;
    
    chat.title = title;
    chat.updatedAt = new Date().toISOString();
    return chat;
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a chat and its messages
   * @param {string} chatId - Chat ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteChat(chatId) {
    const deleted = this.chats.delete(chatId);
    if (deleted) {
      this.messages.delete(chatId);
    }
    return deleted;
  }

  /**
   * PUBLIC_INTERFACE
   * Add a message to a chat
   * @param {string} chatId - Chat ID
   * @param {string} role - Message role (user or assistant)
   * @param {string} content - Message content
   * @returns {Object|null} Created message object or null if chat not found
   */
  addMessage(chatId, role, content) {
    const chat = this.chats.get(chatId);
    if (!chat) return null;

    const messageId = `msg_${this.messageIdCounter++}`;
    const message = {
      id: messageId,
      chatId,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    const chatMessages = this.messages.get(chatId);
    chatMessages.push(message);
    
    chat.messageCount = chatMessages.length;
    chat.updatedAt = new Date().toISOString();
    
    return message;
  }

  /**
   * PUBLIC_INTERFACE
   * Get all messages for a chat
   * @param {string} chatId - Chat ID
   * @returns {Array} Array of message objects
   */
  getMessages(chatId) {
    return this.messages.get(chatId) || [];
  }

  /**
   * PUBLIC_INTERFACE
   * Clear all data (for testing)
   */
  clearAll() {
    this.chats.clear();
    this.messages.clear();
    this.chatIdCounter = 1;
    this.messageIdCounter = 1;
  }
}

module.exports = new ChatService();
