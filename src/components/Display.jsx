export default function Display({ prev, op, current }) {
  return (
    <div className="display">
      <div className="display-top">{prev ? `${prev} ${op || ""}` : ""}</div>
      <div className="display-main">{current}</div>
    </div>
  );
}
