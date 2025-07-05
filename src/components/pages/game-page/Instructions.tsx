import React from 'react'

const Instructions = () => {
  return (
    <div>
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
  )
}

export default Instructions
