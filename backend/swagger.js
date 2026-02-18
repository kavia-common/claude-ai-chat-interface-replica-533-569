const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Claude AI Chat Interface API',
      version: '1.0.0',
      description: 'Backend API for Claude AI chat interface with in-memory storage and SSE streaming support for real-time message responses',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Chats',
        description: 'Chat management endpoints for creating, reading, updating, and deleting chats'
      },
      {
        name: 'Messages',
        description: 'Message operations with Server-Sent Events (SSE) streaming support for real-time assistant responses'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
