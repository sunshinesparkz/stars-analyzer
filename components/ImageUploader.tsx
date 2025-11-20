import React, { useRef, useState } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
          ${dragActive ? 'border-blue-400 bg-blue-900/20' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'}
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
          bg-slate-900/60 backdrop-blur-sm
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          {isLoading ? (
            <div className="animate-spin text-blue-400">
              <Loader2 size={64} />
            </div>
          ) : (
            <div className="bg-slate-800 p-4 rounded-full border border-slate-700 shadow-inner">
              <Upload className="text-blue-400 w-10 h-10" />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isLoading ? 'กำลังวิเคราะห์ข้อมูล...' : 'อัปโหลดภาพดาวเคราะห์'}
            </h3>
            <p className="text-slate-400 text-sm">
              {isLoading ? 'AI กำลังเปรียบเทียบองค์ประกอบกับฐานข้อมูล' : 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4">
          <ImageIcon className="text-slate-700 w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;