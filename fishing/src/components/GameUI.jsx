import React from 'react';
import '../stylesheets/GameUI.css';

const GameUI = ({ gameState, gameData, feedback, onStartGame, onPauseGame, onShowLeaderboard }) => {
  const { score, level, lives, isPlaying, isPaused, gameOver } = gameState;

  if (!isPlaying && !gameOver) {
    return (
      <div className="game-menu">
        <h1>🎣 Fishing Game</h1>
        <p>Time your cast to catch fish!</p>
        <div className="menu-buttons">
          <button onClick={onStartGame} className="start-btn">
            Start Game
          </button>
          <button onClick={onShowLeaderboard} className="leaderboard-btn">
            🏆 Leaderboard
          </button>
        </div>
        {gameData && (
          <div className="player-stats">
            <h4>Your Best:</h4>
            <p>High Score: {gameData.highScore}</p>
            <p>Best Level: {gameData.bestLevel}</p>
            <p>Total Fish: {gameData.totalFishCaught}</p>
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
    );
  }

  if (gameOver) {
    return (
      <div className="game-over">
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        <p>Level Reached: {level}</p>
        <button onClick={onStartGame} className="restart-btn">
          Play Again
        </button>
      </div>
    );
  }

  return (
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

      <button onClick={onPauseGame} className="pause-btn">
        {isPaused ? '▶️' : '⏸️'}
      </button>

      {feedback.show && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {isPaused && (
        <div className="pause-overlay">
          <h2>Game Paused</h2>
          <button onClick={onPauseGame}>Resume</button>
        </div>
      )}
    </div>
  );
};

export default GameUI;