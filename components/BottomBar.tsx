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

  const baseControlStyles = "bar-group";
  const btnStyles = "bar-btn";
  const activeBtnStyles = "active";

  return (
    <div className="bottom-bar">
      <div className="bar-inner">
        
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
        <div className="bar-center">
           <div className={`${baseControlStyles} gap-1 px-2`}>
             <button onClick={toggleTheme} className={btnStyles} aria-label="Toggle theme">
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <div className="bar-divider"></div>
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