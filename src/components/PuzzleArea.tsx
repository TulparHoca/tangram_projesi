import React from 'react';
import { ShapeTemplate } from '../types/tangram';
import { CheckCircle } from 'lucide-react';

interface PuzzleAreaProps {
  currentShape: ShapeTemplate;
  showHint: boolean;
  onCheckSolution: () => void;
}

const PuzzleArea: React.FC<PuzzleAreaProps> = ({ 
  currentShape, 
  showHint, 
  onCheckSolution 
}) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Puzzle Alanı - {currentShape.name}
        </h2>
        <button
          onClick={onCheckSolution}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Kontrol Et</span>
        </button>
      </div>

      <div
        className="puzzle-area relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden"
        style={{
          width: '100%',
          height: '450px',
          minHeight: '450px'
        }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Target shape outline (hint) */}
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-9xl opacity-10 animate-pulse">
              {currentShape.icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleArea;