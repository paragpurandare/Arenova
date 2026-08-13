import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { getManagers, register } from "../../services/authService";
import { assignManager } from "../../services/clubService";
import { UserCheck, UserPlus, CheckCircle, Search, Mail, Phone, Lock, User } from "lucide-react";

export default function AssignManagerModal({ club, onClose, onAssigned }) {
  const [activeTab, setActiveTab] = useState("select"); // "select" | "create"
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // New Manager Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!club) return;
    setLoading(true);
    setError(null);
    setSelectedManager(null);
    getManagers()
      .then((data) => setManagers(data || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to fetch managers list."))
      .finally(() => setLoading(false));
  }, [club]);

  const handleAssignExisting = async () => {
    if (!selectedManager || !club?.id) return;
    setAssigning(true);
    setError(null);
    try {
      await assignManager(club.id, selectedManager.id);
      onAssigned?.();
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not assign this manager.");
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateAndAssign = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setError("Please fill out all required fields.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      // 1. Register new user account with role MANAGER
      const regResponse = await register({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        phone: newPhone.trim(),
        role: "MANAGER",
      });

      const createdManagerId = regResponse?.user?.id || regResponse?.id;
      if (createdManagerId && club?.id) {
        // 2. Assign immediately to club
        await assignManager(club.id, createdManagerId);
      }
      onAssigned?.();
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create & assign new manager.");
    } finally {
      setCreating(false);
    }
  };

  const filteredManagers = managers.filter((m) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(term) ||
      (m.email || "").toLowerCase().includes(term) ||
      (m.phone || "").toLowerCase().includes(term)
    );
  });

  return (
    <Modal open={!!club} onClose={onClose} title={`Assign Manager · ${club?.name || ""}`} size="md">
      {club && (
        <div className="space-y-4">
          {/* Tab Switcher */}
          <div className="flex bg-[#faf9f6] p-1 rounded-xl border border-[#f0ede6]">
            <button
              type="button"
              onClick={() => { setActiveTab("select"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "select" ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserCheck size={14} /> Select Existing Manager
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("create"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "create" ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserPlus size={14} /> + Create & Assign New Manager
            </button>
          </div>

          {error && (
            <div className="bg-[#FCEBEB] text-[#A32D2D] p-3 rounded-xl text-xs font-medium border border-[#f5c6c6]">
              {error}
            </div>
          )}

          {/* TAB 1: SELECT EXISTING MANAGER */}
          {activeTab === "select" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search manager by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#f0ede6] text-xs text-[#08060d] focus:outline-none focus:border-[#1D9E75]"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {loading ? (
                  <div className="text-center py-6 text-xs text-gray-400">Loading managers list...</div>
                ) : filteredManagers.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-500">
                    No manager accounts found. Switch to <strong>+ Create New Manager</strong> tab to register one.
                  </div>
                ) : (
                  filteredManagers.map((m) => {
                    const isSelected = selectedManager?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedManager(m)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-[#f0ede6] hover:border-[#1D9E75]/40 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#E1F5EE] text-[#1D9E75] font-bold text-sm flex items-center justify-center">
                            {(m.name || "M").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[#08060d]">{m.name}</div>
                            <div className="text-[11px] text-gray-500">{m.email}</div>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="flex items-center gap-1 text-[#0F6E56] font-bold text-xs">
                            <CheckCircle size={15} /> Selected
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Select</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f0ede6]">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button size="sm" disabled={!selectedManager || assigning} onClick={handleAssignExisting}>
                  {assigning ? "Assigning..." : "Confirm & Assign Manager"}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE & ASSIGN NEW MANAGER */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateAndAssign} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Manager Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. ramesh@sportsarena.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Default Password *</label>
                <Input
                  required
                  type="password"
                  placeholder="Set initial manager password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f0ede6]">
                <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create & Assign Manager"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
