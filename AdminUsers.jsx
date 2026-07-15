import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Search, Ban, CheckCircle2, ShieldAlert } from "lucide-react";
import { db } from "./FirebaseConfig.js";
import { useAuth } from "./AuthContext.jsx";

const PERMISSION_KEYS = [
  { key: "canManageApis", label: "Manage APIs" },
  { key: "canBanUsers", label: "Ban users" },
  { key: "canPostAnnouncements", label: "Post announcements" },
  { key: "canToggleSystemLocks", label: "Toggle system locks" },
];

export default function AdminUsers() {
  const { userDoc: me, isAdmin, can } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const patchUser = (uid, patch) => updateDoc(doc(db, "users", uid), patch);

  const toggleBan = (u) => {
    if (!isAdmin && u.role !== "user") return; // sub-admins can only ban plain users
    patchUser(u.id, { isBanned: !u.isBanned });
  };

  const toggleApproval = (u) => patchUser(u.id, { isApproved: !u.isApproved });

  const setRole = (u, role) => patchUser(u.id, { role });

  const togglePermission = (u, key) =>
    patchUser(u.id, { permissions: { ...u.permissions, [key]: !u.permissions?.[key] } });

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">User Control Hub</h2>
          <p className="text-sm text-slate-400">
            {users.length} registered {users.length === 1 ? "user" : "users"}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username, email, role…"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={u.id === me?.id}
              isAdmin={isAdmin}
              can={can}
              onToggleBan={() => toggleBan(u)}
              onToggleApproval={() => toggleApproval(u)}
              onSetRole={(role) => setRole(u, role)}
              onTogglePermission={(key) => togglePermission(u, key)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No matching users.</p>
          )}
        </div>
      )}
    </section>
  );
}

function UserRow({
  user: u,
  isSelf,
  isAdmin,
  can,
  onToggleBan,
  onToggleApproval,
  onSetRole,
  onTogglePermission,
}) {
  const [expanded, setExpanded] = useState(false);
  const canBan = can("canBanUsers");

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
          {(u.username || "U").slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-white">{u.username || "—"}</p>
            {isSelf && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-400">
                you
              </span>
            )}
            <RoleBadge role={u.role} />
            {u.isBanned && <StatusPill tone="rose" icon={Ban} label="Banned" />}
            {!u.isApproved && <StatusPill tone="amber" icon={ShieldAlert} label="Pending" />}
          </div>
          <p className="truncate text-xs text-slate-500">{u.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <select
              value={u.role || "user"}
              onChange={(e) => onSetRole(e.target.value)}
              disabled={isSelf}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white outline-none disabled:opacity-50"
            >
              <option value="user" className="bg-slate-900">User</option>
              <option value="sub-admin" className="bg-slate-900">Sub-admin</option>
              <option value="admin" className="bg-slate-900">Admin</option>
            </select>
          )}

          <button
            onClick={onToggleApproval}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {u.isApproved ? "Revoke" : "Approve"}
          </button>

          {canBan && !isSelf && (
            <button
              onClick={onToggleBan}
              className="flex items-center gap-1.5 rounded-lg border border-rose-400/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
            >
              <Ban className="h-3.5 w-3.5" />
              {u.isBanned ? "Unban" : "Ban"}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            >
              Permissions
            </button>
          )}
        </div>
      </div>

      {expanded && isAdmin && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
          {PERMISSION_KEYS.map((p) => {
            const active = Boolean(u.permissions?.[p.key]);
            return (
              <button
                key={p.key}
                onClick={() => onTogglePermission(p.key)}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                  active
                    ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {p.label}
                <span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-500">
                  {active ? "Enabled" : "Disabled"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  const map = {
    admin: "border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-300",
    "sub-admin": "border-indigo-400/30 bg-indigo-500/15 text-indigo-300",
    user: "border-white/10 bg-white/5 text-slate-400",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[role] || map.user}`}>
      {role || "user"}
    </span>
  );
}

function StatusPill({ tone, icon: Icon, label }) {
  const map = {
    rose: "border-rose-400/30 bg-rose-500/15 text-rose-300",
    amber: "border-amber-400/30 bg-amber-500/15 text-amber-300",
  };
  return (
    <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${map[tone]}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
