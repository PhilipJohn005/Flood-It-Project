import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Play, Users } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Afterheader = () => {
  const { data: session } = useSession();
  const isLoggedin = !!session?.user;

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-4xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="bg-gray-100 shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Choose Your Challenge
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Pick a game mode and start your color conquest!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SINGLE PLAYER */}
              {isLoggedin ? (
                <Link href="/single-player" className="w-full">
                  <Button className="h-16 w-full bg-gray-700 hover:bg-gray-800 text-white text-lg flex items-center justify-center">
                    <Play className="w-6 h-6 mr-3" />
                    <div className="flex flex-col text-center leading-tight">
                      <span className="text-base sm:text-lg">Single Player</span>
                      <span className="text-[10px] sm:text-xs opacity-80">
                        Ready to go
                      </span>
                    </div>
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  className="h-16 w-full bg-gray-400 text-white text-lg opacity-60 cursor-not-allowed flex items-center justify-center"
                >
                  <Play className="w-6 h-6 mr-3" />
                  <div className="flex flex-col text-center leading-tight">
                    <span className="text-base sm:text-lg">Single Player</span>
                    <span className="text-[10px] sm:text-xs">Login Required</span>
                  </div>
                </Button>
              )}

              {/* MULTI PLAYER */}
              {isLoggedin ? (
                <Link href="/multi-player" className="w-full">
                  <Button className="h-16 w-full bg-gray-600 hover:bg-gray-700 text-white text-lg flex items-center justify-center">
                    <Users className="w-6 h-6 mr-3" />
                    <div className="flex flex-col text-center leading-tight">
                      <span className="text-base sm:text-lg">Custom-Player</span>
                      <span className="text-[10px] sm:text-xs opacity-80">
                        Play with friends
                      </span>
                    </div>
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  className="h-16 w-full bg-gray-400 text-white text-lg opacity-60 cursor-not-allowed flex items-center justify-center"
                >
                  <Users className="w-6 h-6 mr-3" />
                  <div className="flex flex-col text-center leading-tight">
                    <span className="text-base sm:text-lg">Custom-Player</span>
                    <span className="text-[10px] sm:text-xs">Login Required</span>
                  </div>
                </Button>
              )}

              <div className="col-span-1 sm:col-span-2">
                <Link href={"/leaderboard"}>
                  <Button
                    variant="outline"
                    className="h-12 w-full border-gray-400 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    <span className="text-sm sm:text-base">Leaderboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center text-gray-800">
              How to Play
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  1
                </div>
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                  Choose Color
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Click a color button to flood from the top-left corner
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  2
                </div>
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                  Watch It Spread
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Connected tiles of the same color will change instantly
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full mx-auto flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  3
                </div>
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                  Fill the Board
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Make all tiles the same color in minimum moves to win!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Afterheader;
