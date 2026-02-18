# Claude AI Chat Interface Backend API

This backend provides RESTful API endpoints for managing chats and messages with Server-Sent Events (SSE) streaming support for real-time assistant responses.

## Features

- **In-memory storage** for chats and messages
- **SSE streaming** for real-time message responses
- **Full CRUD operations** for chats
- **Message management** with streaming assistant responses
- **OpenAPI/Swagger documentation** at `/docs`
- **CORS enabled** for frontend integration

## API Endpoints

### Health Check

- **GET /** - Health check endpoint
  - Returns service status and environment information

### Chat Management

- **POST /api/chats** - Create a new chat
  - Request body (optional): `{ "title": "Chat Title" }`
  - Response: Chat object with ID, title, timestamps, and message count

- **GET /api/chats** - Get all chats
  - Returns array of all chats sorted by most recently updated

- **GET /api/chats/:chatId** - Get a specific chat
  - Returns chat details by ID

- **PUT /api/chats/:chatId** - Update a chat title
  - Request body: `{ "title": "New Title" }`
  - Returns updated chat object

- **DELETE /api/chats/:chatId** - Delete a chat
  - Deletes the chat and all its messages
  - Returns 204 No Content on success

### Message Management

- **GET /api/chats/:chatId/messages** - Get all messages for a chat
  - Returns array of messages in chronological order

- **POST /api/chats/:chatId/messages** - Send a message with SSE streaming
  - Request body: `{ "content": "Your message here" }`
  - Returns Server-Sent Events stream with the following event types:
    - `user_message`: Initial user message confirmation
    - `thinking`: Processing indicator
    - `content`: Streaming assistant response (multiple events)
    - `complete`: Final message with full content
    - `error`: Error information if something goes wrong

## SSE Streaming Example

When you POST to `/api/chats/:chatId/messages`, the response streams events like:

```
data: {"type":"user_message","message":{"id":"msg_1","chatId":"chat_1","role":"user","content":"Hello"}}

data: {"type":"thinking","messageId":"msg_123456789"}

data: {"type":"content","messageId":"msg_123456789","content":"I understand","isComplete":false}

data: {"type":"content","messageId":"msg_123456789","content":"I understand you're","isComplete":false}

...

data: {"type":"complete","message":{"id":"msg_2","chatId":"chat_1","role":"assistant","content":"Full response here"}}
```

## Environment Variables

The backend uses the following environment variables:

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment mode (development/production)
- `REACT_APP_FRONTEND_URL` - Frontend URL for CORS configuration

## Running the Server

```bash
# Install dependencies
npm install

# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI JSON**: http://localhost:3001/openapi.json

## Data Models

### Chat Object
```json
{
  "id": "chat_1",
  "title": "New Chat",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "messageCount": 5
}
```

### Message Object
```json
{
  "id": "msg_1",
  "chatId": "chat_1",
  "role": "user",
  "content": "Hello, how are you?",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Integration Notes

- All timestamps are in ISO 8601 format
- Chat IDs follow the pattern: `chat_<number>`
- Message IDs follow the pattern: `msg_<number>`
- SSE responses use `text/event-stream` content type
- CORS is configured to allow the frontend origin
- In-memory storage means data is lost on server restart
```
