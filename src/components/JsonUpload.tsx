import React, { useState } from 'react';
import { FileJson, Loader2, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface JsonUploadProps {
  onUploadSuccess: () => void;
}

export const JsonUpload: React.FC<JsonUploadProps> = ({ onUploadSuccess }) => {
  const [jsonData, setJsonData] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateJson = (json: string): boolean => {
    try {
      if (!json.trim()) return false;
      
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (err) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonData(value);
    
    if (value.trim()) {
      const valid = validateJson(value);
      setIsValid(valid);
      setError(valid ? null : 'Invalid JSON format. Data should be an array of objects.');
    } else {
      setIsValid(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!jsonData.trim() || !isValid) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const parsedData = JSON.parse(jsonData);
      const response = await api.uploadJson(parsedData);
      
      if (response.status === 'success') {
        onUploadSuccess();
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading JSON:', err);
      setError('Failed to upload JSON data. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label 
          htmlFor="json-data" 
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Paste your JSON array data:
        </label>
        <div className="relative">
          <textarea
            id="json-data"
            value={jsonData}
            onChange={handleChange}
            placeholder='[{"column1": "value1", "column2": "value2"}, ...]'
            className={`w-full h-60 p-3 bg-white dark:bg-slate-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white resize-none transition-all ${
              isValid === true
                ? 'border-green-500 dark:border-green-700'
                : isValid === false
                ? 'border-rose-500 dark:border-rose-700'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {isValid === true && (
            <div className="absolute top-3 right-3 bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Data must be a JSON array of objects with the same structure
        </p>
      </div>
      
      {/* Example */}
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <div className="flex items-center mb-1">
          <FileJson className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-2" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Example format:</span>
        </div>
        <pre className="text-xs overflow-x-auto text-slate-600 dark:text-slate-400">
{`[
  {"name": "Product A", "price": 10.99, "category": "Electronics"},
  {"name": "Product B", "price": 24.99, "category": "Home"}
]`}
        </pre>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Upload button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!isValid || isUploading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FileJson className="h-4 w-4 mr-2" />
              Upload JSON
            </>
          )}
        </button>
      </div>
    </div>
  );
};