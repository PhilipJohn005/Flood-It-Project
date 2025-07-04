"use client"

import React, { useRef, useState,useEffect } from 'react'
import { ArrowLeft,Grid3X3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import io from 'socket.io-client';
import { getSocket } from '@/lib/socket'

const Createroom = () => {
  const [gridSize,setGridSize]=useState(6);
  const [colorCount,setColorCount]=useState(3);
  const [rounds,setRounds]=useState(1);
  const [name,setName]=useState('');
  const router=useRouter();
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  
  const socket=getSocket();


  const handleCreateRoom = () => {
     socket.emit("create-room", {
      name,
      gridSize,
      colors: colorCount,
      rounds,
    }, ({ roomKey }: { roomKey: string }) => {
      const queryParams = new URLSearchParams({
        name,
        mode: 'create',
      });

      router.push(`/multi-player/${roomKey}?${queryParams.toString()}`);
    });    
  };

  return (
    <div>
        <div className="rounded-xl p-6 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <Grid3X3 size={20} className="text-slate-300" />
              </div>
              <h2 className="text-xl font-medium">Create New Room</h2>
            </div>
            <div className='space-y-3 mb-3'>
              <label className="block text-sm font-medium">
                  Name:
                </label>
                <input
                  value={name}
                  placeholder='xyz'
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none transition-colors text-center font-mono tracking-wider"
                />
            </div>

            <div className="space-y-6">
              {/* Grid Size */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Grid Size: {gridSize}×{gridSize}
                </label>
                <input
                  type="range"
                  min="6"
                  max="16"
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs">
                  <span>6×6</span>
                  <span>16x16</span>
                </div>
              </div>

              {/* Color Count */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Colors: {colorCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={colorCount}
                  onChange={(e) => setColorCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs">
                  <span>3 colors</span>
                  <span>8 colors</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Rounds: {rounds}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rounds}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setRounds(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs">
                  <span>1 round</span>
                  <span>10 round</span>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium mb-3">Configuration</h3>
                <div className="space-y-2 text-sm">
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
                  <div className='flex justify-between'>
                    <span>Total Rounds:</span>
                    <span>{rounds}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Create Room
              </button>
            </div>
          </div>
    </div>
  )
}

export default Createroom
