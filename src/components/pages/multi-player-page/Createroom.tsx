"use client";

import React, { useRef, useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import { useSession } from 'next-auth/react';

const Createroom = () => {
  const [gridSize, setGridSize] = useState(8);
  const [colorCount, setColorCount] = useState(4);
  const [rounds, setRounds] = useState(5);
  const router = useRouter();
  const socket = getSocket();
  const {data:session}=useSession();

  const userName=session?.user?.name ?? "Guest";


  const handleCreateRoom = () => {
    socket.emit("create-room", {
      userName,
      gridSize,
      colors: colorCount,
      rounds,
    }, ({ roomKey }: { roomKey: string }) => {
      const queryParams = new URLSearchParams({
        userName,
        mode: 'create',
      });
      router.push(`/multi-player/${roomKey}?${queryParams.toString()}`);
    });
  };

  return (
    <div className=''>
      <div className="rounded-xl p-6 border border-gray-300 shadow-sm bg-gray-800" >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
            <Grid3X3 size={20} className="text-gray-200" />
          </div>
          <h2 className="text-xl font-medium text-gray-300">Create New Room</h2>
        </div>

        <div className='space-y-3 mb-3'>
          <label className="block text-sm font-medium text-gray-300">Name:</label>
          <input
            placeholder={`${userName}`}
            disabled={true}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none text-center font-mono tracking-wider"
          />
        </div>

        <div className="space-y-6">
          {/* Grid Size */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Grid Size: {gridSize}×{gridSize}
            </label>
            <input
              type="range"
              min="8"
              max="16"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>8x8</span>
              <span>16x16</span>
            </div>
          </div>

          {/* Color Count */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Colors: {colorCount}
            </label>
            <input
              type="range"
              min="4"
              max="8"
              value={colorCount}
              onChange={(e) => setColorCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>4 colors</span>
              <span>8 colors</span>
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Rounds: {rounds}
            </label>
            <input
              type="range"
              min="5"
              max="24"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>5 round</span>
              <span>24 rounds</span>
            </div>
          </div>

          {/* Preview */}
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

          <button
            onClick={handleCreateRoom}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Createroom;
