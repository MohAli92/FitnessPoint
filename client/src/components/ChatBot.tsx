import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

type Language = 'ar' | 'en' | 'de';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const languageTexts = {
  ar: {
    selectLanguage: 'اختر لغتك المفضلة / Choose your preferred language / Wählen Sie Ihre bevorzugte Sprache',
    welcome: 'مرحباً! أنا مساعدك الذكي في FitnessPoint. كيف يمكنني مساعدتك اليوم؟',
    placeholder: 'اكتب رسالتك...',
    error: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
    assistant: 'FitnessPoint Assistant'
  },
  en: {
    selectLanguage: 'Choose your preferred language / Wählen Sie Ihre bevorzugte Sprache / اختر لغتك المفضلة',
    welcome: 'Hello! I\'m your smart assistant at FitnessPoint. How can I help you today?',
    placeholder: 'Type your message...',
    error: 'Sorry, an error occurred. Please try again.',
    assistant: 'FitnessPoint Assistant'
  },
  de: {
    selectLanguage: 'Wählen Sie Ihre bevorzugte Sprache / Choose your preferred language / اختر لغتك المفضلة',
    welcome: 'Hallo! Ich bin Ihr intelligenter Assistent bei FitnessPoint. Wie kann ich Ihnen heute helfen?',
    placeholder: 'Schreiben Sie Ihre Nachricht...',
    error: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    assistant: 'FitnessPoint Assistent'
  }
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(() => {
    const saved = localStorage.getItem('chatbot-language');
    return (saved as Language) || null;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedLanguage && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: languageTexts[selectedLanguage].welcome,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedLanguage]);

  const selectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    localStorage.setItem('chatbot-language', lang);
    const welcomeMessage: Message = {
      id: 1,
      text: languageTexts[lang].welcome,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !selectedLanguage) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot`, {
        message: inputMessage,
        language: selectedLanguage
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('ChatBot error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: languageTexts[selectedLanguage].error,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open ChatBot"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
              <h3 className="font-semibold">
                {selectedLanguage ? languageTexts[selectedLanguage].assistant : 'FitnessPoint Assistant'}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Language Selection */}
          {!selectedLanguage && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-700 mb-3 text-center">
                {languageTexts.en.selectLanguage}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => selectLanguage('ar')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  العربية
                </button>
                <button
                  onClick={() => selectLanguage('en')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  English
                </button>
                <button
                  onClick={() => selectLanguage('de')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Deutsch
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedLanguage ? languageTexts[selectedLanguage].placeholder : 'Type your message...'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading || !selectedLanguage}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || !selectedLanguage}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
