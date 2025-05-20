import React from 'react';
import { Bot, User, Info } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  let bgColorClass = '';
  let textColorClass = '';
  let alignClass = '';
  let icon = null;
  
  switch (message.role) {
    case 'user':
      bgColorClass = 'bg-indigo-100 dark:bg-indigo-900/30';
      textColorClass = 'text-slate-800 dark:text-slate-100';
      alignClass = 'ml-auto';
      icon = <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      break;
    case 'assistant':
      bgColorClass = 'bg-teal-100 dark:bg-teal-900/30';
      textColorClass = 'text-slate-800 dark:text-slate-100';
      alignClass = 'mr-auto';
      icon = <Bot className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      break;
    case 'system':
      bgColorClass = 'bg-slate-100 dark:bg-slate-700/50';
      textColorClass = 'text-slate-600 dark:text-slate-300';
      alignClass = 'mx-auto';
      icon = <Info className="h-5 w-5 text-slate-500 dark:text-slate-400" />;
      break;
  }
  
  const maxWidthClass = message.role === 'system' ? 'max-w-full' : 'max-w-[80%] md:max-w-[70%]';
  
  return (
    <div className={`${alignClass} ${maxWidthClass} animate-messageIn`}>
      <div className={`rounded-lg px-4 py-3 shadow-sm ${bgColorClass} ${textColorClass}`}>
        <div className="flex items-center mb-1">
          {icon}
          <span className="font-medium ml-2 capitalize">{message.role}</span>
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{formattedTime}</span>
        </div>
        <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};