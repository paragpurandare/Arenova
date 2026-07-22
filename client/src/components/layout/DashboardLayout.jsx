// ─── DASHBOARD LAYOUT ────────────────────────────────────────────────────────
// Shared layout wrapper for all dashboard pages. Renders the TopNav, a
// left sidebar with role-appropriate navigation links, and the page content
// area via <Outlet />. Sidebar links are driven by the `nav` prop so each
// role page can define its own tabs.
import { NavLink, Outlet } from "react-router-dom";
import TopNav from "./TopNav";

export default function DashboardLayout({ nav = [], title }) {
  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6" }}>
      <TopNav />

      <div style={{ display: "flex", maxWidth: "1280px", margin: "0 auto" }}>
        {/* Sidebar */}
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
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#1D9E75" : "#555",
                  background: isActive ? "#E1F5EE" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.2s ease, color 0.2s ease",
                })}
              >
                {item.icon && <span style={{ fontSize: "16px" }}>{item.icon}</span>}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "32px", minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
