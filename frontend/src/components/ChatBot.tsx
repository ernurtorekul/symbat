import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../types/quiz';
import { ChatbotService } from '../services/chatbotService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
  quickActions?: string[];
}

interface ChatBotProps {
  onClose: () => void;
  products: Product[];
  userQuizData?: any;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose, products, userQuizData }) => {
  const [chatbotService] = useState(() => new ChatbotService(products, userQuizData));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your Smart Beauty Assistant powered by AI. I can help you find the perfect makeup products for your skin type and concerns. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      quickActions: [
        "Find products for my skin type",
        "Compare products",
        "Tell me about ingredients",
        "Recommend budget-friendly options"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = async (userInput: string): Promise<ChatMessage> => {
    try {
      // Build conversation history for OpenAI
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'system')
        .map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' as const : msg.sender as 'user',
          content: msg.text
        }));

      const response = await chatbotService.generateResponse(userInput, conversationHistory);

      return {
        id: Date.now().toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        products: response.products,
        quickActions: response.quickActions
      };
    } catch (error) {
      console.error('Error generating bot response:', error);
      return {
        id: Date.now().toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date(),
        quickActions: ["Find products for my skin type", "Tell me about ingredients"]
      };
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating bot response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Minimized Button */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {!isMinimized && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[600px] max-h-[80vh] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Beauty Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  } rounded-lg p-3`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>

                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            // Close chatbot and navigate to product detail
                            onClose();
                            window.location.hash = `/products/${product.id}`;
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                              <p className="text-gray-600 text-xs">{product.brand}</p>
                              {product.price && (
                                <p className="text-green-600 font-semibold text-sm">${product.price}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action)}
                          className="bg-white border border-blue-300 text-blue-600 text-xs px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about products, ingredients, or skincare..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18-9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;