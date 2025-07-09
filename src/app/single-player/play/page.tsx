"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Board from "@/components/pages/game-page/Board";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { random } from "nanoid";

type CellColor = number;

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
];

const SinglePlayerPage = () => {
  const searchParams = useSearchParams();
  const gridSize = Number(searchParams.get("grid") || 4);
  const colors = Number(searchParams.get("colors") || 5);
  const rounds = Number(searchParams.get("rounds") || 1);
  const name = searchParams.get("name") || "Unknown";

  const [board, setBoard] = useState<CellColor[][]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedColor, setSelectedColor] = useState<CellColor | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [liveElapsed, setLiveElapsed] = useState<number>(0);
  const [isRoundOver, setRoundOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeBoard = useCallback(() => {
    const newBoard: CellColor[][] = [];
    for (let i = 0; i < gridSize; i++) {
      const row: CellColor[] = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(Math.floor(Math.random() * colors));
      }
      newBoard.push(row);
    }

    setBoard(newBoard);
    setIsPlaying(true);
    setGameWon(false);
    setRoundOver(false);
    setSelectedColor(null);
  }, [gridSize, colors]);

  useEffect(() => {
    if (gameStarted) {
      initializeBoard();

      const now = Date.now();
      setStartTime(now);
      setLiveElapsed(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setLiveElapsed(Date.now() - now);
      }, 100);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, initializeBoard]);

  const floodFill = (
    board: CellColor[][],
    currentStartColor: CellColor,
    newColor: CellColor,
    x = 0,
    y = 0
  ) => {
    const boundary = gridSize;
    if (x < 0 || y < 0 || x >= boundary || y >= boundary) return;
    if (currentStartColor !== board[x][y] || newColor === board[x][y]) return;

    board[x][y] = newColor;

    floodFill(board, currentStartColor, newColor, x - 1, y);
    floodFill(board, currentStartColor, newColor, x, y - 1);
    floodFill(board, currentStartColor, newColor, x + 1, y);
    floodFill(board, currentStartColor, newColor, x, y + 1);
  };

  const handleColorClick =async (colorIndex: CellColor) => {
    if (isGameOver || !isPlaying || gameWon || isRoundOver) return;

    setSelectedColor(colorIndex);
    const newBoard = board.map((row) => [...row]);
    const startColor = newBoard[0][0];

    floodFill(newBoard, startColor, colorIndex);
    setBoard(newBoard);

    const newMoves = moves + 1;
    setMoves(newMoves);

    const allSameColor = newBoard.every((row) =>
      row.every((cell) => cell === newBoard[0][0])
    );

    if (allSameColor) {
      setGameWon(true);
      setRoundOver(true);
      const roundScore = Math.max(100 - newMoves * 5, 10);
      setScore((prev) => prev + roundScore);

      if (currentRound === rounds) {
        if (timerRef.current) clearInterval(timerRef.current);
        const now = Date.now();
        setTimeTaken(now - startTime);
        const endTime=now-startTime;
        setIsGameOver(true);
        setIsPlaying(false);
        const playerId = Math.random().toString(36).substring(2, 12);

        try{
            const insertIntoDB=await fetch("http://localhost:4000/insertSinglePlayer",{
                method:"POST",
                body:JSON.stringify({
                    playerId,
                    player:name,
                    moves,
                    score,
                    gridSize,
                    rounds,
                    colors,
                    endTime,
                }),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            console.log(insertIntoDB);
        }catch(e){
            console.log("Some error occured"+e);
        }

      }
    }
  };

  const handleNext = () => {
    if (currentRound < rounds) {
      setCurrentRound((prev) => prev + 1);
      initializeBoard();
    }
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const msLeft = ms % 1000;
    return `${s}.${msLeft.toString().padStart(3, "0")}s`;
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-300 space-y-4">
        <h1 className="text-xl font-semibold text-center">🎮 Single Player</h1>

        <div className="space-y-1 text-sm text-gray-700 text-center">
          <p>
            <strong>Player:</strong> {name}
          </p>
          <p>
            <strong>Round:</strong> {currentRound} / {rounds}
          </p>
          <p>
            <strong>Moves:</strong> {moves}
          </p>
          <p>
            <strong>Score:</strong> {score}
          </p>
          {gameStarted && !isGameOver && (
            <p>
              <strong>Time:</strong> {formatTime(liveElapsed)}
            </p>
          )}
          {isGameOver && timeTaken !== null && (
            <p>
              <strong>Total Time:</strong> {formatTime(timeTaken)}
            </p>
          )}
        </div>

        {!gameStarted && (
          <div className="text-center">
            <Button onClick={handleGameStart}>Start Game</Button>
          </div>
        )}

        {gameStarted && (
          <>
            <div className="flex justify-center">
              <Board gridSize={gridSize} board={board} COLORS={COLORS} />
            </div>

            <div className="grid grid-cols-5 gap-2 pt-4">
              {COLORS.slice(0, colors).map((colorClass, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorClick(idx)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${colorClass} ${
                    selectedColor === idx ? "ring-2 ring-black" : ""
                  }`}
                  aria-label={`Color ${idx}`}
                />
              ))}
            </div>

            {isGameOver && (
              <div className="text-center pt-4 text-green-600 font-medium">
                🎉 Game Over! Final Score: {score}
              </div>
            )}

            {isRoundOver && !isGameOver && (
              <div className="text-center pt-4">
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  Next Round
                </Button>
              </div>
            )}

            {!isRoundOver && !isGameOver && (
              <div className="text-center pt-4 text-gray-500">
                Waiting for round to finish...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SinglePlayerPage;
