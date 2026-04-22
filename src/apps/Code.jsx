/* global React, CODE_FILES, PyIcon */
const { useState: useStateCode } = React;

// Minimal Python syntax highlighter (returns an array of nodes, indexed by line).
const KEYWORDS = new Set([
  "from", "import", "as", "def", "class", "return", "if", "elif", "else",
  "for", "while", "in", "not", "and", "or", "is", "None", "True", "False",
  "pass", "break", "continue", "try", "except", "finally", "raise", "with",
  "lambda", "yield", "global", "nonlocal", "assert", "del",
]);
const BUILTINS = new Set([
  "print", "len", "range", "enumerate", "zip", "map", "filter", "list",
  "dict", "set", "tuple", "int", "float", "str", "bool", "open",
  "isinstance", "type", "super",
]);

function tokenize(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    // comment
    if (c === "#") {
      tokens.push({ cls: "cm", text: line.slice(i) });
      break;
    }
    // string
    if (c === '"' || c === "'") {
      // triple-quote?
      if (line.slice(i, i + 3) === c + c + c) {
        const end = line.indexOf(c + c + c, i + 3);
        if (end >= 0) {
          tokens.push({ cls: "str", text: line.slice(i, end + 3) });
          i = end + 3; continue;
        } else {
          tokens.push({ cls: "str", text: line.slice(i) }); break;
        }
      }
      let j = i + 1;
      while (j < line.length && line[j] !== c) {
        if (line[j] === "\\") j += 2; else j++;
      }
      tokens.push({ cls: "str", text: line.slice(i, j + 1) });
      i = j + 1; continue;
    }
    // decorator
    if (c === "@" && /[A-Za-z_]/.test(line[i + 1] || "")) {
      let j = i + 1;
      while (j < line.length && /[A-Za-z0-9_.]/.test(line[j])) j++;
      tokens.push({ cls: "dec", text: line.slice(i, j) });
      i = j; continue;
    }
    // number
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < line.length && /[0-9._eE+\-]/.test(line[j])) j++;
      tokens.push({ cls: "num", text: line.slice(i, j) });
      i = j; continue;
    }
    // identifier
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let cls = null;
      if (KEYWORDS.has(word)) cls = "kw";
      else if (BUILTINS.has(word)) cls = "bi";
      else if (line[j] === "(") cls = "fn";
      if (cls) tokens.push({ cls, text: word });
      else tokens.push({ cls: null, text: word });
      i = j; continue;
    }
    // other
    tokens.push({ cls: null, text: c });
    i++;
  }
  return tokens;
}

function highlight(code) {
  return code.split("\n").map((line, i) => (
    <div key={i}>
      {tokenize(line).map((t, j) =>
        t.cls ? <span key={j} className={t.cls}>{t.text}</span> : <span key={j}>{t.text}</span>
      ) || "\u00A0"}
      {line.length === 0 && "\u00A0"}
    </div>
  ));
}

function fileIcon(name, size) {
  if (name.endsWith('.md')) return <CsvIcon size={size}/>;
  if (name.endsWith('.txt')) return <CsvIcon size={size}/>;
  return <PyIcon size={size}/>;
}

function downloadFile(file) {
  const blob = new Blob([file.code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = file.name;
  a.click(); URL.revokeObjectURL(url);
}

function downloadAll() {
  CODE_FILES.forEach(f => {
    const blob = new Blob([f.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = f.name;
    a.click(); URL.revokeObjectURL(url);
  });
}

function Code() {
  const [sel, setSel] = useStateCode(CODE_FILES[0].id);
  const file = CODE_FILES.find(f => f.id === sel);
  const lines = file.code.split("\n");

  return (
    <div className="code-root">
      <div className="code-sidebar">
        <div className="code-sidebar-head">Explorer</div>
        <div className="code-sidebar-head" style={{ marginTop: 4, fontSize: 11, textTransform: "none", letterSpacing: 0, color: "#bbb" }}>
          ▾ imputation/
        </div>
        {CODE_FILES.map(f => (
          <div
            key={f.id}
            className={`code-file ${sel === f.id ? "selected" : ""}`}
            onClick={() => setSel(f.id)}
            style={{ paddingLeft: 26 }}
          >
            {fileIcon(f.name, 14)} {f.name}
          </div>
        ))}
        <div style={{ padding: "12px 14px 6px", borderTop: "1px solid oklch(0.12 0.02 250)", marginTop: 8 }}>
          <button onClick={downloadAll} style={{
            background: "oklch(0.30 0.06 250)", border: "1px solid oklch(0.40 0.06 250)",
            color: "#fff", padding: "5px 10px", borderRadius: 2, fontSize: 11, cursor: "pointer", width: "100%"
          }}>⬇ Download all files</button>
        </div>
      </div>

      <div className="code-main">
        <div className="code-tabs">
          <div className="code-tab active" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {fileIcon(file.name, 12)} <span>{file.name}</span>
          </div>
          <button onClick={() => downloadFile(file)} style={{
            marginLeft: "auto", background: "transparent", border: "none",
            color: "oklch(0.68 0.02 250)", fontSize: 11, padding: "0 14px", cursor: "pointer"
          }}>⬇ Download</button>
        </div>
        <div className="code-content">
          <div className="code-gutter">
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <pre className="code-pre">{highlight(file.code)}</pre>
        </div>
        <div className="code-statusbar">
          <span>{file.lang === "python" ? "Python" : file.lang} · UTF-8 · LF</span>
          <span>{lines.length} lines · {file.desc}</span>
        </div>
      </div>
    </div>
  );
}

window.Code = Code;
