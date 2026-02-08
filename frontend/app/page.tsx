'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✨</span>
            <span className="text-2xl font-bold text-white">AI Todo</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-white hover:text-purple-200 font-semibold px-4 py-2">
              Login
            </Link>
            <Link href="/signup" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-2 px-6 rounded-lg transition-all duration-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Manage Your Tasks with
            <span className="text-purple-200"> AI Power</span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Experience the future of task management. Our AI-powered chatbot helps you organize, 
            prioritize, and complete your tasks effortlessly. Just chat naturally and let AI do the rest.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg">
              🚀 Start Free Today
            </Link>
            <Link href="/login" className="bg-white/10 border-2 border-white text-white hover:bg-white/20 font-semibold py-3 px-8 rounded-lg transition-all duration-200">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Why Choose AI Todo?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/50 hover:border-white">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Chatbot</h3>
            <p className="text-gray-600">
              Simply chat with our AI assistant to add, update, or complete tasks. 
              No complex forms - just natural conversation.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/50 hover:border-white">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              Built with modern technology for instant responses. 
              Your tasks sync in real-time across all devices.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/50 hover:border-white">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Beautiful Design</h3>
            <p className="text-gray-600">
              Gorgeous purple-themed interface that makes task management 
              a delightful experience every day.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/50 hover:border-white">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is encrypted and secure. We use industry-standard 
              authentication to keep your tasks private.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/50 hover:border-white">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Responsive Design</h3>
            <p className="text-gray-600">
              Works perfectly on desktop, tablet, and mobile. 
              Manage your tasks anywhere, anytime.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/50 hover:border-white">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Natural Language</h3>
            <p className="text-gray-600">
              Just say "Add task to buy groceries" or "Show my pending tasks" 
              and watch the magic happen.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-purple-800/50 backdrop-blur-sm text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-white text-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Sign Up Free</h3>
              <p className="text-purple-100">Create your account in seconds. No credit card required.</p>
            </div>
            <div className="text-center">
              <div className="bg-white text-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Chat with AI</h3>
              <p className="text-purple-100">Tell our AI what you need to do in plain English.</p>
            </div>
            <div className="text-center">
              <div className="bg-white text-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Things Done</h3>
              <p className="text-purple-100">Watch your productivity soar with AI assistance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border-2 border-white/30">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Join thousands of users who are already managing their tasks smarter with AI.
          </p>
          <Link href="/signup" className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-200 inline-block">
            Get Started Now - It's Free! 🎉
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900/50 backdrop-blur-sm text-white py-8 border-t border-white/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-200">
            © 2025 AI Todo App. Built with ❤️ for Hackathon Phase 2 & 3
          </p>
        </div>
      </footer>
    </div>
  )
}
