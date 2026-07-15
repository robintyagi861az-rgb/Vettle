# Vettle Panel

A premium, dark-glass admin/user panel built with React + Vite, Tailwind CSS,
and Firebase (Auth + Firestore).

## File layout — intentionally flat

Every source file lives directly in the project root, side by side — no
`src/`, `/components`, `/context`, `/pages`, or `/hooks` subfolders. Each file
is self-contained and named for what it does:

| File | Responsibility |
|---|---|
| `FirebaseConfig.js` | Single `initializeApp` call; exports `auth` and `db`. |
| `AuthContext.jsx` | Auth state, live Firestore user-doc listener, `login`/`signup`/`logout`, `can(permissionKey)` helper. |
| `useAuth` | Exported from `AuthContext.jsx` — no separate `/hooks` file. |
| `AuthWall.jsx` | Login / signup card, shown when signed out. |
| `ApprovalWall.jsx` | "Awaiting approval" screen for `isApproved: false`. |
| `BannedWall.jsx` | "Account suspended" screen for `isBanned: true`. |
| `MaintenanceOverlay.jsx` | Blocking overlay for `isLocked` / `isMaintenance` (admins bypass). |
| `PermissionGate.jsx` | `<PermissionGate need="canManageApis">…</PermissionGate>` conditional render. |
| `Sidebar.jsx` | Sticky nav, permission-aware links, live announcement badge. |
| `Dashboard.jsx` | Home view with quick-nav cards + recent announcements. |
| `AnnouncementsFeed.jsx` | Realtime announcement list, client-filters anything older than 7 days. |
| `MathSolver.jsx` | Book/Class/Chapter/Exercise workspace, routes on `system_settings.mathPresetFormat`. |
| `TextToVideo.jsx` | "Coming Soon" premium placeholder with animated skeleton canvas. |
| `AdminPanel.jsx` | Tab shell (Users / Credentials / Announcements / Settings). |
| `AdminUsers.jsx` | Searchable roster — ban/unban, approve, role, granular permission toggles. |
| `AdminCredentials.jsx` | `api_credentials` table — add, mask/reveal, activate, delete. |
| `AdminAnnouncements.jsx` | Publish/delete announcements. |
| `AdminSettings.jsx` | `isLocked`, `isMaintenance`, `activeAiModel`, `mathPresetFormat`. |
| `App.jsx` | Top-level gate order (loading → signed out → profile → banned → pending → lock/maintenance) + view router. |
| `main.jsx` | Entry point — wraps `App` in `AuthProvider`, mounts to `#root`. |
| `index.css` | Tailwind directives + glass/glow/skeleton utility classes. |

## Setup

```bash
npm install
npm run dev
```

Your Firebase config is already wired into `FirebaseConfig.js` — no `.env`
needed for the client keys. **Deploy `firestore.rules`** (`firebase deploy
--only firestore:rules`) before going live — the client-side permission
checks in the UI are cosmetic; the rules are what actually enforce access.

## Bootstrapping your first admin

New signups are created with `role: "user"`, `isApproved: false`,
`isBanned: false`, and every permission flag `false` (see `DEFAULT_PROFILE` in
`AuthContext.jsx`). To create your first admin: sign up normally, then in the
Firebase console open that user's document in `users/{uid}` and manually set
`role: "admin"` and `isApproved: true`. From then on, that admin can approve
and promote everyone else from the Admin Panel.

## Firestore schema

```
system_settings/config
  isLocked: boolean
  isMaintenance: boolean
  activeAiModel: string
  mathPresetFormat: string

api_credentials/{serviceId}        e.g. "openai", "replicate"
  providerName: string
  apiKey: string
  isActive: boolean
  apiEndpoint: string

users/{uid}
  username: string
  email: string
  role: "user" | "sub-admin" | "admin"
  isApproved: boolean
  isBanned: boolean
  permissions: {
    canManageApis: boolean
    canBanUsers: boolean
    canPostAnnouncements: boolean
    canToggleSystemLocks: boolean
  }

announcements/{autoId}
  title: string
  content: string
  createdAt: timestamp
```

## Notes

- **Math Solver AI**: the UI is fully wired to read `mathPresetFormat` /
  `activeAiModel` live from Firestore and builds the routed request payload
  for you. The actual solve call is a stub (`MathSolver.jsx`) — point it at
  your backend/Cloud Function.
- **Text to Video**: intentionally a placeholder module per spec — swap the
  disabled prompt bar and skeletons in `TextToVideo.jsx` for the real canvas
  when that feature ships.
- Admins always bypass `isLocked` / `isMaintenance` and every permission
  check, so there's always a way back in to fix a bad toggle.
