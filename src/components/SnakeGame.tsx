import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const head = snake[0];
    const newHead = {
      x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    // Check collision with self
    if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check if food eaten
    if (newHead.x === food.x && newHead.y === food.y) {
      const newScore = score + 10;
      setScore(newScore);
      onScoreChange(newScore);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-black border-4 border-cyan w-full max-w-lg shadow-[8px_8px_0_#ff00ff]">
      <div className="absolute -top-4 right-4 bg-cyan text-black px-3 py-1 text-lg font-bold">
        EXECUTE_SNAKE.EXE
      </div>

      <div className="mb-6 flex justify-between w-full border-b-2 border-dashed border-magenta pb-4">
        <div className="text-cyan text-2xl">
          ENTITIES_CONSUMED: <span className="text-magenta">{score}</span>
        </div>
        <div className="text-white/70 text-xl animate-pulse">
          {isPaused ? 'AWAITING_INPUT' : 'EXECUTING'}
        </div>
      </div>

      <div 
        className="grid bg-[#0a0a0a] border-2 border-white/20 relative"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(100%, 400px)',
          aspectRatio: '1/1',
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ 
               backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
               backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute ${i === 0 ? 'bg-cyan z-10' : 'bg-cyan/70 border border-black'}`}
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
            }}
          >
            {i === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-black" />
              </div>
            )}
          </div>
        ))}

        {/* Food */}
        <div
          className="absolute bg-magenta border-2 border-white animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 border-4 border-magenta screen-tear">
            <h2 className="text-5xl font-bold text-magenta glitch mb-6" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-cyan text-black text-2xl font-bold hover:bg-magenta hover:text-white transition-colors border-2 border-white"
            >
              [ REBOOT_SEQUENCE ]
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 backdrop-blur-sm">
            <div className="text-4xl font-bold text-cyan glitch" data-text="SYSTEM_SUSPENDED">SYSTEM_SUSPENDED</div>
          </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-2 md:hidden w-full max-w-[200px]">
        <div />
        <button onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })} className="p-4 bg-cyan text-black font-bold border-2 border-white">^</button>
        <div />
        <button onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })} className="p-4 bg-cyan text-black font-bold border-2 border-white">&lt;</button>
        <button onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })} className="p-4 bg-cyan text-black font-bold border-2 border-white">v</button>
        <button onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })} className="p-4 bg-cyan text-black font-bold border-2 border-white">&gt;</button>
      </div>
    </div>
  );
};
