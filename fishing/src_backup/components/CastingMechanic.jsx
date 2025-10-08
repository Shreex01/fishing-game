import React from 'react';
import { gameConfig } from '../config/gameConfig';
import '../stylesheets/CastingMechanic.css';

const CastingMechanic = ({ castingActive, onStartCasting, onCast, leverPosition }) => {
  return (
    <div className="casting-controls">
      {!castingActive ? (
        <button 
          onClick={onStartCasting}
          className="ready-cast-btn"
        >
          🎯 Ready to Cast
        </button>
      ) : (
        <div className="casting-active">
          <div className="lever-indicator">
            <div 
              className="lever-position"
              style={{ 
                left: `${(leverPosition / gameConfig.pondWidth) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              ⬇️
            </div>
          </div>
          <button 
            onClick={onCast}
            className="cast-btn"
          >
            🎣 Cast!
          </button>
          <div className="timing-hint">
            Time your cast when the marker is over fish!
          </div>
        </div>
      )}
    </div>
  );
};

export default CastingMechanic;