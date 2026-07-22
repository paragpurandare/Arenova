// ─── PROTECTED ROUTE ────────────────────────────────────────────────────────
// Wraps a route element. If no user is logged in, redirects to /login.
// If `roles` is provided, only allows users whose role is in the array;
// otherwise redirects to their default dashboard.
import { Navigate } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and the user's role isn't in the list, bounce them
  // to their own dashboard so they don't see a blank page.
  if (roles && !roles.includes(user.role)) {
    const home = `/${user.role}`;
    return <Navigate to={home} replace />;
  }

  return children;
}

// Convenience export of role constants for route definitions.
export { ROLES };
