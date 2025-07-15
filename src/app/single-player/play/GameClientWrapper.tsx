"use client";
import { useSearchParams } from "next/navigation";
import GameClient from "./GameClient";

export default function GameClientWrapper() {
  const searchParams = useSearchParams();

  const gridSize = Number(searchParams.get("grid") ?? 8);
  const colors = Number(searchParams.get("colors") ?? 4);
  const rounds = Number(searchParams.get("rounds") ?? 5);
  const name = searchParams.get("name") ?? "Unknown";

  return (
    <GameClient
      gridSize={gridSize}
      colors={colors}
      rounds={rounds}
      name={name}
    />
  );
}
