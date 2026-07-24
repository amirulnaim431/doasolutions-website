'use client';

import { useEffect, useRef, useState } from 'react';

function cls(...items: Array<string | false | undefined>) {
  return items.filter(Boolean).join(' ');
}

export function OyaMediaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [status, setStatus] = useState('Autoplay ready');

  const play = async (source: 'auto' | 'manual' = 'manual') => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.muted = false;
      audio.volume = 0.82;
      await audio.play();
      setIsPlaying(true);
      setStatus('Playing');
    } catch {
      setStatus(source === 'auto' ? 'Tap anywhere to start' : 'Tap play to start');
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setStatus('Stopped');
  };

  useEffect(() => {
    const tryAutoplay = window.setTimeout(() => {
      void play('auto');
    }, 450);

    const unlockAudio = () => {
      if (!audioRef.current?.paused) return;
      void play('auto');
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.clearTimeout(tryAutoplay);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  if (isClosed) return null;

  return (
    <aside className={cls('oya-media-player', isMinimized && 'is-minimized')} aria-label="OYA demo music player">
      <audio
        ref={audioRef}
        src="/showcase/audio/oasis-stand-by-me-demo.mp3"
        autoPlay
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false);
          setStatus('Finished');
        }}
      />
      <div className="oya-media-titlebar">
        <span>OYA Media Player</span>
        <div>
          <button type="button" onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? 'Restore media player' : 'Minimize media player'}>
            {isMinimized ? '□' : '_'}
          </button>
          <button type="button" onClick={() => { stop(); setIsClosed(true); }} aria-label="Close media player">x</button>
        </div>
      </div>
      <div className="oya-media-body">
        <div className="oya-media-display">
          <span className={isPlaying ? 'is-live' : ''} />
          <div>
            <small>Now Playing</small>
            <p><b>oasis - standby me.mp3</b><b>oasis - standby me.mp3</b></p>
          </div>
        </div>
        <div className="oya-media-controls">
          <button type="button" onClick={() => void play('manual')} disabled={isPlaying} aria-label="Play Stand By Me">Play</button>
          <button type="button" onClick={stop} aria-label="Stop playback">Stop</button>
          <span>{status}</span>
        </div>
      </div>
    </aside>
  );
}
