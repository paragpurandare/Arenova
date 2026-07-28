import TopNav from "./TopNav";

// Shared shell for every role dashboard: top bar + left sidebar + content area.
// The sidebar items switch the active tab of whatever page is passed in as
// `children` (activeTab/onNavClick), instead of navigating to a new route -
// all dashboard sections live on one page, so this keeps clicks in sync.
export default function DashboardLayout({ nav = [], title, activeTab, onNavClick, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6" }}>
      <TopNav />
      <div style={{ display: "flex", maxWidth: "1280px", margin: "0 auto" }}>
        <aside
          style={{
            width: "240px",
            flexShrink: 0,
            padding: "24px 16px",
            borderRight: "1px solid #f0ede6",
            minHeight: "calc(100vh - 65px)",
          }}
        >
          {title && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                marginBottom: "12px",
                paddingLeft: "12px",
              }}
            >
              {title}
            </div>
          )}
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {nav.map((item) => {
              const isActive = item.key === activeTab;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavClick?.(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#1D9E75" : "#555",
                    background: isActive ? "#E1F5EE" : "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    width: "100%",
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                >
                  {item.icon && <span style={{ fontSize: "16px" }}>{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>
        <main style={{ flex: 1, padding: "32px", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
