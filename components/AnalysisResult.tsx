import React from 'react';
import { PlanetAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Globe, Skull, ThermometerSun, CheckCircle2, XCircle } from 'lucide-react';

interface AnalysisResultProps {
  data: PlanetAnalysis;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
  const similarityData = [
    { name: 'เหมือนโลก', value: data.earthSimilarityPercentage },
    { name: 'แตกต่าง', value: 100 - data.earthSimilarityPercentage },
  ];

  const COLORS = ['#3b82f6', '#1e293b'];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 border-b border-slate-700 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="text-blue-400 w-8 h-8" />
              {data.planetName}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {data.isSolarSystem ? (
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 size={16} /> ระบบสุริยะจักรวาล
                </span>
              ) : (
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <XCircle size={16} /> นอกระบบสุริยะ (Exoplanet)
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-400">คะแนนการอยู่อาศัยได้</div>
            <div className={`text-4xl font-bold ${data.habitabilityScore > 50 ? 'text-green-400' : 'text-red-400'}`}>
              {data.habitabilityScore}/100
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          
          {/* Left Column: Similarity Chart */}
          <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-blue-200 mb-4">ความเหมือนโลก (ESI)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={similarityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {similarityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                    {data.earthSimilarityPercentage}%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-slate-400 text-center text-sm mt-2">Earth Similarity Index</p>
          </div>

          {/* Right Column: Text Analysis */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                <ThermometerSun size={20} /> องค์ประกอบและสภาพแวดล้อม
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {data.compositionComparison}
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                <Skull size={20} /> ความเป็นไปได้ในการอยู่อาศัย
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {data.habitabilityAnalysis}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 text-center">
          <button 
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]"
          >
            วิเคราะห์ภาพใหม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;