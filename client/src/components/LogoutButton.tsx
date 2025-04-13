"use client";

import { Button } from "@mui/material";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.refresh(); // ✅ Refresh to update Navbar state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
