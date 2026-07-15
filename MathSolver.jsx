import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Calculator, Sparkles, Loader2 } from "lucide-react";
import { db } from "./FirebaseConfig.js";

const BOOKS = ["NCERT Mathematics", "RD Sharma", "RS Aggarwal", "Custom Upload"];
const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

export default function MathSolver() {
  const [settings, setSettings] = useState(null);
  const [book, setBook] = useState(BOOKS[0]);
  const [klass, setKlass] = useState(CLASSES[4]);
  const [chapter, setChapter] = useState("");
  const [exercise, setExercise] = useState("");
  const [prompt, setPrompt] = useState("");
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "system_settings", "config"), (snap) => {
      setSettings(snap.exists() ? snap.data() : null);
    });
    return unsub;
  }, []);

  const handleSolve = async (e) => {
    e.preventDefault();
    setSolving(true);
    setResult(null);

    // Build the routed request payload the way a backend function would expect
    // it — keyed off the live `mathPresetFormat` from system_settings/config.
    const payload = {
      book,
      class: klass,
      chapter,
      exercise,
      prompt,
      presetFormat: settings?.mathPresetFormat || "default",
      model: settings?.activeAiModel || "unassigned",
    };

    // NOTE: wire this up to your actual solver endpoint / Cloud Function.
    // This UI is fully pre-wired to Firestore for config; the solve call
    // itself is left as a stub so you can point it at whatever backend
    // parses `mathPresetFormat`.
    await new Promise((res) => setTimeout(res, 900));
    setResult({
      payload,
      note: "This is a placeholder response. Connect this workspace to your solver backend to return real step-by-step solutions.",
    });
    setSolving(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:px-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-300">
          <Calculator className="h-3.5 w-3.5" />
          Math Solver AI
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">Solve a problem</h1>
        <p className="mt-1 text-sm text-slate-400">
          Select the source material, then describe the problem. Requests route through the{" "}
          <span className="font-mono text-slate-300">
            {settings?.mathPresetFormat || "…"}
          </span>{" "}
          preset format.
        </p>
      </header>

      <form onSubmit={handleSolve} className="glass-strong space-y-5 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Book" value={book} onChange={setBook} options={BOOKS} />
          <SelectField label="Class" value={klass} onChange={setKlass} options={CLASSES} />
          <TextField
            label="Chapter"
            value={chapter}
            onChange={setChapter}
            placeholder="e.g. Quadratic Equations"
          />
          <TextField
            label="Exercise"
            value={exercise}
            onChange={setExercise}
            placeholder="e.g. Exercise 4.2, Q7"
          />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Problem / prompt
          </span>
          <textarea
            required
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste the question, or describe what you need solved…"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>

        <button
          type="submit"
          disabled={solving}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          {solving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Solving…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Solve
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="glass animate-float-up rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white">Routed request</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-4 text-xs text-slate-300">
{JSON.stringify(result.payload, null, 2)}
          </pre>
          <p className="mt-3 text-sm text-slate-400">{result.note}</p>
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400/60 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/30"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-slate-900">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/30"
      />
    </label>
  );
}
