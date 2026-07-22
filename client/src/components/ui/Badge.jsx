export default function Badge({ children, color = "#555", bg = "#f0f0f0", size = "sm" }) {
  const pad = size === "lg" ? "6px 14px" : "4px 10px";
  const fs = size === "lg" ? "13px" : "11px";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: pad,
        borderRadius: "999px",
        fontSize: fs,
        fontWeight: 600,
        color,
        background: bg,
        whiteSpace: "nowrap",
        letterSpacing: "0.2px",
      }}
    >
      {children}
    </span>
  );
}
