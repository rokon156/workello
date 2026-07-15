export type Role = "admin" | "user";

export interface UserAccount {
	id: string;
	username: string;
	// Demo-only: plaintext, stored in localStorage. Do not use this pattern
	// in a real product — passwords must be hashed server-side.
	password: string;
	role: Role;
	createdAt: string;
}

export interface Session {
	userId: string;
}
