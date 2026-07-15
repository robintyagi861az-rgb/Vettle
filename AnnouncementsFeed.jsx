import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Megaphone } from "lucide-react";
import { db } from "./FirebaseConfig.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function AnnouncementsFeed({ limit = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => {
          const ts = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
          return now - ts < SEVEN_DAYS_MS;
        });
      setItems(limit ? rows.slice(0, limit) : rows);
      setLoading(false);
    });
    return unsub;
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass flex flex-col items-center justify-center rounded-xl border-dashed py-10 text-center">
        <Megaphone className="mb-2 h-6 w-6 text-slate-600" />
        <p className="text-sm text-slate-500">No announcements from the last 7 days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((a) => (
        <div
          key={a.id}
          className="glass rounded-xl p-4 transition hover:border-indigo-400/30"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
              <Megaphone className="h-4 w-4 text-indigo-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-semibold text-white">{a.title}</h4>
                <span className="shrink-0 text-[11px] text-slate-500">
                  {formatRelative(a.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{a.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatRelative(ts) {
  if (!ts?.toMillis) return "";
  const diffMs = Date.now() - ts.toMillis();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
