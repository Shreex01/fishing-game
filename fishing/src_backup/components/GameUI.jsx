import React, { useState } from 'react';
import './GameUI.css';

const GameUI = ({ gameState, gameData, feedback, onStartGame, onPauseGame, onShowLeaderboard }) => {
  // Default state for demo purposes - remove if using props
  const [demoGameState] = useState({
    score: 0,
    level: 1,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  });

  const [demoFeedback] = useState({
    show: false,
    type: '',
    message: ''
  });

  const [demoGameData] = useState({
    highScore: 2850,
    bestLevel: 7,
    totalFishCaught: 142
  });

  // Use props if available, otherwise use demo state
  const currentGameState = gameState || demoGameState;
  const currentFeedback = feedback || demoFeedback;
  const currentGameData = gameData || demoGameData;

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame();
    } else {
      console.log('Start game clicked');
    }
  };

  const handlePauseGame = () => {
    if (onPauseGame) {
      onPauseGame();
    } else {
      console.log('Pause game clicked');
    }
  };

  const handleShowLeaderboard = () => {
    if (onShowLeaderboard) {
      onShowLeaderboard();
    } else {
      alert('Leaderboard feature coming soon!');
    }
  };

  const { score, level, lives, isPlaying, isPaused, gameOver } = currentGameState;

  if (!isPlaying && !gameOver) {
    return (
      <div className="game-container">
        {/* Pond Background */}


        {/* Wooden pier/dock */}
        <div className="wooden-pier"></div>

        {/* Game Menu */}
        <div className="game-menu">
          <h1 className="game-title">🎣 Fishing Game</h1>
          <p className="game-subtitle">Time your cast to catch fish!</p>
          
          <div className="menu-buttons">
            <button onClick={handleStartGame} className="start-btn">
              Start Game
            </button>
            
            <button onClick={handleShowLeaderboard} className="leaderboard-btn">
              🏆 Leaderboard
            </button>
          </div>

          {currentGameData && (
            <div className="player-stats">
              <h4>Your Best:</h4>
              <p>High Score: {currentGameData.highScore}</p>
              <p>Best Level: {currentGameData.bestLevel}</p>
              <p>Total Fish: {currentGameData.totalFishCaught}</p>
            </div>
          )}

          <div className="instructions">
            <h3>How to Play:</h3>
            <p>• Click "Ready to Cast" to start the lever</p>
            <p>• Click "Cast!" when the lever is over fish</p>
            <p>• Catch fish to score points and advance levels</p>
            <p>• Higher levels have rarer fish but reduced visibility</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-container">
        <div className="pond">
          <div className="lily-pad lily-pad-1"></div>
          <div className="lily-pad lily-pad-2"></div>
        </div>
        
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <p>Level Reached: {level}</p>
          <button onClick={handleStartGame} className="restart-btn">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="pond">
        <div className="lily-pad lily-pad-1"></div>
        <div className="lily-pad lily-pad-2"></div>
        <div className="lily-pad lily-pad-3"></div>
      </div>

      {/* Game Stats */}
      <div className="game-ui">
        <div className="stats">
          <div className="stat">
            <span className="label">Score:</span>
            <span className="value">{score}</span>
          </div>
          <div className="stat">
            <span className="label">Level:</span>
            <span className="value">{level}</span>
          </div>
          <div className="stat">
            <span className="label">Lives:</span>
            <span className="value">{'❤️'.repeat(lives)}</span>
          </div>
        </div>
      </div>

      {/* Pause Button */}
      <button onClick={handlePauseGame} className="pause-btn">
        {isPaused ? '▶️' : '⏸️'}
      </button>

      {/* Feedback */}
      {currentFeedback.show && (
        <div className={`feedback ${currentFeedback.type}`}>
          {currentFeedback.message}
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="pause-overlay">
          <h2>Game Paused</h2>
          <button onClick={handlePauseGame}>Resume</button>
        </div>
      )}
    </div>
  );
};

export default GameUI;