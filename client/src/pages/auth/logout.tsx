import { authService } from "@/services/authService";

const handleLogout = async () => {
  await authService.logout();
};

<button onClick={handleLogout}>Logout</button>;