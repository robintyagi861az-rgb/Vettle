import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  LayoutDashboard,
  Calculator,
  Clapperboard,
  ShieldCheck,
  Megaphone,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { db } from "./FirebaseConfig.js";
import { useAuth } from "./AuthContext.jsx";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function Sidebar({ view, setView }) {
  const { userDoc, isAdmin, isSubAdmin, logout } = useAuth();
  const [recentCount, setRecentCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "announcements"), (snap) => {
      const now = Date.now();
      let count = 0;
      snap.forEach((d) => {
        const ts = d.data().createdAt?.toMillis ? d.data().createdAt.toMillis() : 0;
        if (now - ts < SEVEN_DAYS_MS) count += 1;
      });
      setRecentCount(count);
    });
    return unsub;
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { id: "math-ai", label: "Math Solver AI", icon: Calculator, show: true },
    { id: "text-to-video", label: "Text to Video", icon: Clapperboard, show: true },
    {
      id: "admin",
      label: "Admin Panel",
      icon: ShieldCheck,
      show: isAdmin || isSubAdmin,
      badge: recentCount > 0 ? recentCount : null,
    },
  ];

  const initials = (userDoc?.username || "U").slice(0, 2).toUpperCase();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-glow">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-white">Vettle Panel</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
            {userDoc?.role || "user"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems
          .filter((i) => i.show)
          .map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setMobileOpen(false);
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-indigo-300" : ""}`} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white shadow-glow animate-pulse-glow">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">
              {userDoc?.username || "User"}
            </p>
            <p className="truncate text-xs text-slate-500">{userDoc?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="glass sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-300" />
          <span className="text-sm font-bold text-white">Vettle Panel</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-slate-300">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 md:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="glass-strong absolute left-0 top-0 h-full w-72">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
