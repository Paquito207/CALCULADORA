// operaciones.
export function operate(aStr, bStr, op) {
  // convertir las cadenas a números de punto flotante
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);
  // si alguna conversión falla, devolver "Error"
  if (isNaN(a) || isNaN(b)) return "Error";

  let res;
  switch (op) {
    case "+": res = a + b; break;           // suma
    case "-": res = a - b; break;           // resta
    case "×": res = a * b; break;           // multiplicación (símbolo × usado en UI)
    case "÷":
      if (b === 0) return "Error";         // evitar división por cero
      res = a / b;                         // división
      break;
    default: return "Error";                // operador no soportado
  }
  // formatear resultado antes de devolver
  return formatNumber(res);
}

export function formatNumber(n) {
  // manejar valores no finitos y NaN
  if (n === Infinity || n === -Infinity || isNaN(n)) return "Error";
  // limitar a 12 decimales para evitar longitudes enormes,
  // luego parseFloat elimina ceros finales innecesarios,
  // y toString devuelve la representación compacta.
  const s = parseFloat(n.toFixed(12)).toString();
  return s;
}
