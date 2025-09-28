# 🎣 2D Fishing Game

A React-based 2D fishing game with interactive casting mechanics, progressive difficulty, and persistent data storage.

## Features

- **Interactive Casting System**: Timing-based casting mechanic inspired by arcade claw machines
- **Progressive Difficulty**: Multiple levels with increasing challenge and rarer fish
- **Animated Feedback**: Smooth animations for all game actions
- **Persistent Data**: Local storage with optional backend integration
- **Responsive Design**: Works on desktop and mobile devices
- **Pixelated Art Style**: Retro gaming aesthetic with smooth animations

## Game Mechanics

- **Casting**: Click "Ready to Cast" to start the lever, then "Cast!" to drop your line
- **Fish Types**: Common, Rare, Epic, and Legendary fish with different point values
- **Level Progression**: Catch all fish to advance to the next level
- **Scoring**: Earn points based on fish rarity and current level multiplier
- **Lives System**: Miss too many casts and the game ends

## Quick Start

### Frontend Setup

```bash
# Navigate to the project directory
cd fishing

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Backend Setup (Optional)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start MongoDB (make sure MongoDB is installed)
mongod

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

## Project Structure

```
fishing/
├── src/
│   ├── components/          # React components
│   │   ├── FishingGame.jsx  # Main game logic
│   │   ├── GameCanvas.jsx   # Canvas rendering
│   │   ├── GameUI.jsx       # User interface
│   │   ├── CastingMechanic.jsx # Casting controls
│   │   └── fishing.jsx      # Root component
│   ├── config/              # Game configuration
│   │   └── gameConfig.js    # Game constants and settings
│   ├── hooks/               # Custom React hooks
│   │   └── useGameData.js   # Persistent data management
│   ├── api/                 # API integration
│   │   └── gameAPI.js       # Backend communication
│   ├── stylesheets/         # CSS files
│   └── assets/              # Images and sprites
├── backend/                 # Node.js backend
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables
└── README.md
```

## Technologies Used

### Frontend
- **React 19** with functional components and hooks
- **HTML5 Canvas** for game rendering
- **CSS3** with animations and responsive design
- **Vite** for fast development and building

### Backend (Optional)
- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests

## Game Configuration

Modify `src/config/gameConfig.js` to adjust:
- Canvas dimensions
- Fish types and properties
- Level progression settings
- Scoring system

## Extending the Game

The modular architecture supports easy extensions:

### Adding New Fish Types
```javascript
// In gameConfig.js
export const fishTypes = [
  // ... existing fish
  {
    name: 'Mythical Fish',
    size: 35,
    speed: 3,
    rarity: 0.001,
    points: 500
  }
];
```

### Adding New Game Mechanics
- Create new components in `src/components/`
- Add state management in `FishingGame.jsx`
- Update UI in `GameUI.jsx`

### Backend Integration
- Set up MongoDB database
- Configure environment variables
- Update API endpoints in `gameAPI.js`

## Performance Optimization

- Canvas rendering optimized with requestAnimationFrame
- Efficient state management with React hooks
- Responsive design with CSS media queries
- Resource-efficient animations

## Browser Compatibility

- Modern browsers with ES6+ support
- HTML5 Canvas support required
- Local storage for data persistence

## Development Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
npm start            # Start production server
npm run dev          # Start with nodemon
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Future Enhancements

- Multiplayer support
- Achievement system
- Power-ups and special abilities
- Seasonal events
- Mobile app version
- Sound effects and music
- Advanced fish AI
- Tournament mode