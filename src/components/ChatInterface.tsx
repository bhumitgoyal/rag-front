import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Upload, FileJson, AlertCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { UploadModal } from './UploadModal';
import { api, ChatResponse } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to Build Fast With AI RAG ChatBot ! Upload a CSV file or JSON data to start asking questions about your data.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUploadedData, setHasUploadedData] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!hasUploadedData) {
      setError('Please upload data first before asking questions.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.query(input);
      
      if (response.status === 'success') {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError('Failed to get response from the chatbot.');
      }
    } catch (err) {
      console.error('Error querying the chatbot:', err);
      setError('Failed to communicate with the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleUploadSuccess = () => {
    setHasUploadedData(true);
    setIsModalOpen(false);
    
    const successMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: 'Data uploaded successfully! You can now ask questions about your data.',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, successMessage]);
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Chat header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Chat with your data</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Data
        </button>
      </div>
      
      {/* Upload modal */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 flex items-center animate-fadeIn">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto mb-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        {isLoading && (
          <div className="flex justify-center items-center py-4 animate-fadeIn">
            <Loader2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="ml-2 text-slate-600 dark:text-slate-300">Thinking...</span>
          </div>
        )}
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustTextareaHeight(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your data..."
          className="w-full p-4 pr-12 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white resize-none transition-colors duration-200"
          rows={1}
          disabled={isLoading || !hasUploadedData}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !hasUploadedData}
          className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
      
      {!hasUploadedData && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-300 flex flex-col items-center animate-fadeIn">
          <div className="flex mb-2">
            <FileJson className="h-6 w-6 mr-2" />
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-center">Please upload a CSV file or JSON data to start chatting.</p>
        </div>
      )}
    </div>
  );
};