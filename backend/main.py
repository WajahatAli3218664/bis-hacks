from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Todo API")

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# CORS - Allow all origins for Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# In-memory storage (replace with database later)
tasks_db = {}
conversations_db = {}

# Models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""

class Task(BaseModel):
    id: int
    user_id: str
    title: str
    description: str
    completed: bool

class ChatRequest(BaseModel):
    message: str
    tasks: List[dict] = []

class ChatResponse(BaseModel):
    response: str
    action: Optional[str] = None
    task: Optional[dict] = None
    task_id: Optional[int] = None
    updated_task: Optional[dict] = None

# Routes
@app.get("/")
def read_root():
    return {"message": "AI Todo API is running", "version": "1.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Task endpoints
@app.get("/api/{user_id}/tasks")
def get_tasks(user_id: str, status: str = "all"):
    user_tasks = tasks_db.get(user_id, [])
    if status == "pending":
        return [t for t in user_tasks if not t["completed"]]
    elif status == "completed":
        return [t for t in user_tasks if t["completed"]]
    return user_tasks

@app.post("/api/{user_id}/tasks")
def create_task(user_id: str, task: TaskCreate):
    if user_id not in tasks_db:
        tasks_db[user_id] = []
    
    new_task = {
        "id": len(tasks_db[user_id]) + 1,
        "user_id": user_id,
        "title": task.title,
        "description": task.description,
        "completed": False
    }
    tasks_db[user_id].append(new_task)
    return new_task

@app.patch("/api/{user_id}/tasks/{task_id}/complete")
def toggle_task(user_id: str, task_id: int):
    user_tasks = tasks_db.get(user_id, [])
    for task in user_tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/api/{user_id}/tasks/{task_id}")
def delete_task(user_id: str, task_id: int):
    user_tasks = tasks_db.get(user_id, [])
    tasks_db[user_id] = [t for t in user_tasks if t["id"] != task_id]
    return {"message": "Task deleted"}

# Chat endpoint
@app.options("/chat")
def chat_options():
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

@app.post("/chat")
def chat(request: ChatRequest, response: Response):
    # Set CORS headers manually
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    try:
        system_prompt = """You are a helpful AI assistant for a todo app. Help users manage their tasks naturally.

When user wants to:
- ADD task: Extract task title and respond briefly
- DELETE/REMOVE task: Identify which task to delete
- UPDATE/CHANGE/RENAME task: Identify task and new title
- SHOW/LIST tasks: Summarize their tasks

Be concise and friendly. Don't show raw task data."""
        
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"User's tasks: {[t.get('title') for t in request.tasks]}\n\nUser message: {request.message}"}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=200,
        )
        
        response_text = chat_completion.choices[0].message.content
        message_lower = request.message.lower()
        action = None
        task = None
        task_id = None
        updated_task = None
        
        if "add" in message_lower or "create" in message_lower:
            task_title = request.message
            for phrase in ["add task to ", "add task ", "create task ", "add ", "create "]:
                if phrase in message_lower:
                    task_title = request.message[message_lower.index(phrase) + len(phrase):].strip()
                    break
            
            if task_title and not any(word in task_title.lower() for word in ['show', 'list', 'view']):
                action = "add_task"
                task = {
                    "title": task_title,
                    "description": "",
                    "completed": False,
                    "priority": "Medium",
                    "category": "Personal",
                    "dueDate": "",
                    "repeat": "No Repeat"
                }
        
        elif "delete" in message_lower or "remove" in message_lower:
            for t in request.tasks:
                title_lower = t.get('title', '').lower()
                if title_lower in message_lower and title_lower != "welcome to ai todo!":
                    action = "delete_task"
                    task_id = t.get('id')
                    break
        
        elif "update" in message_lower or "change" in message_lower or "edit" in message_lower or "rename" in message_lower:
            parts = request.message.lower().split(" to ")
            if len(parts) == 2:
                old_part = parts[0]
                new_title = parts[1].strip().strip('"').strip("'")
                
                for t in request.tasks:
                    title_lower = t.get('title', '').lower()
                    if title_lower in old_part and title_lower != "welcome to ai todo!":
                        action = "update_task"
                        task_id = t.get('id')
                        updated_task = {
                            "title": new_title,
                            "description": t.get('description', ''),
                            "completed": t.get('completed', False),
                            "priority": t.get('priority', 'Medium'),
                            "category": t.get('category', 'Personal'),
                            "dueDate": t.get('dueDate', ''),
                            "repeat": t.get('repeat', 'No Repeat')
                        }
                        break
        
        return ChatResponse(
            response=response_text,
            action=action,
            task=task,
            task_id=task_id,
            updated_task=updated_task
        )
    except Exception as e:
        return ChatResponse(
            response=f"Sorry, I'm having trouble right now. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
