import React, { useState } from 'react';
import { Rocket, AlertCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import { analyzePlanetImage, fileToGenerativePart } from './services/geminiService';
import { saveAnalysisToSupabase } from './services/dbService';
import { AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
    imagePreview: null,
  });

  const handleImageSelect = async (file: File) => {
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      imagePreview: previewUrl,
      result: null
    }));

    try {
      // 1. Analyze with Gemini AI
      const base64Data = await fileToGenerativePart(file);
      const result = await analyzePlanetImage(base64Data, file.type);
      
      // 2. Save to Supabase (Fire and forget - or await if you want to ensure save)
      // We don't want to block the UI if the DB save fails, so we just log errors inside the service
      saveAnalysisToSupabase(result).catch(err => {
        console.error("Background Save Failed:", err);
      });

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        result: result 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ' 
      }));
    }
  };

  const handleReset = () => {
    if (state.imagePreview) {
      URL.revokeObjectURL(state.imagePreview);
    }
    setState({
      isLoading: false,
      result: null,
      error: null,
      imagePreview: null,
    });
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden stars">
      {/* Navbar */}
      <nav className="w-full p-6 flex items-center justify-center md:justify-between max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            AstroAnalyze
          </h1>
        </div>
        <div className="hidden md:block text-sm text-slate-400">
          ระบบวิเคราะห์ดาวเคราะห์อัจฉริยะสำหรับนักศึกษา
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] p-4">
        
        {!state.result && (
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-xl">
              ค้นหาความลับ<br />
              <span className="text-blue-400">แห่งจักรวาล</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8">
              อัปโหลดภาพถ่ายดาวเคราะห์เพื่อระบุชื่อ ตรวจสอบพิกัดในระบบสุริยะ 
              และวิเคราะห์ความเป็นไปได้ในการตั้งถิ่นฐานของมนุษย์ด้วย AI
            </p>
          </div>
        )}

        {state.error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 max-w-xl animate-shake">
            <AlertCircle size={24} />
            <p>{state.error}</p>
            <button onClick={handleReset} className="underline ml-auto text-sm">ลองใหม่</button>
          </div>
        )}

        {!state.result ? (
          <div className="w-full flex flex-col items-center gap-8">
             {state.imagePreview && (
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse-slow">
                <img 
                  src={state.imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
              </div>
             )}
             
             <ImageUploader 
              onImageSelected={handleImageSelect} 
              isLoading={state.isLoading} 
             />
          </div>
        ) : (
          <AnalysisResult data={state.result} onReset={handleReset} />
        )}

      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

    </div>
  );
};

export default App;