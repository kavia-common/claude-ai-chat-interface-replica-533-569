const express = require('express');
const chatController = require('../controllers/chat');
const messageController = require('../controllers/message');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Chats
 *     description: Chat management endpoints
 *   - name: Messages
 *     description: Message operations with streaming support
 */

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chats]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Chat
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: chat_1
 *                 title:
 *                   type: string
 *                   example: New Chat
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 messageCount:
 *                   type: integer
 *                   example: 0
 */
router.post('/chats', chatController.createChat.bind(chatController));

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats
 *     tags: [Chats]
 *     responses:
 *       200:
 *         description: List of all chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   messageCount:
 *                     type: integer
 */
router.get('/chats', chatController.getAllChats.bind(chatController));

/**
 * @swagger
 * /api/chats/{chatId}:
 *   get:
 *     summary: Get a specific chat
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: Chat details
 *       404:
 *         description: Chat not found
 */
router.get('/chats/:chatId', chatController.getChatById.bind(chatController));

/**
 * @swagger
 * /api/chats/{chatId}:
 *   put:
 *     summary: Update a chat
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Chat Title
 *     responses:
 *       200:
 *         description: Chat updated successfully
 *       404:
 *         description: Chat not found
 */
router.put('/chats/:chatId', chatController.updateChat.bind(chatController));

/**
 * @swagger
 * /api/chats/{chatId}:
 *   delete:
 *     summary: Delete a chat
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     responses:
 *       204:
 *         description: Chat deleted successfully
 *       404:
 *         description: Chat not found
 */
router.delete('/chats/:chatId', chatController.deleteChat.bind(chatController));

/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   get:
 *     summary: Get all messages for a chat
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   chatId:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [user, assistant]
 *                   content:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Chat not found
 */
router.get('/chats/:chatId/messages', chatController.getMessages.bind(chatController));

/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   post:
 *     summary: Send a message to a chat with SSE streaming response
 *     description: Sends a user message and streams the assistant's response using Server-Sent Events (SSE). The response will include multiple events - user_message, thinking, content (multiple), and complete.
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: What is the weather like today?
 *     responses:
 *       200:
 *         description: SSE stream of message events
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: Server-Sent Events stream with JSON data. Event types - user_message (initial user message), thinking (processing indicator), content (streaming assistant response), complete (final message with full content), error (if an error occurs)
 *       404:
 *         description: Chat not found
 */
router.post('/chats/:chatId/messages', messageController.sendMessage.bind(messageController));

module.exports = router;
