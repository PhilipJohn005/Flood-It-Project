"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid3X3 } from 'lucide-react';

export default function SinglePlayerConfigForm() {
  const [gridSize, setGridSize] = useState(8);
  const [colorCount, setColorCount] = useState(5);
  const [rounds, setRounds] = useState(1);
  const router = useRouter();

  const handleStartGame = () => {
    const queryParams = new URLSearchParams({
      grid: gridSize.toString(),
      colors: colorCount.toString(),
      rounds: rounds.toString(),
      name:"John"
    });
    router.push(`/single-player/play?${queryParams.toString()}`);
  };

  return (
    <div className='py-20 min-h-screen'>

    <div className="p-6 max-w-md mx-auto border bg-gray-100 rounded-xl shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          <Grid3X3 size={20} className="text-gray-200" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Start Single Player</h2>
      </div>

      {/* Grid Size */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Grid Size: {gridSize}x{gridSize}
        </label>
        <input type="range" min="6" max="16" value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="w-full" />
        <div className="flex justify-between text-xs text-gray-500">
            <span>6×6</span>
            <span>16x16</span>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Colors: {colorCount}
        </label>
        <input type="range" min="3" max="8" value={colorCount}
          onChange={(e) => setColorCount(Number(e.target.value))}
          className="w-full" />
        <div className='flex justify-between text-xs text-gray-500'>
          <span>3</span>
          <span>8</span>
        </div>
      </div>

      {/* Rounds */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Rounds: {rounds}
        </label>
        <input type="range" min="1" max="10" value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="w-full" />
        <div className='flex justify-between text-xs text-gray-500'>
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <button
        onClick={handleStartGame}
        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Play
      </button>
    </div>
    </div>

  );
}
