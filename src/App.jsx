/* global React, ReactDOM, Boot, Desktop, Taskbar, Window, About, Tables, Charts, Code, appIcon */
const { useState, useEffect, useCallback } = React;

const APP_META = {
  about:  { title: "About — Paper", initial: { x: 120, y: 60, w: 820, h: 600 } },
  tables: { title: "Tables", initial: { x: 100, y: 40, w: 880, h: 560 } },
  charts: { title: "Charts", initial: { x: 140, y: 70, w: 900, h: 580 } },
  code:   { title: "Code — Python",  initial: { x: 110, y: 50, w: 920, h: 600 } },
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [booting, setBooting] = useState(() => !sessionStorage.getItem("booted"));
  const [apps, setApps] = useState([]);       // [{id, title, minimized}]
  const [activeId, setActiveId] = useState(null);
  const [zStack, setZStack] = useState({});   // id -> z
  const [zTop, setZTop] = useState(100);
  const [startOpen, setStartOpen] = useState(false);
  const [tableSel, setTableSel] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleBootDone = useCallback(() => {
    sessionStorage.setItem("booted", "1");
    setBooting(false);
  }, []);

  const focus = useCallback((id) => {
    setZTop(z => {
      const next = z + 1;
      setZStack(s => ({ ...s, [id]: next }));
      return next;
    });
    setActiveId(id);
    setApps(a => a.map(x => x.id === id ? { ...x, minimized: false } : x));
  }, []);

  const openApp = useCallback((appId) => {
    setStartOpen(false);
    setApps(a => {
      if (a.find(x => x.id === appId)) {
        return a.map(x => x.id === appId ? { ...x, minimized: false } : x);
      }
      return [...a, { id: appId, title: APP_META[appId].title, minimized: false }];
    });
    focus(appId);
  }, [focus]);

  const closeApp = useCallback((appId) => {
    setApps(a => a.filter(x => x.id !== appId));
    setZStack(s => { const n = { ...s }; delete n[appId]; return n; });
    if (appId === "tables") setTableSel(null);
    setActiveId(curr => curr === appId ? null : curr);
  }, []);

  const minimizeApp = useCallback((appId) => {
    setApps(a => a.map(x => x.id === appId ? { ...x, minimized: true } : x));
    setActiveId(null);
  }, []);

  const toggleApp = useCallback((appId) => {
    const app = apps.find(x => x.id === appId);
    if (!app) return;
    if (app.minimized) {
      focus(appId);
    } else if (activeId === appId) {
      minimizeApp(appId);
    } else {
      focus(appId);
    }
  }, [apps, activeId, focus, minimizeApp]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === "light" ? "dark" : "light");
  }, []);

  // Close start menu on outside click
  useEffect(() => {
    if (!startOpen) return;
    const onDown = (e) => {
      if (!e.target.closest(".start-menu") && !e.target.closest(".start-btn")) {
        setStartOpen(false);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    return () => document.removeEventListener("mousedown", onDown);
  }, [startOpen]);

  if (booting) return <Boot onDone={handleBootDone}/>;

  return (
    <>
      <Desktop onOpen={openApp}/>

      {apps.map(app => {
        if (app.minimized) return null;
        const meta = APP_META[app.id];
        const z = zStack[app.id] || 100;
        const active = activeId === app.id;
        const title = app.id === "tables" && tableSel
          ? `${meta.title} — ${findTableName(tableSel)}`
          : meta.title;
        return (
          <Window
            key={app.id}
            title={title}
            icon={appIcon(app.id, 14)}
            onClose={() => closeApp(app.id)}
            onMinimize={() => minimizeApp(app.id)}
            onFocus={() => focus(app.id)}
            z={z}
            active={active}
            initial={meta.initial}
          >
            {renderAppBody(app.id, { tableSel, setTableSel })}
          </Window>
        );
      })}

      <Taskbar
        openApps={apps}
        activeId={activeId}
        onAppClick={toggleApp}
        onStartClick={() => setStartOpen(o => !o)}
        startOpen={startOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {startOpen && <StartMenu onOpen={openApp} onTheme={toggleTheme}/>}
    </>
  );
}

function findTableName(id) {
  const t = (window.TABLES || []).find(x => x.id === id);
  return t ? t.title.split(".")[0] : "";
}

function renderAppBody(id, { tableSel, setTableSel }) {
  switch (id) {
    case "about":  return <About/>;
    case "tables": return <Tables selectedId={tableSel} onSelect={setTableSel}/>;
    case "charts": return <Charts/>;
    case "code":   return <Code/>;
    default: return null;
  }
}

function StartMenu({ onOpen, onTheme }) {
  return (
    <div className="start-menu">
      <div className="start-header">
        <div className="avatar">R</div>
        <div>
          <div style={{ fontSize: 13 }}>Researcher</div>
          <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>Benchmark workspace</div>
        </div>
      </div>
      <div className="start-body">
        <div className="start-item" onClick={() => onOpen("about")}>
          <span className="start-item-icon">{appIcon("about", 22)}</span>
          <span>About the paper</span>
        </div>
        <div className="start-item" onClick={() => onOpen("tables")}>
          <span className="start-item-icon">{appIcon("tables", 22)}</span>
          <span>Tables</span>
        </div>
        <div className="start-item" onClick={() => onOpen("charts")}>
          <span className="start-item-icon">{appIcon("charts", 22)}</span>
          <span>Charts</span>
        </div>
        <div className="start-item" onClick={() => onOpen("code")}>
          <span className="start-item-icon">{appIcon("code", 22)}</span>
          <span>Code</span>
        </div>
        <div className="start-sep"/>
        <div className="start-item" onClick={onTheme}>
          <span className="start-item-icon" style={{ display: "grid", placeItems: "center" }}>🎨</span>
          <span>Toggle theme</span>
        </div>
      </div>
      <div className="start-footer">
        <button onClick={() => window.location.reload()}>⟲ Restart</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
