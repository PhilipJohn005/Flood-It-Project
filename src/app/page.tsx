"use client";

import Header from "@/components/pages/landing-page/Header";
import Afterheader from "@/components/pages/landing-page/Afterheader";
import { useSession } from "next-auth/react";
import { useState } from "react";

export type GameMode = 'menu' | 'single' | 'multiplayer' | 'lobby' | 'leaderboard' | 'settings';

export default function LoginForm() {
const { data: session, status } = useSession();
    const loading = status === "loading";
const [gameMode, setGameMode] = useState<GameMode>('menu');

  return (
    <div>
      {
        loading ? (
          <div>Loading...</div>
        ): (
          <div>
            <Header/>
            <div className="p-4">
              <Afterheader/>
            </div>
          </div>
        )}
      
       
    </div>
  );
}
