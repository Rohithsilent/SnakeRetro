import React, { useState, useRef, useEffect } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "CORRUPTED_SECTOR_01",
    artist: "SYNTH_ENTITY_A",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "BUFFER_OVERFLOW",
    artist: "MALWARE.WAV",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "NULL_POINTER_EXCEPTION",
    artist: "GHOST_IN_THE_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-magenta-block p-6 relative screen-tear">
      <div className="absolute -top-3 right-4 bg-magenta text-black px-2 text-sm font-bold">
        AUDITORY_STIMULUS
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full border-2 border-cyan p-4 bg-[#050505] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#00ffff_10px,#00ffff_20px)]" />
          <h3 className="text-2xl font-bold text-cyan glitch relative z-10 truncate" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-magenta text-lg mt-2 relative z-10 truncate">
            &gt; {currentTrack.artist}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-4 w-full bg-white/10 border border-white/30 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-cyan"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-0 h-full w-2 bg-magenta"
              style={{ left: `calc(${progress}% - 2px)` }}
            />
          </div>

          <div className="flex justify-between items-center gap-4 text-2xl">
            <button 
              onClick={skipBackward} 
              className="flex-1 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black py-2 transition-colors"
            >
              [ &lt;&lt; ]
            </button>
            <button 
              onClick={togglePlay} 
              className="flex-[2] border-2 border-magenta text-magenta hover:bg-magenta hover:text-black py-2 transition-colors glitch"
              data-text={isPlaying ? '[ HALT ]' : '[ EXECUTE ]'}
            >
              {isPlaying ? '[ HALT ]' : '[ EXECUTE ]'}
            </button>
            <button 
              onClick={skipForward} 
              className="flex-1 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black py-2 transition-colors"
            >
              [ &gt;&gt; ]
            </button>
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      <div className="mt-6 flex justify-between items-center text-sm text-white/50 border-t border-white/20 pt-4">
        <span>STATUS: {isPlaying ? 'STREAMING' : 'IDLE'}</span>
        <span>CH: OUTPUT_01</span>
      </div>
    </div>
  );
};
