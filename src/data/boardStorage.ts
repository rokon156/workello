import type { Card, List as ListType } from "../types/board.types";
import { mockBoard, mockCards } from "./mockData";

export function boardStorageKey(userId: string) {
	return `workello_board_${userId}`;
}

interface StoredBoard {
	cards: Record<string | number, Card>;
	lists: ListType[];
}

/** Deep-clones the demo board so each seeded user gets independent data. */
function freshSeedBoard(): StoredBoard {
	return {
		cards: JSON.parse(JSON.stringify(mockCards)),
		lists: JSON.parse(JSON.stringify(mockBoard.lists)),
	};
}

export function seedBoardForUser(userId: string) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(
			boardStorageKey(userId),
			JSON.stringify(freshSeedBoard()),
		);
	} catch {
		// storage unavailable — silently skip
	}
}

export function getBoardForUser(userId: string): StoredBoard | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(boardStorageKey(userId));
		if (!raw) return null;
		return JSON.parse(raw) as StoredBoard;
	} catch {
		return null;
	}
}

export function deleteBoardForUser(userId: string) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(boardStorageKey(userId));
	} catch {
		// storage unavailable — silently skip
	}
}

/** Quick stats for the admin dashboard list, without mounting a Board. */
export function getBoardStatsForUser(userId: string) {
	const board = getBoardForUser(userId);
	if (!board) {
		return {
			totalTasks: 0,
			doneTasks: 0,
			totalCards: 0,
			listCounts: [] as { id: string; title: string; color: string; count: number }[],
		};
	}
	const cards = Object.values(board.cards);
	const totalTasks = cards.reduce((sum, c) => sum + c.tasks.length, 0);
	const doneTasks = cards.reduce(
		(sum, c) => sum + c.tasks.filter((t) => t.isCompleted).length,
		0,
	);
	const listCounts = [...board.lists]
		.sort((a, b) => a.position - b.position)
		.map((l) => ({
			id: l.id,
			title: l.title,
			color: l.color,
			count: l.cardIds.length,
		}));
	return { totalTasks, doneTasks, totalCards: cards.length, listCounts };
}
