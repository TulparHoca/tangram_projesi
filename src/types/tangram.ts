export interface Position {
  x: number;
  y: number;
}

export interface TangramPiece {
  id: string;
  type: 'large-triangle' | 'medium-triangle' | 'small-triangle' | 'square' | 'parallelogram';
  color: string;
  position: Position;
  rotation: number;
  points: string;
  scale: { x: 1 | -1; y: 1 | -1 };
}

export interface ShapeTemplate {
  id: string;
  name: string;
  icon: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  category: 'Hayvan' | 'Nesne' | 'İnsan' | 'Doğa';
  solution: {
    pieceId: string;
    position: Position;
    rotation: number;
    scale?: { x: 1 | -1; y: 1 | -1; }; // <-- HATA GİDEREN EKLENTİ BURADA
  }[];
}

export interface GameState {
  score: number;
  completedShapes: string[];
  currentLevel: number;
  hintsUsed: number;
}