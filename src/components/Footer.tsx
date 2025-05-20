import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center mb-2 sm:mb-0">
            <span>© {new Date().getFullYear()} 
             | Build Fast With AI</span>
          </div>
          <div className="flex items-center">
            <span>Made by Bhumit Goyal</span>
            <Heart className="h-4 w-4 mx-1 text-rose-500 animate-pulse" />
            <span>and RAG technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};