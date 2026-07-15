import React from "react";
import { Calculator, Clapperboard, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import AnnouncementsFeed from "./AnnouncementsFeed.jsx";

export default function Dashboard({ setView }) {
  const { userDoc, isAdmin, isSubAdmin } = useAuth();

  const cards = [
    {
      id: "math-ai",
      title: "Math Solver AI",
      desc: "Route a problem through the configured book, class, chapter and exercise preset.",
      icon: Calculator,
      accent: "from-indigo-500/20 to-indigo-500/5 text-indigo-300",
    },
    {
      id: "text-to-video",
      title: "Text to Video AI",
      desc: "Turn a prompt into a short video. Premium generation canvas — coming soon.",
      icon: Clapperboard,
      accent: "from-violet-500/20 to-violet-500/5 text-violet-300",
      soon: true,
    },
  ];

  if (isAdmin || isSubAdmin) {
    cards.push({
      id: "admin",
      title: "Admin Panel",
      desc: "Manage users, credentials, announcements and system-wide controls.",
      icon: ShieldCheck,
      accent: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-300",
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-8">
      <div className="glass-strong relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="relative flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          Welcome back
        </div>
        <h1 className="relative mt-2 text-2xl font-bold text-white md:text-3xl">
          Hey {userDoc?.username || "there"} 👋
        </h1>
        <p className="relative mt-2 max-w-xl text-sm text-slate-400">
          You're signed in as{" "}
          <span className="font-medium text-slate-300">{userDoc?.role || "user"}</span>. Jump into
          a workspace below or check the latest announcements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setView(c.id)}
              className="glass group relative flex flex-col items-start gap-3 rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-400/30 hover:shadow-glow"
            >
              {c.soon && (
                <span className="absolute right-4 top-4 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-300">
                  Soon
                </span>
              )}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Recent announcements
        </h2>
        <AnnouncementsFeed limit={4} />
      </div>
    </div>
  );
}
