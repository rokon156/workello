import { createContext, useContext, useState, useCallback } from "react";
import type { UserAccount } from "./authTypes";
import {
	ensureSeedData,
	getSession,
	findUserById,
	login as loginRequest,
	clearSession,
	getUsers,
	addUser as addUserRequest,
	deleteUser as deleteUserRequest,
} from "./authStorage";

// Runs once at module load — seeds the default admin before any component
// reads from storage.
ensureSeedData();

interface AuthContextValue {
	currentUser: UserAccount | null;
	users: UserAccount[];
	login: (username: string, password: string) => { ok: boolean; error?: string };
	logout: () => void;
	addUser: (
		username: string,
		password: string,
		role?: "admin" | "user",
	) => { ok: boolean; error?: string };
	deleteUser: (id: string) => void;
	refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
		const session = getSession();
		if (!session) return null;
		return findUserById(session.userId) ?? null;
	});
	const [users, setUsers] = useState<UserAccount[]>(() => getUsers());

	const refreshUsers = useCallback(() => {
		setUsers(getUsers());
	}, []);

	const login = useCallback((username: string, password: string) => {
		const result = loginRequest(username, password);
		if (!result.ok) return { ok: false, error: result.error };
		setCurrentUser(result.user);
		setUsers(getUsers());
		return { ok: true };
	}, []);

	const logout = useCallback(() => {
		clearSession();
		setCurrentUser(null);
	}, []);

	const addUser = useCallback(
		(username: string, password: string, role: "admin" | "user" = "user") => {
			const result = addUserRequest(username, password, role);
			if (!result.ok) return { ok: false, error: result.error };
			setUsers(getUsers());
			return { ok: true };
		},
		[],
	);

	const deleteUser = useCallback(
		(id: string) => {
			deleteUserRequest(id);
			setUsers(getUsers());
			if (currentUser?.id === id) setCurrentUser(null);
		},
		[currentUser],
	);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				users,
				login,
				logout,
				addUser,
				deleteUser,
				refreshUsers,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
