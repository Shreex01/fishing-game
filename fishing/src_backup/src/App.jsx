import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import '../src/stylesheets/GameUI.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [castingActive, setCastingActive] = useState(false)
  const [leverPosition, setLeverPosition] = useState(0)
  const [fish, setFish] = useState([])
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' })
  const [isPaused, setIsPaused] = useState(false)
  const [fishermanState, setFishermanState] = useState('idle')
  const animationRef = useRef()
  const leverAnimationRef = useRef()

  // Game data for stats
  const [gameData] = useState({
    highScore: Math.max(2850, score),
    bestLevel: Math.max(7, level),
    totalFishCaught: 142
  })

  const fishTypes = [
    { name: 'Common Fish', img: '/src/assets/common1.png', points: 10, size: 25, color: '#4ecdc4' },
    { name: 'Common Fish', img: '/src/assets/common2.png', points: 10, size: 25, color: '#4ecdc4' },
    { name: 'Common Fish', img: '/src/assets/common3.png', points: 10, size: 25, color: '#4ecdc4' },
    { name: 'Rare Fish', img: '/src/assets/rare1.png', points: 25, size: 30, color: '#45b7d1' },
    { name: 'Rare Fish', img: '/src/assets/rare2.png', points: 25, size: 30, color: '#45b7d1' },
    { name: 'Epic Fish', img: '/src/assets/epic1.png', points: 50, size: 35, color: '#f39c12' },
    { name: 'Epic Fish', img: '/src/assets/epic2.png', points: 50, size: 35, color: '#f39c12' },
    { name: 'Legendary Fish', img: '/src/assets/legendary1.png', points: 100, size: 40, color: '#e74c3c' }
  ]

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setLevel(1)
    setLives(3)
    setFeedback({ show: false, type: '', message: '' })
    setCastingActive(false)
    setFishermanState('idle')
    initFish()
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
  }

  const showLeaderboard = () => {
    alert('Leaderboard feature coming soon!')
  }

  const initFish = () => {
    const fishCount = Math.min(3 + level, 8)
    const newFish = []
    
    for (let i = 0; i < fishCount; i++) {
      const fishType = fishTypes[Math.floor(Math.random() * Math.min(fishTypes.length, level + 2))]
      newFish.push({
        id: i,
        x: Math.random() * 300 + 50, // Pond width adjusted
        y: Math.random() * 120 + 40, // Pond height adjusted  
        dx: (Math.random() - 0.5) * 1.5,
        dy: (Math.random() - 0.5) * 1.5,
        ...fishType
      })
    }
    setFish(newFish)
  }

  // Start casting - begin lever movement
  const startCasting = () => {
    if (gameStarted && !castingActive && !isPaused) {
      setCastingActive(true)
      setLeverPosition(0)
    }
  }

  // Cast - attempt to catch fish
  const handleCast = () => {
    if (!castingActive) return
    
    setCastingActive(false)
    setFishermanState('casting')

    // Check for fish at lever position with some tolerance
    const catchRadius = 40
    const caughtFish = fish.find(f => 
      Math.abs(f.x - leverPosition) < catchRadius && 
      Math.abs(f.y - 80) < catchRadius // Center of pond area
    )

    setTimeout(() => {
      if (caughtFish) {
        const points = caughtFish.points * level
        setScore(prev => prev + points)
        setFish(prev => prev.filter(f => f.id !== caughtFish.id))
        setFeedback({
          show: true,
          type: 'success',
          message: `🎉 ${caughtFish.name} caught! +${points} points`
        })

        // Level up if few fish remain
        if (fish.length <= 2) {
          setTimeout(() => {
            setLevel(prev => prev + 1)
            initFish()
          }, 1000)
        }
      } else {
        setLives(prev => prev - 1)
        setFeedback({
          show: true,
          type: 'miss',
          message: '❌ Missed! -1 life'
        })

        // Game over check
        if (lives <= 1) {
          setTimeout(() => {
            setGameStarted(false)
          }, 1500)
        }
      }

      setFishermanState('idle')
      setTimeout(() => setFeedback({ show: false, type: '', message: '' }), 2000)
    }, 1000)
  }

  // Lever animation
  useEffect(() => {
    if (castingActive && !isPaused) {
      const animateLever = () => {
        setLeverPosition(prev => {
          const newPos = prev + 2
          return newPos > 400 ? 0 : newPos // Reset at pond width
        })
        leverAnimationRef.current = requestAnimationFrame(animateLever)
      }
      leverAnimationRef.current = requestAnimationFrame(animateLever)
    }
    return () => {
      if (leverAnimationRef.current) {
        cancelAnimationFrame(leverAnimationRef.current)
      }
    }
  }, [castingActive, isPaused])

  // Fish movement animation
  useEffect(() => {
    if (gameStarted && !isPaused) {
      const animateFish = () => {
        setFish(prev => prev.map(f => ({
          ...f,
          x: f.x + f.dx,
          y: f.y + f.dy,
          dx: f.x <= 20 || f.x >= 380 ? -f.dx : f.dx, // Bounce off pond edges
          dy: f.y <= 20 || f.y >= 160 ? -f.dy : f.dy
        })))
        animationRef.current = requestAnimationFrame(animateFish)
      }
      animationRef.current = requestAnimationFrame(animateFish)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameStarted, isPaused])

  // Initialize fish for menu display
  useEffect(() => {
    if (!gameStarted) {
      initFish()
    }
  }, [gameStarted])

  // Main menu state
  if (!gameStarted || lives <= 0) {
    return (
      <div className="game-container">
        {/* Interactive Pond */}
        <div className="pond fishing-pond">
          {/* Lily pads */}
          <div className="lily-pad lily-pad-1"></div>
          <div className="lily-pad lily-pad-2"></div>
          <div className="lily-pad lily-pad-3"></div>
          <div className="lily-pad lily-pad-4"></div>

          {/* Menu fish swimming */}
          {fish.map(f => (
            <div
              key={f.id} 
              className="fish menu-fish"
              style={{ 
                left: f.x + 'px', 
                top: f.y + 'px', 
                width: f.size + 'px', 
                height: f.size + 'px',
                backgroundColor: f.color,
                borderRadius: '50%'
              }} 
            />
          ))}

          {/* Fishing rod on pond edge */}
          <div className="pond-fishing-rod">
            <div className="rod-handle"></div>
          </div>
        </div>

        <div className="wooden-pier"></div>

        {lives <= 0 ? (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <p>Level Reached: {level}</p>
            <button onClick={startGame} className="restart-btn">
              Play Again
            </button>
          </div>
        ) : (
          <div className="game-menu">
            <h1 className="game-title">🎣 Fishing Game</h1>
            <p className="game-subtitle">Time your cast to catch fish!</p>
            
            <div className="menu-buttons">
              <button onClick={startGame} className="start-btn">
                Start Game
              </button>
              <button onClick={showLeaderboard} className="leaderboard-btn">
                🏆 Leaderboard
              </button>
            </div>

            <div className="player-stats">
              <h4>Your Best:</h4>
              <p>High Score: {gameData.highScore}</p>
              <p>Best Level: {gameData.bestLevel}</p>
              <p>Total Fish: {gameData.totalFishCaught}</p>
            </div>

            <div className="instructions">
              <h3>How to Play:</h3>
              <p>• Click "Ready to Cast" to start the lever</p>
              <p>• Click "Cast!" when the lever is over fish</p>
              <p>• Catch fish to score points and advance levels</p>
              <p>• Higher levels have rarer fish but reduced visibility</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="game-container">
      {/* Interactive Pond - Main Game */}
      <div className="pond fishing-pond">
        {/* Lily pads */}
        <div className="lily-pad lily-pad-1"></div>
        <div className="lily-pad lily-pad-2"></div>
        <div className="lily-pad lily-pad-3"></div>
        
        {/* Casting lever indicator */}
        {castingActive && (
          <div className="lever-indicator">
            <div 
              className="lever-position"
              style={{ 
                left: leverPosition + 'px',
                top: '10px'
              }}
            >
              ⬇️
            </div>
            <div 
              className="lever-line"
              style={{ 
                left: leverPosition + 'px'
              }}
            ></div>
          </div>
        )}
        
        {/* Fish swimming in pond */}
        {fish.map(f => (
          <div
            key={f.id} 
            className="fish pond-fish"
            style={{ 
              left: f.x + 'px', 
              top: f.y + 'px', 
              width: f.size + 'px', 
              height: f.size + 'px',
              backgroundColor: f.color,
              borderRadius: '50%',
              opacity: Math.max(0.6, 1 - (level - 1) * 0.1) // Harder to see at higher levels
            }} 
          />
        ))}

        {/* Fisherman */}
        <div className={`fisherman ${fishermanState}`}>
          <div className="fisherman-body"></div>
          <div className="fisherman-head"></div>
          {fishermanState === 'casting' && <div className="fishing-rod-active"></div>}
        </div>
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
      <button onClick={pauseGame} className="pause-btn">
        {isPaused ? '▶️' : '⏸️'}
      </button>
      
      {/* Feedback */}
      {feedback.show && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      {/* Casting Controls */}
      <div className="casting-controls">
        {!castingActive ? (
          <button onClick={startCasting} className="ready-cast-btn">
            🎯 Ready to Cast
          </button>
        ) : (
          <div className="casting-active">
            <button onClick={handleCast} className="cast-btn">
              🎣 Cast!
            </button>
            <div className="timing-hint">
              Time your cast when the marker is over fish!
            </div>
          </div>
        )}
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="pause-overlay">
          <h2>Game Paused</h2>
          <button onClick={pauseGame}>Resume</button>
        </div>
      )}
    </div>
  )
}

export default App