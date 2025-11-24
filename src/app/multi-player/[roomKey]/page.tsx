'use client'

import Header from '@/components/pages/game-page/Header'
import RoomInfo from '@/components/pages/game-page/RoomInfo'
import Instructions from '@/components/pages/game-page/Instructions'
import Board from '@/components/pages/game-page/Board'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useRef } from 'react'
import {
  Copy, Users, Grid3X3, Palette,
  ArrowLeft, Check, Crown, Trophy,PartyPopper,Loader,LoaderCircle
} from 'lucide-react'
import { getSocket } from '@/lib/socket'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'

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
  const [gameStartRequested, setGameStartRequested] = useState(false)
  const [startTime,setStartTime]=useState(0);
  const [endTime,setEndTime]=useState(0);
  const [liveElapsed, setLiveElapsed] = useState(0);
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([])
  const [timeTaken,setTimeTaken]=useState(0);
  const { data:session,status } = useSession();

  interface PlayerStats {
    id: string;
    name: string;
    moves: number;
    time: number; 
    score: number;
  }

  useEffect(() => {
    fetch("/api/tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        user: name || null,
        email : session?.user?.email || null,
        uid: session?.user?.id || null,
      }),
    }).catch(() => console.error("Tracking failed"));
  }, []);



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

    const handleGameStart=()=>{
      setGameStartRequested(true)
      setIsPlaying(true)
    }

    const handleLeaderboard=(stats:PlayerStats[])=>{
      const sorted = stats.sort((a, b) => {
        return a.moves - b.moves || a.time - b.time;
      })
      setLeaderboard(sorted);
    }

    socket.on('room-updated', handleUpdate)
    socket.on("game-started",handleGameStart);
    socket.on("leaderboard-update",handleLeaderboard);
    return () => {
      socket.off('room-updated', handleUpdate)
      socket.off("game-started",handleGameStart);
      socket.off("leaderboard-update",handleLeaderboard)
    }
  }, [roomKey, name])


  useEffect(() => {    //here is where it starts---------------gamestartrequested
    if (gameStartRequested && room) {
      initializeBoard()
      setGameStartRequested(false)
      
      const now = Date.now();
      setStartTime(now);
      setLiveElapsed(0);
      setEndTime(0);
      setTimeTaken(0);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setLiveElapsed(Date.now() - now);
      }, 100);
    }
  }, [gameStartRequested, room])

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const msLeft = ms % 1000;
    return `${s}.${msLeft.toString().padStart(3, '0')}s`;
  };

  const initializeBoard = useCallback(() => {   //use callback will only render when required
    const newBoard: CellColor[][] = []
    for (let i = 0; i < gridSize; i++) {
      const row: CellColor[] = []
      for (let j = 0; j < gridSize; j++) {
        row.push(Math.floor(Math.random() * colors))
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
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
      if (currentRound === rounds) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        const now = Date.now();
        const totalTime = now - startTime;
        setEndTime(now);
        setTimeTaken(totalTime);
        setIsGameOver(true);
       
        
        const socket = getSocket();
        socket.emit("player-finished", {
          roomKey,
          playerId: socket.id,
          name,
          moves,
          time: totalTime,
          
        });
      }  
    }
  }

  const nextRound = () => {
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1)
      initializeBoard()
    } else {
      setIsGameOver(true)
  }
}

    const startGame = () => {
      if (!gridSize || !colors) return;
      const socket = getSocket();
      socket.emit("start-game", roomKey);
    }


  const colorPalette = COLORS.slice(0, colors)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header roomKey={roomKey} startGame={startGame} liveElapsed={liveElapsed} isCreator={isCreator} currentRound={currentRound} rounds={rounds} gridSize={gridSize} colors={colors} room={room} score={score} moves={moves} isPlaying={isPlaying}/>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Board */}
          <div>
            <Board gridSize={gridSize} board={board} COLORS={COLORS}/>
            
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
          </div>
          
          {/* Right panel */}
          <div className="space-y-6">            
                <div className="bg-white/10 p-4 mt-4 rounded-xl border border-white/20">
                    <div className='flex justify-center items-center py-4'>
                      <Trophy className='w-6 h-6 text-yellow-300' />
                      <span className='px-2'>Leaderboard</span>
                    </div>

                    {
                      isPlaying ?(
                        <div>   
                        {
                          leaderboard.length>0 ? (
                            <div className="text-sm space-y-2">
                              {leaderboard.map((player, idx) => (
                                  <div key={player.id} className="flex justify-between">
                                    <span>{idx + 1}. {player.name}</span>
                                    <span className="font-mono">
                                      {player.score} pts – {player.moves} moves – {formatTime(player.time)}
                                    </span>
                                  </div>
                              ))}
                            </div>
                          ): (
                            <div className='flex flex-col items-center'>
                              <LoaderCircle className='animate-spin'/>
                              <h1>Waiting for All players to finish...</h1> 
                            </div>
                          )
                        }
                        </div>
                      ): (
                        <div className='flex justify-center'>
                          <h1>Waiting For Players to start</h1>
                        </div>
                      )
                    }    

                  </div>
               
            {/* Game Status */}
            {gameWon && (
              <div className="text-center space-y-3 p-4 border rounded">
                <p className="text-lg font-bold text-green-600">
                  <span><PartyPopper/></span> Round {currentRound} Complete!
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
                      Game Complete!
                    </p>
                    <p className="text-sm">Final Score: {score} points</p>
                      <p className="text-sm">Total Moves: <span className="font-mono">{moves}</span></p>
                      <p className="text-sm">Total Time: <span>Time: {formatTime(isGameOver ? timeTaken : liveElapsed)}</span></p>
                      <Button onClick={initializeBoard} variant="outline">
                        Play Again
                      </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomPage