"use client";

import { usePlayer } from "./use-player";
import { useSeed } from "./use-seed";

export function Player() {
  const playerRef = usePlayer();
  const populated = useSeed();

  return (
    <div id="player" className="relative aspect-video w-full flex justify-center items-center overflow-hidden border border-gray-800 rounded-md max-w-4xl mx-7">
      <div ref={playerRef} />
      {!populated && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="loader" />
        </div>
      )}
    </div>
  )
}
