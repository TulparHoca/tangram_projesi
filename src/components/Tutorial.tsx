import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Tangram Nedir?",
      content: "Tangram, yedi geometrik parçadan oluşan geleneksel bir Çin puzzle oyunudur. Bu parçalarla sayısız farklı şekil oluşturabilirsiniz!",
      image: "🧩",
      tips: ["7 parça: 2 büyük üçgen, 1 orta üçgen, 2 küçük üçgen, 1 kare, 1 paralelkenar"]
    },
    {
      title: "Parçaları Nasıl Hareket Ettirirsiniz?",
      content: "Tangram parçalarını sürükle-bırak yöntemiyle hareket ettirebilirsiniz. Parçaları döndürmek için çift tıklayın.",
      image: "👆",
      tips: ["Parçayı sürükleyin", "Çift tıklayarak döndürün", "Mobilde dokunup kaydırın"]
    },
    {
      title: "Hedef Şekilleri",
      content: "Her seviyede oluşturmanız gereken bir hedef şekil vardır. Tüm 7 parçayı kullanarak bu şekli oluşturmaya çalışın.",
      image: "🎯",
      tips: ["Tüm parçaları kullanın", "Parçalar üst üste gelmemeli", "Boşluk bırakmayın"]
    },
    {
      title: "İpucu Sistemi",
      content: "Zorlandığınızda ipucu butonunu kullanabilirsiniz. Bu size hedef şeklin ana hatlarını gösterecektir.",
      image: "💡",
      tips: ["İpucu butonu ile yardım alın", "Zorluk seviyesine dikkat edin", "Sabırlı olun!"]
    },
    {
      title: "Puan ve İlerleme",
      content: "Her tamamladığınız şekil için puan kazanırsınız. Farklı zorluk seviyelerinde farklı puanlar vardır.",
      image: "🏆",
      tips: ["Kolay: 100 puan", "Orta: 200 puan", "Zor: 300 puan"]
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Tangram Tutorial</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Adım {currentStep + 1} / {tutorialSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentTutorial.image}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {currentTutorial.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {currentTutorial.content}
            </p>
          </div>

          {/* Tips */}
          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <div className="text-sm font-medium text-indigo-800 mb-2">💡 İpuçları:</div>
            <ul className="text-sm text-indigo-700 space-y-1">
              {currentTutorial.tips.map((tip, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Önceki</span>
          </button>

          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-indigo-600'
                    : index < currentStep
                    ? 'bg-indigo-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === tutorialSteps.length - 1 ? (
            <button
              onClick={onClose}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Oyuna Başla</span>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;