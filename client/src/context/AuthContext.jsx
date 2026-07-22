import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, register as registerApi, getProfile } from "../services/authService";

const AuthContext = createContext(null);

const USER_KEY = "arenova_auth_user";
const TOKEN_KEY = "arenova_jwt";

export const ROLES = {
  CUSTOMER: "customer",
  MANAGER: "manager",
  OWNER: "owner",
  SUPER: "super",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    const jwt = data.token || data.jwt;
    const profile = data.user || data;
    setToken(jwt);
    setUser(profile);
    return profile;
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    const jwt = data.token || data.jwt;
    const profile = data.user || data;
    setToken(jwt);
    setUser(profile);
    return profile;
  };

  const loginAsRole = (role, name = "Guest User") => {
    const profile = { name, role, email: "" };
    setUser(profile);
    return profile;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginAsRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
