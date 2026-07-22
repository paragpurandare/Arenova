export default function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: "#3a3a3a",
            marginBottom: "6px",
          }}
        >
          {label} {required && <span style={{ color: "#A32D2D" }}>*</span>}
        </label>
      )}
      {children}
      {hint && (
        <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}
