import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Eye, EyeOff, KeyRound, Plus, Trash2 } from "lucide-react";
import { db } from "./FirebaseConfig.js";

export default function AdminCredentials() {
  const [creds, setCreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "api_credentials"), (snap) => {
      setCreds(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const toggleActive = (c) => updateDoc(doc(db, "api_credentials", c.id), { isActive: !c.isActive });
  const removeCred = (c) => deleteDoc(doc(db, "api_credentials", c.id));

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Credentials Manager</h2>
          <p className="text-sm text-slate-400">API keys and endpoints used across the panel.</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-xs font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          <Plus className="h-3.5 w-3.5" />
          Add credential
        </button>
      </div>

      {showAdd && <AddCredentialForm onDone={() => setShowAdd(false)} />}

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : creds.length === 0 ? (
        <p className="glass rounded-xl border-dashed py-8 text-center text-sm text-slate-500">
          No credentials configured yet.
        </p>
      ) : (
        <div className="glass overflow-hidden rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">API key</th>
                <th className="px-4 py-3 font-medium">Endpoint</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creds.map((c) => (
                <CredRow key={c.id} cred={c} onToggle={() => toggleActive(c)} onRemove={() => removeCred(c)} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function CredRow({ cred, onToggle, onRemove }) {
  const [revealed, setRevealed] = useState(false);
  const masked = cred.apiKey ? `${"•".repeat(Math.max(cred.apiKey.length - 4, 4))}${cred.apiKey.slice(-4)}` : "—";

  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 font-medium text-white">
          <KeyRound className="h-3.5 w-3.5 text-indigo-300" />
          {cred.providerName || cred.id}
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {revealed ? cred.apiKey : masked}
          <button onClick={() => setRevealed((v) => !v)} className="text-slate-500 hover:text-slate-300">
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </td>
      <td className="max-w-[200px] truncate px-4 py-3 text-xs text-slate-400">
        {cred.apiEndpoint || "—"}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onToggle}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            cred.isActive
              ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
              : "border border-white/10 bg-white/5 text-slate-500"
          }`}
        >
          {cred.isActive ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <button onClick={onRemove} className="text-slate-500 transition hover:text-rose-300">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function AddCredentialForm({ onDone }) {
  const [serviceId, setServiceId] = useState("");
  const [providerName, setProviderName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!serviceId.trim()) return;
    setSaving(true);
    // Doc ID is the service ID itself (e.g. "openai", "replicate") per the
    // api_credentials/{serviceId} schema — not an auto-generated ID.
    await setDoc(doc(db, "api_credentials", serviceId.trim()), {
      providerName: providerName || serviceId,
      apiKey,
      apiEndpoint,
      isActive: true,
    });
    setSaving(false);
    onDone();
  };

  return (
    <form onSubmit={handleSave} className="glass-strong grid gap-3 rounded-xl p-4 sm:grid-cols-2">
      <Input label="Provider name" value={providerName} onChange={setProviderName} placeholder="OpenAI" required />
      <Input label="Service ID" value={serviceId} onChange={setServiceId} placeholder="openai" required />
      <Input label="API key" value={apiKey} onChange={setApiKey} placeholder="sk-…" required />
      <Input label="Endpoint" value={apiEndpoint} onChange={setApiEndpoint} placeholder="https://api.openai.com/v1" />
      <div className="sm:col-span-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-glow disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save credential"}
        </button>
      </div>
    </form>
  );
}

function Input({ label, value, onChange, placeholder, required }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <input
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
      />
    </label>
  );
}
