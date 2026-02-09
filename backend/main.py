from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(title="AI Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks_db = {}

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""

class ChatRequest(BaseModel):
    message: str
    tasks: List[dict] = []

class ChatResponse(BaseModel):
    response: str
    action: Optional[str] = None
    task: Optional[dict] = None
    task_id: Optional[int] = None
    updated_task: Optional[dict] = None

@app.get("/")
def read_root():
    return {"message": "AI Todo API is running", "version": "1.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

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

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        from groq import Groq
        groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a todo app. Help users manage their tasks naturally. Be concise."},
                {"role": "user", "content": f"Tasks: {[t.get('title') for t in request.tasks]}\n\nMessage: {request.message}"}
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
        
        if "add" in message_lower or "create" in message_lower:
            task_title = request.message
            for phrase in ["add task to ", "add task ", "create task ", "add ", "create "]:
                if phrase in message_lower:
                    task_title = request.message[message_lower.index(phrase) + len(phrase):].strip()
                    break
            if task_title and not any(word in task_title.lower() for word in ['show', 'list', 'view']):
                action = "add_task"
                task = {"title": task_title, "description": "", "completed": False, "priority": "Medium", "category": "Personal", "dueDate": "", "repeat": "No Repeat"}
        
        elif "delete" in message_lower or "remove" in message_lower:
            for t in request.tasks:
                if t.get('title', '').lower() in message_lower:
                    action = "delete_task"
                    task_id = t.get('id')
                    break
        
        return ChatResponse(response=response_text, action=action, task=task, task_id=task_id)
    except Exception as e:
        return ChatResponse(response=f"Error: {str(e)}")
