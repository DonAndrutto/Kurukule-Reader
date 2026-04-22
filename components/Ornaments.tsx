import React from 'react';

interface OrnamentProps {
  size?: number;
  className?: string;
}

export const EndlessKnot: React.FC<OrnamentProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M22 14 L22 26 L14 26 L14 38 L22 38 L22 50 L34 50 L34 42 L42 42 L42 50 L50 50 L50 38 L42 38 L42 26 L50 26 L50 14 L38 14 L38 22 L26 22 L26 14 Z" />
      <path d="M26 22 L26 34 L38 34 L38 22" />
      <path d="M22 26 L34 26 L34 38 L22 38" opacity="0.85" />
      <path d="M42 26 L30 26 L30 38 L42 38" opacity="0.85" />
    </g>
  </svg>
);

export const Lotus: React.FC<OrnamentProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Outer petals */}
      <path d="M32 50 C14 44 10 28 18 16 C24 24 28 34 32 50 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M32 50 C50 44 54 28 46 16 C40 24 36 34 32 50 Z" fill="currentColor" fillOpacity="0.12" />
      {/* Middle petals */}
      <path d="M32 50 C22 44 18 30 24 18 C28 26 30 36 32 50 Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M32 50 C42 44 46 30 40 18 C36 26 34 36 32 50 Z" fill="currentColor" fillOpacity="0.18" />
      {/* Center petal */}
      <path d="M32 50 C30 36 30 22 32 12 C34 22 34 36 32 50 Z" fill="currentColor" fillOpacity="0.25" />
      {/* Base line */}
      <path d="M14 50 L50 50" opacity="0.55" />
    </g>
  </svg>
);

export const Flourish: React.FC<OrnamentProps & { flip?: boolean }> = ({ size = 80, className = '', flip = false }) => (
  <svg
    width={size}
    height={size / 4}
    viewBox="0 0 160 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    style={flip ? { transform: 'scaleX(-1)' } : undefined}
  >
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
      <path d="M2 20 L60 20" />
      <path d="M60 20 C70 20 74 12 82 12 C90 12 94 20 102 20" />
      <path d="M102 20 C110 20 114 28 122 28 C130 28 134 20 142 20" />
      <path d="M142 20 L158 20" />
      <circle cx="80" cy="20" r="2.2" fill="currentColor" />
      <circle cx="82" cy="12" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="122" cy="28" r="1.2" fill="currentColor" opacity="0.7" />
    </g>
  </svg>
);

export const CornerOrnament: React.FC<OrnamentProps> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
      <path d="M2 2 L10 2" />
      <path d="M2 2 L2 10" />
      <path d="M2 2 C6 6 6 6 10 10" opacity="0.5" />
      <circle cx="2" cy="2" r="1.2" fill="currentColor" />
    </g>
  </svg>
);

export const Dorje: React.FC<OrnamentProps> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="currentColor" fillOpacity="0.9">
      <circle cx="16" cy="16" r="2.2" />
      <path d="M16 4 L16 11" strokeWidth="1.8" fill="none" />
      <path d="M16 21 L16 28" strokeWidth="1.8" fill="none" />
      <path d="M12 6 L16 11 L20 6" fill="none" />
      <path d="M12 26 L16 21 L20 26" fill="none" />
      <path d="M4 16 L11 16" strokeWidth="1.8" fill="none" />
      <path d="M21 16 L28 16" strokeWidth="1.8" fill="none" />
      <path d="M6 12 L11 16 L6 20" fill="none" />
      <path d="M26 12 L21 16 L26 20" fill="none" />
    </g>
  </svg>
);
