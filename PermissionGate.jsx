import React from "react";
import { useAuth } from "./AuthContext.jsx";

// Wrap any admin control in <PermissionGate need="canManageApis">…</PermissionGate>
// Admins always pass. Sub-admins pass only if their permissions map has the flag.
// Renders `fallback` (default: nothing) when the check fails.
export default function PermissionGate({ need, children, fallback = null }) {
  const { can } = useAuth();
  if (!need || can(need)) return children;
  return fallback;
}
