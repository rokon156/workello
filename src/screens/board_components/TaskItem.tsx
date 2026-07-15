import type { Task } from "../../types/board.types";

interface Props {
	task: Task;
	onComplete: () => void;
	onDelete?: () => void;
	editable?: boolean;
}

export default function TaskItem({ task, onComplete, onDelete, editable }: Props) {
	return (
		<div
			className={`flex items-center gap-1 w-full rounded-lg
                  transition-colors duration-150
                  ${task.isCompleted ? "opacity-60" : "hover:bg-white/5"}`}>
			<button
				type="button"
				onClick={onComplete}
				disabled={task.isCompleted}
				className={`flex items-start gap-2 flex-1 min-w-0 text-left px-2 py-1.5
                  ${task.isCompleted ? "cursor-not-allowed" : "cursor-pointer"}`}>
			<div
				className={`mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded
                       flex items-center justify-center border transition-colors
                       ${
													task.isCompleted
														? "bg-emerald-500 border-emerald-500"
														: "border-slate-600 bg-transparent"
												}`}>
				{task.isCompleted && (
					<svg className="w-2 h-2 text-white" viewBox="0 0 10 10" fill="none">
						<path
							d="M1.5 5l2.5 2.5 4.5-4.5"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>

			<div className="flex flex-col min-w-0">
				<span
					className={`text-xs font-medium leading-tight
                          ${
														task.isCompleted
															? "line-through text-slate-500"
															: "text-slate-300"
													}`}>
					{task.title}
				</span>
				<span className="text-[11px] text-slate-500 leading-tight truncate">
					{task.description}
				</span>
			</div>

			{task.isCompleted && (
					<span className="ml-auto text-[10px] text-slate-600">🔒</span>
				)}
			</button>

			{editable && onDelete && (
				<button
					type="button"
					onClick={onDelete}
					title="Delete task"
					className="shrink-0 mr-1 w-5 h-5 flex items-center justify-center rounded
                       text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
					<svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
						<path
							d="M2.5 2.5l7 7M9.5 2.5l-7 7"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			)}
		</div>
	);
}
