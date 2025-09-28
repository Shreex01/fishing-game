import React, { useRef, useEffect } from 'react';
import { gameConfig } from '../config/gameConfig';

const GameCanvas = ({ fish, leverPosition, castingActive, fishermanState, level }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pond overlay (transparency based on level)
    const opacity = Math.min(0.3 + (level - 1) * 0.1, 0.7);
    ctx.fillStyle = `rgba(0, 50, 100, ${opacity})`;
    ctx.fillRect(0, gameConfig.pondTop, canvas.width, gameConfig.pondHeight);
    
    // Draw fish
    fish.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      
      // Fish visibility based on level (harder to see at higher levels)
      const fishOpacity = Math.max(0.4, 1 - (level - 1) * 0.1);
      ctx.globalAlpha = fishOpacity;
      
      // Simple fish shape
      ctx.fillStyle = getFishColor(f.type);
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size, f.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Fish tail
      ctx.beginPath();
      ctx.moveTo(-f.size, 0);
      ctx.lineTo(-f.size * 1.5, -f.size * 0.3);
      ctx.lineTo(-f.size * 1.5, f.size * 0.3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });
    
    // Draw casting lever
    if (castingActive) {
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(leverPosition, gameConfig.pondTop - 20);
      ctx.lineTo(leverPosition, gameConfig.pondTop + gameConfig.pondHeight + 20);
      ctx.stroke();
      
      // Lever indicator
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(leverPosition - 5, gameConfig.pondTop - 30, 10, 20);
    }
    
    // Draw fisherman
    drawFisherman(ctx, fishermanState);
    
  }, [fish, leverPosition, castingActive, fishermanState, level]);

  const getFishColor = (type) => {
    const colors = {
      'Common Fish': '#4ecdc4',
      'Rare Fish': '#45b7d1',
      'Epic Fish': '#f39c12',
      'Legendary Fish': '#e74c3c'
    };
    return colors[type] || '#4ecdc4';
  };

  const drawFisherman = (ctx, state) => {
    const x = 50;
    const y = gameConfig.pondTop - 50;
    
    // Simple fisherman sprite
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 5, y, 10, 30); // Body
    
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath();
    ctx.arc(x, y - 5, 8, 0, Math.PI * 2); // Head
    ctx.fill();
    
    // Fishing rod
    if (state === 'casting') {
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 5, y - 5);
      ctx.lineTo(x + 30, y - 20);
      ctx.stroke();
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      width={gameConfig.canvasWidth}
      height={gameConfig.canvasHeight}
      className="game-canvas"
    />
  );
};

export default GameCanvas;