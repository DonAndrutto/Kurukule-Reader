import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { AppSettings, Section } from './types';
import { PRAYER_DATA } from './constants';
import BottomBar from './components/BottomBar';
import Header from './components/Header';
import PrayerBlock from './components/PrayerBlock';

const App: React.FC = () => {
  // --- State ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('kurukulle-app-settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 18,
      isDarkMode: false,
      showPhonetics: true,
      showTranslation: true,
      showTibetan: true,
    };
  });
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isTiltScrolling, setIsTiltScrolling] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);

  // --- Refs ---
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mandalaRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);
  const lastClickTime = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // --- Effects ---
  
  // 1. Persist settings
  useEffect(() => {
    localStorage.setItem('kurukulle-app-settings', JSON.stringify(settings));
  }, [settings]);

  // 2. Handle Dark Mode
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // 3. Handle Native Full Screen
  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    
    if (!document.fullscreenElement && isFullScreen) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) docEl.requestFullscreen().catch((e) => console.log(e));
    } else if (document.fullscreenElement && !isFullScreen) {
      if (document.exitFullscreen) document.exitFullscreen().catch((e) => console.log(e));
    }
    
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [isFullScreen]);

  // 4. Scroll Listener for "Back Up" button and Mandala Fade
  useEffect(() => {
    const handleScroll = () => {
      // 4a. Back Up Button Visibility
      setShowScrollUp(window.scrollY > 300);
      
      // 4b. Auto-scroll safety check
      if (isAutoScrolling && (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
        setIsAutoScrolling(false);
      }

      // 4c. Mandala Fade Effect
      if (mandalaRef.current) {
        const rect = mandalaRef.current.getBoundingClientRect();
        // Fade out range: Start fading when top is at 350px, fully faded at -100px
        const fadeStart = 350;
        const fadeEnd = -100;
        const range = fadeStart - fadeEnd;
        const currentPos = rect.top;
        
        // Calculate opacity: 1 when pos >= fadeStart, 0 when pos <= fadeEnd
        let opacity = (currentPos - fadeEnd) / range;
        opacity = Math.max(0, Math.min(1, opacity));
        
        mandalaRef.current.style.opacity = opacity.toString();
        // Optional: Subtle parallax or scale reduction
        mandalaRef.current.style.transform = `scale(${0.9 + (0.1 * opacity)})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAutoScrolling]);

  // 5. Smooth Auto Scroll Engine (Time-based)
  useEffect(() => {
    const scrollLoop = (timestamp: number) => {
      if (!isAutoScrolling) return;

      if (!lastScrollTime.current) lastScrollTime.current = timestamp;
      const deltaTime = timestamp - lastScrollTime.current;
      lastScrollTime.current = timestamp;

      // Speed calculation:
      // Speed 1: ~15px/sec
      // Speed 10: ~150px/sec
      const pixelsPerMs = (scrollSpeed * 0.015) + 0.005; 
      const move = pixelsPerMs * deltaTime;
      
      scrollAccumulator.current += move;
      
      if (scrollAccumulator.current >= 0.5) {
          window.scrollBy({ top: scrollAccumulator.current, behavior: 'auto' });
          scrollAccumulator.current = 0;
      }

      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    if (isAutoScrolling) {
      lastScrollTime.current = 0;
      scrollAccumulator.current = 0;
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  // 6. Tilt Scrolling Logic
  useEffect(() => {
    let tiltRafId: number | null = null;
    let referenceBeta: number | null = null;
  
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null) return;
  
      if (referenceBeta === null) referenceBeta = event.beta;
  
      const tilt = event.beta - referenceBeta;
      const sensitivityMultiplier = 1.0; 
      const scrollAmount = Math.pow(Math.abs(tilt) / 2.5, 2) * -Math.sign(tilt) * sensitivityMultiplier;
  
      const scroll = () => {
        if (isTiltScrolling && Math.abs(tilt) > 1) { 
          window.scrollBy({ top: scrollAmount, behavior: 'auto' });
          tiltRafId = requestAnimationFrame(scroll);
        } else {
          if (tiltRafId) cancelAnimationFrame(tiltRafId);
        }
      };
      
      if (tiltRafId) cancelAnimationFrame(tiltRafId);
      scroll();
    };
  
    if (isTiltScrolling && permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (tiltRafId) cancelAnimationFrame(tiltRafId);
      referenceBeta = null;
    }
  
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (tiltRafId) cancelAnimationFrame(tiltRafId);
    };
  }, [isTiltScrolling, permissionGranted]);

  // Initial Scroll Reset
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsTiltScrolling(false);
    setIsAutoScrolling(false);
  }, []);

  // --- Handlers ---
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleAutoScroll = () => {
    if (isTiltScrolling) setIsTiltScrolling(false);
    setIsAutoScrolling(prev => !prev);
  };

  const toggleTiltScroll = async () => {
    if (isAutoScrolling) setIsAutoScrolling(false);

    if (isTiltScrolling) {
      setIsTiltScrolling(false);
      return;
    }

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          setIsTiltScrolling(true);
        } else {
          alert('Permission denied.');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setPermissionGranted(true);
      setIsTiltScrolling(true);
    }
  };

  const handleBackUp = () => {
    const now = Date.now();
    const timeDiff = now - lastClickTime.current;
    
    if (timeDiff < 300 && timeDiff > 0) {
        // Double Tap -> Top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Single Tap -> Previous Section
        const currentScroll = window.scrollY + 120; // Header + buffer offset
        let currentSectionIdx = 0;
        
        // Find which section we are currently in
        for (let i = 0; i < sectionRefs.current.length; i++) {
            const el = sectionRefs.current[i];
            if (el && el.offsetTop <= currentScroll) {
                currentSectionIdx = i;
            }
        }

        const targetIdx = Math.max(0, currentSectionIdx - 1);
        const targetEl = sectionRefs.current[targetIdx];
        
        if (targetEl) {
            const headerOffset = 80;
            window.scrollTo({ top: targetEl.offsetTop - headerOffset, behavior: 'smooth' });
        }
    }
    lastClickTime.current = now;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500">
      {!isFullScreen && <Header settings={settings} updateSetting={updateSetting} />}
      
      <main className={`flex-grow container mx-auto px-4 ${isFullScreen ? 'pt-12 pb-24' : 'py-8 pb-32'} max-w-3xl relative`}>
        {PRAYER_DATA.map((section: Section, sIdx: number) => (
            <div 
                key={`section-${sIdx}`} 
                className="mb-8 scroll-mt-24"
                ref={el => { sectionRefs.current[sIdx] = el; }}
            >
                {section.title && sIdx > 0 && (
                     <div className="flex items-center gap-4 my-6 opacity-40">
                        <div className="h-px bg-stone-400 flex-grow"></div>
                        <span className="font-serif italic text-sm text-stone-500 uppercase tracking-widest text-center">{section.title}</span>
                        <div className="h-px bg-stone-400 flex-grow"></div>
                     </div>
                )}
                
                {section.blocks.map((block) => (
                    <PrayerBlock 
                        key={block.id} 
                        data={block} 
                        settings={settings} 
                    />
                ))}

                {/* Insert Mandala Image after the first section (Introduction) */}
                {sIdx === 0 && (
                    <div 
                        ref={mandalaRef}
                        className="mt-2 mb-20 flex justify-center items-center transition-all duration-100 ease-out will-change-transform will-change-opacity"
                    >
                        <div className="relative p-1.5 md:p-3 rounded-full border border-monk-red/20 dark:border-monk-saffron/20 shadow-2xl shadow-monk-red/10 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm w-[90vw] h-[90vw] md:w-[600px] md:h-[600px] max-w-full">
                             <img 
                                src="https://s6.imgcdn.dev/Y7uT2D.png" 
                                alt="Kurukulle Mandala" 
                                className="w-full h-full object-cover rounded-full opacity-90 hover:opacity-100 transition-opacity duration-700"
                             />
                        </div>
                    </div>
                )}
            </div>
        ))}

        <div className="h-32 flex items-center justify-center opacity-30 text-stone-500 italic font-serif">
            Sarva Mangalam
        </div>
      </main>
      
      {/* Back Up Button */}
      <button
        onClick={handleBackUp}
        className={`fixed bottom-24 right-6 z-40 p-3 rounded-full bg-monk-red text-white shadow-xl shadow-monk-red/20 transition-all duration-300 transform hover:scale-110 active:scale-90 ${
            showScrollUp ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
        aria-label="Back to previous section (Double tap for top)"
      >
        <ChevronUp size={24} />
      </button>

      <BottomBar 
        fontSize={settings.fontSize} setFontSize={(v) => updateSetting('fontSize', v)}
        isFullScreen={isFullScreen} toggleFullScreen={() => setIsFullScreen(p => !p)}
        isDarkMode={settings.isDarkMode} toggleTheme={() => updateSetting('isDarkMode', !settings.isDarkMode)}
        isTiltScrolling={isTiltScrolling} toggleTiltScroll={toggleTiltScroll}
        isAutoScrolling={isAutoScrolling} toggleAutoScroll={toggleAutoScroll}
        scrollSpeed={scrollSpeed} setScrollSpeed={setScrollSpeed}
      />
    </div>
  );
};

export default App;