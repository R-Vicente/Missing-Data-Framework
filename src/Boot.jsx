/* global React */
const { useState: useStateBoot, useEffect: useEffectBoot } = React;

function Boot({ onDone }) {
  useEffectBoot(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="boot">
      <div className="boot-logo">
        <svg className="boot-mark" viewBox="0 0 100 100">
          <g>
            {/* matrix of dots, some hollow = "missing" */}
            {[...Array(5)].map((_, r) =>
              [...Array(5)].map((_, c) => {
                const x = 12 + c * 18, y = 12 + r * 18;
                const missing = (r + c * 3) % 7 === 0;
                return missing
                  ? <circle key={`${r}-${c}`} cx={x} cy={y} r="5" fill="none" stroke="#6aa8d6" strokeWidth="1.5" strokeDasharray="2 2"/>
                  : <circle key={`${r}-${c}`} cx={x} cy={y} r="5" fill="#6aa8d6" opacity={0.4 + (((r+c) % 3) * 0.2)}/>;
              })
            )}
          </g>
        </svg>
        <div className="boot-title">BenchmarkOS</div>
        <div className="boot-sub">Imputation Benchmarking</div>
      </div>
      <div className="boot-bar"><div className="boot-bar-fill"/></div>
      <div className="boot-hostname">loading workspace…</div>
    </div>
  );
}

window.Boot = Boot;

