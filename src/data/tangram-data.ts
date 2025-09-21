import { TangramPiece, ShapeTemplate } from '../types/tangram';

export const INITIAL_PIECES: TangramPiece[] = [
  {
    id: 'large-triangle-1',
    type: 'large-triangle',
    color: '#3B82F6', // Blue
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 100,0 50,50',
    scale: { x: 1, y: 1 }
  },
  {
    id: 'large-triangle-2',
    type: 'large-triangle',
    color: '#EF4444', // Red
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 100,0 50,50',
    scale: { x: 1, y: 1 }
  },
  {
    id: 'medium-triangle',
    type: 'medium-triangle',
    color: '#10B981', // Green
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 70,0 35,35',
    scale: { x: 1, y: 1 }
  },
  {
    id: 'small-triangle-1',
    type: 'small-triangle',
    color: '#F59E0B', // Orange
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 50,0 25,25',
    scale: { x: 1, y: 1 }
  },
  {
    id: 'small-triangle-2',
    type: 'small-triangle',
    color: '#8B5CF6', // Purple
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 50,0 25,25',
    scale: { x: 1, y: 1 }
  },
  {
    id: 'square',
    type: 'square',
    color: '#EC4899', // Pink
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 35,0 35,35 0,35',
    scale: { x: 1, y: 1 }
  },
  {
    id: 'parallelogram',
    type: 'parallelogram',
    color: '#06B6D4', // Cyan
    position: { x: 0, y: 0 },
    rotation: 0,
    points: '0,0 50,0 65,25 15,25',
    scale: { x: 1, y: 1 }
  }
];

export const SHAPE_TEMPLATES: ShapeTemplate[] = [
  { id: 'dog', name: 'Köpek', icon: '🐕', difficulty: 'Kolay', category: 'Hayvan', solution: [] },
  { id: 'cat', name: 'Kedi', icon: '🐱', difficulty: 'Kolay', category: 'Hayvan', solution: [] },
  { id: 'fish', name: 'Balık', icon: '🐟', difficulty: 'Kolay', category: 'Hayvan', solution: [] },
  { id: 'bird', name: 'Kuş', icon: '🐦', difficulty: 'Orta', category: 'Hayvan', solution: [] },
  { id: 'rabbit', name: 'Tavşan', icon: '🐰', difficulty: 'Orta', category: 'Hayvan', solution: [] },
  { id: 'swan', name: 'Kuğu', icon: '🦢', difficulty: 'Zor', category: 'Hayvan', solution: [] },
  {
    id: 'house',
    name: 'Ev',
    icon: '🏠',
    difficulty: 'Kolay',
    category: 'Nesne',
    solution: [
      { pieceId: 'large-triangle-1', position: { x: 125, y: 50 }, rotation: 135, scale: { x: 1, y: 1 } },
      { pieceId: 'large-triangle-2', position: { x: 225, y: 50 }, rotation: 225, scale: { x: 1, y: 1 } },
      { pieceId: 'medium-triangle', position: { x: 250, y: 175 }, rotation: 135, scale: { x: 1, y: 1 } },
      { pieceId: 'small-triangle-1', position: { x: 100, y: 250 }, rotation: 270, scale: { x: 1, y: 1 } },
      { pieceId: 'small-triangle-2', position: { x: 175, y: 100 }, rotation: 45, scale: { x: 1, y: 1 } },
      { pieceId: 'square', position: { x: 100, y: 175 }, rotation: 45, scale: { x: 1, y: 1 } },
      { pieceId: 'parallelogram', position: { x: 150, y: 250 }, rotation: 0, scale: { x: -1, y: 1 } }
    ]
  },
  { id: 'tree', name: 'Ağaç', icon: '🌲', difficulty: 'Orta', category: 'Doğa', solution: [] },
  { id: 'person-sitting', name: 'Oturan Kişi', icon: '🧘', difficulty: 'Orta', category: 'İnsan', solution: [] },
  { id: 'person-running', name: 'Koşan Kişi', icon: '🏃', difficulty: 'Zor', category: 'İnsan', solution: [] },
  { id: 'boat', name: 'Tekne', icon: '⛵', difficulty: 'Orta', category: 'Nesne', solution: [] },
  { id: 'flower', name: 'Çiçek', icon: '🌸', difficulty: 'Zor', category: 'Doğa', solution: [] },
  { id: 'butterfly', name: 'Kelebek', icon: '🦋', difficulty: 'Zor', category: 'Hayvan', solution: [] },
  { id: 'heart', name: 'Kalp', icon: '💝', difficulty: 'Orta', category: 'Nesne', solution: [] },
  { id: 'rocket', name: 'Roket', icon: '🚀', difficulty: 'Zor', category: 'Nesne', solution: [] },
  { id: 'mountain', name: 'Dağ', icon: '⛰️', difficulty: 'Kolay', category: 'Doğa', solution: [] },
  { id: 'camel', name: 'Deve', icon: '🐪', difficulty: 'Zor', category: 'Hayvan', solution: [] },
  { id: 'candle', name: 'Mum', icon: '🕯️', difficulty: 'Kolay', category: 'Nesne', solution: [] },
  { id: 'fox', name: 'Tilki', icon: '🦊', difficulty: 'Orta', category: 'Hayvan', solution: [] },
  { id: 'arrow', name: 'Ok', icon: '➡️', difficulty: 'Kolay', category: 'Nesne', solution: [] }
];