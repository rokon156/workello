import { useAuth } from "../../auth/AuthContext";
import { boardStorageKey, getBoardStatsForUser } from "../../data/boardStorage";
import Board from "../board_components/Board";
import { avatarColors, initials } from "./avatarColor";

interface Props {
	userId: string;
	onBack: () => void;
}

export default function AdminBoardView({ userId, onBack }: Props) {
	const { users } = useAuth();
	const user = users.find((u) => u.id === userId);
	const stats = user ? getBoardStatsForUser(user.id) : null;
	const colors = user ? avatarColors(user.username) : null;
	const pct =
		stats && stats.totalTasks > 0
			? Math.round((stats.doneTasks / stats.totalTasks) * 100)
			: 0;

	return (
		<div className="min-h-screen bg-[#0f1117]">
			<div className="flex items-center justify-between px-6 pt-6">
				<button
					type="button"
					onClick={onBack}
					className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5
                     border border-white/10 text-slate-300 hover:bg-white/5 transition-colors">
					<svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
						<path
							d="M7.5 2.5L3 6l4.5 3.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Admin panel
				</button>
				<span className="text-[10px] uppercase tracking-wide text-indigo-400">
					admin mode
				</span>
			</div>

			<div className="flex flex-col items-center pt-4 pb-2 gap-3">
				{user && colors && (
					<div
						className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold"
						style={{ backgroundColor: colors.bg, color: colors.fg }}>
						{initials(user.username)}
					</div>
				)}
				<div className="text-center">
					<h2 className="text-2xl font-bold text-white tracking-tight">
						{user?.username ?? "user"}'s board
					</h2>
					<p className="mt-1 text-sm text-slate-400">
						You're editing on their behalf — add, complete, or delete tasks.
					</p>
					{stats && (
						<p className="mt-1.5 text-[11px] text-slate-500 tabular-nums">
							{stats.totalCards} cards · {stats.doneTasks}/{stats.totalTasks} tasks done ({pct}%)
						</p>
					)}
				</div>
			</div>

			{user && (
				<Board key={user.id} storageKey={boardStorageKey(user.id)} editable />
			)}
		</div>
	);
}
