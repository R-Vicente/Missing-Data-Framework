/* global React, DESKTOP_ICONS, PAPER, FolderIcon, AboutIcon, TableIcon, ChartIcon, CodeIcon, appIcon */
const { useState: useStateD, useEffect: useEffectD } = React;

function iconFor(id) {
  switch (id) {
    case "about":  return <AboutIcon/>;
    case "tables": return <FolderIcon accent="#f0c860"/>;
    case "charts": return <FolderIcon accent="#c8a0dc"/>;
    case "code":   return <FolderIcon accent="#95c490"/>;
    default:       return <FolderIcon/>;
  }
}

function Wallpaper() {
  // Original abstract wallpaper: a data matrix with a few "missing" (empty) cells,
  // on a soft gradient. Not based on any OEM wallpaper.
  const cols = 18, rows = 10;
  const cells = [];
  let seed = 7;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const missing = rand() < 0.14;
      const intensity = 0.25 + rand() * 0.55;
      cells.push({ r, c, missing, intensity });
    }
  }

  return (
    <svg className="desktop-svg" viewBox="0 0 1800 1000" preserveAspectRatio="xMidYMid slice">
      {/* horizon glow */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="1800" height="1000" fill="url(#glow)"/>
      {/* data matrix floating mid-screen */}
      <g transform="translate(360, 170)">
        {cells.map((cell, i) => {
          const size = 56, gap = 10;
          const x = cell.c * (size + gap);
          const y = cell.r * (size + gap);
          if (cell.missing) {
            return (
              <g key={i}>
                <rect x={x} y={y} width={size} height={size}
                      fill="none"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"/>
                <text x={x + size/2} y={y + size/2 + 6} textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="18" fill="rgba(255,255,255,0.6)">NA</text>
              </g>
            );
          }
          return (
            <rect key={i} x={x} y={y} width={size} height={size}
                  fill={`rgba(255,255,255,${cell.intensity * 0.28})`}
                  stroke="rgba(255,255,255,0.12)"/>
          );
        })}
      </g>
    </svg>
  );
}

function Desktop({ onOpen }) {
  const [selected, setSelected] = useStateD(null);

  useEffectD(() => {
    const onClick = (e) => {
      if (!e.target.closest(".desk-icon")) setSelected(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="desktop">
      <Wallpaper/>

      <div className="icon-grid">
        {DESKTOP_ICONS.map(icon => (
          <div
            key={icon.id}
            className={`desk-icon ${selected === icon.id ? "selected" : ""}`}
            onMouseDown={(e) => { e.stopPropagation(); setSelected(icon.id); }}
            onDoubleClick={() => onOpen(icon.app)}
            title={`Double-click to open ${icon.label}`}
          >
            {iconFor(icon.id)}
            <div className="desk-icon-label">{icon.label}</div>
          </div>
        ))}
      </div>

      <div className="desk-title">
        <div className="t1">{PAPER.title}</div>
        <div className="t2">{PAPER.authors.map(a => a.name).join(" · ")} · {PAPER.year}</div>
      </div>
    </div>
  );
}

window.Desktop = Desktop;
window.iconFor = iconFor;
