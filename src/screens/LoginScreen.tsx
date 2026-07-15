import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function LoginScreen() {
	const { login } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = login(username, password);
		if (!result.ok) {
			setError(result.error ?? "Login failed.");
			return;
		}
		setError(null);
	}

	return (
		<div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white tracking-tight">
						Workello
					</h1>
					<p className="mt-1 text-sm text-slate-400">
						Sign in to your workspace
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="rounded-2xl bg-[#1a1d27] border border-white/5 p-6 flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-400">
							Username
						</label>
						<input
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="text-sm rounded-lg bg-white/5 border border-white/10 px-3 py-2
                         text-slate-200 placeholder:text-slate-600 focus:outline-none
                         focus:border-indigo-500/50"
							placeholder="e.g. admin"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-400">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="text-sm rounded-lg bg-white/5 border border-white/10 px-3 py-2
                         text-slate-200 placeholder:text-slate-600 focus:outline-none
                         focus:border-indigo-500/50"
							placeholder="••••••••"
						/>
					</div>

					{error && <p className="text-xs text-red-400">{error}</p>}

					<button
						type="submit"
						className="mt-1 text-sm font-semibold rounded-lg px-3 py-2.5
                       bg-indigo-500 text-white hover:bg-indigo-400 transition-colors">
						Sign in
					</button>
				</form>

				<p className="mt-4 text-center text-[11px] text-slate-600">
					First time here? Default admin login is{" "}
					<span className="text-slate-500">admin / admin123</span>. This is a
					browser-only demo — accounts and data live in this browser's
					storage.
				</p>
			</div>
		</div>
	);
}
