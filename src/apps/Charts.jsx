/* global React, CHARTS */
const { useState: useStateCharts } = React;

function Charts() {
  const [sel, setSel] = useStateCharts(CHARTS[0].id);
  const selected = CHARTS.find(c => c.id === sel);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = selected.img;
    a.download = selected.name;
    a.click();
  };

  return (
    <div className="charts-root">
      <div className="charts-list">
        {CHARTS.map(c => (
          <div key={c.id}
               className={`chart-item ${sel === c.id ? "selected" : ""}`}
               onClick={() => setSel(c.id)}>
            <div className="chart-thumb">
              <img src={c.img} alt={c.title}
                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
                   onError={(e) => { e.target.style.display = "none"; }}/>
            </div>
            <div className="chart-item-text">
              <div className="chart-item-title">{c.title.split(".")[0]}</div>
              <div className="chart-item-sub">{c.title.replace(/^Figure \d+\.\s*/, "")}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-preview">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", maxWidth: 720 }}>
          <div className="chart-preview-title">{selected.title}</div>
          <button className="download-btn" onClick={handleDownload} style={{ flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1 v7 m-3 -3 l3 3 l3 -3 M1 10 h10" stroke="currentColor" fill="none" strokeWidth="1.2"/></svg>
            Download PNG
          </button>
        </div>
        <div className="chart-preview-img">
          <img src={selected.img} alt={selected.title}
               style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
        </div>
        <div className="chart-preview-caption">{selected.caption}</div>
        <div style={{ alignSelf: "flex-start", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)" }}>
          {selected.name}
        </div>
      </div>
    </div>
  );
}

window.Charts = Charts;
