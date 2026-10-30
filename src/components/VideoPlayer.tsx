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
    <div className="relative w-full rounded-xl overflow-hidden bg-gray-950 border border-gray-200 shadow-sm group select-none">
      
      {/* HTML5 Video Element */}
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
                className="text-white/60 font-bold tracking-widest text-lg sm:text-2xl uppercase border-2 border-dashed border-white/20 px-4 py-2 rounded-lg backdrop-blur-2xs"
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
            <div className="bg-white/95 backdrop-blur-md border border-gray-300 px-5 py-2.5 rounded-xl text-center shadow-lg">
              <div className="text-gray-900 font-bold tracking-wider text-xs sm:text-sm flex items-center justify-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>PREVIEW ONLY - PAYLOCK</span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                CLIENT: {clientName.toUpperCase()} • UNLICENSED DRAFT
              </div>
            </div>
          </div>

          {/* Top header lock alert banner */}
          <div className="relative z-30 flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/75 border border-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>WATERMARKED PREVIEW DRAFT</span>
            </div>
            <div className="text-[11px] font-mono text-gray-300 bg-black/60 backdrop-blur px-2.5 py-1 rounded">
              ID: PL-SECURE-{title.substring(0, 6).toUpperCase()}
            </div>
          </div>

          {/* Center prominent PayLock text watermark badge */}
          <div className="relative z-20 mx-auto my-auto text-center pointer-events-none">
            <div className="text-3xl sm:text-5xl font-black text-white/40 tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] border-4 border-white/30 px-8 py-3 rounded-2xl transform -rotate-3 backdrop-blur-xs">
              PREVIEW ONLY - PAYLOCK
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-medium mt-2 bg-black/70 px-4 py-1 rounded-full inline-block">
              🔒 Audio/Video compressed. High-bitrate master files unlocked upon payment.
            </p>
          </div>

          {/* Bottom subtle bar */}
          <div className="relative z-20 flex justify-between items-center text-[11px] text-gray-400 font-mono">
            <span>PAYLOCK ASSET PROTECTION</span>
            <span>ESCROW ID: #8841-A7</span>
          </div>
        </div>
      )}

      {/* UNLOCKED BADGE (WHEN PAID) */}
      {!isLocked && (
        <div className="absolute top-4 left-4 z-30 flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>OFFICIALLY UNLOCKED & LICENSED (4K MASTER)</span>
        </div>
      )}

      {/* Video Player Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity">
        {/* Scrubber */}
        <div className="relative w-full mb-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-xs font-mono text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration || 120)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
              {isLocked ? '720p Preview Stream' : '4K UltraHD Master'}
            </span>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
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
