# Multi-user / admin mode

This build adds accounts on top of the original Workello board — **entirely
in the browser** (localStorage), no server. Good for demos and local dev,
not for production (passwords are stored in plaintext, and anyone with
devtools access to the browser can read all data).

## Setup

```
npm install
npm run dev
```

## Logging in

On first load a default admin account is seeded automatically:

- **Username:** `admin`
- **Password:** `admin123`

Log in as admin, then use **+ Add user** in the admin panel to create
regular user accounts. Each new user gets their own board seeded with the
demo Workello tasks.

## What each role sees

- **Regular user** — logs in and only ever sees their own board. They can
  drag cards, complete tasks, add new tasks, and delete tasks — same as
  before, just scoped to their own data.
- **Admin** — lands on an admin dashboard listing every user, with task
  completion stats per user. From there they can:
  - **Manage board** — open any user's board and add / complete / delete
    tasks on their behalf.
  - **Add user** — create new accounts (user or admin role).
  - **Delete** — remove a user account and wipe their board data.

Users never see the admin panel or each other's boards — there's no UI
path from a regular account to any other account's data.

## Data model

- `workello_users_v1` — array of accounts (id, username, password, role).
- `workello_session_v1` — the currently logged-in user id.
- `workello_board_<userId>` — that user's board (cards + lists), same shape
  the original app used, just namespaced per user.

## Known limitation

This is a client-only demo. All "security" (login, isolation between
users) is enforced by the app's UI logic, not by a server — anyone editing
localStorage directly could bypass it. For a real deployment you'd want a
backend with hashed passwords and server-side authorization instead.
