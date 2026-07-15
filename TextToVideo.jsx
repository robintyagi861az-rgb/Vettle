import React from "react";
import { Clapperboard, Sparkles } from "lucide-react";

export default function TextToVideo() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:px-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-violet-300">
          <Clapperboard className="h-3.5 w-3.5" />
          Text to Video AI
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">Prompt-to-video generation</h1>
        <p className="mt-1 text-sm text-slate-400">
          Describe a scene and generate a short video. This premium canvas is being built.
        </p>
      </header>

      <div className="glass-strong relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-[110px]" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
            </span>
            <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300 shadow-glow">
              Coming Soon
            </span>
          </div>
          <Sparkles className="h-5 w-5 text-violet-300" />
        </div>

        {/* Disabled prompt bar */}
        <div className="relative mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 opacity-60">
          <input
            disabled
            placeholder="A neon cityscape at dusk, cinematic, slow pan…"
            className="flex-1 bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-500"
          />
          <button
            disabled
            className="cursor-not-allowed rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white opacity-70"
          >
            Generate
          </button>
        </div>

        {/* Skeleton generation canvas */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 animate-shimmer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Clapperboard className="h-6 w-6 text-white/10" />
              </div>
            </div>
          ))}
        </div>

        <p className="relative mt-6 text-center text-sm text-slate-500">
          We're building a full generation canvas — resolution, duration and style controls,
          scene-by-scene storyboarding, and rendered previews. Hang tight.
        </p>
      </div>
    </div>
  );
}
