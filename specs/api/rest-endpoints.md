# REST API Endpoints

## Base URL
- Development: http://localhost:8000
- Production: https://your-backend.vercel.app

## Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Task Endpoints

### GET /api/{user_id}/tasks
List all tasks for authenticated user.

**Query Parameters:**
- status: "all" | "pending" | "completed"

**Response:**
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

### POST /api/{user_id}/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-01-01T10:00:00Z"
}
```

### PUT /api/{user_id}/tasks/{id}
Update a task.

### DELETE /api/{user_id}/tasks/{id}
Delete a task.

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle task completion.

## Chat Endpoint

### POST /api/{user_id}/chat
Send message to AI chatbot.

**Request Body:**
```json
{
  "conversation_id": 1,
  "message": "Add task to buy groceries"
}
```

**Response:**
```json
{
  "conversation_id": 1,
  "response": "I've added 'Buy groceries' to your task list!",
  "tool_calls": ["add_task"]
}
```
