/**
 * NaNMuncher.jsx
 *
 * A maze-chase game: you pilot a data-cleaning cursor through a dataset grid,
 * eating NaN cells while dodging outlier bots. Original design — not a clone
 * of any branded game's art, maze, or characters.
 *
 * Usage:
 *   import NaNMuncher from './NaNMuncher.jsx';
 *   <NaNMuncher />     // drop anywhere; it sizes to its container
 *
 * Controls:
 *   Arrow keys / WASD to move
 *   Space / P to pause
 *   R to restart
 */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

// ---------- Maze ----------
// 19 cols x 21 rows. Legend: # wall, . NaN pellet, o power-cell, _ empty, G ghost spawn, P player spawn
const MAZE = [
  '###################',
  '#........#........#',
  '#o##.###.#.###.##o#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.###_#_###.####',
  '####.#_______#.####',
  '####.#_##G##_#.####',
  '_____.__#GGG#__.____',
  '####.#_##_##_#.####',
  '####.#_______#.####',
  '####.#.#####.#.####',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#o.#.....P.....#.o#',
  '##.#.#.#####.#.#.##',
  '#....#...#...#....#',
  '#.######.#.######.#',
  '#.................#',
  '###################',
];

const ROWS = MAZE.length;
const COLS = MAZE[0].length;

// ---------- Helpers ----------
const DIRS = {
  up:    { x: 0, y: -1 },
  down:  { x: 0, y: 1 },
  left:  { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function parseMaze(maze) {
  const walls = [];
  const pellets = new Set();
  const power = new Set();
  let player = { x: 9, y: 15 };
  const ghostSpawns = [];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const ch = maze[y][x];
      const key = `${x},${y}`;
      if (ch === '#') walls.push({ x, y });
      else if (ch === '.') pellets.add(key);
      else if (ch === 'o') power.add(key);
      else if (ch === 'P') player = { x, y };
      else if (ch === 'G') ghostSpawns.push({ x, y });
    }
  }
  return { walls, pellets, power, player, ghostSpawns };
}

function isWall(x, y) {
  // Tunnel wrap row 9 sides
  if (x < 0 || x >= COLS) return false;
  if (y < 0 || y >= ROWS) return true;
  return MAZE[y][x] === '#';
}

function wrap(x) {
  if (x < 0) return COLS - 1;
  if (x >= COLS) return 0;
  return x;
}

// BFS next step from (sx,sy) toward (tx,ty). Used by ghost AI.
function bfsNext(sx, sy, tx, ty, avoid = null) {
  if (sx === tx && sy === ty) return null;
  const q = [[sx, sy]];
  const prev = new Map();
  const key = (x, y) => `${x},${y}`;
  prev.set(key(sx, sy), null);
  while (q.length) {
    const [x, y] = q.shift();
    if (x === tx && y === ty) {
      // walk back
      let cur = key(x, y);
      let last = cur;
      while (prev.get(cur) !== null) {
        last = cur;
        cur = prev.get(cur);
      }
      const [lx, ly] = last.split(',').map(Number);
      return { x: lx, y: ly };
    }
    for (const d of Object.values(DIRS)) {
      const nx = wrap(x + d.x);
      const ny = y + d.y;
      if (isWall(nx, ny)) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      if (avoid && avoid === k) continue;
      prev.set(k, key(x, y));
      q.push([nx, ny]);
    }
  }
  return null;
}

// ---------- Component ----------
export default function Game() {
  const initial = useMemo(() => parseMaze(MAZE), []);
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState('ready'); // ready | playing | paused | dead | won | gameover
  const [level, setLevel] = useState(1);
  const [frightenedUntil, setFrightenedUntil] = useState(0);

  const stateRef = useRef({
    player: { ...initial.player },
    dir: { x: 0, y: 0 },
    queuedDir: { x: 0, y: 0 },
    pellets: new Set(initial.pellets),
    power: new Set(initial.power),
    ghosts: initial.ghostSpawns.slice(0, 4).map((g, i) => ({
      x: g.x, y: g.y,
      home: { ...g },
      dir: { x: 0, y: -1 },
      color: ['#ff5577', '#22d3ee', '#f59e0b', '#a78bfa'][i % 4],
      label: ['µ', 'σ', '∞', '?'][i % 4],
      eaten: false,
      frightened: false,
    })),
    frameCount: 0,
    mouthOpen: true,
  });

  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(24);

  // Resize cellSize to fit container
  useEffect(() => {
    function resize() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const s = Math.floor(Math.min(w / COLS, (h - 60) / ROWS));
      setCellSize(Math.max(12, s));
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Input
  useEffect(() => {
    function onKey(e) {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') stateRef.current.queuedDir = DIRS.up;
      else if (k === 'arrowdown' || k === 's') stateRef.current.queuedDir = DIRS.down;
      else if (k === 'arrowleft' || k === 'a') stateRef.current.queuedDir = DIRS.left;
      else if (k === 'arrowright' || k === 'd') stateRef.current.queuedDir = DIRS.right;
      else if (k === ' ' || k === 'p') {
        setStatus((s) => {
          if (s === 'playing') return 'paused';
          if (s === 'paused') return 'playing';
          if (s === 'ready') return 'playing';
          return s;
        });
      } else if (k === 'r') {
        restart(true);
      }
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = useCallback((full) => {
    const fresh = parseMaze(MAZE);
    stateRef.current.player = { ...fresh.player };
    stateRef.current.dir = { x: 0, y: 0 };
    stateRef.current.queuedDir = { x: 0, y: 0 };
    stateRef.current.ghosts.forEach((g, i) => {
      const home = fresh.ghostSpawns[i % fresh.ghostSpawns.length];
      g.x = home.x; g.y = home.y;
      g.home = { ...home };
      g.dir = { x: 0, y: -1 };
      g.eaten = false;
      g.frightened = false;
    });
    if (full) {
      stateRef.current.pellets = new Set(fresh.pellets);
      stateRef.current.power = new Set(fresh.power);
      setScore(0);
      setLives(3);
      setLevel(1);
    }
    setFrightenedUntil(0);
    setStatus('ready');
  }, []);

  // Game loop
  useEffect(() => {
    let raf;
    let last = performance.now();
    let playerAcc = 0;
    let ghostAcc = 0;
    const PLAYER_STEP_MS = 130;
    const GHOST_STEP_MS = 160;
    function loop(now) {
      const dt = now - last;
      last = now;
      if (status === 'playing') {
        playerAcc += dt;
        ghostAcc += dt;
        while (playerAcc >= PLAYER_STEP_MS) {
          stepPlayer();
          playerAcc -= PLAYER_STEP_MS;
        }
        const ghostStep = frightenedUntil > now ? GHOST_STEP_MS * 1.5 : GHOST_STEP_MS;
        while (ghostAcc >= ghostStep) {
          stepGhosts(now);
          ghostAcc -= ghostStep;
        }
        stateRef.current.frameCount++;
        if (stateRef.current.frameCount % 8 === 0) {
          stateRef.current.mouthOpen = !stateRef.current.mouthOpen;
        }
        setTick((t) => (t + 1) % 1000000);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, frightenedUntil]);

  function stepPlayer() {
    const s = stateRef.current;
    const p = s.player;

    // try queued direction first
    if (s.queuedDir.x || s.queuedDir.y) {
      const nx = wrap(p.x + s.queuedDir.x);
      const ny = p.y + s.queuedDir.y;
      if (!isWall(nx, ny)) {
        s.dir = s.queuedDir;
      }
    }
    const nx = wrap(p.x + s.dir.x);
    const ny = p.y + s.dir.y;
    if (!isWall(nx, ny)) {
      p.x = nx;
      p.y = ny;
    }

    const key = `${p.x},${p.y}`;
    if (s.pellets.has(key)) {
      s.pellets.delete(key);
      setScore((sc) => sc + 10);
    }
    if (s.power.has(key)) {
      s.power.delete(key);
      setScore((sc) => sc + 50);
      const now = performance.now();
      setFrightenedUntil(now + 6000);
      s.ghosts.forEach((g) => { if (!g.eaten) g.frightened = true; });
    }

    // collisions
    for (const g of s.ghosts) {
      if (g.x === p.x && g.y === p.y) {
        handleCollision(g);
      }
    }

    // win check
    if (s.pellets.size === 0 && s.power.size === 0) {
      setStatus('won');
      setLevel((l) => l + 1);
      // reset board, keep score
      setTimeout(() => {
        const fresh = parseMaze(MAZE);
        s.pellets = new Set(fresh.pellets);
        s.power = new Set(fresh.power);
        s.player = { ...fresh.player };
        s.dir = { x: 0, y: 0 };
        s.queuedDir = { x: 0, y: 0 };
        s.ghosts.forEach((g, i) => {
          const home = fresh.ghostSpawns[i % fresh.ghostSpawns.length];
          g.x = home.x; g.y = home.y; g.eaten = false; g.frightened = false;
        });
        setFrightenedUntil(0);
        setStatus('ready');
      }, 1400);
    }
  }

  function stepGhosts(now) {
    const s = stateRef.current;
    const p = s.player;
    const fright = now < frightenedUntil;
    for (const g of s.ghosts) {
      if (g.eaten) {
        // return home
        const nxt = bfsNext(g.x, g.y, g.home.x, g.home.y);
        if (nxt) { g.x = nxt.x; g.y = nxt.y; }
        if (g.x === g.home.x && g.y === g.home.y) {
          g.eaten = false;
          g.frightened = false;
        }
        continue;
      }
      let tx = p.x, ty = p.y;
      if (fright && g.frightened) {
        // flee: pick neighbor farthest from player (by manhattan)
        let best = null, bestD = -1;
        for (const d of Object.values(DIRS)) {
          const nx = wrap(g.x + d.x);
          const ny = g.y + d.y;
          if (isWall(nx, ny)) continue;
          const dd = Math.abs(nx - p.x) + Math.abs(ny - p.y);
          if (dd > bestD) { bestD = dd; best = { x: nx, y: ny }; }
        }
        if (best) { g.x = best.x; g.y = best.y; }
      } else {
        // Different personalities per ghost
        if (g.label === 'σ') {
          // ambush: target 3 ahead of player
          tx = wrap(p.x + 3 * (s.dir.x || 0));
          ty = p.y + 3 * (s.dir.y || 0);
          ty = Math.max(0, Math.min(ROWS - 1, ty));
        } else if (g.label === '∞') {
          // random-ish: 30% chance random neighbor
          if (Math.random() < 0.3) {
            const opts = Object.values(DIRS)
              .map((d) => ({ x: wrap(g.x + d.x), y: g.y + d.y }))
              .filter((n) => !isWall(n.x, n.y));
            if (opts.length) {
              const pick = opts[Math.floor(Math.random() * opts.length)];
              g.x = pick.x; g.y = pick.y;
              continue;
            }
          }
        } else if (g.label === '?') {
          // wander when far, chase when close
          const dist = Math.abs(g.x - p.x) + Math.abs(g.y - p.y);
          if (dist > 8) { tx = g.home.x; ty = g.home.y; }
        }
        const nxt = bfsNext(g.x, g.y, tx, ty);
        if (nxt) { g.x = nxt.x; g.y = nxt.y; }
      }
      // collision check after move
      if (g.x === p.x && g.y === p.y) handleCollision(g);
    }
    // drop frightened flag
    if (!fright) {
      for (const g of s.ghosts) g.frightened = false;
    }
  }

  function handleCollision(g) {
    const s = stateRef.current;
    if (g.frightened && !g.eaten) {
      g.eaten = true;
      g.frightened = false;
      setScore((sc) => sc + 200);
      return;
    }
    if (g.eaten) return;
    // player dies
    setLives((lv) => {
      const nl = lv - 1;
      if (nl <= 0) {
        setStatus('gameover');
      } else {
        // reset positions
        const fresh = parseMaze(MAZE);
        s.player = { ...fresh.player };
        s.dir = { x: 0, y: 0 };
        s.queuedDir = { x: 0, y: 0 };
        s.ghosts.forEach((gg, i) => {
          const home = fresh.ghostSpawns[i % fresh.ghostSpawns.length];
          gg.x = home.x; gg.y = home.y; gg.eaten = false; gg.frightened = false;
        });
        setFrightenedUntil(0);
        setStatus('ready');
      }
      return nl;
    });
  }

  // ---------- Render ----------
  const boardW = COLS * cellSize;
  const boardH = ROWS * cellSize;
  const s = stateRef.current;
  const now = performance.now();
  const fright = now < frightenedUntil;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 560,
        background: '#07090d',
        color: '#e6edf3',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* HUD */}
      <div style={{
        width: boardW,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        fontSize: 13,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: '#9aa4b2',
      }}>
        <div>
          <span style={{ color: '#e6edf3' }}>df.dropna()</span>
          <span style={{ marginLeft: 12 }}>level {level}</span>
        </div>
        <div style={{ color: '#e6edf3', fontVariantNumeric: 'tabular-nums' }}>
          score <b style={{ color: '#fde68a' }}>{score.toString().padStart(5, '0')}</b>
        </div>
        <div>
          lives {Array.from({ length: lives }).map((_, i) => (
            <span key={i} style={{ color: '#fde68a', marginLeft: 4 }}>●</span>
          ))}
        </div>
      </div>

      {/* Board */}
      <div style={{
        position: 'relative',
        width: boardW,
        height: boardH,
        background: '#0b0f17',
        border: '1px solid #1b2130',
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        {/* dataset column headers (decorative) */}
        <DatasetHeader cols={COLS} cellSize={cellSize} />
        <svg width={boardW} height={boardH} style={{ display: 'block' }}>
          {/* walls as thin rounded bars */}
          {MAZE.map((row, y) =>
            row.split('').map((ch, x) => {
              if (ch !== '#') return null;
              return (
                <rect
                  key={`w${x}-${y}`}
                  x={x * cellSize + cellSize * 0.18}
                  y={y * cellSize + cellSize * 0.18}
                  width={cellSize * 0.64}
                  height={cellSize * 0.64}
                  rx={cellSize * 0.12}
                  fill="#11223d"
                  stroke="#1e3a68"
                  strokeWidth={1}
                />
              );
            })
          )}

          {/* pellets: literal "NaN" glyphs */}
          {[...s.pellets].map((k) => {
            const [x, y] = k.split(',').map(Number);
            return (
              <text
                key={`p${k}`}
                x={x * cellSize + cellSize / 2}
                y={y * cellSize + cellSize / 2 + cellSize * 0.12}
                textAnchor="middle"
                fontSize={cellSize * 0.42}
                fill="#5b6472"
                fontFamily="ui-monospace, Menlo, monospace"
                style={{ fontWeight: 600 }}
              >
                NaN
              </text>
            );
          })}

          {/* power cells: pulsing ⊘ */}
          {[...s.power].map((k) => {
            const [x, y] = k.split(',').map(Number);
            const pulse = 0.6 + 0.4 * Math.sin(stateRef.current.frameCount / 6 + x + y);
            return (
              <g key={`o${k}`}>
                <circle
                  cx={x * cellSize + cellSize / 2}
                  cy={y * cellSize + cellSize / 2}
                  r={cellSize * 0.28 * pulse}
                  fill="#fde68a"
                  opacity={0.22}
                />
                <circle
                  cx={x * cellSize + cellSize / 2}
                  cy={y * cellSize + cellSize / 2}
                  r={cellSize * 0.18}
                  fill="#fde68a"
                />
                <line
                  x1={x * cellSize + cellSize * 0.32}
                  y1={y * cellSize + cellSize * 0.32}
                  x2={x * cellSize + cellSize * 0.68}
                  y2={y * cellSize + cellSize * 0.68}
                  stroke="#07090d"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}

          {/* Player: data cursor disk */}
          <PlayerSprite
            x={s.player.x}
            y={s.player.y}
            dir={s.dir}
            cellSize={cellSize}
            mouthOpen={s.mouthOpen}
          />

          {/* Ghosts: outlier bots */}
          {s.ghosts.map((g, i) => (
            <GhostSprite
              key={i}
              g={g}
              cellSize={cellSize}
              fright={fright && g.frightened && !g.eaten}
              frightEnding={fright && frightenedUntil - now < 1800 && g.frightened && !g.eaten}
            />
          ))}
        </svg>

        {/* Overlays */}
        {status !== 'playing' && (
          <Overlay status={status} onStart={() => setStatus('playing')} onRestart={() => restart(true)} level={level} />
        )}
      </div>

      {/* Footer */}
      <div style={{
        width: boardW,
        marginTop: 12,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: '#5b6472',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}>
        <span>arrows / wasd · space to pause · r to restart</span>
        <span>eat NaNs · avoid outliers · ⊘ flips the tables</span>
      </div>
    </div>
  );
}

// ---------- Subcomponents ----------
function DatasetHeader({ cols, cellSize }) {
  const names = ['id','age','lat','lng','val','cat','pct','ts','x1','x2','x3','y','err','mu','sd','z','r2','k','q'];
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: cols * cellSize,
      height: cellSize,
      display: 'flex',
      pointerEvents: 'none',
      opacity: 0.35,
      zIndex: 1,
    }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} style={{
          width: cellSize,
          textAlign: 'center',
          fontSize: Math.max(8, cellSize * 0.32),
          color: '#7aa2d8',
          fontFamily: 'ui-monospace, Menlo, monospace',
          lineHeight: `${cellSize}px`,
        }}>
          {names[i % names.length]}
        </div>
      ))}
    </div>
  );
}

function PlayerSprite({ x, y, dir, cellSize, mouthOpen }) {
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;
  const r = cellSize * 0.42;
  // Angle of mouth opening based on direction
  let angle = 0; // facing right
  if (dir.x === 1) angle = 0;
  else if (dir.x === -1) angle = 180;
  else if (dir.y === -1) angle = -90;
  else if (dir.y === 1) angle = 90;
  const mouth = mouthOpen ? 45 : 8;
  const startA = (angle - mouth) * Math.PI / 180;
  const endA = (angle + mouth) * Math.PI / 180;
  const sx = cx + r * Math.cos(startA);
  const sy = cy + r * Math.sin(startA);
  const ex = cx + r * Math.cos(endA);
  const ey = cy + r * Math.sin(endA);
  const largeArc = 1;
  const path = `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 0 ${ex} ${ey} Z`;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 1.5} fill="none" stroke="#fde68a" strokeOpacity={0.25} strokeWidth={2} />
      <path d={path} fill="#fde68a" />
      {/* eye */}
      <circle cx={cx + (dir.y ? 0 : 0)} cy={cy - r * 0.45} r={r * 0.11} fill="#07090d" />
    </g>
  );
}

function GhostSprite({ g, cellSize, fright, frightEnding }) {
  const cx = g.x * cellSize + cellSize / 2;
  const cy = g.y * cellSize + cellSize / 2;
  const r = cellSize * 0.42;
  const bodyColor = g.eaten ? 'transparent' : (fright ? (frightEnding ? '#e6edf3' : '#3b82f6') : g.color);
  const stroke = g.eaten ? '#e6edf3' : 'none';
  // body: rounded top + wavy bottom
  const top = cy - r;
  const bot = cy + r * 0.85;
  const left = cx - r;
  const right = cx + r;
  const waveCount = 4;
  let waves = '';
  for (let i = 0; i < waveCount; i++) {
    const x1 = left + (2 * r) * (i / waveCount);
    const x2 = left + (2 * r) * ((i + 0.5) / waveCount);
    const x3 = left + (2 * r) * ((i + 1) / waveCount);
    waves += ` L ${x2} ${bot - r * 0.22} L ${x3} ${bot}`;
  }
  const d = `M ${left} ${bot} L ${left} ${cy} A ${r} ${r} 0 0 1 ${right} ${cy} L ${right} ${bot}${waves}`;
  return (
    <g opacity={g.eaten ? 0.65 : 1}>
      <path d={d} fill={bodyColor} stroke={stroke} strokeWidth={g.eaten ? 1.5 : 0} />
      {/* eyes */}
      <circle cx={cx - r * 0.35} cy={cy - r * 0.1} r={r * 0.22} fill="#e6edf3" />
      <circle cx={cx + r * 0.3} cy={cy - r * 0.1} r={r * 0.22} fill="#e6edf3" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.05} r={r * 0.1} fill="#07090d" />
      <circle cx={cx + r * 0.35} cy={cy - r * 0.05} r={r * 0.1} fill="#07090d" />
      {/* label */}
      {!g.eaten && !fright && (
        <text
          x={cx}
          y={cy + r * 0.55}
          textAnchor="middle"
          fontSize={r * 0.7}
          fill="#07090d"
          fontFamily="ui-monospace, Menlo, monospace"
          fontWeight="700"
        >
          {g.label}
        </text>
      )}
    </g>
  );
}

function Overlay({ status, onStart, onRestart, level }) {
  const map = {
    ready: { title: 'Ready?', body: 'Eat the NaNs. Avoid the outliers.', btn: 'Start', action: onStart },
    paused: { title: 'Paused', body: 'df.query(" paused == True ")', btn: 'Resume', action: onStart },
    dead: { title: 'Caught!', body: 'Respawning…', btn: null, action: null },
    won: { title: 'Dataset cleaned', body: `Level ${level - 1} complete — loading next partition…`, btn: null, action: null },
    gameover: { title: 'Game over', body: 'Your pipeline crashed.', btn: 'Restart', action: onRestart },
  };
  const m = map[status] || map.ready;
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(7, 9, 13, 0.78)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      color: '#e6edf3',
      textAlign: 'center',
      padding: 24,
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 8,
      }}>{m.title}</div>
      <div style={{ color: '#9aa4b2', fontSize: 14, marginBottom: 18 }}>{m.body}</div>
      {m.btn && (
        <button
          onClick={m.action}
          style={{
            background: '#fde68a',
            color: '#07090d',
            border: 'none',
            padding: '10px 22px',
            borderRadius: 4,
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >{m.btn}</button>
      )}
    </div>
  );
}
