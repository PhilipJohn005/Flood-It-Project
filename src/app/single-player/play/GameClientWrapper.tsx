"use client";
import { useSearchParams } from "next/navigation";
import GameClient from "./GameClient";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function GameClientWrapper() {
  const searchParams = useSearchParams();
  const { data:session , status } = useSession();
  const gridSize = Number(searchParams.get("grid") ?? 8);
  const colors = Number(searchParams.get("colors") ?? 4);
  const rounds = Number(searchParams.get("rounds") ?? 5);
  const name = searchParams.get("name") ?? "Unknown";

  useEffect(()=>{
    fetch('/api/tracker',{
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({ 
        path : window.location.pathname,
        email : session?.user?.email || null,
        uid : session?.user?.id || null,
        name : session?.user?.name || null
      })
    }).catch((e)=>console.log("Some error occured while tracking user : " + e));

  },[]);

  return (
    <GameClient
      gridSize={gridSize}
      colors={colors}
      rounds={rounds}
      name={name}
    />
  );
}
