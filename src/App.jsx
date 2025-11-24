import { useState } from "react";
import Display from "./components/Display";
import Keypad from "./components/Keypad";
import { operate } from "./utils/math";
import "./index.css";

export default function App() {
  const [current, setCurrent] = useState("0");
  const [prev, setPrev] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(false);

  // dígitos
  function handleDigit(d) {
    if (d !== "0" && d !== "1" && isNaN(d)) return; // seguridad
    if (overwrite) {
      setCurrent(d);
      setOverwrite(false);
      return;
    }
    if (current === "0" && d === "0") return;
    setCurrent(current === "0" ? d : current + d);
  }

  // decimal
  function handleDecimal() {
    if (overwrite) {
      setCurrent("0.");
      setOverwrite(false);
      return;
    }
    if (current.includes(".")) return;
    setCurrent(current + ".");
  }

  // elegir operador
  function handleOperator(op) {
    if (operator && !overwrite) {
      // evaluar cadena prev op current -> nuevo prev
      const result = operate(prev ?? current, current, operator);
      setPrev(result === "Error" ? null : result);
      setCurrent(result === "Error" ? "Error" : result);
    } else {
      setPrev(current);
    }
    setOperator(op);
    setOverwrite(true);
  }

  // igual
  function handleEquals() {
    if (!operator || !prev) return;
    const result = operate(prev, current, operator);
    setCurrent(result);
    setPrev(null);
    setOperator(null);
    setOverwrite(true);
  }

  // AC
  function handleClear() {
    setCurrent("0");
    setPrev(null);
    setOperator(null);
    setOverwrite(false);
  }

  // Backspace
  function handleBackspace() {
    if (overwrite) { setCurrent("0"); setOverwrite(false); return; }
    if (current.length === 1 || (current.length === 2 && current.startsWith("-"))) {
      setCurrent("0");
      return;
    }
    setCurrent(current.slice(0, -1));
  }

  // +/-
  function handleToggleSign() {
    if (current === "0") return;
    setCurrent(current.startsWith("-") ? current.slice(1) : "-" + current);
  }

  const handlers = {
    onDigit: (v) => handleDigit(v),
    onDecimal: () => handleDecimal(),
    onOperator: (op) => handleOperator(op),
    onEquals: () => handleEquals(),
    onClear: () => handleClear(),
    onBackspace: () => handleBackspace(),
    onToggleSign: () => handleToggleSign()
  };

  return (
    <div className="calculator">
      <Display prev={prev} op={operator} current={current} />
      <Keypad handlers={handlers} />
    </div>
  );
}
