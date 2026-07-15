import React from "react";
import { HourglassIcon, LogOut } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

export default function ApprovalWall() {
  const { logout, userDoc } = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4">
      <div className="glass-strong w-full max-w-md rounded-2xl p-8 text-center shadow-glow animate-float-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15">
          <HourglassIcon className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Awaiting Approval</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Hey {userDoc?.username || "there"}, your account has been created but a Vettle Panel
          administrator still needs to approve access. This usually doesn't take long —
          check back soon.
        </p>
        <button
          onClick={logout}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
