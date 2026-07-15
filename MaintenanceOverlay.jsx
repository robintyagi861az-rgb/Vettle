import React from "react";
import { Lock, Wrench } from "lucide-react";

/**
 * Blocking overlay shown to non-privileged users when system_settings.config
 * has isLocked or isMaintenance set. Admins bypass this entirely (see App.jsx),
 * so they can always get in to flip the switch back.
 */
export default function MaintenanceOverlay({ type = "maintenance" }) {
  const isLock = type === "locked";
  const Icon = isLock ? Lock : Wrench;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm px-4">
      <div className="glass-strong w-full max-w-md rounded-2xl p-8 text-center shadow-glow-lg animate-float-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15">
          <Icon className="h-8 w-8 text-indigo-300" />
        </div>
        <h1 className="text-xl font-bold text-white">
          {isLock ? "Vettle Panel is Locked" : "Under Maintenance"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isLock
            ? "An administrator has temporarily locked access to the panel. Please check back shortly."
            : "We're rolling out improvements right now. The panel will be back online shortly — thanks for your patience."}
        </p>
      </div>
    </div>
  );
}
