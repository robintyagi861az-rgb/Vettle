import React, { useState } from "react";
import { Users, KeyRound, Megaphone, Settings2 } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import PermissionGate from "./PermissionGate.jsx";
import AdminUsers from "./AdminUsers.jsx";
import AdminCredentials from "./AdminCredentials.jsx";
import AdminAnnouncements from "./AdminAnnouncements.jsx";
import AdminSettings from "./AdminSettings.jsx";

const TABS = [
  { id: "users", label: "Users", icon: Users, need: null }, // roster is visible to any admin/sub-admin
  { id: "credentials", label: "Credentials", icon: KeyRound, need: "canManageApis" },
  { id: "announcements", label: "Announcements", icon: Megaphone, need: "canPostAnnouncements" },
  { id: "settings", label: "Settings", icon: Settings2, need: "canToggleSystemLocks" },
];

export default function AdminPanel() {
  const { can, isAdmin, isSubAdmin } = useAuth();
  const visibleTabs = TABS.filter((t) => !t.need || can(t.need));
  const [tab, setTab] = useState(visibleTabs[0]?.id || "users");

  if (!isAdmin && !isSubAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <p className="glass rounded-xl p-6 text-sm text-slate-400">
          You don't have access to the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-400">
          Signed in as <span className="font-medium text-slate-300">{isAdmin ? "admin" : "sub-admin"}</span>
          {isAdmin ? " — full access to every control below." : " — access reflects your assigned permissions."}
        </p>
      </header>

      <div className="glass flex w-full gap-1 overflow-x-auto rounded-xl p-1.5">
        {visibleTabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-indigo-500/25 to-violet-500/25 text-white shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="glass-strong rounded-2xl p-5 md:p-6">
        {tab === "users" && <AdminUsers />}
        {tab === "credentials" && (
          <PermissionGate need="canManageApis" fallback={<Denied />}>
            <AdminCredentials />
          </PermissionGate>
        )}
        {tab === "announcements" && (
          <PermissionGate need="canPostAnnouncements" fallback={<Denied />}>
            <AdminAnnouncements />
          </PermissionGate>
        )}
        {tab === "settings" && (
          <PermissionGate need="canToggleSystemLocks" fallback={<Denied />}>
            <AdminSettings />
          </PermissionGate>
        )}
      </div>
    </div>
  );
}

function Denied() {
  return (
    <p className="py-8 text-center text-sm text-slate-500">
      You don't have the permission required for this section.
    </p>
  );
}
