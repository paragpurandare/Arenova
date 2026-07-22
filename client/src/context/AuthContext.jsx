// ─── AUTH CONTEXT ──────────────────────────────────────────────────────────
// Lightweight auth provider storing the active user and role in React state
// plus localStorage so a page refresh preserves the session. ProtectedRoute
// reads from this context to decide whether to render or redirect to /login.
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "arenova_auth_user";

// Available roles mirror the backend UserRole enum.
export const ROLES = {
  CUSTOMER: "customer",
  MANAGER: "manager",
  OWNER: "owner",
  SUPER: "super",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Persist user to localStorage whenever it changes so refreshes keep the
  // session alive without a round-trip to the backend.
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // login simply stores the user object (name + role). Replace with a real
  // API call to the backend auth endpoint when it is available.
  const login = (userData) => setUser(userData);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so components don't import the context object directly.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
