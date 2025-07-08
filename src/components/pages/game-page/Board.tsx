import React from 'react'

type CellColor=number

type BoardProps={
    gridSize:number,
    COLORS:string[],
    board:CellColor[][]
}

const Board:React.FC<BoardProps> = ({gridSize,board,COLORS}) => {
  return (
      <div className="lg:col-span-3">
            <div className="backdrop-blur-sm rounded-2xl p-6">
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
  )
}

export default Board
