import { Suspense } from "react";
import GameClientWrapper from "./GameClientWrapper";

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading game...</div>}>
      <GameClientWrapper />
    </Suspense>
  );
}
