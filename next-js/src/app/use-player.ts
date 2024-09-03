import { useContext, useEffect, useRef } from "react";
import { CompositionContext } from "./context";

export function usePlayer() {
  const { composition } = useContext(CompositionContext);

  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playerRef.current || !playerRef.current.parentElement || !composition) return;

    const container = playerRef.current.parentElement;
    const player = playerRef.current;

    composition.attachPlayer(playerRef.current);

    const observer = new ResizeObserver(() => {
      const scale = container.clientWidth / composition.width;
      player.style.width = `${composition.width}px`;
      player.style.height = `${composition.height}px`;
      player.style.transform = `scale(${scale})`;
      player.style.transformOrigin = 'center';
    });

    observer.observe(document.body);

    return () => {
      playerRef.current && composition.detachPlayer(playerRef.current);
      observer.disconnect();
    }
  }, [composition, playerRef]);

  return playerRef;
}
