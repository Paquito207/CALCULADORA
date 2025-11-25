import { useState, useEffect, useRef } from "react";
import Display from "./components/Display";
import Keypad from "./components/Keypad";
import History from "./components/History";
import { operate } from "./utils/math";
import "./index.css";

const STORAGE_KEY = "calc_history_v1";
const THEME_KEY = "calc_theme_v1";

export default function App() {
  // estado principal de la calculadora
  const [current, setCurrent] = useState("0"); // texto actual en el display
  const [prev, setPrev] = useState(null);      // valor previo para operaciones
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(false); // controla si escribir reemplaza el display

  // historial y UI
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // overlay del historial
  const [theme, setTheme] = useState(() => {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch (e) {
    return "dark";
  }
});
// tema visual

  // manejo de selección en el input (caret)
  const [cursor, setCursor] = useState({ start: null, end: null });
  const selectionToSetRef = useRef(null);   // posición que se quiere aplicar tras un setState
  const inputRef = useRef(null);

  // Carga el historial de operaciones
  useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) setHistory(JSON.parse(saved));
}, []);


  // sincronizar tema (clase en <html>) y guardarlo
  useEffect(() => {
  document.documentElement.classList.toggle("theme-light", theme === "light");
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}, [theme]);

  // guardar historial en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // helper para posicionar caret después de actualizaciones de current
  function setCaretAfterUpdate(pos) { selectionToSetRef.current = typeof pos === "number" ? pos : null; }

  useEffect(() => {
    const pos = selectionToSetRef.current;
    if (pos !== null && inputRef.current) {
      try { inputRef.current.setSelectionRange(pos, pos); inputRef.current.focus(); } catch (e) {}
      selectionToSetRef.current = null;
    }
  }, [current]);

  /* ---------- lógica de entrada y operaciones ---------- */

  function handleDigit(d) {
    // aceptar solo dígitos
    if (!/^\d$/.test(String(d))) return;
    if (overwrite) { // si el próximo dígito debe sobrescribir el display
      setCurrent(String(d)); setOverwrite(false); setCaretAfterUpdate(String(d).length); return;
    }
    if (current === "0") { // reemplazar el cero inicial
      setCurrent(String(d)); setCaretAfterUpdate(1); return;
    }
    // insertar en la posición del cursor (soporta selección)
    const start = cursor.start ?? current.length;
    const end = cursor.end ?? start;
    const newVal = current.slice(0, start) + String(d) + current.slice(end);
    setCurrent(newVal);
    setCaretAfterUpdate(start + 1);
  }

  function handleDecimal() {
    if (overwrite) { setCurrent("0."); setOverwrite(false); setCaretAfterUpdate(2); return; }
    if (current.includes(".")) return; // no permitir más de un punto
    const start = cursor.start ?? current.length;
    const end = cursor.end ?? start;
    const newVal = current.slice(0, start) + "." + current.slice(end);
    setCurrent(newVal);
    setCaretAfterUpdate(start + 1);
  }

  function handleOperator(op) {
    if (!["+", "-", "×", "÷"].includes(op)) return;
    if (operator && !overwrite) {
      // si ya hay un operador pendiente y el usuario presiona otro,
      // calcular el resultado anterior primero.
      const result = operate(prev ?? current, current, operator);
      if (result === "Error") { setCurrent("Error"); setPrev(null); setOperator(null); setOverwrite(true); return; }
      setPrev(result); setCurrent(result);
    } else { setPrev(current); }
    setOperator(op);
    setOverwrite(true); // la próxima entrada sobrescribirá el display
  }

  function handleEquals() {
    if (!operator || !prev) return;
    const result = operate(prev, current, operator);
    addHistory(`${prev} ${operator} ${current}`, result); // guardar en historial
    setCurrent(result); setPrev(null); setOperator(null); setOverwrite(true);
    setCaretAfterUpdate(String(result).length);
  }

  function handleClear() { setCurrent("0"); setPrev(null); setOperator(null); setOverwrite(false); setCaretAfterUpdate(1); }

  function handleBackspace(caret) {
    // si overwrite activo simplemente restaurar 0
    if (overwrite) { setCurrent("0"); setOverwrite(false); setCaretAfterUpdate(1); return; }
    const start = typeof caret?.start === "number" ? caret.start : (cursor.start ?? current.length);
    const end = typeof caret?.end === "number" ? caret.end : (cursor.end ?? start);
    if (start !== end) {
      // eliminar selección
      let newVal = current.slice(0, start) + current.slice(end);
      if (newVal === "" || newVal === "-") newVal = "0";
      setCurrent(newVal); setCaretAfterUpdate(start); return;
    }
    if (start === 0) { setCaretAfterUpdate(0); return; } // nada que borrar a la izquierda
    // manejar casos de un solo carácter o "-x"
    if (current.length === 1 || (current.length === 2 && current.startsWith("-"))) {
      setCurrent("0"); setCaretAfterUpdate(1); return;
    }
    // borrar carácter justo a la izquierda del caret
    const newVal = current.slice(0, start - 1) + current.slice(start);
    setCurrent(newVal); setCaretAfterUpdate(start - 1);
  }

  function handleToggleSign() {
    if (current === "0" || current === "Error") return;
    const start = cursor.start ?? current.length;
    const end = cursor.end ?? start;
    if (start !== end) {
      // si hay selección, cambiar signo de todo (implementación simple)
      setCurrent((c) => (c.startsWith("-") ? c.slice(1) : "-" + c));
      setCaretAfterUpdate(null);
      return;
    }
    setCurrent((c) => (c.startsWith("-") ? c.slice(1) : "-" + c));
    setCaretAfterUpdate(start + (current.startsWith("-") ? -1 : 1));
  }

  function addHistory(expr, result) {
    const item = { id: Date.now() + Math.random(), expr, result, ts: new Date().toISOString() };
    // insertar al inicio y limitar a 50 entradas
    setHistory((h) => [item, ...h].slice(0, 50));
  }

  function handleUseHistory(item) {
    // usar resultado del historial en el display
    setCurrent(String(item.result)); setPrev(null); setOperator(null); setOverwrite(true); setCaretAfterUpdate(String(item.result).length);
  }

  function handleEdit(text) {
    // sanitizar entrada que venga del input (permite editar manualmente)
    let v = text.replace(/[^0-9\.\-]/g, ""); // permitir solo dígitos, punto y signo -
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join(""); // sólo un punto
    if (v.includes("-")) v = "-" + v.replace(/-/g, "").slice(1); // sólo un signo inicial
    if (v === "" || v === "-") { setCurrent(v); return; }
    // evitar ceros a la izquierda como "007" -> "7" (mantener posible "-0")
    if (/^-?0\d/.test(v)) { v = v.replace(/^(-?)0+/, "$1"); if (v === "" || v === "-") v = "0"; }
    setCurrent(v);
  }

  function handleCopyHistory(item) { const text = `${item.expr} = ${item.result}`; navigator.clipboard?.writeText(text).catch(() => {}); }
  function handleDeleteHistory(id) { setHistory((h) => h.filter((x) => x.id !== id)); }
  function handleClearHistory() { setHistory([]); }

  async function copyDisplay() { try { await navigator.clipboard.writeText(String(current)); } catch (e) {} }
  async function pasteIntoDisplay() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      const sanitized = text.trim();
      // intentar extraer un número al final de la cadena
      const numMatch = sanitized.match(/-?\d+(\.\d+)?$/);
      if (numMatch) { setCurrent(numMatch[0]); setOverwrite(true); setCaretAfterUpdate(String(numMatch[0]).length); return; }
      if (/^-?\d+(\.\d+)?$/.test(sanitized)) { setCurrent(sanitized); setOverwrite(true); setCaretAfterUpdate(String(sanitized).length); }
    } catch (e) {}
  }

  // listener global de teclado (soporta atajos y mapeo de teclas)
  useEffect(() => {
  function onKey(e) {
    if (e.key >= "0" && e.key <= "9") { e.preventDefault(); handleDigit(e.key); return; }
    if (e.key === "." || e.key === ",") { e.preventDefault(); handleDecimal(); return; }
    if (["+", "-", "*", "x", "X", "/"].includes(e.key)) {
      e.preventDefault();
      const map = { "*": "×", "x": "×", "X": "×", "/": "÷", "+": "+", "-": "-" };
      handleOperator(map[e.key]); return;
    }
    if (e.key === "Enter" || e.key === "=") { e.preventDefault(); handleEquals(); return; }
    if (e.key === "Backspace") { e.preventDefault(); handleBackspace(); return; }
    if (e.key === "Escape") { e.preventDefault(); handleClear(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") navigator.clipboard?.writeText(String(current)).catch(()=>{});
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") pasteIntoDisplay();
  }

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);  // ← solo una vez


  function onDisplayKeyDown(e) {
    // cuando el input captura Backspace, manejarlo con la lógica de caret personalizada
    if (e.key === "Backspace") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      handleBackspace({ start, end });
      return;
    }
  }

  function onDisplaySelect(e) { setCursor({ start: e.target.selectionStart, end: e.target.selectionEnd }); }

  // handlers que se pasan al Keypad
  const handlers = {
    onDigit: (v) => handleDigit(v),
    onDecimal: () => handleDecimal(),
    onOperator: (op) => handleOperator(op),
    onEquals: () => handleEquals(),
    onClear: () => handleClear(),
    onBackspace: () => handleBackspace(),
    onToggleSign: () => handleToggleSign()
  };

  useEffect(() => { if (current === "Error" && inputRef.current) inputRef.current.focus?.(); }, [current]);

  return (
    <div className="calculator" aria-label="Calculadora">
      {/* cabecera con controles: copiar/pegar, tema, historial */}
      <div className="meta">
        <div className="brand">Calculadora</div>
        <div className="controls">
          <div className="ctrl" role="toolbar" aria-label="Controles">
            <button className="icon-btn" title="Copiar" onClick={copyDisplay} aria-label="Copiar display">📋</button>
            <button className="icon-btn" title="Pegar" onClick={pasteIntoDisplay} aria-label="Pegar desde portapapeles">📥</button>
            <button className="icon-btn" title={theme === "light" ? "Modo oscuro" : "Modo claro"} onClick={() => setTheme(t => t === "light" ? "dark" : "light")} aria-label="Cambiar tema">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="icon-btn" title="Mostrar/ocultar historial" onClick={() => setShowHistory(s => !s)} aria-label="Historial">🕘</button>
          </div>
        </div>
      </div>

      <div>
        <Display
          prev={prev}
          op={operator}
          current={current}
          onChange={handleEdit}
          onFocus={() => setOverwrite(false)}
          inputRef={inputRef}
          onKeyDown={onDisplayKeyDown}
          onSelect={onDisplaySelect}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Keypad handlers={handlers} />
        </div>
      </div>

      {/* Sidebar overlay de historial */}
      <div
        className={`history-panel ${showHistory ? "open" : ""}`}
        aria-hidden={!showHistory}
      >
        <div className="history-panel-inner" role="dialog" aria-label="Historial de operaciones">
          <div className="history-panel-header">
            <div className="history-panel-title">Historial</div>
            <div className="history-panel-controls">
              <button className="h-btn" onClick={() => setShowHistory(false)} aria-label="Cerrar historial">Cerrar</button>
            </div>
          </div>

          <History
            items={history}
            onUse={handleUseHistory}
            onCopy={handleCopyHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}
