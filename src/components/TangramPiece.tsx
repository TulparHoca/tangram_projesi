import React, { useRef, useState } from 'react';
import { TangramPiece as TangramPieceType, Position } from '../types/tangram';

interface TangramPieceProps {
  piece: TangramPieceType;
  onMove: (id: string, position: Position) => void;
  onSetRotation: (id: string, rotation: number) => void;
}

// İki nokta arasındaki açıyı ve mesafeyi hesaplayan yardımcı fonksiyonlar
const getAngle = (p1: Position, p2: Position) => Math.atan2(p2.y - p1.y, p2.x - p1.x);
const getDistance = (p1: Position, p2: Position) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

const TangramPiece: React.FC<TangramPieceProps> = ({ piece, onMove, onSetRotation }) => {
  const [isActive, setIsActive] = useState(false);
  
  // Dokunma ve sürükleme durumlarını yönetmek için useRef'ler
  const initialTouchState = useRef<{
    touches: Position[];
    pieceRotation: number;
    angle: number;
    distance: number;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsActive(true); // Parçayı aktif (vurgulu) yap

    const touches = Array.from(e.targetTouches).map(t => ({ x: t.clientX, y: t.clientY }));

    // Tek dokunuş (sürükleme başlangıcı)
    if (touches.length === 1) {
      initialTouchState.current = {
        touches,
        pieceRotation: piece.rotation,
        angle: 0,
        distance: 0,
      };
    } 
    // İki dokunuş (döndürme başlangıcı)
    else if (touches.length === 2) {
      initialTouchState.current = {
        touches,
        pieceRotation: piece.rotation,
        angle: getAngle(touches[0], touches[1]),
        distance: getDistance(touches[0], touches[1]),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!initialTouchState.current) return;

    const currentTouches = Array.from(e.targetTouches).map(t => ({ x: t.clientX, y: t.clientY }));
    const initial = initialTouchState.current;

    // Tek parmakla sürükleme
    if (currentTouches.length === 1 && initial.touches.length === 1) {
      const initialTouch = initial.touches[0];
      const currentTouch = currentTouches[0];
      
      // Hassas konumlandırma için Sürükleme Ofseti
      const dragOffsetX = 0; // Yatay ofset
      const dragOffsetY = -80; // Dikey ofset (parmağın 80px yukarısında)
      
      const newPos: Position = {
        x: currentTouch.x - (piece.position.x - initialTouch.x) - (pieceRef.current?.offsetWidth ?? 100) / 2 + dragOffsetX,
        y: currentTouch.y - (piece.position.y - initialTouch.y) - (pieceRef.current?.offsetHeight ?? 100) / 2 + dragOffsetY,
      };
      
      onMove(piece.id, newPos);
    } 
    // İki parmakla döndürme
    else if (currentTouches.length === 2 && initial.touches.length === 2) {
      const currentAngle = getAngle(currentTouches[0], currentTouches[1]);
      const angleDifference = currentAngle - initial.angle;
      
      const newRotation = initial.pieceRotation + angleDifference * (180 / Math.PI);
      onSetRotation(piece.id, newRotation);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsActive(false); // Parçayı normal hale getir
    initialTouchState.current = null; // Durumu sıfırla
  };

  const pieceRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pieceRef}
      className="absolute select-none"
      style={{
        left: piece.position.x,
        top: piece.position.y,
        width: 100,
        height: 100,
        transform: `rotate(${piece.rotation}deg) scale(${isActive ? 1.15 : 1})`, // Aktifken büyüt
        transition: 'transform 0.1s ease-out',
        zIndex: isActive ? 100 : 10, // Aktifken en üste getir
        WebkitTapHighlightColor: 'transparent', // Dokunma vurgusunu kaldır
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // Fare ile kontrol için eski fonksiyonları da ekleyebiliriz (opsiyonel)
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="pointer-events-none" // SVG'nin dokunma olaylarını engellemesini önle
        style={{
          filter: isActive ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
          transition: 'filter 0.1s ease-out',
        }}
      >
        <g>
          <polygon
            points={piece.points}
            fill={piece.color}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
};

export default TangramPiece;