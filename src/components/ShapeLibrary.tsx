import React from 'react';
import { ShapeTemplate } from '../types/tangram';
import { Crown, Star, Award } from 'lucide-react';

interface ShapeLibraryProps {
  shapes: ShapeTemplate[];
  completedShapes: string[];
  onSelectShape: (shape: ShapeTemplate) => void;
  currentShapeId: string;
}

const ShapeLibrary: React.FC<ShapeLibraryProps> = ({
  shapes,
  completedShapes,
  onSelectShape,
  currentShapeId
}) => {
  const categories = ['Hayvan', 'Nesne', 'İnsan', 'Doğa'];
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'bg-green-100 text-green-700 border-green-200';
      case 'Orta': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Zor': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return <Star className="w-3 h-3" />;
      case 'Orta': return <Award className="w-3 h-3" />;
      case 'Zor': return <Crown className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Şekil Kütüphanesi</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-green-600">{completedShapes.length}</span> / {shapes.length} tamamlandı
        </div>
      </div>

      {categories.map((category) => {
        const categoryShapes = shapes.filter(shape => shape.category === category);
        const completedInCategory = categoryShapes.filter(shape => completedShapes.includes(shape.id)).length;
        
        return (
          <div key={category} className="mb-8 last:mb-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{category}</h3>
              <div className="text-sm text-gray-500">
                {completedInCategory}/{categoryShapes.length}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {categoryShapes.map((shape) => {
                const isCompleted = completedShapes.includes(shape.id);
                const isCurrent = currentShapeId === shape.id;
                
                return (
                  <button
                    key={shape.id}
                    onClick={() => onSelectShape(shape)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : isCompleted
                        ? 'border-green-400 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* Completion badge */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                    
                    {/* Current selection indicator */}
                    {isCurrent && (
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-2xl mb-2">{shape.icon}</div>
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        {shape.name}
                      </div>
                      
                      {/* Difficulty badge */}
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(shape.difficulty)}`}>
                        {getDifficultyIcon(shape.difficulty)}
                        <span>{shape.difficulty}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Progress bar */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Genel İlerleme</span>
          <span className="text-sm text-gray-600">
            {Math.round((completedShapes.length / shapes.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedShapes.length / shapes.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShapeLibrary;