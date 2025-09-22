import React from 'react';
import { TangramPiece as TangramPieceType } from '../types/tangram';
import { Puzzle } from 'lucide-react';

interface PiecePaletteProps {
  pieces: TangramPieceType[];
  onPieceClick: (id: string) => void;
}

const PiecePalette: React.FC<PiecePaletteProps> = ({ pieces, onPieceClick }) => {
  return (
    <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
        <Puzzle className="w-5 h-5 mr-2 text-indigo-500"/>
        Parça Paleti
      </h3>
      <div className="relative bg-gray-100 rounded-lg p-2 grid grid-cols-4 sm:grid-cols-7 gap-2 min-h-[8rem]">
        {pieces.map((piece) => (
          <button
            key={piece.id}
            onClick={() => onPieceClick(piece.id)}
            className="relative flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 aspect-square"
            title={piece.type}
          >
            <svg
              width="80%"
              height="80%"
              viewBox="0 0 100 100"
              className="drop-shadow-sm pointer-events-none"
            >
              <g transform={`rotate(${piece.rotation} 50 50)`}>
                <polygon
                  points={piece.points}
                  fill={piece.color}
                />
              </g>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PiecePalette;