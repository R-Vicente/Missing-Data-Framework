/* global React, TABLES, CsvIcon */
const { useState: useStateTables } = React;

function Tables({ selectedId, onSelect }) {
  const table = TABLES.find(t => t.id === selectedId);

  if (!table) {
    return <TableList onOpen={onSelect} />;
  }
  return <TableView table={table} onBack={() => onSelect(null)} />;
}

function TableList({ onOpen }) {
  const [sel, setSel] = useStateTables(null);
  return (
    <div className="explorer">
      <div className="explorer-sidebar">
        <div className="explorer-group">
          <div className="explorer-group-head">File and Folder Tasks</div>
          <div className="explorer-group-body">
            <a href="#" onClick={e => e.preventDefault()}>Rename this folder</a>
            <a href="#" onClick={e => e.preventDefault()}>Move this folder</a>
            <a href="#" onClick={e => e.preventDefault()}>Publish folder to the Web</a>
          </div>
        </div>
        <div className="explorer-group">
          <div className="explorer-group-head">Details</div>
          <div className="explorer-group-body">
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Tables</div>
            <div>File Folder</div>
            <div>Contains {TABLES.length} CSV files</div>
          </div>
        </div>
      </div>
      <div className="explorer-main">
        <table className="filelist">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Name</th>
              <th style={{ width: "10%" }}>Size</th>
              <th style={{ width: "10%" }}>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {TABLES.map(t => (
              <tr
                key={t.id}
                className={sel === t.id ? "selected" : ""}
                onClick={() => setSel(t.id)}
                onDoubleClick={() => onOpen(t.id)}
              >
                <td className="name"><CsvIcon/> {t.name}</td>
                <td>{t.size}</td>
                <td>CSV File</td>
                <td>{t.title.replace(/^Table \d+[a-z]?\.\s*/, "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableView({ table, onBack }) {
  const handleDownload = () => {
    const header = table.columns.map(quoteCSV).join(",");
    const rows = table.rows.map(r => r.map(quoteCSV).join(",")).join("\n");
    const csv = header + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = table.name;
    a.click(); URL.revokeObjectURL(url);
  };

  // Detect "best" values for numeric tables (lowest in each row for error tables)
  const isBest = (rowIdx, colIdx, val) => {
    if (table.id !== "t2" && table.id !== "t4a" && table.id !== "t4b") return false;
    if (colIdx === 0) return false;
    const row = table.rows[rowIdx];
    const nums = row.slice(1).map(v => parseFloat(String(v).split("±")[0]));
    const min = Math.min(...nums.filter(n => !isNaN(n)));
    const thisNum = parseFloat(String(val).split("±")[0]);
    return thisNum === min;
  };

  return (
    <div className="table-viewer">
      <div className="toolbar">
        <button className="toolbar-btn" onClick={onBack}>← Back</button>
        <div className="toolbar-sep"/>
        <span style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          Tables \ {table.name}
        </span>
      </div>
      <div className="table-caption">
        <div>
          <div className="cap-title">{table.title}</div>
          <div className="cap-sub">{table.caption}</div>
        </div>
        <button className="download-btn" onClick={handleDownload}>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1 v7 m-3 -3 l3 3 l3 -3 M1 10 h10" stroke="currentColor" fill="none" strokeWidth="1.2"/></svg>
          Download CSV
        </button>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>{table.columns.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  const numeric = typeof cell === "number" || /^[-+]?\d/.test(String(cell));
                  const best = isBest(i, j, cell);
                  return (
                    <td key={j} className={[numeric && j > 0 ? "num" : "", best ? "best" : ""].filter(Boolean).join(" ")}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="statusbar">
        <div className="statusbar-cell">{table.rows.length} rows</div>
        <div className="statusbar-cell">{table.columns.length} columns</div>
      </div>
    </div>
  );
}

function quoteCSV(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

window.Tables = Tables;
