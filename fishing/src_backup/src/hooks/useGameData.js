import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fishing_game_data';

export const useGameData = () => {
  const [gameData, setGameData] = useState({
    highScore: 0,
    totalGamesPlayed: 0,
    bestLevel: 1,
    totalFishCaught: 0
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setGameData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading game data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever gameData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
  }, [gameData]);

  const updateGameData = (newScore, level, fishCaught) => {
    setGameData(prev => ({
      highScore: Math.max(prev.highScore, newScore),
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      bestLevel: Math.max(prev.bestLevel, level),
      totalFishCaught: prev.totalFishCaught + fishCaught
    }));
  };

  const resetGameData = () => {
    setGameData({
      highScore: 0,
      totalGamesPlayed: 0,
      bestLevel: 1,
      totalFishCaught: 0
    });
  };

  return {
    gameData,
    updateGameData,
    resetGameData
  };
};