/* global React, CHARTS, PngIcon */
const { useState: useStateCharts } = React;

// Generates a distinct placeholder SVG per chart kind.
function ChartPlaceholder({ kind, small = false }) {
  const w = small ? 52 : 720;
  const h = small ? 38 : 450;
  const vb = small ? "0 0 52 38" : "0 0 720 450";

  if (kind === "bars") {
    return (
      <svg viewBox={vb} width={w} height={h}>
        <rect width="100%" height="100%" fill="#ffffff"/>
        {[...Array(6)].map((_, i) => {
          const bw = small ? 6 : 90;
          const gap = small ? 2 : 20;
          const x = (small ? 4 : 40) + i * (bw + gap);
          const bh = (small ? [22, 16, 28, 10, 24, 18] : [280, 210, 360, 130, 310, 240])[i];
          const y = (small ? 34 : 400) - bh;
          const colors = ["#3d6aa0", "#c06a3b", "#4a8a4e", "#a05fa0", "#d9a830", "#6a9eb5"];
          return <rect key={i} x={x} y={y} width={bw} height={bh} fill={colors[i]}/>;
        })}
        {!small && <line x1="40" y1="400" x2="700" y2="400" stroke="#333" strokeWidth="1"/>}
      </svg>
    );
  }

  if (kind === "scatter") {
    return (
      <svg viewBox={vb} width={w} height={h}>
        <rect width="100%" height="100%" fill="#ffffff"/>
        {[...Array(small ? 20 : 80)].map((_, i) => {
          const x = small ? 4 + Math.random() * 44 : 40 + Math.random() * 660;
          const y = small ? 4 + Math.random() * 30 : 30 + Math.random() * 340;
          return <circle key={i} cx={x} cy={y} r={small ? 1.5 : 5} fill="#3d6aa0" opacity="0.55"/>;
        })}
        {!small && <line x1="40" y1="30" x2="700" y2="370" stroke="#c06a3b" strokeWidth="2" strokeDasharray="6 4"/>}
      </svg>
    );
  }

  if (kind === "paired") {
    return (
      <svg viewBox={vb} width={w} height={h}>
        <rect width="100%" height="100%" fill="#ffffff"/>
        {[...Array(6)].map((_, i) => {
          const x1 = small ? 10 : 150;
          const x2 = small ? 40 : 580;
          const step = small ? 5 : 55;
          const y1 = (small ? 6 : 80) + i * step;
          const y2 = y1 + (small ? 2 : 30) + Math.random() * (small ? 4 : 40);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3d6aa0" strokeWidth={small ? 0.8 : 2}/>
              <circle cx={x1} cy={y1} r={small ? 1.5 : 5} fill="#4a8a4e"/>
              <circle cx={x2} cy={y2} r={small ? 1.5 : 5} fill="#c06a3b"/>
            </g>
          );
        })}
      </svg>
    );
  }

  if (kind === "heatmap") {
    const cols = small ? 6 : 12;
    const rows = small ? 4 : 6;
    const cw = small ? 7 : 55;
    const ch = small ? 7 : 55;
    const ox = small ? 4 : 40;
    const oy = small ? 4 : 40;
    return (
      <svg viewBox={vb} width={w} height={h}>
        <rect width="100%" height="100%" fill="#ffffff"/>
        {[...Array(rows)].map((_, r) =>
          [...Array(cols)].map((_, c) => {
            const v = Math.random();
            const color = `rgb(${Math.round(255 - v*180)}, ${Math.round(220 - v*120)}, ${Math.round(255 - v*60)})`;
            return <rect key={`${r}-${c}`} x={ox + c*cw} y={oy + r*ch} width={cw-0.5} height={ch-0.5} fill={color}/>;
          })
        )}
      </svg>
    );
  }

  if (kind === "lines") {
    const pts1 = Array.from({length: 8}, (_, i) => i);
    return (
      <svg viewBox={vb} width={w} height={h}>
        <rect width="100%" height="100%" fill="#ffffff"/>
        {[0,1,2].map(s => (
          <polyline key={s} fill="none"
            stroke={["#3d6aa0","#c06a3b","#4a8a4e"][s]}
            strokeWidth={small ? 1 : 2}
            points={pts1.map(i => {
              const x = (small ? 4 : 40) + i * (small ? 6 : 90);
              const y = (small ? 20 : 220) + Math.sin(i * 0.8 + s) * (small ? 8 : 80) + s * (small ? 3 : 30);
              return `${x},${y}`;
            }).join(" ")}/>
        ))}
      </svg>
    );
  }

  // violins
  return (
    <svg viewBox={vb} width={w} height={h}>
      <rect width="100%" height="100%" fill="#ffffff"/>
      {[...Array(6)].map((_, i) => {
        const cx = (small ? 6 : 80) + i * (small ? 7 : 105);
        const cy = small ? 19 : 220;
        const rx = small ? 2.5 : 28;
        const ry = small ? 10 : 120 + Math.random() * 40;
        return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
          fill={["#3d6aa0","#c06a3b","#4a8a4e","#a05fa0","#d9a830","#6a9eb5"][i]} opacity="0.7"/>;
      })}
    </svg>
  );
}

function Charts() {
  const [sel, setSel] = useStateCharts(CHARTS[0].id);
  const selected = CHARTS.find(c => c.id === sel);

  return (
    <div className="charts-root">
      <div className="charts-list">
        {CHARTS.map(c => (
          <div key={c.id}
               className={`chart-item ${sel === c.id ? "selected" : ""}`}
               onClick={() => setSel(c.id)}>
            <div className="chart-thumb">
              <ChartPlaceholder kind={c.kind} small/>
            </div>
            <div className="chart-item-text">
              <div className="chart-item-title">{c.title.split(".")[0]}</div>
              <div className="chart-item-sub">{c.title.replace(/^Figure \d+\.\s*/, "")}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-preview">
        <div className="chart-preview-title">{selected.title}</div>
        <div className="chart-preview-img">
          <ChartPlaceholder kind={selected.kind}/>
        </div>
        <div className="chart-preview-caption">{selected.caption}</div>
        <div style={{ alignSelf: "flex-start", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)" }}>
          {selected.name} · placeholder — replace with final figure
        </div>
      </div>
    </div>
  );
}

window.Charts = Charts;
window.ChartPlaceholder = ChartPlaceholder;
