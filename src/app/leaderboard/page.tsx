"use client"

import React from 'react'
import { getSocket } from '@/lib/socket'
import { useState, useEffect } from 'react'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { Crown,Medal } from 'lucide-react'

const LeaderboardPage = () => {
  const [boardSize, setBoardSize] = useState("6x6");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("get-leaderboard", { boardSize, limit: 10 }, (res: any) => {
      if (res.success) {
        setLeaderboard(res.leaderboard);
      } else {
        console.error(res.error);
      }
    });
  }, [boardSize]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown />;
      case 2: return <Medal />;
      case 3: return <Medal />;
      default: return `#${rank}`;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2: return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3: return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200";
      default: return "bg-white border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-600">Top players for {boardSize} board</p>
        </div>

        {/* Board Size Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <select
              value={boardSize}
              onChange={(e) => setBoardSize(e.target.value)}
              className="px-4 py-2 rounded-md border-none bg-transparent text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {[...Array(11)].map((_, i) => {
                const size = 6 + i;
                return (
                  <option key={size} value={`${size}x${size}`}>
                    {size}×{size} Grid
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg">No players yet for this board size</p>
              <p className="text-gray-400">Be the first to set a record!</p>
            </div>
          ) : (
            leaderboard.map((player, i) => {
              const rank = i + 1;
              return (
                <div
                  key={i}
                  className={`${getRankStyle(rank)} rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank and Name */}
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold min-w-[60px] text-center">
                        {getRankIcon(rank)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {player.name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          Rank #{rank}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-600 text-lg">
                          {player.score.toFixed(1)}
                        </div>
                        <div className="text-gray-500">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600 text-lg">
                          {player.moves}
                        </div>
                        <div className="text-gray-500">Moves</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600 text-lg">
                          {Math.round(player.time / 1000)}s
                        </div>
                        <div className="text-gray-500">Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Showing top 10 players
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage