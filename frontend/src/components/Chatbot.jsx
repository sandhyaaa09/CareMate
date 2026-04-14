import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { getGeminiChatSession } from '../services/geminiService';
import { medicationService, appointmentService } from '../services/api';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chat session when opened and user exists
  useEffect(() => {
    if (isOpen && user && !chatSession) {
      initializeChat();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    setIsTyping(true);
    let contextData = {};
    try {
      if (user.role === 'ROLE_PATIENT') {
        const [medsRes, apptsRes] = await Promise.all([
          medicationService.getAll(),
          appointmentService.getAll()
        ]);
        contextData = {
          medications: medsRes.data,
          appointments: apptsRes.data
        };
      } else if (user.role === 'ROLE_DOCTOR') {
        const apptsRes = await appointmentService.getAll();
        contextData = { appointments: apptsRes.data };
      }
    } catch (error) {
      console.error("Failed to load context for Careo", error);
    }

    const session = getGeminiChatSession(user.role, contextData);
    if (!session) {
      setMessages([{ role: 'bot', text: 'Sorry, my AI engine is not configured at the moment limit. Please check your API key.' }]);
      setIsTyping(false);
      return;
    }
    
    setChatSession(session);
    setMessages([
      { role: 'bot', text: `Hello ${user.fullName || ''}! I am Careo, your health assistant. How can I help you today?` }
    ]);
    setIsTyping(false);
  };

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || !chatSession) return;

    const userMessage = text.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage(userMessage);
      const response = await result.response;
      let textResponse = response.text();
      
      // Basic markdown replacement for bold text for simple rendering
      textResponse = textResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      setMessages(prev => [...prev, { role: 'bot', text: textResponse, isHtml: true }]);
    } catch (error) {
      console.error("Careo Error:", error);
      setMessages(prev => [
        ...prev, 
        { role: 'bot', text: "I'm having trouble connecting to my knowledge base right now. Please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (actionText) => {
    handleSend(actionText);
  };

  // Do not parse bot for unauthenticated users, or alternatively, prompt them to login.
  if (!user) return null;

  return (
    <div className="chatbot-wrapper">
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-icon">
            <Bot size={24} />
          </div>
          <div className="chatbot-header-info">
            <h3>Careo</h3>
            <p><span className="chatbot-status-dot"></span> Online</p>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}

          {messages.length === 1 && user.role === 'ROLE_PATIENT' && !isTyping && (
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => handleQuickAction("What are my upcoming appointments?")}>My Appointments</button>
              <button className="quick-action-btn" onClick={() => handleQuickAction("Remind me about my medications.")}>My Medications</button>
            </div>
          )}
          {messages.length === 1 && user.role === 'ROLE_DOCTOR' && !isTyping && (
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => handleQuickAction("Do I have pending requests?")}>Pending Requests</button>
              <button className="quick-action-btn" onClick={() => handleQuickAction("How do I manage patients?")}>App Help</button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isTyping || !chatSession}
          />
          <button 
            className="chatbot-send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping || !chatSession}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
