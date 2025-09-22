import React, { useCallback, useRef } from 'react';
import { TangramPiece as TangramPieceType, Position } from '../types/tangram';
import { RotateCw } from 'lucide-react';

interface TangramPieceProps {
  piece: TangramPieceType;
  onMove: (id: string, position: Position) => void;
  onSetRotation: (id: string, rotation: number) => void;
  onFlip: (id: string) => void;
}

const TangramPiece: React.FC<TangramPieceProps> = ({ piece, onMove, onSetRotation, onFlip }) => {
  // Parçanın ana elementine referans oluşturarak DOM gezintisini ortadan kaldırıyoruz.
  const pieceRef = useRef<HTMLDivElement>(null);

  // --- SÜRÜKLEME MANTIĞI ---
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    const pieceElement = pieceRef.current;
    if (!pieceElement) return;

    const parent = pieceElement.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const startXInParent = clientX - parentRect.left;
    const startYInParent = clientY - parentRect.top;
    const offsetX = startXInParent - piece.position.x;
    const offsetY = startYInParent - piece.position.y;

    const handleDragMove = (moveClientX: number, moveClientY: number) => {
      const newXInParent = moveClientX - parentRect.left;
      const newYInParent = moveClientY - parentRect.top;
      onMove(piece.id, { x: newXInParent - offsetX, y: newYInParent - offsetY });
    };

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleInteractionEnd = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleInteractionEnd);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleInteractionEnd);
  }, [piece.id, piece.position, onMove]);


  // --- DÖNDÜRME MANTIĞI ---
  const handleRotateStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Sürüklemenin başlamasını engelle
    
    const pieceElement = pieceRef.current;
    if (!pieceElement) return;

    const pieceRect = pieceElement.getBoundingClientRect();
    const centerX = pieceRect.left + pieceRect.width / 2;
    const centerY = pieceRect.top + pieceRect.height / 2;

    const handleRotateMove = (clientX: number, clientY: number) => {
      const radians = Math.atan2(clientY - centerY, clientX - centerX);
      let degrees = radians * (180 / Math.PI);
      degrees += 90;
      onSetRotation(piece.id, degrees);
    };

    const handleMouseMove = (e: MouseEvent) => handleRotateMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleRotateMove(e.touches[0].clientX, e.touches[0].clientY);

    const handleInteractionEnd = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleInteractionEnd);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleInteractionEnd);
  }, [piece.id, onSetRotation]);

  return (
    <div
      ref={pieceRef}
      className="absolute cursor-grab z-20 select-none group"
      style={{
        width: 100,
        height: 100,
        transform: `translate(${piece.position.x}px, ${piece.position.y}px)`,
        left: 0,
        top: 0,
        touchAction: 'none',
      }}
      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onDoubleClick={() => onFlip(piece.id)}
    >
      <div 
        className="w-full h-full pointer-events-none"
        style={{ transform: `rotate(${piece.rotation}deg)` }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
        >
          <g transform={`scale(${piece.scale.x}, ${piece.scale.y}) translate(${piece.scale.x === -1 ? -100 : 0}, ${piece.scale.y === -1 ? -100 : 0})`}>
            <polygon
              points={piece.points}
              fill={piece.color}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      {/* Döndürme Kulakçığı */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center cursor-alias opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleRotateStart}
        onTouchStart={handleRotateStart}
        title="Döndür"
      >
        <RotateCw className="w-4 h-4 text-gray-700" />
      </div>
    </div>
  );
};

export default TangramPiece;