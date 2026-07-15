import React from "react";

export default function Loader({ label = "Loading Vettle Panel" }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
        <div className="absolute inset-2 rounded-full bg-indigo-500/20 blur-md animate-pulse-glow" />
      </div>
      <p className="text-sm font-medium tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
