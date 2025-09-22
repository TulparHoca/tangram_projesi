import React, { useRef, useCallback, useEffect } from 'react';
import { TangramPiece as TangramPieceType, Position } from '../types/tangram';

interface TangramPieceProps {
  piece: TangramPieceType;
  isActive: boolean;
  onMove: (id: string, position: Position) => void;
  onSetRotation: (id: string, rotation: number) => void;
  onInteractionStart: (id: string) => void;
  onInteractionEnd: () => void;
}

const TangramPiece: React.FC<TangramPieceProps> = ({ piece, isActive, onMove, onSetRotation, onInteractionStart, onInteractionEnd }) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const gestureState = useRef({
    isDragging: false,
    isRotating: false,
    startX: piece.position.x,
    startY: piece.position.y,
    touchStartX: 0,
    touchStartY: 0,
    initialAngle: 0,
    initialRotation: 0,
  }).current;
  
  useEffect(() => {
    if (pieceRef.current && !gestureState.isDragging) {
      gestureState.startX = piece.position.x;
      gestureState.startY = piece.position.y;
      pieceRef.current.style.transform = `translate(${piece.position.x}px, ${piece.position.y}px) scale(${isActive ? 1.15 : 1})`;
    }
  }, [piece.position, isActive, gestureState]);

  const updateTransform = (currentX: number, currentY: number) => {
    const newX = gestureState.startX + (currentX - gestureState.touchStartX);
    const newY = gestureState.startY + (currentY - gestureState.touchStartY);

    if (pieceRef.current) {
        pieceRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${isActive ? 1.15 : 1})`;
    }
    animationFrameId.current = null;
  };


  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    onInteractionStart(piece.id);
    const touch = e.touches[0];
    gestureState.touchStartX = touch.clientX;
    gestureState.touchStartY = touch.clientY;

    if (e.touches.length === 1) {
      gestureState.isDragging = true;
    }
    
    if (e.touches.length === 2) {
      gestureState.isDragging = false;
      gestureState.isRotating = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      gestureState.initialAngle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
      gestureState.initialRotation = piece.rotation;
    }
  }, [onInteractionStart, gestureState, piece.id, piece.rotation]);


  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (gestureState.isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => updateTransform(touch.clientX, touch.clientY));
    }

    if (e.touches.length === 2 && gestureState.isRotating) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentAngle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
      const angleDifference = currentAngle - gestureState.initialAngle;
      const newRotation = gestureState.initialRotation + (angleDifference * 180 / Math.PI);
      onSetRotation(piece.id, newRotation);
    }
  }, [gestureState, onSetRotation]);


  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    if (gestureState.isDragging) {
      const finalX = gestureState.startX + (e.changedTouches[0].clientX - gestureState.touchStartX);
      const finalY = gestureState.startY + (e.changedTouches[0].clientY - gestureState.touchStartY);
      onMove(piece.id, { x: finalX, y: finalY });
    }

    if (e.touches.length < 2) gestureState.isRotating = false;
    if (e.touches.length < 1) {
      gestureState.isDragging = false;
      onInteractionEnd();
    }
  }, [onInteractionEnd, gestureState, piece.id, onMove]);

  const svgStyle = {
    transform: `rotate(${piece.rotation}deg)`,
  };

  return (
    <div
      ref={pieceRef}
      className={`absolute select-none cursor-grab ${isActive ? 'z-20' : 'z-10'}`}
      style={{
        width: 100,
        height: 100,
        transform: `translate(${piece.position.x}px, ${piece.position.y}px) scale(${isActive ? 1.15 : 1})`,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="w-full h-full pointer-events-none"
        style={svgStyle}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className={`drop-shadow-lg ${isActive ? 'drop-shadow-xl' : ''}`}
        >
          {/* SCALE TRANSFORM TEKRAR EKLENDİ */}
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