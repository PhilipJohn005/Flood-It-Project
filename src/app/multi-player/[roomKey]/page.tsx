'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useRef } from 'react'
import {
  Copy, Users, Grid3X3, Palette,
  ArrowLeft, Check, Crown, Trophy
} from 'lucide-react'
import { getSocket } from '@/lib/socket'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Player {
  id: string;
  name: string;
}
type CellColor = number
interface Room {
  host: string;
  players: Player[];
  settings: { gridSize: number; colors: number; rounds: number };
  started: boolean;
}

const COLORS = [
  'bg-red-500',
  'bg-blue-500', 
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500'
];

const RoomPage = () => {
  const { roomKey } = useParams()
  if (!roomKey) return;
  const searchParams = useSearchParams()
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [gridSize, setGridSize] = useState<number>(12)
  const [colors, setColors] = useState<number>(6)
  const [rounds, setRounds] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const mode = searchParams.get('mode') ?? 'join'
  const name = searchParams.get('name') ?? 'Player'
  const isCreator = mode === 'create'
  const [copied, setCopied] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#EF4444')
  const [board, setBoard] = useState<CellColor[][]>([])
  const [moves, setMoves] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const socket = getSocket()
    if (!roomKey || !name) return

    socket.emit('join-room', { roomKey, name }, (res: any) => {
      if (res?.error) {
        alert(res.error)
        router.push('/multi-player')
      }
    })

    const handleUpdate = (updatedRoom: Room) => {
      setRoom(updatedRoom)
      setGridSize(updatedRoom.settings.gridSize)
      setColors(updatedRoom.settings.colors)
      setRounds(updatedRoom.settings.rounds)
      setIsLoading(false)
    }

    socket.on('room-updated', handleUpdate)

    return () => {
      socket.off('room-updated', handleUpdate)
    }
  }, [roomKey, name])

  const copyRoomKey = async () => {
    if (roomKey && typeof roomKey === 'string') {
      await navigator.clipboard.writeText(roomKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
    }
  }

  const initializeBoard = useCallback(() => {
    const newBoard: CellColor[][] = []
    for (let i = 0; i < gridSize; i++) {
      const row: CellColor[] = []
      for (let j = 0; j < gridSize; j++) {
        row.push(Math.floor(Math.random() * colors))
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
    setMoves(0)
    setIsGameOver(false)
    setIsPlaying(true)
    setGameWon(false)
  }, [gridSize, colors])

  const floodFill = (board: CellColor[][], currentStartColor: CellColor, newColor: CellColor, x = 0, y = 0) => {
    const boundaryOfBoard = gridSize
    if (x < 0 || y < 0 || x >= boundaryOfBoard || y >= boundaryOfBoard) return
    if (currentStartColor !== board[x][y] || newColor == board[x][y]) return

    board[x][y] = newColor

    floodFill(board, currentStartColor, newColor, x - 1, y)
    floodFill(board, currentStartColor, newColor, x, y - 1)
    floodFill(board, currentStartColor, newColor, x + 1, y)
    floodFill(board, currentStartColor, newColor, x, y + 1)
  }

  const handleColorClick = (colorIndex: CellColor) => {
    if (isGameOver || !isPlaying || gameWon) return
    setSelectedColor(COLORS[colorIndex])
    const newBoard = board.map(row => [...row])
    const startColor = newBoard[0][0]
    
    floodFill(newBoard, startColor, colorIndex)
    setBoard(newBoard)
    
    const newMoves = moves + 1
    setMoves(newMoves)

    // Check if game is won (all cells same color)
    const allSameColor = newBoard.every(row => 
      row.every(cell => cell === newBoard[0][0])
    )

    if (allSameColor) {
      setGameWon(true)
      const roundScore = Math.max(100 - moves * 5, 10)
      setScore(score + roundScore)
      
      
    }
  }

  const nextRound = () => {
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1)
      initializeBoard()
    } else {
      setIsGameOver(true)
      setIsPlaying(false)
      
    }
  }

  const startGame = () => {
    initializeBoard()
    setIsPlaying(true)
  }

  useEffect(() => {
    if (gridSize && colors) {
      initializeBoard()
    }
  }, [gridSize, colors, initializeBoard])

  const colorPalette = COLORS.slice(0, colors)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              {!isPlaying && (
                <Button 
                  onClick={startGame}
                  className="mt-2"
                >
                  Start Game
                </Button>
              )}
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

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Board */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="p-4 rounded border overflow-auto">
                <div 
                  className="grid gap-1 mx-auto"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    maxWidth: `${Math.min(400, gridSize * 20)}px`
                  }}
                >
                  {board.map((row, i) => 
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`aspect-square rounded ${COLORS[cell]} ${
                          i === 0 && j === 0 ? 'ring-2 ring-black' : ''
                        }`}
                        style={{ minWidth: '12px', minHeight: '12px' }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Color Palette */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <div className="flex justify-center space-x-2 p-3 bg-gray-50 rounded border">
                {colorPalette.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorClick(index)}
                    disabled={gameWon}
                    className={`w-8 h-8 rounded ${color} border-2 border-gray-300 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 ${
                      board[0]?.[0] === index ? 'ring-2 ring-black' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Game Status */}
            {gameWon && (
              <div className="text-center space-y-3 p-4 border rounded bg-green-50">
                <p className="text-lg font-bold text-green-600">
                  🎉 Round {currentRound} Complete!
                </p>
                <p className="text-sm text-gray-600">
                  Completed in {moves} moves!
                </p>
                {currentRound < rounds ? (
                  <Button 
                    onClick={nextRound}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    Next Round
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-purple-600">
                      🏆 Game Complete!
                    </p>
                    <p className="text-sm">Final Score: {score} points</p>
                    <Button 
                      onClick={initializeBoard}
                      variant="outline"
                    >
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Room Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Room Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Room Key</span>
                  <span className="font-mono">{roomKey}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Grid Size</span>
                  <span>{gridSize}×{gridSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Colors</span>
                  <span>{colors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rounds</span>
                  <span>{rounds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Online</span>
                  <span className="text-green-400">{room?.players?.length ?? 1}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3">How to Play</h3>
              <div className="space-y-2 text-sm">
                <p>• Select a color from the palette</p>
                <p>• Flood the entire board with one color</p>
                <p>• Complete all rounds to win</p>
                <p>• Fewer moves = higher score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomPage