/* global React */
const { useState, useEffect, useRef, useCallback } = React;

function Game() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [holes, setHoles] = useState([]);

  const timerRef = useRef(null);
  const popRef = useRef(null);

  // Inicializa as 9 células
  useEffect(() => {
    const initialHoles = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      active: false,
      symbol: Math.random() > 0.5 ? 'NaN' : '❓'
    }));
    setHoles(initialHoles);
  }, []);

  const popRandomNaN = useCallback(() => {
    if (!gameActive) return;

    setHoles(prev => {
      // Desativa todos
      let newHoles = prev.map(h => ({ ...h, active: false }));
      
      // Ativa um aleatório
      const idx = Math.floor(Math.random() * 9);
      newHoles[idx] = { ...newHoles[idx], active: true };
      
      return newHoles;
    });

    // Desaparece automaticamente depois de 1.2s
    setTimeout(() => {
      setHoles(prev => prev.map(h => h.active ? { ...h, active: false } : h));
    }, 1200);
  }, [gameActive]);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Pop dos NaNs
    popRef.current = setInterval(popRandomNaN, 650);
    setTimeout(popRandomNaN, 250); // primeiro NaN aparece rápido
  }, [popRandomNaN]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (popRef.current) clearInterval(popRef.current);
  }, []);

  const restartGame = useCallback(() => {
    endGame();
    // Pequeno delay para limpar visualmente
    setTimeout(() => {
      startGame();
    }, 80);
  }, [endGame, startGame]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (popRef.current) clearInterval(popRef.current);
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
        Impute the NaNs!
      </h1>
      <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '1.25rem' }}>
        Click the NaNs before the dataset dies
      </p>

      <div style={{ display: 'flex', gap: '50px', fontSize: '1.65rem', margin: '15px 0' }}>
        <div>Score: <span style={{ color: '#22c55e', fontWeight: 700 }}>{score}</span></div>
        <div>Time: <span style={{ color: timeLeft > 10 ? '#fff' : '#ef4444', fontWeight: 700 }}>{timeLeft}</span></div>
      </div>

      {/* GRID */}
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
            onClick={() => {
              if (!gameActive || !hole.active) return;
              setScore(s => s + 1);
              setHoles(prev => prev.map(h => h.id === hole.id ? { ...h, active: false } : h));
            }}
            style={{
              background: '#1e2937',
              borderRadius: '50%',
              aspectRatio: '1',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 8px 15px rgba(0,0,0,0.5)',
              transition: 'transform 0.1s',
              transform: hole.active ? 'scale(1.08)' : 'scale(1)'
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

      {/* End screen */}
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
