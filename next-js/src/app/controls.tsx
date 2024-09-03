"use client";

import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WebcodecsEncoder } from '@diffusionstudio/core';
import { PauseIcon, PlayIcon, TrackNextIcon, TrackPreviousIcon } from '@radix-ui/react-icons';
import { Spinner } from './spinner';
import { CompositionContext } from './context';


export function Controls() {
  const { composition } = useContext(CompositionContext);
  const [playing, setPlaying] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<string>('0%');
  const [time, setTime] = useState('00:00 / 00:00');

  useEffect(() => {
    if (!composition) return;

    const pauseEvt = composition.on('pause', () => setPlaying(false));
    const playEvt = composition.on('play', () => setPlaying(true));
    const frameEvt = composition.on('frame', () => setTime(composition.time()));
    const currentEvt = composition.on('currentframe', () => setTime(composition.time()));

    return () => {
      composition.off(pauseEvt, playEvt, frameEvt, currentEvt);
    }
  }, [composition]);

  const render = async () => {
    if (rendering || !composition) return;

    const encoder = new WebcodecsEncoder(composition);

    encoder.on('render', (event) => {
      const { progress, total } = event.detail;

      setRenderProgress(`${Math.round(progress * 100 / total)}%`);
    });

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `untitled_video.mp4`,
        types: [{ accept: { 'video/mp4': ['.mp4'] } }],
      });

      setRendering(true);
      await encoder.export(fileHandle);
    } finally {
      setRendering(false);
    }
  }

  useEffect(() => {
    if (!('showSaveFilePicker' in window)) {
      // use in memory as fallback
      Object.assign(window, { showSaveFilePicker: async () => undefined })
    }
  });

  return (
    <>
      <div className="flex justify-center items-center gap-7 mt-6 rounded-xl border border-gray-800 p-2">
        <div className="flex gap-4 items-center ml-3">
          <TrackPreviousIcon onClick={() => composition?.seek(0)} className="h-5 w-5 cursor-pointer" />
          {!playing && (
            <PlayIcon onClick={() => composition?.play()} className="h-5 w-5 cursor-pointer" />
          )}
          {playing && (
            <PauseIcon onClick={() => composition?.pause()} className="h-5 w-5 cursor-pointer" />
          )}
          <TrackNextIcon onClick={() => composition?.seek(composition.duration.frames)} className="h-5 w-5 cursor-pointer" />
        </div>
        <span className="font-mono text-gray-300 font-light">{time}</span>
        <button
          onClick={render}
          disabled={rendering}
          className="rounded-md flex items-center justify-center border-none gap-1 px-3 h-[36px] text-sm bg-gray-50 text-gray-950 hover:bg-gray-200 disabled:opacity-50"
        >
          {rendering && <Spinner />}
          Export
        </button>
      </div>
      {rendering && createPortal(
        <div className="flex backdrop-blur-2xl backdrop-brightness-50 absolute justify-center items-center inset-0">
          <h1 className="text-6xl font-medium">{renderProgress}</h1>
        </div>,
        document.getElementById('player')!
      )}
    </>
  )
}
