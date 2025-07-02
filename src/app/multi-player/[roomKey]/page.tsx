'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Copy, Users, Grid3X3, Palette,
  ArrowLeft, Check, Crown
} from 'lucide-react'

const RoomPage = () => {
  const { roomKey } = useParams()
  if(!roomKey)return;
  const searchParams = useSearchParams()
  const router = useRouter()

  const gridSize = searchParams.get('gridSize') ?? '12'
  const colors = searchParams.get('colors') ?? '6'
  const rounds = searchParams.get('rounds') ?? '1'
  const mode = searchParams.get('mode') ?? 'join'
  const name = searchParams.get('name') ?? 'Player'
  const isCreator = mode === 'create'

  const [copied, setCopied] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#EF4444')

  // Generate sample color palette
  const generateColorPalette = (count: number) => {
    const baseColors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
      '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
      '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
    ]
    return baseColors.slice(0, count)
  }

  const colorPalette = generateColorPalette(parseInt(colors))//convert to int
  const gridCells = Array(parseInt(gridSize) * parseInt(gridSize)).fill(null)

  useEffect(() => {
    setSelectedColor(colorPalette[0])
  }, [colors])

  const copyRoomKey = async () => {
    if (roomKey && typeof roomKey === 'string') {
      await navigator.clipboard.writeText(roomKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/multi-player')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="" />
            </button>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold ">Room: {roomKey}</h1>
                {isCreator && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg text-sm">
                    <Crown size={14} />
                    Creator
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm ">
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
                  1 online
                </span>
              </div>
              <button className='px-4 py-2 bg-red-400 cursor-pointer hover:bg-red-500 rounded-md'>
                Start
              </button>
            </div>
          </div>

          <button
            onClick={copyRoomKey}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Share Room Key'}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Canvas</h2>
              
              <div className="bg-white rounded-xl p-4 overflow-auto">
                <div 
                  className="grid gap-1 mx-auto"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: 'fit-content',
                    maxWidth: '100%'
                  }}
                >
                  {gridCells.map((_, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gray-100 border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors rounded-sm"
                      onClick={() => {
                        console.log(`Coloring pixel ${index} with ${selectedColor}`)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Color Palette */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorPalette.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-xl transition-all duration-200 ${
                      selectedColor === color 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl">
                <p className="text-sm mb-1">Selected Color</p>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg border border-slate-600"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-sm font-mono">{selectedColor}</span>
                </div>
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Room Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="">Room Key</span>
                  <span className="font-mono">{roomKey}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="">Grid Size</span>
                  <span className="">{gridSize}×{gridSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="">Colors</span>
                  <span className="">{colors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="">Rounds</span>
                  <span className="">{rounds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="">Online</span>
                  <span className="text-green-400">1 user</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3">How to Use</h3>
              <div className="space-y-2 text-sm ">
                <p>• Select a color from the palette</p>
                <p>• Click on canvas cells to paint</p>
                <p>• Share the room key with friends</p>
                <p>• Collaborate in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomPage
