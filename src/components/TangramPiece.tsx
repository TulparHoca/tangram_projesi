import React, { useCallback } from 'react';
import { TangramPiece as TangramPieceType, Position } from '../types/tangram';

interface TangramPieceProps {
  piece: TangramPieceType;
  onMove: (id: string, position: Position) => void;
  onRotate: (id: string) => void;
}

const TangramPiece: React.FC<TangramPieceProps> = ({ piece, onMove, onRotate }) => {

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent<HTMLDivElement>,
    clientX: number,
    clientY: number
  ) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const parent = target.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();

    // Fare pozisyonunun, parent elemente göre göreceli başlangıç noktasını bul
    const startXInParent = clientX - parentRect.left;
    const startYInParent = clientY - parentRect.top;

    // Farenin, parçanın sol üst köşesine göre ofsetini hesapla
    const offsetX = startXInParent - piece.position.x;
    const offsetY = startYInParent - piece.position.y;

    const handleDragMove = (moveClientX: number, moveClientY: number) => {
      // Farenin yeni pozisyonunu yine parent'a göre hesapla
      const newXInParent = moveClientX - parentRect.left;
      const newYInParent = moveClientY - parentRect.top;

      // Parçanın yeni pozisyonunu ofseti çıkararak bul
      onMove(piece.id, { x: newXInParent - offsetX, y: newYInParent - offsetY });
    };

    // --- Mouse Olayları için ---
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleDragMove(moveEvent.clientX, moveEvent.clientY);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // --- Touch Olayları için ---
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault(); // Sayfanın kaymasını engelle
      handleDragMove(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    if ('touches' in e.nativeEvent) { // Olayın touch mı mouse mu olduğunu kontrol et
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <div
      className="absolute cursor-grab z-20 select-none"
      style={{
        width: 100,
        height: 100,
        transform: `translate(${piece.position.x}px, ${piece.position.y}px)`,
        // Left ve Top artık doğrudan transform ile yönetildiği için 0'da kalabilir
        left: 0,
        top: 0,
      }}
      onMouseDown={(e) => handleDragStart(e, e.clientX, e.clientY)}
      onTouchStart={(e) => handleDragStart(e, e.touches[0].clientX, e.touches[0].clientY)}
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