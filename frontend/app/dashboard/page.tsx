'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: 'Low' | 'Medium' | 'High'
  category: string
  dueDate: string
  repeat: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [category, setCategory] = useState('Personal')
  const [dueDate, setDueDate] = useState('')
  const [repeat, setRepeat] = useState('No Repeat')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('All Priorities')
  const [sortBy, setSortBy] = useState('priority')
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'analytics'>('list')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hi! I\'m your AI assistant. Try saying "Add task to buy groceries" or "Show my tasks"' }
  ])
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
    
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      const defaultTask: Task[] = [{ id: 1, title: 'Welcome to AI Todo!', description: 'Try adding your first task', completed: false, priority: 'Medium', category: 'Personal', dueDate: '', repeat: 'No Repeat' }]
      setTasks(defaultTask)
      localStorage.setItem('tasks', JSON.stringify(defaultTask))
    }
  }, [router])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const addTask = () => {
    if (!title.trim()) return
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      priority,
      category,
      dueDate,
      repeat,
    }
    setTasks([...tasks, newTask])
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('Personal')
    setDueDate('')
    setRepeat('No Repeat')
    setShowAddForm(false)
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatInput('')
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log('API URL:', apiUrl)
    
    if (!apiUrl) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: API URL not configured. Please check environment variables.' 
      }])
      return
    }
    
    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ message: userMessage, tasks })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      
      if (data.action === 'add_task' && data.task) {
        const newTask = { ...data.task, id: Date.now() }
        setTasks(prev => {
          const updated = [...prev, newTask]
          localStorage.setItem('tasks', JSON.stringify(updated))
          return updated
        })
      }
      
      if (data.action === 'delete_task' && data.task_id) {
        setTasks(prev => {
          const updated = prev.filter(t => t.id !== data.task_id)
          localStorage.setItem('tasks', JSON.stringify(updated))
          return updated
        })
      }
      
      if (data.action === 'update_task' && data.task_id && data.updated_task) {
        setTasks(prev => {
          const updated = prev.map(t => 
            t.id === data.task_id ? { ...data.updated_task, id: t.id } : t
          )
          localStorage.setItem('tasks', JSON.stringify(updated))
          return updated
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check if the backend is running.` 
      }])
    }
  }

  if (!user) return null

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'All Priorities' || task.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700">
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-purple-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <span className="text-2xl font-bold text-purple-600">AI Todo</span>
            </div>
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
              🏠 Home
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">👋 {user?.name || user?.email}</span>
            <button onClick={handleLogout} className="text-purple-600 hover:text-purple-700 font-semibold">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            📝 Tasks
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            💬 AI Chat
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 border-2 border-purple-300">
                <div className="text-purple-600 text-sm font-semibold mb-1">Total Tasks</div>
                <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
                <div className="text-2xl mt-2">📋</div>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 border-2 border-green-300">
                <div className="text-green-600 text-sm font-semibold mb-1">Completed</div>
                <div className="text-3xl font-bold text-gray-800">{tasks.filter(t => t.completed).length}</div>
                <div className="text-2xl mt-2">✅</div>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 border-2 border-orange-300">
                <div className="text-orange-600 text-sm font-semibold mb-1">Pending</div>
                <div className="text-3xl font-bold text-gray-800">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-2xl mt-2">⏳</div>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 border-2 border-blue-300">
                <div className="text-blue-600 text-sm font-semibold mb-1">Completion Rate</div>
                <div className="text-3xl font-bold text-gray-800">{tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</div>
                <div className="text-2xl mt-2">📈</div>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-purple-600' : 'bg-white/50 text-white'}`}
              >
                📝 List View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'timeline' ? 'bg-white text-purple-600' : 'bg-white/50 text-white'}`}
              >
                🗓️ Timeline
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'analytics' ? 'bg-white text-purple-600' : 'bg-white/50 text-white'}`}
              >
                📊 Analytics
              </button>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 mb-6 border-2 border-purple-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-purple"
                />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="input-purple"
                >
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-purple"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn-purple">
                  {showAddForm ? '✖ Close Form' : '➕ Add New Task'}
                </button>
              </div>
            </div>

            {viewMode === 'list' && (
              <div>
                {showAddForm && (
                  <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-300">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4">➕ Add New Task</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title *</label>
                        <input
                          type="text"
                          placeholder="Enter task title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="input-purple w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                          placeholder="Add details (optional)"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength={500}
                          className="input-purple w-full h-24 resize-none"
                        />
                        <div className="text-xs text-gray-500 mt-1">{description.length}/500</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                            className="input-purple w-full"
                          >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-purple w-full"
                          >
                            <option>Personal</option>
                            <option>Work</option>
                            <option>Shopping</option>
                            <option>Health</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                          <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input-purple w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Repeat</label>
                          <select
                            value={repeat}
                            onChange={(e) => setRepeat(e.target.value)}
                            className="input-purple w-full"
                          >
                            <option>No Repeat</option>
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={addTask} className="btn-purple flex-1">
                          ➕ Add
                        </button>
                        <button
                          onClick={() => {
                            setTitle('')
                            setDescription('')
                            setPriority('Medium')
                            setCategory('Personal')
                            setDueDate('')
                            setRepeat('No Repeat')
                            setShowAddForm(false)
                          }}
                          className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold py-2 px-6 rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">📋 Your Tasks ({filteredTasks.length})</h2>
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white/95 backdrop-blur-md rounded-xl">
                      <p className="text-xl text-gray-500">No tasks found!</p>
                    </div>
                  ) : (
                    filteredTasks.map(task => (
                      <div key={task.id} className="card-purple">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.title}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                                {task.category}
                              </span>
                            </div>
                            {task.description && (
                              <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-300' : 'text-gray-600'}`}>
                                {task.description}
                              </p>
                            )}
                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                              {task.dueDate && <span>📅 {task.dueDate}</span>}
                              {task.repeat !== 'No Repeat' && <span>🔁 {task.repeat}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {viewMode === 'timeline' && (
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-8 border-2 border-purple-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🗓️ Timeline View</h3>
                <p className="text-gray-600">Timeline view coming soon...</p>
              </div>
            )}

            {viewMode === 'analytics' && (
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-8 border-2 border-purple-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Analytics</h3>
                <p className="text-gray-600">Analytics view coming soon...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-purple-300 overflow-hidden">
            <div className="bg-purple-600 text-white p-4">
              <h2 className="text-xl font-bold">🤖 AI Assistant</h2>
              <p className="text-purple-100 text-sm">Chat naturally to manage your tasks</p>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-purple-100 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..."
                  className="input-purple flex-1"
                />
                <button onClick={sendChatMessage} className="btn-purple">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 shadow-2xl transition-all duration-200 z-50 flex items-center justify-center text-2xl"
      >
        {showChatbot ? '✖' : '💬'}
      </button>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="fixed bottom-28 right-6 w-96 bg-white rounded-xl shadow-2xl border-2 border-purple-300 overflow-hidden z-50">
          <div className="bg-purple-600 text-white p-4">
            <h3 className="text-lg font-bold">🤖 AI Assistant</h3>
            <p className="text-purple-100 text-xs">Chat naturally to manage tasks</p>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-purple-100 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type your message..."
                className="input-purple flex-1 text-sm"
              />
              <button onClick={sendChatMessage} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
