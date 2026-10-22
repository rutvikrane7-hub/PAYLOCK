import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  isLocked: boolean;
  title: string;
  clientName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ isLocked, title, clientName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 30 });

  // Floating watermark position shifting periodically for anti-rip protection
  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.floor(Math.random() * 40) + 15,
        y: Math.floor(Math.random() * 40) + 20,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current?.parentElement) {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group select-none">
      
      {/* HTML5 Video Element with high quality sample or fallback animation */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* WATERMARK OVERLAYS (ONLY ACTIVE WHEN LOCKED) */}
      {isLocked && (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 overflow-hidden">
          
          {/* Diagonal repeating watermark grid across the whole player */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-16 opacity-30 transform -rotate-12 scale-125 select-none pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="text-white/60 font-black tracking-widest text-lg sm:text-2xl uppercase border-2 border-dashed border-white/20 px-4 py-2 rounded-lg backdrop-blur-[1px]"
              >
                PREVIEW ONLY - PAYLOCK
              </div>
            ))}
          </div>

          {/* Floating animated central watermark banner */}
          <div
            className="absolute transition-all duration-1000 ease-in-out pointer-events-none z-30"
            style={{ top: `${watermarkPos.y}%`, left: `${watermarkPos.x}%` }}
          >
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 px-5 py-2.5 rounded-xl text-center shadow-[0_0_25px_rgba(239,68,68,0.4)]">
              <div className="text-white font-extrabold tracking-widest text-sm sm:text-base drop-shadow-md flex items-center justify-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>PREVIEW ONLY - PAYLOCK</span>
              </div>
              <div className="text-[10px] text-red-200/90 font-mono mt-0.5">
                CLIENT: {clientName.toUpperCase()} • UNLICENSED DRAFT
              </div>
            </div>
          </div>

          {/* Top header lock alert banner */}
          <div className="relative z-30 flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/75 border border-red-500/40 backdrop-blur-md text-red-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>WATERMARKED PREVIEW DRAFT</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-black/60 backdrop-blur px-2.5 py-1 rounded">
              ID: PL-SECURE-{title.substring(0, 6).toUpperCase()}
            </div>
          </div>

          {/* Center prominent PayLock text watermark badge */}
          <div className="relative z-20 mx-auto my-auto text-center pointer-events-none">
            <div className="text-3xl sm:text-5xl font-black text-white/40 tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] border-4 border-white/30 px-8 py-3 rounded-2xl transform -rotate-3 backdrop-blur-[2px]">
              PREVIEW ONLY - PAYLOCK
            </div>
            <p className="text-xs sm:text-sm text-cyan-300/80 font-mono mt-2 bg-black/70 px-4 py-1 rounded-full inline-block">
              🔒 Audio/Video compressed. High-bitrate master files unlocked upon payment.
            </p>
          </div>

          {/* Bottom subtle bar */}
          <div className="relative z-20 flex justify-between items-center text-[11px] text-slate-400/80 font-mono">
            <span>ANTIGRAVITY ASSET PROTECTION</span>
            <span>ESCROW ID: #8841-A7</span>
          </div>
        </div>
      )}

      {/* UNLOCKED BADGE (WHEN PAID) */}
      {!isLocked && (
        <div className="absolute top-4 left-4 z-30 flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>OFFICIALLY UNLOCKED & LICENSED (4K MASTER)</span>
        </div>
      )}

      {/* Video Player Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity">
        {/* Scrubber */}
        <div className="relative w-full mb-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-slate-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-cyan-300" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-xs font-mono text-slate-400">
              {formatTime(currentTime)} / {formatTime(duration || 120)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {isLocked ? '720p Preview Stream' : '4K UltraHD Master'}
            </span>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
