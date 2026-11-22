import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { AppSettings, Section } from './types';
import { PRAYER_DATA } from './constants';
import BottomBar from './components/BottomBar';
import Header, { donationURL } from './components/Header';
import PrayerBlock from './components/PrayerBlock';
import portrait from './assets/kurukulle.jpg';
import './reader.css';

const App: React.FC = () => {
  // --- State ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults = { fontSize: 18, isDarkMode: false, showPhonetics: true, showTranslation: true, showTibetan: true };
    try {
      const saved = JSON.parse(localStorage.getItem('kurukulle-app-settings') || '{}');
      return { ...defaults, ...saved };
    } catch {
      return defaults;
    }
  });
  
  const donationPrompt = useRef<HTMLDialogElement>(null);
  const donationShown = useRef(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isTiltScrolling, setIsTiltScrolling] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);

  // --- Refs ---
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
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
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else setIsFullScreen(value => !value);
    } catch {
      setIsFullScreen(value => !value);
    }
  };

  // 4. Scroll Listener for "Back Up" button and Mandala Fade
  useEffect(() => {
    const handleScroll = () => {
      // 4a. Back Up Button Visibility
      setShowScrollUp(window.scrollY > 300);
      
      // 4b. Auto-scroll safety check
      if (isAutoScrolling && (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
        setIsAutoScrolling(false);
      }

      if (!donationShown.current && window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        donationShown.current = true;
        setIsAutoScrolling(false);
        setIsTiltScrolling(false);
        donationPrompt.current?.showModal();
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

    if (typeof DeviceOrientationEvent === 'undefined') {
      alert('Tilt scrolling requires a device with an orientation sensor.');
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

  useEffect(() => {
    const stop = () => setIsAutoScrolling(false);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    return () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
    };
  }, []);

  return (
    <div>
      {!isFullScreen && <Header settings={settings} updateSetting={updateSetting} />}
      <main className="reader" style={{fontSize: settings.fontSize}}>
        {PRAYER_DATA.map((section: Section, index) => (
          <section key={section.title} ref={el => { sectionRefs.current[index] = el; }}>
            {index > 0 && <h2 className="section-title">{section.title}</h2>}
            {section.blocks.map(block => <React.Fragment key={block.id}>
              <PrayerBlock data={block} settings={settings} />
              {block.id === 'title-1' && <a href="https://ibb.co/0RN6dS4C" target="_blank" rel="noreferrer">
                <img className="portrait" src={portrait} alt="Kurukulle Mandala Image" width="531" height="640" />
              </a>}
            </React.Fragment>)}
            {index === 0 && <div className="mandala" ref={mandalaRef}>
              <figure><img src="https://raw.githubusercontent.com/DonAndrutto/Media/fb4334123099733c182b1a99b404b4b1cbfc5a41/kurukulla-mandala-reference-full.png" alt="Kurukulle Mandala" loading="lazy" /></figure>
            </div>}
          </section>
        ))}
        <p className="signoff">Sarva Mangalam</p>
      </main>
      {showScrollUp && <button className="back-up" onClick={handleBackUp} aria-label="Back to previous section (Double tap for top)"><ChevronUp size={20}/></button>}
      <dialog ref={donationPrompt}>
        <p>Would you like to support more translation projects?</p>
        <form method="dialog"><button>Later</button><a href={donationURL} target="_blank" rel="noreferrer">Donate</a></form>
      </dialog>
      <BottomBar 
        fontSize={settings.fontSize} setFontSize={(v) => updateSetting('fontSize', v)}
        isFullScreen={isFullScreen} toggleFullScreen={toggleFullScreen}
        isDarkMode={settings.isDarkMode} toggleTheme={() => updateSetting('isDarkMode', !settings.isDarkMode)}
        isTiltScrolling={isTiltScrolling} toggleTiltScroll={toggleTiltScroll}
        isAutoScrolling={isAutoScrolling} toggleAutoScroll={toggleAutoScroll}
        scrollSpeed={scrollSpeed} setScrollSpeed={setScrollSpeed}
      />
    </div>
  );
};

export default App;