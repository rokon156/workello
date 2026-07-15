import { useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getBoardStatsForUser } from "../../data/boardStorage";
import { avatarColors, initials } from "./avatarColor";
import ListDistributionBar from "./ListDistributionBar";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
	onManageUser: (userId: string) => void;
}

function generatePassword() {
	const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let out = "";
	for (let i = 0; i < 10; i++) {
		out += chars[Math.floor(Math.random() * chars.length)];
	}
	return out;
}

export default function AdminDashboard({ onManageUser }: Props) {
	const { currentUser, users, logout, addUser, deleteUser } = useAuth();
	const [showAddForm, setShowAddForm] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newRole, setNewRole] = useState<"user" | "admin">("user");
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [sortBy, setSortBy] = useState<"name" | "completion">("name");
	const [pendingDelete, setPendingDelete] = useState<{
		id: string;
		username: string;
	} | null>(null);

	const regularUsers = users.filter((u) => u.role === "user");
	const adminUsers = users.filter((u) => u.role === "admin");

	const roster = useMemo(() => {
		const withStats = regularUsers
			.filter((u) =>
				u.username.toLowerCase().includes(query.trim().toLowerCase()),
			)
			.map((u) => ({ user: u, stats: getBoardStatsForUser(u.id) }));

		return withStats.sort((a, b) => {
			if (sortBy === "name") return a.user.username.localeCompare(b.user.username);
			const pctA = a.stats.totalTasks ? a.stats.doneTasks / a.stats.totalTasks : 0;
			const pctB = b.stats.totalTasks ? b.stats.doneTasks / b.stats.totalTasks : 0;
			return pctB - pctA;
		});
	}, [regularUsers, query, sortBy]);

	const fleetTotals = useMemo(() => {
		return regularUsers.reduce(
			(acc, u) => {
				const s = getBoardStatsForUser(u.id);
				acc.cards += s.totalCards;
				acc.tasks += s.totalTasks;
				acc.done += s.doneTasks;
				return acc;
			},
			{ cards: 0, tasks: 0, done: 0 },
		);
	}, [regularUsers]);
	const fleetPct =
		fleetTotals.tasks > 0
			? Math.round((fleetTotals.done / fleetTotals.tasks) * 100)
			: 0;

	function handleAddUser(e: React.FormEvent) {
		e.preventDefault();
		const result = addUser(newUsername, newPassword, newRole);
		if (!result.ok) {
			setError(result.error ?? "Could not add user.");
			return;
		}
		setNewUsername("");
		setNewPassword("");
		setNewRole("user");
		setError(null);
		setShowAddForm(false);
	}

	function requestDelete(id: string, username: string) {
		setPendingDelete({ id, username });
	}

	function confirmDelete() {
		if (!pendingDelete) return;
		deleteUser(pendingDelete.id);
		setPendingDelete(null);
	}

	return (
		<div className="min-h-screen bg-[#0f1117]">
			{/* Top bar */}
			<div className="flex items-center justify-between px-6 pt-6">
				<span className="text-xs text-slate-500">
					Signed in as{" "}
					<span className="text-slate-300 font-medium">
						{currentUser?.username}
					</span>{" "}
					<span className="ml-1 text-[10px] uppercase tracking-wide text-indigo-400">
						admin
					</span>
				</span>
				<button
					type="button"
					onClick={logout}
					className="text-xs font-medium rounded-lg px-3 py-1.5 border border-white/10
                     text-slate-300 hover:bg-white/5 transition-colors">
					Log out
				</button>
			</div>

			<div className="max-w-5xl mx-auto px-6">
				{/* Hero */}
				<div className="pt-6 pb-6">
					<p className="text-[11px] font-semibold tracking-[0.2em] text-indigo-400 mb-1">
						ADMIN
					</p>
					<h1 className="text-3xl font-bold text-white tracking-tight">
						Control panel
					</h1>
					<p className="mt-1 text-sm text-slate-400">
						Every workspace, one place. Manage accounts and step into any
						user's board.
					</p>
				</div>

				{/* Fleet summary strip */}
				<div
					className="rounded-2xl bg-[#1a1d27] border border-white/5 px-6 py-5
                     grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
					<div>
						<p className="text-[11px] text-slate-500 mb-1">Users</p>
						<p className="text-2xl font-semibold text-white tabular-nums">
							{regularUsers.length}
						</p>
					</div>
					<div className="sm:border-l sm:border-white/5 sm:pl-6">
						<p className="text-[11px] text-slate-500 mb-1">Cards in flight</p>
						<p className="text-2xl font-semibold text-white tabular-nums">
							{fleetTotals.cards}
						</p>
					</div>
					<div className="sm:border-l sm:border-white/5 sm:pl-6">
						<p className="text-[11px] text-slate-500 mb-1">Tasks done</p>
						<p className="text-2xl font-semibold text-white tabular-nums">
							{fleetTotals.done}
							<span className="text-slate-500 text-base"> / {fleetTotals.tasks}</span>
						</p>
					</div>
					<div className="sm:border-l sm:border-white/5 sm:pl-6">
						<p className="text-[11px] text-slate-500 mb-1">Completion rate</p>
						<p className="text-2xl font-semibold text-emerald-400 tabular-nums">
							{fleetPct}%
						</p>
					</div>
				</div>

				{/* Controls */}
				<div className="flex flex-wrap items-center gap-3 mb-3">
					<div className="relative flex-1 min-w-[180px]">
						<svg
							className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600"
							viewBox="0 0 16 16"
							fill="none">
							<circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
							<path
								d="M11 11l3.5 3.5"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search users…"
							className="w-full text-sm rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2
                         text-slate-200 placeholder:text-slate-600 focus:outline-none
                         focus:border-indigo-500/50"
						/>
					</div>

					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as "name" | "completion")}
						className="text-sm rounded-lg bg-white/5 border border-white/10 px-2 py-2
                       text-slate-300 focus:outline-none focus:border-indigo-500/50">
						<option value="name">Sort: name</option>
						<option value="completion">Sort: completion</option>
					</select>

					<button
						type="button"
						onClick={() => setShowAddForm((s) => !s)}
						className="text-xs font-medium rounded-lg px-3 py-2 bg-indigo-500
                       text-white hover:bg-indigo-400 transition-colors">
						{showAddForm ? "Cancel" : "+ Add user"}
					</button>
				</div>

				{/* Add user panel */}
				{showAddForm && (
					<form
						onSubmit={handleAddUser}
						className="rounded-xl bg-[#1a1d27] border border-white/5 p-4 mb-5 flex flex-col gap-3">
						<div className="grid sm:grid-cols-3 gap-3">
							<input
								autoFocus
								value={newUsername}
								onChange={(e) => setNewUsername(e.target.value)}
								placeholder="Username"
								className="text-sm rounded-lg bg-white/5 border border-white/10 px-3 py-2
                           text-slate-200 placeholder:text-slate-600 focus:outline-none
                           focus:border-indigo-500/50"
							/>
							<div className="flex gap-2">
								<input
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="Password"
									className="flex-1 text-sm rounded-lg bg-white/5 border border-white/10 px-3 py-2
                             text-slate-200 placeholder:text-slate-600 focus:outline-none
                             focus:border-indigo-500/50"
								/>
								<button
									type="button"
									onClick={() => setNewPassword(generatePassword())}
									title="Generate a password"
									className="shrink-0 text-xs font-medium rounded-lg px-2.5 border border-white/10
                             text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-colors">
									Generate
								</button>
							</div>
							<select
								value={newRole}
								onChange={(e) => setNewRole(e.target.value as "user" | "admin")}
								className="text-sm rounded-lg bg-white/5 border border-white/10 px-2 py-2
                           text-slate-200 focus:outline-none focus:border-indigo-500/50">
								<option value="user">Role: user</option>
								<option value="admin">Role: admin</option>
							</select>
						</div>
						{error && <p className="text-xs text-red-400">{error}</p>}
						<div className="flex items-center justify-between">
							<p className="text-[11px] text-slate-500">
								{newRole === "user"
									? "New users are seeded with the demo Workello board."
									: "Admin accounts manage other users but don't get a board."}
							</p>
							<button
								type="submit"
								className="text-xs font-medium rounded-lg px-3 py-1.5
                           bg-emerald-500 text-white hover:bg-emerald-400 transition-colors">
								Create account
							</button>
						</div>
					</form>
				)}

				{/* Roster */}
				<div className="flex flex-col gap-2 mb-10">
					{regularUsers.length === 0 && (
						<div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
							<p className="text-sm text-slate-400 mb-1">No users yet</p>
							<p className="text-xs text-slate-600">
								Add one above to give them their own board.
							</p>
						</div>
					)}

					{regularUsers.length > 0 && roster.length === 0 && (
						<p className="text-xs text-slate-500 py-6 text-center">
							No users match "{query}".
						</p>
					)}

					{roster.map(({ user: u, stats }) => {
						const pct =
							stats.totalTasks > 0
								? Math.round((stats.doneTasks / stats.totalTasks) * 100)
								: 0;
						const colors = avatarColors(u.username);
						return (
							<div
								key={u.id}
								className="rounded-xl bg-[#1a1d27] border border-white/5 px-4 py-3.5
                           flex items-center gap-4 hover:border-white/10 transition-colors">
								<div
									className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                             text-[11px] font-semibold"
									style={{ backgroundColor: colors.bg, color: colors.fg }}>
									{initials(u.username)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1.5">
										<p className="text-sm font-medium text-slate-200 truncate">
											{u.username}
										</p>
										<span className="text-[10px] text-slate-500 tabular-nums">
											{stats.totalCards} cards · {stats.doneTasks}/{stats.totalTasks} tasks
											{" · "}
											<span className={pct === 100 ? "text-emerald-400" : "text-slate-500"}>
												{pct}%
											</span>
										</span>
									</div>
									<ListDistributionBar segments={stats.listCounts} />
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<button
										type="button"
										onClick={() => onManageUser(u.id)}
										className="text-xs font-medium rounded-lg px-3 py-1.5 bg-indigo-500/10
                               text-indigo-300 hover:bg-indigo-500/20 transition-colors">
										Manage board
									</button>
									<button
										type="button"
										onClick={() => requestDelete(u.id, u.username)}
										title="Delete user"
										className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10
                               text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors">
										<svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
											<path
												d="M2.5 4h9M5.5 4V2.5h3V4M5.5 6.5v4M8.5 6.5v4M3.5 4l.5 8h6l.5-8"
												stroke="currentColor"
												strokeWidth="1.3"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								</div>
							</div>
						);
					})}
				</div>

				{/* Other admins */}
				{adminUsers.filter((a) => a.id !== currentUser?.id).length > 0 && (
					<div className="mb-16">
						<h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-3">
							Other admins
						</h3>
						<div className="flex flex-col gap-2">
							{adminUsers
								.filter((a) => a.id !== currentUser?.id)
								.map((a) => {
									const colors = avatarColors(a.username);
									return (
										<div
											key={a.id}
											className="flex items-center gap-3 rounded-xl bg-[#1a1d27]
                                 border border-white/5 px-4 py-2.5">
											<div
												className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                                   text-[10px] font-semibold"
												style={{ backgroundColor: colors.bg, color: colors.fg }}>
												{initials(a.username)}
											</div>
											<p className="flex-1 text-sm font-medium text-slate-200">
												{a.username}
											</p>
											<button
												type="button"
												onClick={() => requestDelete(a.id, a.username)}
												className="text-xs font-medium rounded-lg px-3 py-1.5 border border-white/10
                                   text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
												Delete
											</button>
										</div>
									);
								})}
						</div>
					</div>
				)}
			</div>

			{pendingDelete && (
				<ConfirmDialog
					title={`Delete "${pendingDelete.username}"?`}
					description="This removes their account and their entire board. This can't be undone."
					confirmLabel="Delete account"
					onCancel={() => setPendingDelete(null)}
					onConfirm={confirmDelete}
				/>
			)}
		</div>
	);
}
