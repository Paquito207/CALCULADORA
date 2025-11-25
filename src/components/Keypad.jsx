import Button from "./Button";

export default function Keypad({ handlers }) {
  // desestructurar handlers pasados desde App
  const {
    onDigit, onDecimal, onOperator, onEquals,
    onClear, onBackspace, onToggleSign
  } = handlers;

  // disposición de teclas que usa el componente Button para enviar
  // el texto correspondiente al handler
  return (
    <div className="keypad" role="group" aria-label="Teclado calculadora">
      <Button className="special" onClick={onClear} ariaLabel="Limpiar">AC</Button>
      <Button className="special" onClick={onBackspace} ariaLabel="Retroceder">←</Button>
      <Button className="special" onClick={onToggleSign} ariaLabel="Cambiar signo">+/-</Button>
      <Button className="operator" onClick={onOperator} ariaLabel="Dividir">÷</Button>

      <Button onClick={onDigit}>7</Button>
      <Button onClick={onDigit}>8</Button>
      <Button onClick={onDigit}>9</Button>
      <Button className="operator" onClick={onOperator}>×</Button>

      <Button onClick={onDigit}>4</Button>
      <Button onClick={onDigit}>5</Button>
      <Button onClick={onDigit}>6</Button>
      <Button className="operator" onClick={onOperator}>-</Button>

      <Button onClick={onDigit}>1</Button>
      <Button onClick={onDigit}>2</Button>
      <Button onClick={onDigit}>3</Button>
      <Button className="operator" onClick={onOperator}>+</Button>

      <Button className="zero" onClick={onDigit}>0</Button>
      <Button onClick={onDecimal}>.</Button>
      <Button className="equals" onClick={onEquals} ariaLabel="Igual">=</Button>
    </div>
  );
}
