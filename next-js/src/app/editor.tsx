"use client";

import { Composition } from "@diffusionstudio/core";
import { CompositionContext } from "./context";
import { useEffect, useState } from "react";
import { Player } from "./player";
import { Controls } from "./controls";


export function Editor() {
  const [composition, setComposition] = useState<Composition>();

  useEffect(() => {
    setComposition(new Composition())
  }, []);
  
  return (
    <CompositionContext.Provider value={{ composition }}>
      <Player />
      <Controls />
    </CompositionContext.Provider>
  )
}
