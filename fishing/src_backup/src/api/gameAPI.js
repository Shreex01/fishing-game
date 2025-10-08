// Mock API for game data - replace with actual backend endpoints
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const gameAPI = {
  // Save game score
  saveScore: async (playerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving score:', error);
      // Fallback to localStorage
      const scores = JSON.parse(localStorage.getItem('fishing_scores') || '[]');
      scores.push({ ...playerData, timestamp: Date.now() });
      localStorage.setItem('fishing_scores', JSON.stringify(scores));
      return { success: true, id: Date.now() };
    }
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to localStorage
      const scores = JSON.parse(localStorage.getItem('fishing_scores') || '[]');
      return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    }
  },

  // Get player stats
  getPlayerStats: async (playerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return JSON.parse(localStorage.getItem('fishing_game_data') || '{}');
    }
  }
};