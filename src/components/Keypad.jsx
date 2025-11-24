import Button from "./Button";

export default function Keypad({ handlers }) {
  const {
    onDigit, onDecimal, onOperator, onEquals,
    onClear, onBackspace, onToggleSign
  } = handlers;

  return (
    <div className="keypad">
      <div className="row">
        <Button onClick={onClear}>AC</Button>
        <Button onClick={onBackspace}>←</Button>
        <Button onClick={onToggleSign}>+/-</Button>
        <Button onClick={onOperator}>÷</Button>
      </div>

      <div className="row">
        <Button onClick={onDigit}>7</Button>
        <Button onClick={onDigit}>8</Button>
        <Button onClick={onDigit}>9</Button>
        <Button onClick={onOperator}>×</Button>
      </div>

      <div className="row">
        <Button onClick={onDigit}>4</Button>
        <Button onClick={onDigit}>5</Button>
        <Button onClick={onDigit}>6</Button>
        <Button onClick={onOperator}>-</Button>
      </div>

      <div className="row">
        <Button onClick={onDigit}>1</Button>
        <Button onClick={onDigit}>2</Button>
        <Button onClick={onDigit}>3</Button>
        <Button onClick={onOperator}>+</Button>
      </div>

      <div className="row">
        <Button className="zero" onClick={onDigit}>0</Button>
        <Button onClick={onDecimal}>.</Button>
        <Button onClick={onEquals}>=</Button>
      </div>
    </div>
  );
}
