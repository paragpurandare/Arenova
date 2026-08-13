import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Input from "../components/ui/Input";
import ArenovaLogo from "../components/common/ArenovaLogo";
import { User, Mail, Lock, CircleUser as UserCircle, Briefcase, Building2, Shield } from "lucide-react";

const ROLE_OPTIONS = [
  { key: ROLES.CUSTOMER, label: "Customer", icon: UserCircle, desc: "Book courts & rent gear", color: "#185FA5", bg: "#E6F1FB" },
  { key: ROLES.MANAGER, label: "Manager", icon: Briefcase, desc: "Manage daily operations", color: "#BA7517", bg: "#FAEEDA" },
  { key: ROLES.OWNER, label: "Owner", icon: Building2, desc: "Own & manage clubs", color: "#1D9E75", bg: "#E1F5EE" },
  { key: ROLES.SUPER, label: "Super Admin", icon: Shield, desc: "Platform oversight", color: "#993556", bg: "#FBEAF0" },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Real backend call only - no silent "fake login" fallback here.
      // If this fails, the error below is shown and we do NOT navigate,
      // otherwise the user ends up "logged in" with no JWT and every
      // later API call would fail with 401.
      if (mode === "register") {
        await register({ name, email, password, role: selectedRole });
      } else {
        await login(email, password);
      }
      navigate(`/${selectedRole}`);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "linear-gradient(135deg, #f5f4f0 0%, #e8f5ef 100%)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10" style={{ animation: "modalIn 0.3s ease" }}>
        <div className="text-center mb-6 flex flex-col items-center">
          <ArenovaLogo theme="light" height={56} className="mb-2" />
          <p className="text-xs text-gray-500 mt-1 m-0">Unified Sports Arena, Rental & Player Experience Platform</p>
        </div>

        <div className="flex gap-2 mb-6 bg-[#faf9f6] rounded-xl p-1">
          <button onClick={() => setMode("login")} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === "login" ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-500"}`}>Sign In</button>
          <button onClick={() => setMode("register")} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === "register" ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-500"}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Select your role" required>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((r) => {
                const isActive = selectedRole === r.key;
                const Icon = r.icon;
                return (
                  <button key={r.key} type="button" onClick={() => setSelectedRole(r.key)}
                    className={`p-3.5 rounded-xl text-left transition-all ${isActive ? "border-2" : "border-[1.5px] border-[#f0ede6] bg-white"}`}
                    style={isActive ? { borderColor: r.color, background: r.bg } : {}}>
                    <Icon size={22} color={isActive ? r.color : "#888"} />
                    <div className="text-sm font-bold mt-1.5" style={{ color: isActive ? r.color : "#08060d" }}>{r.label}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </Field>

          {mode === "register" && (
            <Field label="Full Name" required>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: "36px" }} />
              </div>
            </Field>
          )}
          <Field label="Email" required>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: "36px" }} />
            </div>
          </Field>
          <Field label="Password" required>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: "36px" }} />
            </div>
          </Field>

          {error && <div className="p-3 rounded-lg mb-4 text-sm font-semibold bg-[#FCEBEB] text-[#A32D2D]">{error}</div>}

          <Button type="submit" fullWidth size="lg" disabled={loading} style={{ marginTop: "4px" }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">Sign in or register to access your dashboard.</p>
      </div>
    </div>
  );
}
