import { useState } from "react";
import "./output.css";
import WorkSpace from "./screens/workSpace";
import LoginScreen from "./screens/LoginScreen";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminBoardView from "./screens/admin/AdminBoardView";
import { useAuth } from "./auth/AuthContext";

export default function App() {
	const { currentUser } = useAuth();
	const [managingUserId, setManagingUserId] = useState<string | null>(null);

	if (!currentUser) {
		return <LoginScreen />;
	}

	if (currentUser.role === "admin") {
		if (managingUserId) {
			return (
				<AdminBoardView
					userId={managingUserId}
					onBack={() => setManagingUserId(null)}
				/>
			);
		}
		return <AdminDashboard onManageUser={setManagingUserId} />;
	}

	return <WorkSpace />;
}
