/* global React */
// SVG icons used across the UI. Original — not derived from any branded OS assets.

const { useMemo } = React;

// Generic folder icon (manila + blue accent)
function FolderIcon({ size = 42, accent = "#f0c860" }) {
  return (
    <svg className="desk-icon-img" viewBox="0 0 48 42" width={size} height={size * 42/48}
         style={{ width: size, height: size * 42/48 }}>
      <defs>
        <linearGradient id="folderFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor="#c99118" />
        </linearGradient>
        <linearGradient id="folderTab" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6d77c" />
          <stop offset="1" stopColor="#d9a830" />
        </linearGradient>
      </defs>
      {/* back tab */}
      <path d="M2 8 h14 l4 4 h28 v28 H2 Z" fill="url(#folderTab)" stroke="#8a6210" strokeWidth="0.8"/>
      {/* front */}
      <path d="M2 14 h44 v26 H2 Z" fill="url(#folderFill)" stroke="#8a6210" strokeWidth="0.8"/>
      <path d="M2 14 h44 v4 H2 Z" fill="#ffffff" opacity="0.35"/>
    </svg>
  );
}

// About = book / document-with-i icon
function AboutIcon({ size = 42 }) {
  return (
    <svg className="desk-icon-img" viewBox="0 0 48 48" style={{ width: size, height: size }}>
      <defs>
        <linearGradient id="docBg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset="1" stopColor="#dbe6f2"/>
        </linearGradient>
      </defs>
      <path d="M8 4 h22 l10 10 v30 H8 Z" fill="url(#docBg)" stroke="#4a6fa5" strokeWidth="1"/>
      <path d="M30 4 v10 h10" fill="none" stroke="#4a6fa5" strokeWidth="1"/>
      <circle cx="24" cy="24" r="7" fill="#4a6fa5"/>
      <rect x="23" y="20" width="2" height="2" fill="#fff"/>
      <rect x="23" y="23" width="2" height="7" fill="#fff"/>
    </svg>
  );
}

// Chart icon — small bar chart
function ChartIcon({ size = 42 }) {
  return (
    <svg className="desk-icon-img" viewBox="0 0 48 48" style={{ width: size, height: size }}>
      <defs>
        <linearGradient id="chartBg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset="1" stopColor="#e7eef7"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="2" fill="url(#chartBg)" stroke="#5a7ca6"/>
      <rect x="12" y="24" width="5" height="14" fill="#c06a3b"/>
      <rect x="20" y="18" width="5" height="20" fill="#4a8a4e"/>
      <rect x="28" y="12" width="5" height="26" fill="#3d6aa0"/>
      <rect x="36" y="22" width="4" height="16" fill="#a05fa0"/>
    </svg>
  );
}

// Table icon — sheet of rows
function TableIcon({ size = 42 }) {
  return (
    <svg className="desk-icon-img" viewBox="0 0 48 48" style={{ width: size, height: size }}>
      <rect x="6" y="6" width="36" height="36" rx="2" fill="#fff" stroke="#5a7ca6"/>
      <rect x="6" y="6" width="36" height="6" fill="#4a6fa5"/>
      <line x1="18" y1="6" x2="18" y2="42" stroke="#b4c3d6"/>
      <line x1="30" y1="6" x2="30" y2="42" stroke="#b4c3d6"/>
      <line x1="6" y1="18" x2="42" y2="18" stroke="#b4c3d6"/>
      <line x1="6" y1="24" x2="42" y2="24" stroke="#b4c3d6"/>
      <line x1="6" y1="30" x2="42" y2="30" stroke="#b4c3d6"/>
      <line x1="6" y1="36" x2="42" y2="36" stroke="#b4c3d6"/>
    </svg>
  );
}

// Code icon — < / > on document
function CodeIcon({ size = 42 }) {
  return (
    <svg className="desk-icon-img" viewBox="0 0 48 48" style={{ width: size, height: size }}>
      <rect x="6" y="6" width="36" height="36" rx="2" fill="#1e1e1e" stroke="#2a3340"/>
      <text x="24" y="30" textAnchor="middle" fontFamily="monospace" fontSize="16"
            fontWeight="700" fill="#4ea8f5">{"</>"}</text>
    </svg>
  );
}

// Small file / csv / py icons for inside explorers
function CsvIcon({ size = 18 }) {
  return (
    <svg className="file-icon" viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <path d="M5 2 h10 l4 4 v16 H5 Z" fill="#fff" stroke="#4a6fa5"/>
      <path d="M15 2 v4 h4" fill="none" stroke="#4a6fa5"/>
      <rect x="7" y="13" width="10" height="7" fill="#4a8a4e"/>
      <text x="12" y="19" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fontWeight="700" fill="#fff">CSV</text>
    </svg>
  );
}

function PyIcon({ size = 18 }) {
  return (
    <svg className="file-icon" viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <path d="M12 3 c-4 0 -5 1 -5 3 v2 h6 v1 H5 c-2 0 -3 1 -3 4 s1 4 3 4 h2 v-3 c0 -2 1 -3 4 -3 h4 c2 0 3 -1 3 -3 V6 c0 -2 -1 -3 -6 -3 z m-2 2 a1 1 0 1 1 0 2 a1 1 0 0 1 0 -2 z" fill="#3d6aa0"/>
      <path d="M12 21 c4 0 5 -1 5 -3 v-2 h-6 v-1 h8 c2 0 3 -1 3 -4 s-1 -4 -3 -4 h-2 v3 c0 2 -1 3 -4 3 h-4 c-2 0 -3 1 -3 3 v4 c0 2 1 3 6 3 z m2 -2 a1 1 0 1 1 0 -2 a1 1 0 0 1 0 2 z" fill="#e0a93a"/>
    </svg>
  );
}

function PngIcon({ size = 18 }) {
  return (
    <svg className="file-icon" viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <path d="M5 2 h10 l4 4 v16 H5 Z" fill="#fff" stroke="#4a6fa5"/>
      <path d="M15 2 v4 h4" fill="none" stroke="#4a6fa5"/>
      <rect x="7" y="10" width="10" height="8" fill="#a05fa0"/>
      <circle cx="10" cy="13" r="1.2" fill="#fff"/>
      <path d="M7 18 l3 -3 l2 2 l3 -4 l2 5 z" fill="#d9b0d9"/>
    </svg>
  );
}

// Start-menu flag (original abstract mark)
function StartFlag({ size = 18 }) {
  return (
    <svg viewBox="0 0 18 18" width={size} height={size}>
      <rect x="2" y="2" width="6" height="6" fill="#e74c3c"/>
      <rect x="10" y="2" width="6" height="6" fill="#27ae60"/>
      <rect x="2" y="10" width="6" height="6" fill="#3498db"/>
      <rect x="10" y="10" width="6" height="6" fill="#f39c12"/>
    </svg>
  );
}

// Tray speaker
function SpeakerIcon() {
  return (
    <svg className="tray-icon" viewBox="0 0 16 16">
      <path d="M2 6 h3 l4 -3 v10 l-4 -3 H2 Z" fill="#fff"/>
      <path d="M11 5 q2 3 0 6" stroke="#fff" fill="none" strokeWidth="1"/>
      <path d="M13 3 q3 5 0 10" stroke="#fff" fill="none" strokeWidth="1"/>
    </svg>
  );
}

function ResizeVG({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <path d="M10 2 v2 h2" stroke="currentColor" fill="none"/>
    </svg>
  );
}

Object.assign(window, {
  FolderIcon, AboutIcon, ChartIcon, TableIcon, CodeIcon,
  CsvIcon, PyIcon, PngIcon, StartFlag, SpeakerIcon, ResizeVG,
});
