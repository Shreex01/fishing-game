const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fishing_game';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Game Score Schema
const scoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Number, required: true },
  fishCaught: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Player Stats Schema
const playerStatsSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true },
  totalGames: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  bestLevel: { type: Number, default: 1 },
  totalFishCaught: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now }
});

const PlayerStats = mongoose.model('PlayerStats', playerStatsSchema);

// Routes

// Save game score
app.post('/api/scores', async (req, res) => {
  try {
    const { playerName, score, level, fishCaught, playerId } = req.body;
    
    // Save score
    const newScore = new Score({ playerName, score, level, fishCaught });
    await newScore.save();
    
    // Update player stats
    await PlayerStats.findOneAndUpdate(
      { playerId },
      {
        $inc: { totalGames: 1, totalFishCaught: fishCaught },
        $max: { highScore: score, bestLevel: level },
        $set: { lastPlayed: new Date() }
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, id: newScore._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(limit)
      .select('playerName score level timestamp');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player stats
app.get('/api/players/:playerId/stats', async (req, res) => {
  try {
    const { playerId } = req.params;
    const stats = await PlayerStats.findOne({ playerId });
    res.json(stats || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});