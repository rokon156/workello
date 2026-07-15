// A fixed set of accent pairs pulled from the app's own palette family so
// avatars always feel native to Workello rather than randomly rainbow.
const PALETTE = [
	{ bg: "#312e81", fg: "#a5b4fc" }, // indigo
	{ bg: "#1e3a5f", fg: "#7dd3fc" }, // sky
	{ bg: "#064e3b", fg: "#6ee7b7" }, // emerald
	{ bg: "#5b1d3a", fg: "#f9a8d4" }, // rose
	{ bg: "#4a3510", fg: "#fcd34d" }, // amber
	{ bg: "#3b2350", fg: "#d8b4fe" }, // violet
	{ bg: "#0f3d3e", fg: "#5eead4" }, // teal
];

function hashString(value: string): number {
	let hash = 0;
	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export function avatarColors(seed: string) {
	return PALETTE[hashString(seed) % PALETTE.length];
}

export function initials(username: string): string {
	const clean = username.trim();
	if (!clean) return "?";
	const parts = clean.split(/[\s._-]+/).filter(Boolean);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}
	return clean.slice(0, 2).toUpperCase();
}
