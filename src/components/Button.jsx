export default function Button({ children, onClick, className = "", ariaLabel }) {
  // Button es un wrapper pequeño: convierte el contenido a string
  // y llama a onClick pasando ese string (útil para teclas numéricas)
  return (
    <button
      className={`btn ${className}`}
      onClick={() => onClick(String(children))} // siempre pasa string
      aria-label={ariaLabel ?? String(children)} // accesibilidad: etiqueta aria por defecto
      type="button"
    >
      {children}
    </button>
  );
}
