"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid3X3 } from 'lucide-react';

export default function SinglePlayerConfigForm() {
  const [gridSize, setGridSize] = useState(8);
  const [colorCount, setColorCount] = useState(4);
  const [rounds, setRounds] = useState(5);
  const router = useRouter();

  const handleStartGame = () => {
    const queryParams = new URLSearchParams({
      grid: gridSize.toString(),
      colors: colorCount.toString(),
      rounds: rounds.toString(),
      name:"k2"
    });
    router.push(`/single-player/play?${queryParams.toString()}`);
  };

  return (
    <div className='pt-15 min-h-screen bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600'>

    <div className="p-6 max-w-md mx-auto border bg-gray-800 border-gray-300 rounded-xl shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          <Grid3X3 size={20} className="text-gray-200" />
        </div>
        <h2 className="text-xl font-medium text-gray-300">Start Single Player</h2>
      </div>

      {/* Grid Size */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-300">
          Grid Size: {gridSize}x{gridSize}
        </label>
        <input type="range" min="8" max="16" value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="w-full" />
        <div className="flex justify-between text-xs text-gray-300">
            <span>8x8</span>
            <span>16x16</span>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-300">
          Colors: {colorCount}
        </label>
        <input type="range" min="4" max="8" value={colorCount}
          onChange={(e) => setColorCount(Number(e.target.value))}
          className="w-full" />
        <div className='flex justify-between text-xs text-gray-300'>
          <span>4</span>
          <span>8</span>
        </div>
      </div>

      {/* Rounds */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-300">
          Rounds: {rounds}
        </label>
        <input type="range" min="5" max="24" value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="w-full" />
        <div className='flex justify-between text-xs text-gray-300'>
          <span>5</span>
          <span>24</span>
        </div>
      </div>
      <div className="bg-gray-200 rounded-lg p-4 border border-gray-300">
            <h3 className="text-sm font-medium mb-3 text-gray-700">Configuration</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Canvas Size:</span>
                <span>{gridSize}×{gridSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Color Palette:</span>
                <span>{colorCount} colors</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pixels:</span>
                <span>{gridSize * gridSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Rounds:</span>
                <span>{rounds}</span>
              </div>
            </div>
          </div>
          <div className='pt-6'>
            <button
              onClick={handleStartGame}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Play
            </button>
          </div>
      
    </div>
    </div>

  );
}
