import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./FirebaseConfig.js";

const AuthCtx = createContext(null);

// Default shape given to every brand-new signup. Server-side rules should
// forbid a client from writing role/isApproved/permissions themselves.
const DEFAULT_PROFILE = (username, email) => ({
  username,
  email,
  role: "user",
  isApproved: false,
  isBanned: false,
  permissions: {
    canManageApis: false,
    canBanUsers: false,
    canPostAnnouncements: false,
    canToggleSystemLocks: false,
  },
  createdAt: serverTimestamp(),
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (!user) {
        setUserDoc(null);
        setProfileLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setProfileLoading(true);
    const ref = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setUserDoc(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setProfileLoading(false);
      },
      () => setProfileLoading(false)
    );
    return unsub;
  }, [currentUser]);

  const login = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setAuthError(friendlyAuthError(err.code));
      return false;
    }
  };

  const signup = async (username, email, password) => {
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      await setDoc(doc(db, "users", cred.user.uid), DEFAULT_PROFILE(username, email));
      return true;
    } catch (err) {
      setAuthError(friendlyAuthError(err.code));
      return false;
    }
  };

  const logout = () => signOut(auth);

  // Convenience permission helpers used throughout the UI.
  const isAdmin = userDoc?.role === "admin";
  const isSubAdmin = userDoc?.role === "sub-admin";
  const can = (flag) => isAdmin || Boolean(userDoc?.permissions?.[flag]);

  const value = {
    currentUser,
    userDoc,
    loading: authLoading || (currentUser ? profileLoading : false),
    authError,
    login,
    signup,
    logout,
    isAdmin,
    isSubAdmin,
    can,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function friendlyAuthError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}
