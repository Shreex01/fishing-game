import React, { useState, useEffect } from 'react';
import { gameAPI } from '../api/gameAPI';
import '../stylesheets/Leaderboard.css';

const Leaderboard = ({ show, onClose }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      loadLeaderboard();
    }
  }, [show]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await gameAPI.getLeaderboard(10);
      setScores(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="leaderboard-content">
          {loading ? (
            <div className="loading">Loading scores...</div>
          ) : scores.length > 0 ? (
            <div className="scores-list">
              {scores.map((score, index) => (
                <div key={score.id || index} className={`score-item ${index < 3 ? 'top-three' : ''}`}>
                  <div className="rank">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className="player-name">{score.playerName || 'Anonymous'}</div>
                  <div className="score-details">
                    <span className="score">{score.score}</span>
                    <span className="level">Lv.{score.level}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-scores">No scores yet. Be the first to play!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;