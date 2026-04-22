/* global React */
const { useState, useEffect, useRef, useCallback } = React;

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
  const gameIntervalRef = useRef(null);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    foodRef.current = newFood;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fundo dataset
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (efeito dataset)
    ctx.strokeStyle = '#1e2937';
    ctx.lineWidth = 1;
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

    // Snake (imputer)
    ctx.fillStyle = '#22c55e';
    snakeRef.current.forEach((segment, i) => {
      ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      if (i === 0) {
        ctx.fillStyle = '#86efac';
        ctx.fillRect(segment.x * CELL_SIZE + 8, segment.y * CELL_SIZE + 8, CELL_SIZE - 16, CELL_SIZE - 16);
        ctx.fillStyle = '#22c55e';
      }
    });

    // Food = NaN
    ctx.font = '22px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NaN', 
      foodRef.current.x * CELL_SIZE + CELL_SIZE / 2, 
      foodRef.current.y * CELL_SIZE + CELL_SIZE / 2);
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

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
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
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
  }, [gameStarted, gameOver, draw, generateFood]);

  const startGame = () => {
    snakeRef.current = [{ x: 7, y: 7 }];
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    generateFood();
    draw();

    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    gameIntervalRef.current = setInterval(moveSnake, 160); // velocidade boa
  };

  const changeDirection = useCallback((e) => {
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
  }, [gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', changeDirection);
    return () => window.removeEventListener('keydown', changeDirection);
  }, [changeDirection]);

  useEffect(() => {
    if (gameStarted) draw();
  }, [gameStarted, draw]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, []);

  return (
    <div style={{ height: '100%', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      <h1 style={{ fontSize: '2.4rem', margin: '0 0 10px', textShadow: '0 0 20px #22c55e' }}>
        🧪 NaN Eater 🧪
      </h1>
      <p style={{ margin: '0 0 15px', opacity: 0.9 }}>Come os NaNs antes que o dataset morra!</p>

      <div style={{ marginBottom: '10px', fontSize: '1.5rem' }}>
        Score: <strong style={{ color: '#22c55e' }}>{score}</strong>
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{ border: '4px solid #22c55e', borderRadius: '12px', imageRendering: 'pixelated', boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)' }}
      />

      {!gameStarted && !gameOver && (
        <button
          onClick={startGame}
          style={{ marginTop: '25px', padding: '14px 40px', fontSize: '1.4rem', background: '#22c55e', color: '#052e16', border: 'none', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}
        >
          ▶️ START GAME
        </button>
      )}

      {gameOver && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>Dataset corrupted...</h2>
          <p style={{ fontSize: '1.4rem' }}>Pontuação final: <strong>{score}</strong></p>
          <button onClick={startGame} style={{ padding: '12px 32px', background: '#22c55e', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 700 }}>
            Jogar novamente
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.7 }}>
        Use as setas do teclado ← ↑ ↓ →
      </div>
    </div>
  );
}

window.Game = Game;
