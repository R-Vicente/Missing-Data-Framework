/* global React */
const { useState, useRef, useEffect, useCallback } = React;

// Draggable, resizable window with XP-like chrome.
// Props: title, icon, onClose, onMinimize, onFocus, z, active, children,
//        initial {x, y, w, h}, minW, minH

function Window({
  title, icon, onClose, onMinimize, onFocus, z, active,
  children,
  initial = { x: 80, y: 60, w: 820, h: 540 },
  minW = 420, minH = 300,
}) {
  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const [size, setSize] = useState({ w: initial.w, h: initial.h });
  const [maximized, setMaximized] = useState(false);
  const prev = useRef(null);
  const dragRef = useRef(null);

  // Constrain on mount for small viewports
  useEffect(() => {
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 60;
    setPos(p => ({ x: Math.max(0, Math.min(p.x, maxX - 100)), y: Math.max(0, Math.min(p.y, maxY - 60)) }));
    setSize(s => ({
      w: Math.min(s.w, window.innerWidth - 40),
      h: Math.min(s.h, window.innerHeight - 60),
    }));
  }, []);

  const startDrag = useCallback((e) => {
    if (maximized) return;
    if (e.target.closest(".tb-btn")) return;
    onFocus && onFocus();
    const startX = e.clientX, startY = e.clientY;
    const { x, y } = pos;
    const move = (ev) => {
      setPos({
        x: Math.max(-size.w + 120, Math.min(window.innerWidth - 80, x + ev.clientX - startX)),
        y: Math.max(0, Math.min(window.innerHeight - 60, y + ev.clientY - startY)),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [pos, size, maximized, onFocus]);

  const startResize = useCallback((e) => {
    if (maximized) return;
    e.stopPropagation();
    onFocus && onFocus();
    const startX = e.clientX, startY = e.clientY;
    const { w, h } = size;
    const move = (ev) => {
      setSize({
        w: Math.max(minW, Math.min(window.innerWidth - pos.x - 10, w + ev.clientX - startX)),
        h: Math.max(minH, Math.min(window.innerHeight - pos.y - 40, h + ev.clientY - startY)),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [size, pos, maximized, minW, minH, onFocus]);

  const toggleMaximize = () => {
    if (maximized) {
      if (prev.current) {
        setPos(prev.current.pos);
        setSize(prev.current.size);
      }
      setMaximized(false);
    } else {
      prev.current = { pos, size };
      setPos({ x: 0, y: 0 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 30 });
      setMaximized(true);
    }
  };

  const style = {
    left: pos.x, top: pos.y,
    width: size.w, height: size.h,
    zIndex: z,
  };

  return (
    <div
      className={`window ${active ? "" : "inactive"} ${maximized ? "maximized" : ""}`}
      style={style}
      onMouseDown={onFocus}
      ref={dragRef}
    >
      <div className="titlebar" onMouseDown={startDrag} onDoubleClick={toggleMaximize}>
        <span className="titlebar-icon">{icon}</span>
        <span className="titlebar-title">{title}</span>
        <div className="titlebar-buttons">
          <button className="tb-btn" onClick={onMinimize} title="Minimize">_</button>
          <button className="tb-btn" onClick={toggleMaximize} title={maximized ? "Restore" : "Maximize"}>
            {maximized ? "❐" : "□"}
          </button>
          <button className="tb-btn close" onClick={onClose} title="Close">×</button>
        </div>
      </div>

      <div className="window-body">
        {children}
      </div>

      {!maximized && <div className="resize-handle" onMouseDown={startResize} />}
    </div>
  );
}

window.Window = Window;
