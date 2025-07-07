"use client";

import React, { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Trophy, Medal, Crown, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface LeaderboardProps {
  onBack: () => void;
}

interface Player {
  rank: number;
  username: string;
  score: number;
  moves: number;
  timeCompleted: string;
}

const boardSizes = [
  { size: "6x6", label: "6×6" },
  { size: "7x7", label: "7×7" },
  { size: "8x8", label: "8×8" },
  { size: "9x9", label: "9×9" },
  { size: "10x10", label: "10×10" },
  { size: "11x11", label: "11×11" },
  { size: "12x12", label: "12×12" },
  { size: "13x13", label: "13×13" },
  { size: "14x14", label: "14×14" },
  { size: "15x15", label: "15×15" },
  { size: "16x16", label: "16×16" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2: return <Medal className="w-5 h-5 text-gray-400" />;
    case 3: return <Medal className="w-5 h-5 text-amber-600" />;
    default: return <Star className="w-4 h-4 text-gray-400" />;
  }
};

const Leaderboard = ({ onBack }: LeaderboardProps) => {
  const [selectedBoard, setSelectedBoard] = useState("8x8");
  const [data, setData] = useState<{ [key: string]: Player[] }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    setLoading(true);
    socket.emit("get-leaderboard", { boardSize: selectedBoard, limit: 20 }, (res: any) => {
      if (res.success) {
        const leaderboard: Player[] = res.leaderboard.map((p: any, index: number) => ({
          rank: index + 1,
          username: p.name,
          score: p.score,
          moves: p.moves,
          timeCompleted: formatTime(p.time),
        }));
        setData(prev => ({ ...prev, [selectedBoard]: leaderboard }));
      } else {
        console.error("Leaderboard fetch error:", res.error);
      }
      setLoading(false);
    });
  }, [selectedBoard]);

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${min}:${String(remSec).padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-2">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onBack} size="sm">
              ← Back
            </Button>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Leaderboards</span>
            </CardTitle>
            <div className="w-16" />
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedBoard} onValueChange={setSelectedBoard} className="w-full">
            <TabsList className="grid grid-cols-6 lg:grid-cols-11 mb-6 gap-1 h-auto p-1">
              {boardSizes.map((board) => (
                <TabsTrigger
                  key={board.size}
                  value={board.size}
                  className="text-xs py-1 px-6 cursor-pointer"
                >
                  {board.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {boardSizes.map((board) => (
              <TabsContent key={board.size} value={board.size} className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {board.label} Board
                  </h3>
                  <div className="text-sm text-gray-500">Top 20 Players</div>
                </div>

                <div className="grid grid-cols-5 gap-2 p-3 bg-gray-100 rounded font-semibold text-sm">
                  <div>Rank</div>
                  <div>Player</div>
                  <div className="text-center">Score</div>
                  <div className="text-center">Moves</div>
                  <div className="text-center">Time</div>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Loading leaderboard...</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-1">
                    {(data[board.size] || []).map((player) => (
                      <div
                        key={`${board.size}-${player.rank}`}
                        className={`grid grid-cols-5 gap-2 p-3 rounded border transition-colors hover:bg-gray-50`}
                      >
                        <div className="flex items-center space-x-2">
                          {getRankIcon(player.rank)}
                          <span className="font-semibold">#{player.rank}</span>
                        </div>
                        <div className="font-medium truncate">{player.username}</div>
                        <div className="text-center font-bold">{player.score}</div>
                        <div className="text-center">{player.moves}</div>
                        <div className="text-center text-sm text-gray-600">{player.timeCompleted}</div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard