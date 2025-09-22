import React, { useCallback } from 'react';
import { TangramPiece as TangramPieceType, Position } from '../types/tangram';

interface TangramPieceProps {
  piece: TangramPieceType;
  onMove: (id: string, position: Position) => void;
  onRotate: (id: string) => void;
}

const TangramPiece: React.FC<TangramPieceProps> = ({ piece, onMove, onRotate }) => {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const pieceRect = target.getBoundingClientRect();
    // Tarayıcı penceresinin sol üst köşesine göre değil,
    // sayfanın kendisine göre pozisyonu almak için scroll pozisyonlarını ekliyoruz.
    const offsetX = e.clientX - pieceRect.left;
    const offsetY = e.clientY - pieceRect.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      onMove(piece.id, { x: moveEvent.pageX - offsetX, y: moveEvent.pageY - offsetY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [piece.id, onMove]);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.currentTarget as HTMLElement;
    const pieceRect = target.getBoundingClientRect();
    const offsetX = touch.clientX - pieceRect.left;
    const offsetY = touch.clientY - pieceRect.top;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      onMove(piece.id, { x: moveEvent.touches[0].pageX - offsetX, y: moveEvent.touches[0].pageY - offsetY });
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  },[piece.id, onMove]);

  return (
    <div
      className="absolute cursor-grab z-20 select-none"
      style={{
        // Sayfa scroll olduğunda bile doğru konumda kalması için 'absolute' kullanıyoruz.
        // Parent elementin 'relative' olması gerekir.
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        transform: `translate(${piece.position.x}px, ${piece.position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={() => onRotate(piece.id)}
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
    </div>
  );
};

export default TangramPiece;