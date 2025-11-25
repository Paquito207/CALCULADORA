export default function History({ items = [], onUse, onCopy, onDelete, onClear }) {
  return (
    <div className="history" role="region" aria-label="Historial de operaciones">
      <h4>Historial</h4>

      {items.length === 0 ? (
        // mensaje cuando no hay entradas
        <div style={{ padding: 8, color: "var(--muted)", fontSize: 13 }}>Sin operaciones</div>
      ) : (
        // mapear entradas del historial
        items.map((it) => (
          <div
            key={it.id}
            className="history-item"
            onClick={() => onUse(it)} // usar resultado al hacer click en la fila
            title="Usar resultado"
          >
            <div className="history-expr">{it.expr}</div> {/* expresión */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="history-result">{it.result}</div> {/* resultado */}
              <div className="h-actions" onClick={(e)=>e.stopPropagation()}>
                {/* botones: detener propagación para que no active onUse */}
                <button className="h-btn" onClick={() => onCopy(it)}>Copiar</button>
                <button className="h-btn" onClick={() => onDelete(it.id)}>Borrar</button>
              </div>
            </div>
          </div>
        ))
      )}

      {items.length > 0 && (
        // botón para limpiar todo el historial (visible solo si hay items)
        <div style={{ padding: 8, display: "flex", justifyContent: "flex-end" }}>
          <button className="h-btn" onClick={onClear}>Limpiar</button>
        </div>
      )}
    </div>
  );
}
