// ─── BUTTON ────────────────────────────────────────────────────────────────
// Reusable button with three visual variants: solid (primary), outline
// (secondary), and ghost (tertiary). Sizes: sm, md, lg. Supports `as` prop
// for rendering as a different element (e.g. Link via `as={Link}`).
export default function Button({
  children,
  variant = "solid",
  size = "md",
  color = "#1D9E75",
  bg = "#E1F5EE",
  fullWidth = false,
  disabled = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "7px 14px", fontSize: "13px" },
    md: { padding: "10px 20px", fontSize: "14px" },
    lg: { padding: "13px 28px", fontSize: "15px" },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    border: "none",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
    ...sizes[size],
    ...style,
  };

  const variants = {
    solid: { background: color, color: "#fff" },
    outline: { background: "transparent", color, border: `1.5px solid ${color}` },
    ghost: { background: bg, color },
  };

  return (
    <button style={{ ...base, ...variants[variant] }} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
