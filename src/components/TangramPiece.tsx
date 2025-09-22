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
    // e.preventDefault() fare olayları için burada gerekli değil, 
    // ancak touchstart içinde çağrılabilir. Şimdilik en temiz çözüm CSS.
    const target = e.currentTarget as HTMLElement;
    const parent = target.parentElement;
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

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleDragMove(moveEvent.clientX, moveEvent.clientY);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      // Bu preventDefault da kaydırmayı engeller ancak CSS çözümü daha performanslıdır.
      moveEvent.preventDefault();
      handleDragMove(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    if ('touches' in e.nativeEvent) {
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
        left: 0,
        top: 0,
        // YENİ EKLENEN SATIR: TARAYICI KAYDIRMASINI ENGELLER
        touchAction: 'none',
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