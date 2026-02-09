from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

tasks_db = {}

class ChatRequest(BaseModel):
    message: str
    tasks: List[dict] = []

class ChatResponse(BaseModel):
    response: str
    action: Optional[str] = None
    task: Optional[dict] = None
    task_id: Optional[int] = None

@app.get("/")
def root():
    return {"message": "AI Todo API", "version": "1.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.options("/chat")
def chat_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        from groq import Groq
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a todo app. Be concise."},
                {"role": "user", "content": f"Tasks: {[t.get('title') for t in request.tasks]}\nMessage: {request.message}"}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=200,
        )
        
        response_text = completion.choices[0].message.content
        message_lower = request.message.lower()
        action = None
        task = None
        task_id = None
        
        if "add" in message_lower:
            task_title = request.message
            for phrase in ["add task to ", "add task ", "add ", "create "]:
                if phrase in message_lower:
                    task_title = request.message[message_lower.index(phrase) + len(phrase):].strip()
                    break
            if task_title:
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
