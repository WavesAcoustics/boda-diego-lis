"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const musicSrc = "/audio/binks-sake-wedding-orchestra.mp3";

export function WeddingMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      audio.volume = 0.55;
      audio.muted = isMuted;
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, [isMuted]);

  useEffect(() => {
    void playMusic();

    const startAfterInteraction = () => {
      void playMusic();
    };

    window.addEventListener("pointerdown", startAfterInteraction, { once: true });
    window.addEventListener("keydown", startAfterInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startAfterInteraction);
      window.removeEventListener("keydown", startAfterInteraction);
    };
  }, [playMusic]);

  function toggleSound() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying || audio.paused) {
      audio.muted = false;
      setIsMuted(false);
      void playMusic();
      return;
    }

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }

  return (
    <>
      <audio ref={audioRef} src={musicSrc} loop preload="auto" playsInline />
      <button
        type="button"
        onClick={toggleSound}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border border-charcoal/10 bg-ivory/95 px-4 text-sm font-semibold text-charcoal shadow-soft backdrop-blur transition hover:bg-white"
        aria-label={isMuted || !isPlaying ? "Activar música" : "Silenciar música"}
      >
        {isMuted || !isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span>{isMuted || !isPlaying ? "Música" : "Silenciar"}</span>
      </button>
    </>
  );
}
