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
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForLanguage, setIsWaitingForLanguage] = useState(false);
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
    // Ask for language automatically when opening if no language selected
    if (isOpen && !selectedLanguage && messages.length === 0) {
      setIsWaitingForLanguage(true);
      const languageQuestion: Message = {
        id: Date.now(),
        text: 'Hello! 👋\n\nWhich language do you prefer? / Welche Sprache bevorzugen Sie? / أي لغة تفضّل؟\n\nPlease choose:\n1️⃣ English\n2️⃣ Deutsch (German)\n3️⃣ العربية (Arabic)\n\nOr click the buttons below ⬇️',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([languageQuestion]);
    }
  }, [isOpen, selectedLanguage, messages.length]);

  // Reset language and messages when closing ChatBot
  useEffect(() => {
    if (!isOpen) {
      setSelectedLanguage(null);
      setMessages([]);
      setIsWaitingForLanguage(false);
      setInputMessage('');
    }
  }, [isOpen]);

  const selectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setIsWaitingForLanguage(false);
    localStorage.setItem('chatbot-language', lang);
    const welcomeMessage: Message = {
      id: Date.now(),
      text: languageTexts[lang].welcome,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // If no language selected, show language selection message
      if (!selectedLanguage) {
        setIsWaitingForLanguage(true);
        const languageQuestion: Message = {
          id: Date.now() + 1,
          text: 'Hello! 👋\n\nWhich language do you prefer? / Welche Sprache bevorzugen Sie? / أي لغة تفضّل؟\n\nPlease choose:\n1️⃣ English\n2️⃣ Deutsch (German)\n3️⃣ العربية (Arabic)\n\nOr click the buttons below ⬇️',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, languageQuestion]);
        setIsLoading(false);
        return;
      }

      // Check if user is selecting language
      const lowerMessage = currentMessage.toLowerCase().trim();
      if (isWaitingForLanguage || lowerMessage === '1' || lowerMessage === 'english' || 
          lowerMessage === '2' || lowerMessage === 'deutsch' || lowerMessage === 'german' ||
          lowerMessage === '3' || lowerMessage === 'عربي' || lowerMessage === 'arabic' || lowerMessage === 'العربية') {
        if (lowerMessage === '1' || lowerMessage === 'english') {
          selectLanguage('en');
        } else if (lowerMessage === '2' || lowerMessage === 'deutsch' || lowerMessage === 'german') {
          selectLanguage('de');
        } else if (lowerMessage === '3' || lowerMessage === 'عربي' || lowerMessage === 'arabic' || lowerMessage === 'العربية') {
          selectLanguage('ar');
        } else {
          // If unclear, ask again
          setIsWaitingForLanguage(true);
          const askAgain: Message = {
            id: Date.now() + 1,
            text: 'Please choose a language:\n\n1️⃣ English\n2️⃣ Deutsch (German)\n3️⃣ العربية (Arabic)\n\nOr click the buttons below ⬇️',
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, askAgain]);
        }
        setIsLoading(false);
        return;
      }

      // Normal message with selected language
      const response = await axios.post(`${API_URL}/chatbot`, {
        message: currentMessage,
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
      const errorText = selectedLanguage ? languageTexts[selectedLanguage].error : 'Sorry, an error occurred. Please try again.';
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
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
        className="fixed bottom-6 right-6 z-[9998] bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
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
        <div className="fixed bottom-24 right-6 z-[9999] w-96 h-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
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

          {/* Language Selection Buttons (shown when waiting for language) */}
          {isWaitingForLanguage && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-700 mb-3 text-center font-medium">
                Choose your language / اختر لغتك / Wählen Sie Ihre Sprache
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => selectLanguage('en')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  English
                </button>
                <button
                  onClick={() => selectLanguage('de')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  Deutsch
                </button>
                <button
                  onClick={() => selectLanguage('ar')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  العربية
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
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
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
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
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
