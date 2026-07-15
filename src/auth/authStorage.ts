import type { UserAccount, Session } from "./authTypes";
import { seedBoardForUser, deleteBoardForUser } from "../data/boardStorage";

const USERS_KEY = "workello_users_v1";
const SESSION_KEY = "workello_session_v1";

const DEFAULT_ADMIN: UserAccount = {
	id: "admin-1",
	username: "admin",
	password: "admin123",
	role: "admin",
	createdAt: new Date().toISOString(),
};

function readUsers(): UserAccount[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(USERS_KEY);
		if (!raw) return [];
		return JSON.parse(raw) as UserAccount[];
	} catch {
		return [];
	}
}

function writeUsers(users: UserAccount[]) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
	} catch {
		// storage unavailable — silently skip
	}
}

/** Ensures a default admin account exists on first load. Call once at startup. */
export function ensureSeedData() {
	const users = readUsers();
	if (users.length === 0) {
		writeUsers([DEFAULT_ADMIN]);
	}
}

export function getUsers(): UserAccount[] {
	return readUsers();
}

export function findUserByUsername(username: string): UserAccount | undefined {
	return readUsers().find(
		(u) => u.username.toLowerCase() === username.toLowerCase(),
	);
}

export function findUserById(id: string): UserAccount | undefined {
	return readUsers().find((u) => u.id === id);
}

export function addUser(
	username: string,
	password: string,
	role: "admin" | "user" = "user",
): { ok: true; user: UserAccount } | { ok: false; error: string } {
	const users = readUsers();
	if (!username.trim() || !password) {
		return { ok: false, error: "Username and password are required." };
	}
	if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
		return { ok: false, error: "That username is already taken." };
	}

	const user: UserAccount = {
		id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		username: username.trim(),
		password,
		role,
		createdAt: new Date().toISOString(),
	};

	writeUsers([...users, user]);
	if (role === "user") {
		seedBoardForUser(user.id);
	}
	return { ok: true, user };
}

export function deleteUser(id: string) {
	const users = readUsers().filter((u) => u.id !== id);
	writeUsers(users);
	deleteBoardForUser(id);
	const session = getSession();
	if (session?.userId === id) {
		clearSession();
	}
}

export function login(
	username: string,
	password: string,
): { ok: true; user: UserAccount } | { ok: false; error: string } {
	const user = findUserByUsername(username);
	if (!user || user.password !== password) {
		return { ok: false, error: "Invalid username or password." };
	}
	setSession({ userId: user.id });
	return { ok: true, user };
}

export function getSession(): Session | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as Session;
	} catch {
		return null;
	}
}

export function setSession(session: Session) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	} catch {
		// storage unavailable — silently skip
	}
}

export function clearSession() {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(SESSION_KEY);
	} catch {
		// storage unavailable — silently skip
	}
}
