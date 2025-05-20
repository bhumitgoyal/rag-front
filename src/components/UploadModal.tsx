import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, Check, AlertCircle, FileJson } from 'lucide-react';
import { JsonUpload } from './JsonUpload';
import { api } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'json'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Only CSV files are supported');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Only CSV files are supported');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await api.uploadFile(file);
      
      if (response.status === 'success') {
        onUploadSuccess();
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleJsonUploadSuccess = () => {
    onUploadSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scaleIn">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Upload Data</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Tabs */}
          <div className="flex mb-4 border-b border-slate-200 dark:border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'file'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('file')}
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                CSV File
              </div>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'json'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('json')}
            >
              <div className="flex items-center">
                <FileJson className="h-4 w-4 mr-2" />
                JSON Data
              </div>
            </button>
          </div>
          
          {/* Tab content */}
          {activeTab === 'file' ? (
            <>
              {/* File upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : file
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  {file ? (
                    <div className="flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                      <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                      <Upload className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  
                  {file ? (
                    <>
                      <p className="text-lg font-medium text-slate-800 dark:text-white mb-1">File ready to upload</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{file.name}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-slate-800 dark:text-white mb-1">
                        Drag & drop your CSV file here
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        or 
                        <button 
                          className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
                          onClick={handleUploadClick}
                        >
                          browse files
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mt-3 p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* Upload button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleFileUpload}
                  disabled={!file || isUploading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 flex items-center"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <JsonUpload onUploadSuccess={handleJsonUploadSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};