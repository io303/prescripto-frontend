import React, { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const QUICK_PROMPTS = [
  { label: '🤒 I have fever', text: 'I have fever and body pain, which doctor should I see?' },
  { label: '🧴 Skin problem', text: 'I have a skin rash and itching problem' },
  { label: '👶 Child is sick', text: 'My child has cold and cough, which doctor?' },
  { label: '🤰 Women health', text: 'I need help with women health related issues' },
  { label: '🧠 Headache', text: 'I am having severe headaches and migraines' },
  { label: '📅 Book appointment', text: 'How do I book an appointment?' },
]

const Chatbot = () => {
  const { backendUrl, userData } = useContext(AppContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! 🙏 I'm **Raya**, your AI health assistant at Prescripto.\n\nI can help you:\n• Find the right doctor for your symptoms\n• Guide you through booking an appointment\n• Answer basic health questions\n\nHow are you feeling today? Tell me your symptoms or choose a quick option below! 😊`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setShowQuick(false)

    try {
      const { data } = await axios.post(`${backendUrl}/api/chat/message`, {
        messages: newMessages,
        userInfo: userData ? { name: userData.name, phone: userData.phone } : null,
      })

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting right now. Please try again in a moment. 🙏',
      }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Namaste! 🙏 I'm **Raya**, your AI health assistant.\n\nHow can I help you today?`,
    }])
    setShowQuick(true)
    setInput('')
  }

  // Format markdown-like text
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .replace(/\n/g, '<br/>')
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(59,130,246,0.45))' }}
        >
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
            <span className="text-2xl">🩺</span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></span>
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with Raya AI 👋
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'h-14 w-80' : 'w-96 h-[580px]'
          }`}
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(59,130,246,0.1)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
                  🩺
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600"></span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Raya</p>
                <p className="text-blue-200 text-xs mt-0.5">AI Health Assistant • Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="w-7 h-7 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center text-white text-xs transition"
                title="New chat"
              >🔄</button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-7 h-7 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center text-white text-sm transition"
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsMinimized(false) }}
                className="w-7 h-7 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center text-white text-sm transition"
              >✕</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm shrink-0 mt-1">
                        🩺
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
                    />
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white shrink-0 mt-1 font-bold">
                        {userData?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading */}
                {loading && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm shrink-0">🩺</div>
                    <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                    </div>
                  </div>
                )}

                {/* Quick Prompts */}
                {showQuick && !loading && (
                  <div className="flex flex-col gap-2 mt-1">
                    <p className="text-xs text-gray-400 text-center">Quick options</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q.text)}
                          className="text-xs bg-white border border-blue-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Doctor Button - shows after recommendations */}
                {messages.length > 2 && !loading && (
                  <div className="flex justify-center mt-1">
                    <button
                      onClick={() => { navigate('/doctors'); setIsOpen(false) }}
                      className="text-xs bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-1.5"
                    >
                      👨‍⚕️ View All Doctors & Book
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl shrink-0">
                <div className="flex items-end gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-blue-400 transition">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Describe your symptoms..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-gray-800 resize-none outline-none placeholder-gray-400 max-h-20"
                    style={{ minHeight: '24px' }}
                    onInput={e => {
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-center text-xs text-gray-300 mt-1.5">Powered by Prescripto AI · Not a substitute for medical advice</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Chatbot
