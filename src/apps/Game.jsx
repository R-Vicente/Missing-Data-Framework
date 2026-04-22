/* global React */
const { useState, useEffect, useRef } = React;

function Game() {
  console.log('%c🎮 Game component MOUNTED!', 'color:#22c55e;font-size:16px;font-weight:bold');

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [holes, setHoles] = useState([]);

  const intervalRef = useRef(null);
  const holesRef = useRef([]);

  // Inicializa os buracos
  useEffect(() => {
    const initial = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      active: false,
      symbol: Math.random() > 0.5 ? 'NaN' : '❓'
    }));
    setHoles(initial);
    holesRef.current = initial;
    console.log('Holes initialized');
  }, []);

  const startGame = () => {
    console.log('%c▶️ START GAME clicked!', 'color:#22c55e;font-weight:bold');
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);

    // Limpa intervalo antigo
    if (intervalRef.current) clearInterval(intervalRef.current);

    let currentScore = 0;
    let currentTime = 30;

    intervalRef.current = setInterval(() => {
      // Timer
      currentTime--;
      setTimeLeft(currentTime);

      // Pop NaN
      setHoles(prev => {
        const newHoles = prev.map(h => ({ ...h, active: false }));
        const idx = Math.floor(Math.random() * 9);
        newHoles[idx].active = true;
        holesRef.current = newHoles;
        return newHoles;
      });

      // Desaparece o NaN depois de 1.1s
      setTimeout(() => {
        setHoles(prev => {
          const newHoles = prev.map(h => h.active ? { ...h, active: false } : h);
          holesRef.current = newHoles;
          return newHoles;
        });
      }, 1100);

      if (currentTime <= 0) {
        endGame(currentScore);
      }
    }, 650);
  };

  const endGame = (finalScore) => {
    console.log('%c⏹ Game ended with score:', 'color:#ef4444', finalScore);
    setGameActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setScore(finalScore);
  };

  const handleClick = (id) => {
    if (!gameActive) return;
    const hole = holesRef.current.find(h => h.id === id);
    if (!hole || !hole.active) return;

    setScore(s => {
      const newScore = s + 1;
      return newScore;
    });

    setHoles(prev => {
      const newHoles = prev.map(h => h.id === id ? { ...h, active: false } : h);
      holesRef.current = newHoles;
      return newHoles;
    });
  };

  const restartGame = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(startGame, 50);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(180deg, #1e3a8a, #0f172a)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 10px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'auto'
    }}>
      <h1 style={{ fontSize: '2.6rem', margin: '8px 0 4px', textShadow: '0 0 20px #22c55e' }}>
        🧪 Imputa os NaNs! 🧪
      </h1>
      <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '1.25rem' }}>
        Click the NaNs before the dataset dies 
      </p>

      <div style={{ display: 'flex', gap: '50px', fontSize: '1.65rem', margin: '15px 0' }}>
        <div>Score: <span style={{ color: '#22c55e', fontWeight: 700 }}>{score}</span></div>
        <div>Time: <span style={{ color: timeLeft > 10 ? '#fff' : '#ef4444', fontWeight: 700 }}>{timeLeft}</span></div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '18px',
        maxWidth: '420px',
        padding: '25px',
        background: '#0f172a',
        borderRadius: '20px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
      }}>
        {holes.map(hole => (
          <div
            key={hole.id}
            onClick={() => handleClick(hole.id)}
            style={{
              background: '#1e2937',
              borderRadius: '50%',
              aspectRatio: '1',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 8px 15px rgba(0,0,0,0.5)',
              transition: 'transform 0.1s',
              transform: hole.active ? 'scale(1.12)' : 'scale(1)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${hole.active ? 1 : 0})`,
              fontSize: '3.9rem',
              transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
              pointerEvents: 'none'
            }}>
              {hole.symbol}
            </div>
          </div>
        ))}
      </div>

      {!gameActive && (
        <button
          onClick={startGame}
          style={{
            marginTop: '30px',
            padding: '16px 48px',
            fontSize: '1.5rem',
            background: '#22c55e',
            color: '#052e16',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 700,
            boxShadow: '0 6px 0 #16a34a',
            cursor: 'pointer'
          }}
        >
          ▶️ START GAME
        </button>
      )}

      {!gameActive && score > 0 && (
        <div style={{
          marginTop: '30px',
          background: 'rgba(15,23,42,0.95)',
          padding: '30px 40px',
          borderRadius: '16px',
          textAlign: 'center',
          maxWidth: '460px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.9rem' }}>
            {score >= 25 ? 'Dataset saved!' : score >= 15 ? 'Not bad...' : 'Dataset died of NaNs...'}
          </h2>
          <p style={{ fontSize: '1.6rem', margin: '15px 0' }}>
            Final score: <strong style={{ color: '#22c55e' }}>{score}</strong>
          </p>
          <button onClick={restartGame} style={{
            padding: '12px 36px',
            background: '#22c55e',
            color: '#000',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}>
            Play again
          </button>
        </div>
      )}
    </div>
  );
}

window.Game = Game;
