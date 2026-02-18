const chatService = require('../services/chat');

/**
 * MessageController - Handles message operations with streaming support
 */
class MessageController {
  /**
   * PUBLIC_INTERFACE
   * Send a message and stream the assistant's response using SSE
   */
  async sendMessage(req, res) {
    try {
      const { chatId } = req.params;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
      }
      
      const chat = chatService.getChatById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      // Add user message
      const userMessage = chatService.addMessage(chatId, 'user', content);
      
      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx
      
      // Send initial event with user message
      res.write(`data: ${JSON.stringify({ type: 'user_message', message: userMessage })}\n\n`);
      
      // Simulate assistant response with streaming
      const assistantResponse = this._generateAssistantResponse(content);
      const messageId = `msg_${Date.now()}`;
      
      // Send thinking indicator
      res.write(`data: ${JSON.stringify({ type: 'thinking', messageId })}\n\n`);
      
      await this._sleep(500);
      
      // Stream response word by word
      const words = assistantResponse.split(' ');
      let accumulatedContent = '';
      
      for (let i = 0; i < words.length; i++) {
        accumulatedContent += (i > 0 ? ' ' : '') + words[i];
        
        res.write(`data: ${JSON.stringify({ 
          type: 'content', 
          messageId,
          content: accumulatedContent,
          isComplete: false
        })}\n\n`);
        
        await this._sleep(50 + Math.random() * 100);
      }
      
      // Add assistant message to storage
      const assistantMessage = chatService.addMessage(chatId, 'assistant', assistantResponse);
      
      // Send completion event
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        message: assistantMessage
      })}\n\n`);
      
      res.end();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Try to send error event if SSE is active
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Failed to send message' });
      } else {
        res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to process message' })}\n\n`);
        res.end();
      }
    }
  }

  /**
   * Generate a simulated assistant response
   * @private
   */
  _generateAssistantResponse(userContent) {
    const responses = [
      `I understand you're asking about "${userContent}". That's an interesting topic! Let me help you with that.`,
      `Thanks for your message about "${userContent}". Here's what I think about this subject.`,
      `Great question regarding "${userContent}"! I'd be happy to provide some insights on this.`,
      `I appreciate you bringing up "${userContent}". This is definitely worth discussing in detail.`,
      `Regarding "${userContent}", I have several thoughts that might be helpful to you.`
    ];
    
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  /**
   * Utility sleep function
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new MessageController();
