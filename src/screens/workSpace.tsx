import { mockBoard } from "../data/mockData";
import Board from "./board_components/Board";
import { useAuth } from "../auth/AuthContext";
import { boardStorageKey } from "../data/boardStorage";

export default function Workspace() {
	const { currentUser, logout } = useAuth();

	return (
		<div className="min-h-screen bg-[#0f1117]">
			{/* Header */}
			<div className="flex items-center justify-between px-6 pt-6">
				<span className="text-xs text-slate-500">
					Signed in as{" "}
					<span className="text-slate-300 font-medium">
						{currentUser?.username}
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

			<div className="text-center pt-4 pb-2">
				<h2 className="text-3xl font-bold text-white tracking-tight">
					{mockBoard.title}
				</h2>
				<p className="mt-1 text-sm text-slate-400">{mockBoard.description}</p>
			</div>

			{currentUser && (
				<Board
					key={currentUser.id}
					storageKey={boardStorageKey(currentUser.id)}
					editable
				/>
			)}
		</div>
	);
}
