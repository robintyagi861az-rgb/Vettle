import React, { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { Lock, Wrench, Cpu, FileCode } from "lucide-react";
import { db } from "./FirebaseConfig.js";

const AI_MODELS = ["gpt-4o", "gpt-4.1", "claude-sonnet-4-6", "gemini-2.5-pro", "custom"];

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [presetDraft, setPresetDraft] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "system_settings", "config"), (snap) => {
      const data = snap.exists() ? snap.data() : {};
      setSettings(data);
      setPresetDraft(data.mathPresetFormat || "");
      setLoading(false);
    });
    return unsub;
  }, []);

  const patch = (fields) =>
    setDoc(doc(db, "system_settings", "config"), fields, { merge: true });

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Master Control Knobs</h2>
        <p className="text-sm text-slate-400">
          Global toggles. Admins always retain access even while these are active.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ToggleCard
          icon={Lock}
          title="Site lock"
          desc="Blocks all non-admin access to the panel."
          active={Boolean(settings?.isLocked)}
          onToggle={() => patch({ isLocked: !settings?.isLocked })}
          tone="rose"
        />
        <ToggleCard
          icon={Wrench}
          title="Maintenance mode"
          desc="Shows a maintenance overlay to standard users."
          active={Boolean(settings?.isMaintenance)}
          onToggle={() => patch({ isMaintenance: !settings?.isMaintenance })}
          tone="amber"
        />
      </div>

      <div className="glass-strong space-y-4 rounded-xl p-5">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <Cpu className="h-3.5 w-3.5" /> Active AI model
          </span>
          <select
            value={settings?.activeAiModel || ""}
            onChange={(e) => patch({ activeAiModel: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="" className="bg-slate-900">Select a model…</option>
            {AI_MODELS.map((m) => (
              <option key={m} value={m} className="bg-slate-900">
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <FileCode className="h-3.5 w-3.5" /> Math preset format
          </span>
          <div className="flex gap-2">
            <input
              value={presetDraft}
              onChange={(e) => setPresetDraft(e.target.value)}
              placeholder="e.g. book-class-chapter-exercise"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              onClick={() => patch({ mathPresetFormat: presetDraft })}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Save
            </button>
          </div>
          <span className="mt-1 block text-xs text-slate-500">
            Determines how the Math Solver AI workspace routes requests to your backend parser.
          </span>
        </label>
      </div>
    </section>
  );
}

function ToggleCard({ icon: Icon, title, desc, active, onToggle, tone }) {
  const toneMap = {
    rose: "border-rose-400/30 bg-rose-500/15 text-rose-300",
    amber: "border-amber-400/30 bg-amber-500/15 text-amber-300",
  };
  return (
    <div className="glass flex items-center justify-between gap-3 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${active ? toneMap[tone] : "border-white/10 bg-white/5 text-slate-500"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${active ? "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-glow" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${active ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
