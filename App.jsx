import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./FirebaseConfig.js";
import { useAuth } from "./AuthContext.jsx";
import Loader from "./Loader.jsx";
import AuthWall from "./AuthWall.jsx";
import ApprovalWall from "./ApprovalWall.jsx";
import BannedWall from "./BannedWall.jsx";
import MaintenanceOverlay from "./MaintenanceOverlay.jsx";
import Sidebar from "./Sidebar.jsx";
import Dashboard from "./Dashboard.jsx";
import MathSolver from "./MathSolver.jsx";
import TextToVideo from "./TextToVideo.jsx";
import AdminPanel from "./AdminPanel.jsx";

export default function App() {
  const { currentUser, userDoc, loading, isAdmin } = useAuth();
  const [view, setView] = useState("dashboard");
  const [sysSettings, setSysSettings] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "system_settings", "config"), (snap) => {
      setSysSettings(snap.exists() ? snap.data() : {});
    });
    return unsub;
  }, []);

  // 1. Still resolving auth/profile state.
  if (loading) return <Loader />;

  // 2. Not signed in at all.
  if (!currentUser) return <AuthWall />;

  // 3. Signed in but no Firestore profile yet (write blocked, or deleted).
  if (!userDoc) return <Loader label="Setting up your profile…" />;

  // 4. Hard block: banned accounts never see the app, regardless of anything else.
  if (userDoc.isBanned) return <BannedWall />;

  // 5. Unapproved accounts wait here.
  if (!userDoc.isApproved) return <ApprovalWall />;

  // 6. Global lock / maintenance overlay — admins bypass so they can undo it.
  const blocked = !isAdmin && (sysSettings?.isLocked || sysSettings?.isMaintenance);

  return (
    <div className="flex min-h-screen w-full bg-slate-950">
      <Sidebar view={view} setView={setView} />
      <main className="min-w-0 flex-1">
        {view === "dashboard" && <Dashboard setView={setView} />}
        {view === "math-ai" && <MathSolver />}
        {view === "text-to-video" && <TextToVideo />}
        {view === "admin" && <AdminPanel />}
      </main>
      {blocked && (
        <MaintenanceOverlay type={sysSettings?.isLocked ? "locked" : "maintenance"} />
      )}
    </div>
  );
}
