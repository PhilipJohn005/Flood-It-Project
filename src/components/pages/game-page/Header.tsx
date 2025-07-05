"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Crown, Grid3X3, Palette, Users,Check,Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useState } from 'react'



interface Player {
  id: string;
  name: string;
}
interface Room {
  host: string;
  players: Player[];
  settings: { gridSize: number; colors: number; rounds: number };
  started: boolean;
}

type HeaderProps={
    gridSize:number,
    score:number,
    moves:number,
    isPlaying:Boolean,
    rounds:number,
    isCreator:Boolean,
    currentRound:number,
    roomKey:string | string[],
    room: Room | null,
    colors:number,
    liveElapsed:number,
    startGame: ()=>void
}


const Header= ({
    roomKey,
    isCreator,
    currentRound,
    rounds,
    gridSize,
    colors,
    room,
    score,
    moves,
    isPlaying,
    startGame,
    liveElapsed}:HeaderProps)=> {

    const router = useRouter()
    const [copied, setCopied] = useState(false)
    

    const copyRoomKey = async () => {
        if (roomKey && typeof roomKey === 'string') {
        await navigator.clipboard.writeText(roomKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        
        }
    }
    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const msLeft = ms % 1000;
        return `${s}.${msLeft.toString().padStart(3, '0')}s`;
    };


  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/multi-player')}
                  size="sm"
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Leave
                </Button>
                <h1 className="text-2xl font-bold">Room: {roomKey}</h1>
                {isCreator && (
                  <Badge variant="secondary">
                    <Crown size={14} className="mr-1" />
                    Creator
                  </Badge>
                )}
                <Badge variant="secondary">
                  Round {currentRound}/{rounds}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Grid3X3 size={16} />
                  {gridSize}x{gridSize}
                </span>
                <span className="flex items-center gap-1">
                  <Palette size={16} />
                  {colors} colors
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {room?.players?.length ?? 1} Joined
                </span>
                <span>Score: {score}</span>
                <span>Moves: {moves}</span>
              </div>
              {!isPlaying && isCreator &&(
                <Button 
                  onClick={startGame}
                  className="mt-2"
                >
                  Start Game
                </Button>
              )}
              {!isPlaying && !isCreator && (
                <p className="text-sm text-gray-500 mt-2">Waiting for host to start the game...</p>
              )}
              <span>Time: {formatTime(liveElapsed)}</span>
            </div>  
          </div>

          <Button
            onClick={copyRoomKey}
            variant="outline"
          >
            {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
            {copied ? 'Copied!' : 'Share Room Key'}
          </Button>
        </div>
  )
}

export default Header
