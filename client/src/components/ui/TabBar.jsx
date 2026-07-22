// ─── TAB BAR ────────────────────────────────────────────────────────────────
// Horizontal tab navigation. `tabs` is an array of { key, label, icon? }.
// Controlled component — parent owns `active` and calls `onChange`.
export default function TabBar({ tabs, active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "1.5px solid #f0ede6",
        marginBottom: "24px",
        overflowX: "auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: isActive ? "2.5px solid #1D9E75" : "2.5px solid transparent",
              color: isActive ? "#1D9E75" : "#888",
              fontWeight: isActive ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.2s ease, border-color 0.2s ease",
              marginBottom: "-1.5px",
            }}
          >
            {tab.icon && <span style={{ marginRight: "6px" }}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
