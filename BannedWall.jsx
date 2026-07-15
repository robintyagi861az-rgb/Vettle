import React from "react";
import { Ban, LogOut } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

export default function BannedWall() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-950/20 via-transparent to-transparent" />
      <div className="glass-strong relative w-full max-w-md rounded-2xl border-rose-500/20 p-8 text-center shadow-glow-rose animate-float-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15">
          <Ban className="h-8 w-8 text-rose-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Account Suspended</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          This account has been suspended by a Vettle Panel administrator and no longer has
          access to the platform. If you believe this is a mistake, contact your
          administrator to resolve it.
        </p>
        <button
          onClick={logout}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
