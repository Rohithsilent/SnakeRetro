import { useState, useCallback } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = useCallback((score: number) => {
    setHighScore((prev) => (score > prev ? score : prev));
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-4 relative">
      <div className="static-bg" />
      <div className="scanlines" />
      
      <header className="mb-8 text-center z-10 screen-tear">
        <h1 
          className="text-6xl md:text-8xl font-black tracking-widest text-white glitch"
          data-text="SYS.OP.SNAKE"
        >
          SYS.OP.SNAKE
        </h1>
        <p className="text-cyan text-xl tracking-[0.5em] mt-2 bg-magenta text-black inline-block px-2">
          INITIATING_AUDIO_VISUAL_OVERRIDE...
        </p>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        {/* Left Sidebar - Stats & Info */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <div className="bg-black border-cyan-block p-6 relative">
            <div className="absolute -top-3 left-4 bg-cyan text-black px-2 text-sm font-bold">
              DATA_METRICS
            </div>
            <div className="space-y-6 mt-2">
              <div>
                <p className="text-magenta text-lg mb-1">PEAK_EFFICIENCY</p>
                <p className="text-5xl text-cyan glitch" data-text={highScore.toString()}>
                  {highScore}
                </p>
              </div>
              <div className="pt-4 border-t-2 border-dashed border-cyan/50">
                <p className="text-magenta text-lg mb-2">INPUT_VECTORS</p>
                <div className="grid grid-cols-1 gap-2 text-lg">
                  <div className="bg-cyan/20 p-2 border border-cyan text-cyan">[ARROWS] : TRAVERSE</div>
                  <div className="bg-magenta/20 p-2 border border-magenta text-magenta">[SPACE]  : HALT</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border-magenta-block p-6 relative screen-tear" style={{ animationDelay: '2s' }}>
            <div className="absolute -top-3 right-4 bg-magenta text-black px-2 text-sm font-bold">
              CORE_DIAGNOSTICS
            </div>
            <div className="space-y-4 mt-2 text-lg">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-white/60">UPLINK_STATUS</span>
                <span className="text-cyan animate-pulse">ESTABLISHED</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-white/60">AUDIO_SUBSYSTEM</span>
                <span className="text-magenta">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">MEMORY_LEAK</span>
                <span className="text-red-500 glitch" data-text="DETECTED">DETECTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Game */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Right Sidebar - Music Player */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end space-y-8 order-3">
          <MusicPlayer />
          
          <div className="w-full bg-black border-cyan-block p-6 relative">
            <div className="absolute -top-3 left-4 bg-cyan text-black px-2 text-sm font-bold">
              WAVEFORM_ANALYSIS
            </div>
            <div className="flex items-end gap-1 h-20 mt-4">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="flex-grow bg-magenta"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `pulse-height ${0.2 + Math.random() * 0.5}s infinite alternate`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse-height {
          0% { transform: scaleY(0.1); transform-origin: bottom; }
          100% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      <footer className="mt-12 text-xl text-white/40 tracking-[0.5em] z-10 glitch" data-text="TERMINAL_05 // END_OF_LINE">
        TERMINAL_05 // END_OF_LINE
      </footer>
    </div>
  );
}
