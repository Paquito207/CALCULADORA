export default function Display({
  prev, op, current, onChange, onFocus, onBlur,
  inputRef, onKeyDown, onSelect
}) {
  return (
    <div className="display" role="region" aria-label="Calculadora display">
      <div className="display-top">
        {/* mostrar la operación previa y el operador (si existen) */}
        {prev ? `${prev} ${op || ""}` : ""}
      </div>

      <input
        ref={inputRef}
        className="display-input"
        value={current} // valor controlado
        onChange={(e) => onChange(e.target.value)} // pasa el texto al padre (sanitizado allí)
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => {
          // reenviar evento al handler del padre si existe,
          // y evitar que el listener global capture este evento
          onKeyDown?.(e);
          e.stopPropagation();
        }}
        onSelect={(e) => onSelect?.(e)} // actualizar selección/cursores
        onKeyUp={(e) => onSelect?.(e)}
        aria-live="polite" // comunicación accesible de cambios
        aria-atomic="true"
        title={String(current)}
        inputMode="decimal" // teclado móvil con punto decimal
        autoComplete="off"
      />
    </div>
  );
}
