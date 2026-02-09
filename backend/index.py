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
        
        # Create task context
        task_list = "\n".join([f"- {t.get('title')}" for t in request.tasks]) if request.tasks else "No tasks yet"
        
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": f"""You are a friendly AI assistant for a todo app. Be conversational and helpful.

User's current tasks:
{task_list}

When user wants to:
- Add a task: Be encouraging and confirm
- Delete a task: Confirm which one
- View tasks: Summarize them nicely
- Chat casually: Respond naturally but remind them you can help with tasks

Be brief, friendly, and natural. Use emojis occasionally."""},
                {"role": "user", "content": request.message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=150,
        )
        
        response_text = completion.choices[0].message.content
        message_lower = request.message.lower()
        action = None
        task = None
        task_id = None
        
        # Detect add task intent
        if any(word in message_lower for word in ["add", "create", "new task", "remind me"]):
            task_title = request.message
            for phrase in ["add task to ", "add task ", "add ", "create ", "remind me to ", "new task "]:
                if phrase in message_lower:
                    idx = message_lower.index(phrase)
                    task_title = request.message[idx + len(phrase):].strip()
                    break
            
            # Clean up task title
            task_title = task_title.strip('"\'.!?')
            
            if task_title and len(task_title) > 2:
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
        
        # Detect delete task intent
        elif any(word in message_lower for word in ["delete", "remove", "done with", "completed"]):
            for t in request.tasks:
                title_lower = t.get('title', '').lower()
                if title_lower in message_lower and title_lower != "welcome to ai todo!":
                    action = "delete_task"
                    task_id = t.get('id')
                    break
        
        return ChatResponse(response=response_text, action=action, task=task, task_id=task_id)
    except Exception as e:
        return ChatResponse(response=f"Oops! Something went wrong: {str(e)}")
