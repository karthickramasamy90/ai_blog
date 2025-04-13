"use client";

import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { authService } from "../services/authService";

const Navbar = () => {
  const [user, setUser] = useState<{ userId: number, email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
        setUser(null); // User is not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Blog
        </Typography>
        {loading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : user ? (
          <>
            <Button color="inherit" component={Link} href="/ai-assistant">
              AI Assistant
            </Button>
            <Typography variant="body2" sx={{ marginRight: 2 }}>
                Welcome: {user.email}
            </Typography>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/auth/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
