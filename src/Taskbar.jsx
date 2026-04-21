/* global React, StartFlag, SpeakerIcon, AboutIcon, TableIcon, ChartIcon, CodeIcon */
const { useState: useStateTB, useEffect: useEffectTB } = React;

function Taskbar({ openApps, activeId, onAppClick, onStartClick, startOpen, theme, onToggleTheme }) {
  const [now, setNow] = useStateTB(new Date());
  useEffectTB(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="taskbar">
      <button className={`start-btn ${startOpen ? "active" : ""}`} onClick={onStartClick}>
        <span className="start-flag"><StartFlag/></span>
        start
      </button>
      <div className="taskbar-apps">
        {openApps.map(app => (
          <button
            key={app.id}
            className={`taskbar-app ${activeId === app.id && !app.minimized ? "active" : ""}`}
            onClick={() => onAppClick(app.id)}
          >
            <span style={{ width: 14, height: 14, display: "inline-flex" }}>
              {appIcon(app.id, 14)}
            </span>
            <span className="taskbar-app-label">{app.title}</span>
          </button>
        ))}
      </div>
      <div className="tray">
        <button className="tray-theme" onClick={onToggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <SpeakerIcon/>
        <span className="tray-clock">{time}</span>
      </div>
    </div>
  );
}

function appIcon(appId, size = 16) {
  switch (appId) {
    case "about":  return <AboutIcon size={size}/>;
    case "tables": return <TableIcon size={size}/>;
    case "charts": return <ChartIcon size={size}/>;
    case "code":   return <CodeIcon size={size}/>;
    default: return null;
  }
}

window.Taskbar = Taskbar;
window.appIcon = appIcon;
