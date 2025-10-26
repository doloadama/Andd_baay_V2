import React, { useState, useEffect, useRef } from 'react';
import { User, Harvest, ChatMessage } from '../types';
import { api } from '../services/api';
import { Chat } from '@google/genai';
import ChatbotIcon from './ChatbotIcon';

interface ChatbotProps {
  currentUser: User;
  allUsers: User[];
  marketListings: Harvest[];
}

const Chatbot: React.FC<ChatbotProps> = ({ currentUser, allUsers, marketListings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session when component mounts or user data changes
    if (currentUser) {
      chatSessionRef.current = api.startChatSession(currentUser, allUsers, marketListings);
      setMessages([{
        role: 'model',
        parts: [{ text: `Hello ${currentUser.name}! I'm your Andd Baay assistant. How can I help you manage your farm today?` }]
      }]);
    }
  }, [currentUser, allUsers, marketListings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Open chatbot"
      >
        <ChatbotIcon />
      </button>

      <div className={`fixed bottom-20 right-6 w-full max-w-sm h-[60vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Andd Baay Helper</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.parts[0].text.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your farm..."
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default Chatbot;
