import React, { useState, useEffect } from 'react';
import './App.css';

const board_size = 10;
const default_cells_value = Array(board_size).fill(Array(board_size).fill());
const available_moves = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];
const speed = 500;

function App() {
  const [direction, setDirection] = useState(available_moves[0]);
  const [snake, setSnake] = useState([[1, 1]]);
  const [food, setFood] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleKeyDown = (event) => {
    const index = available_moves.indexOf(event.key);
    if (index > -1) {
      setDirection(available_moves[index]);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && !isGameOver) {
      interval = gameLoop();
    }
    return () => clearInterval(interval);
  }, [snake, isPlaying, isGameOver]);

  const checkAvailableSlot = (position) => {
    switch (true) {
      case position >= board_size:
        return 0;
      case position < 0:
        return board_size - 1;
      default:
        return position;
    }
  };

  const generateFood = () => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * board_size),
        Math.floor(Math.random() * board_size)
      ];
    } while (snake.some(elem => elem[0] === newFood[0] && elem[1] === newFood[1]));
    setFood(newFood);
  };

  const checkCollision = (head, snake) => {
    for (let i = 0; i < snake.length; i++) {
      if (snake[i][0] === head[0] && snake[i][1] === head[1]) {
        return true;
      }
    }
    return false;
  };

  const gameLoop = () => {
    const timerId = setTimeout(() => {
      const newSnake = [...snake];
      let move = [];

      switch (direction) {
        case available_moves[0]:
          move = [1, 0];
          break;
        case available_moves[1]:
          move = [-1, 0];
          break;
        case available_moves[2]:
          move = [0, 1];
          break;
        case available_moves[3]:
          move = [0, -1];
          break;
      }

      const head = [
        checkAvailableSlot(newSnake[newSnake.length - 1][0] + move[0]),
        checkAvailableSlot(newSnake[newSnake.length - 1][1] + move[1])
      ];

      if (checkCollision(head, newSnake)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      newSnake.push(head);

      let spliceIndex = 1;

      if (head[0] === food[0] && head[1] === food[1]) {
        spliceIndex = 0;
        generateFood();
        setScore(score + 1); // Увеличиваем очки
      }

      setSnake(newSnake.slice(spliceIndex));
    }, speed);
    return timerId;
  };

  const togglePlayPause = () => {
    if (isGameOver) {
      setSnake([[1, 1]]);
      setFood([0, 0]);
      setIsGameOver(false);
      setDirection(available_moves[0]);
      setScore(0); // Сброс очков
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      {default_cells_value.map((row, indexR) => (
        <div key={indexR} className="row">
          {row.map((cell, indexC) => {
            let type = snake.some(elem => elem[0] === indexR && elem[1] === indexC) && "cell-snake";
            if (type !== "cell-snake") {
              type = (food[0] === indexR && food[1] === indexC) && "cell-food";
            }
            return <div key={indexC} className={`cell ${type}`} />;
          })}
        </div>
      ))}
      <button onClick={togglePlayPause}>
        {isPlaying ? "Pause" : isGameOver ? "Restart" : "Start"}
      </button>
      <div className="score">Score: {score}</div>
      {isGameOver && <div className="game-over">Game Over</div>}
    </div>
  );
}

export default App;
