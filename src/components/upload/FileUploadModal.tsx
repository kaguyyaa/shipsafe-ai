'use client';

import React, { useState, useRef } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Upload, FileCode, X, CheckCircle2, Sparkles, Code2, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const { uploadCodeFile } = useDemo();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedCode, setPastedCode] = useState('');
  const [fileName, setFileName] = useState('customService.ts');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileRead = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await uploadCodeFile(content, file.name);
      setIsProcessing(false);
      onClose();
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  };

  const handlePastedSubmit = async () => {
    if (!pastedCode.trim()) return;
    setIsProcessing(true);
    await uploadCodeFile(pastedCode, fileName || 'customService.ts');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col font-mono">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Code / Repository File</h2>
              <p className="text-xs text-slate-400 font-sans">Run Real SAST vulnerability analysis & IBM Bob fixes on your code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-4 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={clsx(
              'pb-3 font-bold uppercase tracking-wider transition border-b-2 flex items-center gap-2',
              activeTab === 'upload' ? 'text-blue-400 border-blue-500' : 'text-slate-400 border-transparent hover:text-slate-200'
            )}
          >
            <FileCode className="w-4 h-4" />
            <span>Upload File</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={clsx(
              'pb-3 font-bold uppercase tracking-wider transition border-b-2 flex items-center gap-2',
              activeTab === 'paste' ? 'text-blue-400 border-blue-500' : 'text-slate-400 border-transparent hover:text-slate-200'
            )}
          >
            <Code2 className="w-4 h-4" />
            <span>Paste Code Directly</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'upload' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3',
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".ts,.js,.json,.py,.java,.cpp,.cs,.go"
                onChange={(e) => e.target.files?.[0] && handleFileRead(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Click to browse or drag & drop source code file</p>
                <p className="text-xs text-slate-400 font-sans mt-1">Supports TypeScript (.ts), JavaScript (.js), Python (.py), JSON (.json), etc.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">File Name:</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="customService.ts"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Source Code Content:</label>
                <textarea
                  rows={8}
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                  placeholder="// Paste your TypeScript / JavaScript code here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-sans">
            ShipSafe Real SAST engine will scan your code for bugs and security vulnerabilities.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            {activeTab === 'paste' && (
              <button
                onClick={handlePastedSubmit}
                disabled={!pastedCode.trim() || isProcessing}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Code</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
