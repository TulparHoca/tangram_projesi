import React, { useState, useCallback, useEffect } from 'react';
import { Shuffle, RotateCcw, Lightbulb, Trophy, BookOpen } from 'lucide-react';
import TangramPiece from './components/TangramPiece';
import PuzzleArea from './components/PuzzleArea';
import ShapeLibrary from './components/ShapeLibrary';
import Tutorial from './components/Tutorial';
import PiecePalette from './components/PiecePalette';
import { TangramPiece as TangramPieceType, Position, ShapeTemplate } from './types/tangram';
import { INITIAL_PIECES, SHAPE_TEMPLATES } from './data/tangram-data';

function App() {
  const [pieces, setPieces] = useState<TangramPieceType[]>(INITIAL_PIECES);
  const [currentShape, setCurrentShape] = useState<ShapeTemplate>(SHAPE_TEMPLATES.find(s => s.id === 'house') || SHAPE_TEMPLATES[0]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completedShapes, setCompletedShapes] = useState<string[]>([]);

  const resetPieces = useCallback(() => {
    setPieces(prevPieces => prevPieces.map(p => ({ ...p, onBoard: false, rotation: 0, scale: { x: 1, y: 1 } })));
  }, []);

  useEffect(() => {
    resetPieces();
  }, [currentShape, resetPieces]);

  const handlePieceMove = useCallback((id: string, position: Position) => {
    setPieces(prev => prev.map(p => (p.id === id ? { ...p, position } : p)));
  }, []);

  const handleSetRotation = useCallback((id: string, rotation: number) => {
    setPieces(prev => prev.map(p => (p.id === id ? { ...p, rotation } : p)));
  }, []);

  const handlePieceFlip = useCallback((id: string) => {
    setPieces(prev => prev.map(p => (p.id === id ? { ...p, scale: { ...p.scale, x: p.scale.x * -1 as (1 | -1) } } : p)));
  }, []);

  const handlePalettePieceClick = useCallback((id: string) => {
    setPieces(prev => prev.map(p => (p.id === id ? { ...p, onBoard: true, position: { x: 300, y: 180 } } : p)));
  }, []);

  const generateRandomShape = () => {
    const availableShapes = SHAPE_TEMPLATES.filter(s => !completedShapes.includes(s.id));
    const shapesToChooseFrom = availableShapes.length > 0 ? availableShapes : SHAPE_TEMPLATES;
    const randomIndex = Math.floor(Math.random() * shapesToChooseFrom.length);
    setCurrentShape(shapesToChooseFrom[randomIndex]);
    setShowHint(false);
  };

  const selectShape = (shape: ShapeTemplate) => {
    setCurrentShape(shape);
    setShowHint(false);
  };

  const checkSolution = () => {
    const solutionTemplate = currentShape.solution;
    if (!solutionTemplate || solutionTemplate.length === 0) {
      alert("Bu şekil için çözüm verisi bulunmuyor. Lütfen 'Ev' şeklini deneyin.");
      return;
    }
    
    const puzzleAreaContainer = document.querySelector('.lg\\:col-span-2.relative');
    if (!puzzleAreaContainer) {
      alert("Puzzle alanı bulunamadı!");
      return;
    }

    const positionTolerance = 35;
    const rotationTolerance = 15;
    let allPiecesCorrect = true;

    for (const solutionPiece of solutionTemplate) {
      const userPiece = pieces.find(p => p.id === solutionPiece.pieceId);
      if (!userPiece || !userPiece.onBoard) { allPiecesCorrect = false; break; }

      const relativeX = userPiece.position.x;
      const relativeY = userPiece.position.y;

      const dx = relativeX - solutionPiece.position.x;
      const dy = relativeY - solutionPiece.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > positionTolerance) { allPiecesCorrect = false; break; }

      const angleDiff = Math.abs(userPiece.rotation - solutionPiece.rotation) % 360;
      const normalizedAngleDiff = Math.min(angleDiff, 360 - angleDiff);
      if (normalizedAngleDiff > rotationTolerance) { allPiecesCorrect = false; break; }

      if (solutionPiece.scale) {
        if (userPiece.scale.x !== solutionPiece.scale.x || userPiece.scale.y !== solutionPiece.scale.y) {
          allPiecesCorrect = false;
          break;
        }
      }
    }

    if (allPiecesCorrect) {
      if (!completedShapes.includes(currentShape.id)) {
        setCompletedShapes(prev => [...prev, currentShape.id]);
        setScore(prev => prev + 100);
        alert(`🎉 Tebrikler! "${currentShape.name}" şeklini başarıyla tamamladınız!`);
      } else {
        alert("Bu şekli zaten tamamlamıştınız, ama yine de harika iş! 👍");
      }
    } else {
      alert("Neredeyse oldu! Bazı parçalar doğru yerde veya açıda değil. Tekrar deneyin. 🤔");
    }
  };

  const boardPieces = pieces.filter(p => p.onBoard);
  const palettePieces = pieces.filter(p => !p.onBoard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-sans">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Tangram Master
                </h1>
                <p className="text-sm text-gray-600">Zeka ve Sabır Oyunu</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Puan</div>
                <div className="font-bold text-lg text-purple-600">{score.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Tamamlanan</div>
                <div className="font-bold text-lg text-indigo-600">{completedShapes.length} / {SHAPE_TEMPLATES.length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" /> Kontroller
              </h3>
              <div className="space-y-3">
                <button onClick={generateRandomShape} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <Shuffle className="w-4 h-4" /> <span>Rastgele Şekil</span>
                </button>
                <button onClick={resetPieces} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <RotateCcw className="w-4 h-4" /> <span>Parçaları Sıfırla</span>
                </button>
                <button onClick={() => setShowHint(!showHint)} className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg ${showHint ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700'}`}>
                  <Lightbulb className="w-4 h-4" /> <span>{showHint ? 'İpucu Gizle' : 'İpucu Göster'}</span>
                </button>
                <button onClick={() => setShowTutorial(true)} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-3 rounded-xl font-medium hover:from-teal-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <BookOpen className="w-4 h-4" /> <span>Nasıl Oynanır?</span>
                </button>
              </div>
              <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Hedef Şekil</h3>
                <div className="text-5xl mb-2">{currentShape.icon}</div>
                <div className="font-medium text-indigo-600 text-lg">{currentShape.name}</div>
                <div className="text-sm text-gray-500 mt-1">Zorluk: {currentShape.difficulty}</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <PuzzleArea
                currentShape={currentShape}
                showHint={showHint}
                onCheckSolution={checkSolution}
              />
              <PiecePalette pieces={palettePieces} onPieceClick={handlePalettePieceClick} />
            </div>
            {boardPieces.map((piece) => (
              <TangramPiece
                key={piece.id}
                piece={piece}
                onMove={handlePieceMove}
                onSetRotation={handleSetRotation}
                onFlip={handlePieceFlip}
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <ShapeLibrary
            shapes={SHAPE_TEMPLATES}
            completedShapes={completedShapes}
            onSelectShape={selectShape}
            currentShapeId={currentShape.id}
          />
        </div>
      </main>
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
}

export default App;