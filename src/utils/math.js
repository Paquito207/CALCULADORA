// operaciones.
export function operate(aStr, bStr, op) {
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);
  if (isNaN(a) || isNaN(b)) return "Error";

  let res;
  switch (op) {
    case "+": res = a + b; break;
    case "-": res = a - b; break;
    case "×": res = a * b; break;
    case "÷":
      if (b === 0) return "Error";
      res = a / b;
      break;
    default: return "Error";
  }
  return formatNumber(res);
}

export function formatNumber(n) {
  if (n === Infinity || n === -Infinity || isNaN(n)) return "Error";
  // limitar a 12 decimales y quitar ceros finales
  const s = parseFloat(n.toFixed(12)).toString();
  return s;
}
