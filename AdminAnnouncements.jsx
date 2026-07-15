import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Megaphone, Trash2, Send } from "lucide-react";
import { db } from "./FirebaseConfig.js";

export default function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    await addDoc(collection(db, "announcements"), {
      title,
      content,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setContent("");
    setPosting(false);
  };

  const handleDelete = (id) => deleteDoc(doc(db, "announcements", id));

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Announcements</h2>
        <p className="text-sm text-slate-400">
          Published announcements surface panel-wide and auto-hide after 7 days.
        </p>
      </div>

      <form onSubmit={handlePost} className="glass-strong space-y-3 rounded-xl p-4">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
        />
        <textarea
          required
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's the update?"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={posting}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" />
            {posting ? "Publishing…" : "Publish announcement"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="glass rounded-xl border-dashed py-8 text-center text-sm text-slate-500">
          Nothing published yet.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((a) => (
            <div key={a.id} className="glass flex items-start justify-between gap-3 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
                <div>
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{a.content}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="shrink-0 text-slate-500 transition hover:text-rose-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
