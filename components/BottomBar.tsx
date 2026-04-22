import React from 'react';
import { ZoomIn, ZoomOut, Move3d, Maximize, Minimize, Sun, Moon, Play, Pause, Plus, Minus } from 'lucide-react';

interface BottomBarProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isTiltScrolling?: boolean;
  toggleTiltScroll?: () => void;
  isAutoScrolling: boolean;
  toggleAutoScroll: () => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  fontSize, setFontSize, isFullScreen, toggleFullScreen,
  isDarkMode, toggleTheme, isTiltScrolling = false, toggleTiltScroll = () => {},
  isAutoScrolling, toggleAutoScroll, scrollSpeed, setScrollSpeed
}) => {

  const handleFontSize = (amount: number) => setFontSize(Math.max(12, Math.min(fontSize + amount, 40)));
  const handleSpeed = (amount: number) => setScrollSpeed(Math.max(1, Math.min(scrollSpeed + amount, 10)));

  const baseControlStyles = "flex items-center p-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur-lg rounded-xl border border-monk-gold/30 dark:border-monk-saffron/20 shadow-lg shadow-monk-red/10 dark:shadow-black/30 transition-all duration-300";
  const btnStyles = "p-2 rounded-lg hover:bg-monk-gold/10 dark:hover:bg-monk-saffron/10 text-stone-600 dark:text-stone-300 transition-colors active:scale-95 transform";
  const activeBtnStyles = "bg-monk-red/10 text-monk-red dark:text-monk-saffron shadow-inner";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 pointer-events-none transition-opacity duration-500">
      <div className="relative max-w-lg mx-auto h-12 flex items-center justify-between pointer-events-auto">
        
        {/* Left: Auto Scroll Controls */}
        <div className={`${baseControlStyles} gap-0`}>
          <button onClick={() => handleSpeed(-1)} className={btnStyles} aria-label="Decrease speed">
            <Minus size={18} />
          </button>
          <button onClick={toggleAutoScroll} className={`${btnStyles} ${isAutoScrolling ? activeBtnStyles : ''}`} aria-label={isAutoScrolling ? "Pause scroll" : "Start scroll"}>
            {isAutoScrolling ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
          </button>
          <button onClick={() => handleSpeed(1)} className={btnStyles} aria-label="Increase speed">
            <Plus size={18} />
          </button>
        </div>

        {/* Center: Theme, Full Screen, Tilt */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
           <div className={`${baseControlStyles} gap-1 px-2`}>
             <button onClick={toggleTheme} className={btnStyles} aria-label="Toggle theme">
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <div className="w-px h-4 bg-stone-200 dark:bg-stone-700 mx-1"></div>
             <button onClick={toggleFullScreen} className={btnStyles} aria-label="Toggle full screen">
               {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
             </button>
             <button onClick={toggleTiltScroll} className={`${btnStyles} ${isTiltScrolling ? activeBtnStyles : ''}`} aria-label="Toggle tilt scroll">
               <Move3d size={18} />
             </button>
           </div>
        </div>

        {/* Right: Text Size */}
        <div className={`${baseControlStyles} gap-0`}>
          <button onClick={() => handleFontSize(-2)} className={btnStyles} aria-label="Decrease font size">
            <ZoomOut size={18} />
          </button>
          <button onClick={() => handleFontSize(2)} className={btnStyles} aria-label="Increase font size">
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;