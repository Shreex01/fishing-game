import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import CastingMechanic from './CastingMechanic';
import Leaderboard from './Leaderboard';
import { gameConfig, fishTypes } from '../config/gameConfig';
import { useGameData } from '../hooks/useGameData';
import { gameAPI } from '../api/gameAPI';
import '../stylesheets/FishingGame.css';

const FishingGame = () => {
  const { gameData, updateGameData } = useGameData();
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [totalFishCaught, setTotalFishCaught] = useState(0);

  const [fish, setFish] = useState([]);
  const [castingActive, setCastingActive] = useState(false);
  const [leverPosition, setLeverPosition] = useState(0);
  const [fishermanState, setFishermanState] = useState('idle');
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });

  const gameLoopRef = useRef();
  const leverAnimationRef = useRef();

  // Initialize fish for current level
  const initializeFish = useCallback(() => {
    const fishCount = Math.min(3 + gameState.level, 8);
    const newFish = [];

    for (let i = 0; i < fishCount; i++) {
      const fishType = fishTypes[Math.floor(Math.random() * Math.min(fishTypes.length, gameState.level + 1))];
      newFish.push({
        id: i,
        type: fishType.name,
        x: Math.random() * (gameConfig.pondWidth - 60) + 30,
        y: Math.random() * (gameConfig.pondHeight - 100) + gameConfig.pondTop + 50,
        speed: fishType.speed * (0.5 + Math.random() * 0.5),
        direction: Math.random() * Math.PI * 2,
        size: fishType.size,
        rarity: fishType.rarity,
        points: fishType.points
      });
    }
    setFish(newFish);
  }, [gameState.level]);

  // Start game
  // In FishingGame.jsx - Fix the startGame function
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      level: 1,
      lives: 3,
      isPlaying: true,
      gameOver: false
    }));
    setTotalFishCaught(0);
    setCastingActive(false);
    initializeFish();
  };

  // Lever animation
  useEffect(() => {
    if (castingActive) {
      const animateLever = () => {
        setLeverPosition(prev => {
          const newPos = prev + 2;
          return newPos > gameConfig.pondWidth ? 0 : newPos;
        });
        leverAnimationRef.current = requestAnimationFrame(animateLever);
      };
      leverAnimationRef.current = requestAnimationFrame(animateLever);
    }
    return () => {
      if (leverAnimationRef.current) {
        cancelAnimationFrame(leverAnimationRef.current);
      }
    };
  }, [castingActive]);

  // Fish movement animation
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const animateFish = () => {
        setFish(prevFish =>
          prevFish.map(f => {
            let newX = f.x + Math.cos(f.direction) * f.speed;
            let newY = f.y + Math.sin(f.direction) * f.speed;
            let newDirection = f.direction;

            // Boundary collision
            if (newX <= 30 || newX >= gameConfig.pondWidth - 30) {
              newDirection = Math.PI - f.direction;
              newX = Math.max(30, Math.min(gameConfig.pondWidth - 30, newX));
            }
            if (newY <= gameConfig.pondTop + 50 || newY >= gameConfig.pondTop + gameConfig.pondHeight - 50) {
              newDirection = -f.direction;
              newY = Math.max(gameConfig.pondTop + 50, Math.min(gameConfig.pondTop + gameConfig.pondHeight - 50, newY));
            }

            // Random direction change
            if (Math.random() < 0.02) {
              newDirection += (Math.random() - 0.5) * 0.5;
            }

            return { ...f, x: newX, y: newY, direction: newDirection };
          })
        );
        gameLoopRef.current = requestAnimationFrame(animateFish);
      };
      gameLoopRef.current = requestAnimationFrame(animateFish);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused]);

  // Handle casting
  const handleCast = () => {
    if (!castingActive) return;

    setCastingActive(false);
    setFishermanState('casting');

    // Check for fish at lever position
    const catchRadius = 40;
    const caughtFish = fish.find(f =>
      Math.abs(f.x - leverPosition) < catchRadius &&
      Math.abs(f.y - (gameConfig.pondTop + gameConfig.pondHeight / 2)) < catchRadius
    );

    setTimeout(() => {
      if (caughtFish) {
        // Success
        const points = caughtFish.points * gameState.level;
        setGameState(prev => ({ ...prev, score: prev.score + points }));
        setFish(prev => prev.filter(f => f.id !== caughtFish.id));
        setTotalFishCaught(prev => prev + 1);
        setFeedback({ show: true, type: 'success', message: `+${points} points!` });

        // Check level progression
        if (fish.length <= 1) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, level: prev.level + 1 }));
            initializeFish();
          }, 1000);
        }
      } else {
        // Miss
        setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
        setFeedback({ show: true, type: 'miss', message: 'Missed!' });

        // Check game over
        if (gameState.lives <= 1) {
          setGameState(prev => ({ ...prev, gameOver: true, isPlaying: false }));
          // Save game data
          updateGameData(gameState.score, gameState.level, totalFishCaught);
          // Save to backend
          gameAPI.saveScore({
            playerName: 'Player',
            score: gameState.score,
            level: gameState.level,
            fishCaught: totalFishCaught,
            playerId: 'local_player'
          }).catch(console.error);
        }
      }

      setFishermanState('idle');
      setTimeout(() => setFeedback({ show: false, type: '', message: '' }), 2000);
    }, 1000);
  };

  // Start casting
  const startCasting = () => {
    if (gameState.isPlaying && !castingActive) {
      setCastingActive(true);
    }
  };

  // Make sure components are properly layered
  return (
    <div className="fishing-game">
      <GameCanvas
        fish={fish}
        leverPosition={leverPosition}
        castingActive={castingActive}
        fishermanState={fishermanState}
        level={gameState.level}
      />

      <GameUI
        gameState={gameState}
        gameData={gameData}
        feedback={feedback}
        onStartGame={startGame}
        onPauseGame={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />

      <CastingMechanic
        castingActive={castingActive}
        onStartCasting={startCasting}
        onCast={handleCast}
        leverPosition={leverPosition}
      />

      <Leaderboard
        show={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
};

export default FishingGame;