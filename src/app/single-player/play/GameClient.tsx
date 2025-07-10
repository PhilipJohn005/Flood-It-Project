"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Board from "@/components/pages/game-page/Board";
import { Trophy, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

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

type CellColor = number;

type Props = {
  gridSize: number;
  colors: number;
  rounds: number;
  name: string;
};
type Prop = {
  searchParams: Record<string, string | string[] | undefined>;
};

const GameClient = ({ searchParams }:Prop) => {
     const gridSize = Number(searchParams.grid ?? 8);
  const colors = Number(searchParams.colors ?? 4);
  const rounds = Number(searchParams.rounds ?? 5);
  const name =
    typeof searchParams.name === "string" ? searchParams.name : "Unknown";
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
    if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return;
    if (currentStartColor !== board[x][y] || newColor === board[x][y]) return;

    board[x][y] = newColor;

    floodFill(board, currentStartColor, newColor, x - 1, y);
    floodFill(board, currentStartColor, newColor, x, y - 1);
    floodFill(board, currentStartColor, newColor, x + 1, y);
    floodFill(board, currentStartColor, newColor, x, y + 1);
  };

  const handleColorClick = async (colorIndex: CellColor) => {
    if (isGameOver || !isPlaying || gameWon) return;
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
      const roundScore = Math.max(100 - newMoves * 5, 10);
      setScore(score + roundScore);

      if (currentRound === rounds) {
        if (timerRef.current) clearInterval(timerRef.current);
        const endTime = Date.now();
        setIsGameOver(true);
        setIsPlaying(false);
        setTimeTaken(endTime - startTime);

        try {
          await fetch("http://localhost:4000/insertSinglePlayer", {
            method: "POST",
            body: JSON.stringify({
              playerId: Math.random().toString(36).substring(2, 12),
              player: name,
              moves: newMoves,
              score,
              gridSize,
              rounds,
              colors,
              endTime: endTime - startTime,
            }),
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("Failed to insert:", e);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentRound < rounds) {
      setCurrentRound((prev) => prev + 1);
      initializeBoard();
      setGameWon(false);
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const msLeft = ms % 1000;
    return `${s}.${msLeft.toString().padStart(3, "0")}s`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-semibold">Welcome, {name}</h2>
          <p className="text-sm text-muted-foreground">Single Player Mode</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Game */}
          <div>
            {!gameStarted && (
              <Button onClick={() => setGameStarted(true)}>Start Game</Button>
            )}
            <Board gridSize={gridSize} board={board} COLORS={COLORS} />
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mt-4">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <div className="flex justify-center space-x-2 p-3 bg-gray-50 rounded border">
                {COLORS.slice(0, colors).map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorClick(index)}
                    disabled={gameWon || isGameOver}
                    className={`w-8 h-8 rounded ${color} border-2 border-gray-300 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 ${
                      board[0]?.[0] === index ? "ring-2 ring-black" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">👤 Player</span>
                  <span>{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🏁 Round</span>
                  <span>{currentRound} / {rounds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🎯 Moves</span>
                  <span>{moves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🏆 Score</span>
                  <span>{score}</span>
                </div>
                {gameStarted && !isGameOver && (
                  <div className="flex justify-between">
                    <span className="font-medium">⏱️ Time</span>
                    <span>{formatTime(liveElapsed)}</span>
                  </div>
                )}
                {isGameOver && timeTaken !== null && (
                  <div className="flex justify-between">
                    <span className="font-medium">⌛ Total Time</span>
                    <span>{formatTime(timeTaken)}</span>
                  </div>
                )}
              </div>
            </div>

            {gameWon && (
              <div className="text-center space-y-3 p-4 border rounded">
                <p className="text-lg font-bold text-green-600">
                  <PartyPopper className="inline mr-2" />
                  Round {currentRound} Complete!
                </p>
                <p className="text-sm text-gray-600">Completed in {moves} moves!</p>
                {currentRound < rounds ? (
                  <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 w-full">
                    <Trophy className="w-4 h-4 mr-1" /> Next Round
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-purple-600">Game Complete!</p>
                    <p className="text-sm">Final Score: {score} points</p>
                    <p className="text-sm">Total Moves: <span className="font-mono">{moves}</span></p>
                    <p className="text-sm">Total Time: <span>{formatTime(timeTaken || liveElapsed)}</span></p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameClient;
