import React from "react";
import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy,Play,Users,Settings } from "lucide-react";
import Link from "next/link";

const Afterheader = () => {
    
    const ShowLeaderboard=()=>{

    }
    const ShowSettings=()=>{

    }

  return (
    <div className="min-h-screen">
      {/*HERO section*/}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-br from-slate-100 via-purple-900 to-slate-100 text-white rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-black">
            FloodFill
          </h1>
          <p className="text-lg sm:text-xl mb-6 text-black">
            The ultimate color puzzle challenge! Fill the entire board with one
            color in the minimum moves possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full text-black">
              Strategic Thinking
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-black">
              Quick Reflexes
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-black">
              High Scores
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto space-y-6 px-2 py-4">
        <Card className="bg-white shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Choose Your Challenge
              </h2>
              <p className="text-gray-600">
                Pick a game mode and start your color conquest!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link href={"/single-player"} passHref>
                <Button
                  className="h-16 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg"
                  size="lg"
                >
                  <Play className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div>Single Player</div>
                  </div>
                </Button>
              </Link>
              
              <Link href={"/multi-player"} passHref>
                <Button
                  className="h-16 w-full bg-green-600 hover:bg-green-700 text-white text-lg"
                  size="lg"
                >
                  <Users className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div>Multiplayer</div>
                    <div className="text-sm opacity-80">
                      Login Required
                    </div>
                  </div>
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-3 col-span-2">
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={ShowLeaderboard}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Leaderboard
                </Button>
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={ShowSettings}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">How to Play</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-center p-2 pt-2">
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg">1</div>
                        <h4 className="font-semibold">Choose Color</h4>
                        <p className="text-sm text-gray-600">Click a color button to flood from the top-left corner</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg">2</div>
                        <h4 className="font-semibold">Watch It Spread</h4>
                        <p className="text-sm text-gray-600">Connected tiles of the same color will change instantly</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg">3</div>
                        <h4 className="font-semibold">Fill the Board</h4>
                        <p className="text-sm text-gray-600">Make all tiles the same color in minimum moves to win!</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default Afterheader;
