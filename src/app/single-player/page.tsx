"use client"
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Palette, Clock, Trophy } from "lucide-react";
import useToast from "react-hook-toast";
type User = {
  id: string;
  username: string;
  email: string;
};

interface GameBoardProps {
  onBack: () => void;
  onScoreChange: (score: number) => void;
  onMovesChange: (moves: number) => void;
  mode: 'single' | 'multiplayer';
  user?: User | null;
}

type CellColor = number;

const COLORS = [
  'bg-red-500',
  'bg-blue-500', 
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-gray-500',
  'bg-orange-500'
];

const LEVELS = [
  { level: 1, boardSize: 6, colors: 4, timeLimit: 60, name: "Beginner" },
  { level: 2, boardSize: 8, colors: 4, timeLimit: 58, name: "Easy" },
  { level: 3, boardSize: 8, colors: 5, timeLimit: 56, name: "Medium" },
  { level: 4, boardSize: 10, colors: 5, timeLimit: 54, name: "Hard" },
  { level: 5, boardSize: 10, colors: 6, timeLimit: 50, name: "Expert" },
  { level: 6, boardSize: 10, colors: 7, timeLimit: 54, name: "x" },
  { level: 7, boardSize: 10, colors: 8, timeLimit: 45, name: "xl" },
];
const GameBoard = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [board, setBoard] = useState<CellColor[][]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].timeLimit);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeReduction, setTimeReduction] = useState(0);

  const toast = useToast();

  const currentLevelConfig = LEVELS[currentLevel - 1];

  const onMovesChange=(moves:number)=>{
    setMoves(moves);
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0 && !gameWon && !gameOver) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setIsPlaying(false);
            toast({
              title: "Time's Up!",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, gameWon, gameOver, toast]);

  // Initialize board with random colors
  const initializeBoard = useCallback(() => {
    const { boardSize, colors, timeLimit } = currentLevelConfig;
    const adjustedTimeLimit = Math.max(30, timeLimit - timeReduction); // Minimum 30 seconds
    const newBoard: CellColor[][] = [];
    
    for (let i = 0; i < boardSize; i++) {
      const row: CellColor[] = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(Math.floor(Math.random() * colors));
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
    setMoves(0);
    setTimeLeft(adjustedTimeLimit);
    setGameWon(false);
    setGameOver(false);
    setIsPlaying(true);
  }, [currentLevelConfig, timeReduction]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard, currentLevel]);

  useEffect(() => {
    onMovesChange(moves);
  }, [moves, onMovesChange]);

  // Flood fill algorithm
  const floodFill = (board: CellColor[][], startColor: CellColor, newColor: CellColor, x = 0, y = 0) => {
    const { boardSize } = currentLevelConfig;
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) return;
    if (board[x][y] !== startColor || board[x][y] === newColor) return;

    board[x][y] = newColor;

    // Recursively fill adjacent cells
    floodFill(board, startColor, newColor, x + 1, y);
    floodFill(board, startColor, newColor, x - 1, y);
    floodFill(board, startColor, newColor, x, y + 1);
    floodFill(board, startColor, newColor, x, y - 1);
  };

  const handleColorClick = (colorIndex: CellColor) => {
    if (gameWon || gameOver || board[0][0] === colorIndex || !isPlaying) return;

    const newBoard = board.map(row => [...row]);
    const startColor = newBoard[0][0];
    
    floodFill(newBoard, startColor, colorIndex);
    setBoard(newBoard);
    
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Check if game is won (all cells same color)
    const allSameColor = newBoard.every(row => 
      row.every(cell => cell === newBoard[0][0])
    );

    if (allSameColor) {
      setGameWon(true);
      setIsPlaying(false);
      const timeBonus = timeLeft * 10;
      const moveBonus = Math.max(0, (20 - newMoves) * 50);
      const levelBonus = currentLevel * 100;
      
      toast({
        title: "Level Complete! 🎉",
      });
    }
  };

  const resetLevel = () => {
    initializeBoard();
  };

  const nextLevel = () => {
    if (currentLevel < LEVELS.length) {
      setCurrentLevel(currentLevel + 1);
      // Reduce time by 15 seconds for next level (cumulative)
      setTimeReduction(prev => prev + 15);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-2 sm:space-y-4 px-2">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                Level {currentLevel}: {currentLevelConfig.name}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm mt-1 sm:mt-0">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTime(timeLeft)}
                {timeReduction > 0 && (
                  <span className="text-red-600 ml-1">(-{timeReduction}s)</span>
                )}
              </span>
              
            </CardTitle>
            
            <Button 
              variant="outline" 
              onClick={resetLevel}
              size="sm"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-6">
          {/* Game Stats */}
          <div className="flex justify-center space-x-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{moves}</div>
              <div className="">Moves</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{currentLevelConfig.boardSize}x{currentLevelConfig.boardSize}</div>
              <div className="">Board</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{currentLevelConfig.colors}</div>
              <div className="">Colors</div>
            </div>
          </div>

          {/* Game Board */}
          <div className="p-2 sm:p-4 bg-gray-50 rounded border">
            <div 
              className="grid gap-1 max-w-xs mx-auto"
              style={{ gridTemplateColumns: `repeat(${currentLevelConfig.boardSize}, 1fr)` }}
            >
              {board.map((row, i) => 
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`aspect-square rounded ${COLORS[cell]} ${
                      i === 0 && j === 0 ? 'ring-2 ring-black' : ''
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-4 p-2 sm:p-4 bg-gray-50 rounded border">
            <div className="flex items-center justify-center space-x-2">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Choose Color:</span>
            </div>
            <div className="flex justify-center space-x-2">
              {COLORS.slice(0, currentLevelConfig.colors).map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(index)}
                  disabled={gameWon || gameOver || board[0]?.[0] === index || !isPlaying}
                  className={`w-10 h-10 rounded ${color} border-2 border-gray-300 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                    board[0]?.[0] === index ? 'ring-2 ring-black' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Game Status */}
          {(gameWon || gameOver) && (
            <div className="text-center space-y-3 sm:space-y-4 p-3 sm:p-4 border rounded bg-gray-50">
              <div className="space-y-2">
                <p className="text-lg sm:text-xl font-bold">
                  {gameWon ? '🎉 Level Complete!' : '⏰ Time Up!'}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  {gameWon 
                    ? `Completed in ${moves} moves with ${formatTime(timeLeft)} remaining!` 
                    : 'Try again to beat this level!'
                  }
                </p>
                {gameWon && currentLevel < LEVELS.length && (
                  <p className="text-xs text-orange-600">
                    Next level will have 15 seconds less time!
                  </p>
                )}
              </div>
              <div className="flex justify-center space-x-2">
                <Button 
                  onClick={resetLevel}
                  variant="outline"
                  className="text-sm sm:text-base"
                >
                  Retry Level
                </Button>
                {gameWon && currentLevel < LEVELS.length && (
                  <Button 
                    onClick={nextLevel}
                    className="bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    Next Level
                  </Button>
                )}
                {gameWon && currentLevel === LEVELS.length && (
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">🎊 All Levels Complete!</p>
                    <p className="text-sm text-gray-600">You're a FloodFill Master!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameBoard;