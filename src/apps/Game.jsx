/* global React */
const { useState, useEffect, useRef } = React;

function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const GRID_SIZE = 15;
  const CELL_SIZE = 28;

  const snakeRef = useRef([{ x: 7, y: 7 }]);
  const directionRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 5, y: 5 });
  const intervalRef = useRef(null);

  console.log('%c🎮 NaN Eater mounted', 'color:#22c55e;font-weight:bold');

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y));
    foodRef.current = newFood;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#1e2937';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Snake
    ctx.fillStyle = '#22c55e';
    snakeRef.current.forEach((seg, i) => {
      ctx.fillRect(seg.x * CELL_SIZE + 2, seg.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      if (i === 0) {
        ctx.fillStyle = '#86efac';
        ctx.fillRect(seg.x * CELL_SIZE + 8, seg.y * CELL_SIZE + 8, CELL_SIZE - 16, CELL_SIZE - 16);
        ctx.fillStyle = '#22c55e';
      }
    });

    // NaN
    ctx.font = 'bold 23px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NaN', 
      foodRef.current.x * CELL_SIZE + CELL_SIZE / 2, 
      foodRef.current.y * CELL_SIZE + CELL_SIZE / 2);
  };

  const moveSnake = () => {
    if (!gameStarted || gameOver) return;

    console.log('→ Moving snake... direction:', directionRef.current);

    const snake = snakeRef.current;
    const head = { ...snake[0] };
    head.x += directionRef.current.x;
    head.y += directionRef.current.y;

    // Colisão com parede
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }

    // Colisão consigo próprio
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      return;
    }

    snake.unshift(head);

    // Comeu NaN?
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 1);
      generateFood();
    } else {
      snake.pop();
    }

    draw();
  };

  const startGame = () => {
    snakeRef.current = [{ x: 7, y: 7 }];
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    generateFood();
    draw();

    const canvas = canvasRef.current;
    if (canvas) canvas.focus();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(moveSnake, 160);
  };

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key);

    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        if (directionRef.current.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (directionRef.current.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (directionRef.current.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (directionRef.current.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
    e.preventDefault();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.tabIndex = 0;
      canvas.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (canvas) canvas.removeEventListener('keydown', handleKeyDown);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ height: '100%', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2.4rem', margin: '0 0 8px', textShadow: '0 0 20px #22c55e' }}>
        🧪 NaN Eater 🧪
      </h1>
      <p style={{ marginBottom: '15px', opacity: 0.9 }}>Come os NaNs com as setas do teclado!</p>

      <div style={{ marginBottom: '8px', fontSize: '1.5rem' }}>
        Score: <strong style={{ color: '#22c55e' }}>{score}</strong>
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{
          border: '5px solid #22c55e',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
          imageRendering: 'pixelated',
          outline: 'none'
        }}
      />

      {!gameStarted && !gameOver && (
        <button onClick={startGame} style={{ marginTop: '25px', padding: '14px 42px', fontSize: '1.45rem', background: '#22c55e', color: '#052e16', border: 'none', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}>
          ▶️ START GAME
        </button>
      )}

      {gameOver && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>Dataset corrupted...</h2>
          <p style={{ fontSize: '1.4rem' }}>Pontuação final: <strong>{score}</strong></p>
          <button onClick={startGame} style={{ padding: '12px 34px', background: '#22c55e', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 700 }}>
            Jogar novamente
          </button>
        </div>
      )}

      <div style={{ marginTop: '18px', fontSize: '0.95rem', opacity: 0.75 }}>
        ← ↑ ↓ →
      </div>
    </div>
  );
}

window.Game = Game;
