import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [casting, setCasting] = useState(false)
  const [hookPos, setHookPos] = useState({ x: 300, y: 150 })
  const [lineActive, setLineActive] = useState(false)
  const [fish, setFish] = useState([])
  const [feedback, setFeedback] = useState('')
  const canvasRef = useRef()
  const animationRef = useRef()

  const startGame = () => {
    setGameStarted(true)
    initFish()
  }

  const fishTypes = [
    { img: '/src/assets/common1.png', points: 10, size: 30 },
    { img: '/src/assets/common2.png', points: 10, size: 30 },
    { img: '/src/assets/common3.png', points: 10, size: 30 },
    { img: '/src/assets/rare1.png', points: 25, size: 35 },
    { img: '/src/assets/rare2.png', points: 25, size: 35 },
    { img: '/src/assets/rare3.png', points: 25, size: 35 },
    { img: '/src/assets/epic1.png', points: 50, size: 40 },
    { img: '/src/assets/epic2.png', points: 50, size: 40 },
    { img: '/src/assets/epic3.png', points: 50, size: 40 },
    { img: '/src/assets/legendary1.png', points: 100, size: 45 }
  ]

  const initFish = () => {
    const newFish = []
    for (let i = 0; i < 3 + level; i++) {
      const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)]
      newFish.push({
        id: i,
        x: Math.random() * 500 + 50,
        y: Math.random() * 200 + 50,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        ...fishType
      })
    }
    setFish(newFish)
  }

  const startCasting = () => {
    setLineActive(true)
    setHookPos({ x: 300, y: 150 })
  }

  const catchFish = () => {
    if (!lineActive) return
    setCasting(true)
    
    const caughtFish = fish.find(f => 
      Math.abs(f.x - hookPos.x) < 50 && Math.abs(f.y - hookPos.y) < 50
    )
    
    setTimeout(() => {
      if (caughtFish) {
        setScore(prev => prev + caughtFish.points)
        setFish(prev => prev.filter(f => f.id !== caughtFish.id))
        setFeedback(`🎉 Fish Caught! +${caughtFish.points} points`)
        if (fish.length <= 1) {
          setLevel(prev => prev + 1)
          setTimeout(initFish, 1000)
        }
      } else {
        setLives(prev => prev - 1)
        setFeedback('❌ Missed! -1 life')
      }
      setCasting(false)
      setLineActive(false)
      setTimeout(() => setFeedback(''), 2000)
    }, 1000)
  }

  useEffect(() => {
    if (!gameStarted) return
    const animate = () => {
      setFish(prev => prev.map(f => ({
        ...f,
        x: f.x + f.dx,
        y: f.y + f.dy,
        dx: f.x <= 20 || f.x >= 580 ? -f.dx : f.dx,
        dy: f.y <= 20 || f.y >= 280 ? -f.dy : f.dy
      })))
      
      if (lineActive) {
        setHookPos(prev => ({
          x: prev.x + Math.sin(Date.now() * 0.003) * 2,
          y: prev.y + Math.cos(Date.now() * 0.002) * 1.5
        }))
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [gameStarted, lineActive])

  if (!gameStarted) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 30%, #228B22 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>🎣 Fishing Game</h1>
        <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>Time your cast to catch fish!<br/>Watch the red line and click Cast when it's over a fish.</p>
        <button onClick={startGame} style={{ padding: '20px 40px', fontSize: '24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
          🚀 Start Fishing
        </button>
      </div>
    )
  }

  if (lives <= 0) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #e74c3c 0%, #c0392b 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>🎮 Game Over!</h1>
        <p style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Final Score: {score}</p>
        <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '2rem' }}>Level Reached: {level}</p>
        <button onClick={() => { setGameStarted(false); setScore(0); setLevel(1); setLives(3); }} style={{ padding: '15px 30px', fontSize: '20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
          🔄 Play Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 30%, #228B22 100%)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', color: 'white', fontSize: '18px', background: 'rgba(0,0,0,0.3)' }}>
        <div>💰 Score: {score}</div>
        <div>🎯 Level: {level}</div>
        <div>❤️ Lives: {lives}</div>
      </div>
      
      <div style={{ width: '600px', height: '300px', background: 'rgba(0,100,200,0.6)', margin: '30px auto', position: 'relative', border: '4px solid #654321', borderRadius: '10px', overflow: 'hidden' }}>
        {lineActive && (
          <>
            <div style={{ position: 'absolute', left: '20px', top: '10px', width: '30px', height: '40px', background: '#8b4513', borderRadius: '5px 5px 0 0', zIndex: 5 }}>
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '15px', height: '15px', background: '#fdbcb4', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', top: '5px', right: '-5px', width: '2px', height: '15px', background: '#654321', transformOrigin: 'bottom', transform: `rotate(${Math.atan2(hookPos.y - 25, hookPos.x - 35) * 180 / Math.PI}deg)` }}></div>
            </div>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 8 }}>
              <line x1="35" y1="25" x2={hookPos.x} y2={hookPos.y} stroke="#654321" strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', left: hookPos.x - 8 + 'px', top: hookPos.y - 8 + 'px', width: '16px', height: '16px', background: '#c0392b', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 10px rgba(192,57,43,0.8)', zIndex: 10 }}></div>
          </>
        )}
        
        {fish.map(f => (
          <img key={f.id} src={f.img} alt="fish" style={{ position: 'absolute', left: f.x + 'px', top: f.y + 'px', width: f.size + 'px', height: f.size + 'px', transition: 'all 0.1s', imageRendering: 'pixelated' }} />
        ))}
        

      </div>
      
      {feedback && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '20px', borderRadius: '10px', fontSize: '20px', zIndex: 20 }}>
          {feedback}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {!lineActive ? (
          <button onClick={startCasting} style={{ padding: '15px 40px', fontSize: '20px', background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(52,152,219,0.4)', animation: 'pulse 2s infinite' }}>
            🎯 Start Fishing
          </button>
        ) : (
          <button onClick={catchFish} disabled={casting} style={{ padding: '15px 40px', fontSize: '20px', background: casting ? '#95a5a6' : 'linear-gradient(45deg, #e74c3c, #c0392b)', color: 'white', border: 'none', borderRadius: '25px', cursor: casting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(231,76,60,0.6)', animation: casting ? 'none' : 'glow 1s infinite alternate' }}>
            {casting ? '⏳ Catching...' : '🎣 CATCH!'}
          </button>
        )}
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes glow {
          0% { box-shadow: 0 4px 15px rgba(231,76,60,0.6); }
          100% { box-shadow: 0 4px 15px rgba(231,76,60,0.9), 0 0 20px rgba(231,76,60,0.5); }
        }
      `}</style>
    </div>
  )
}

export default App
