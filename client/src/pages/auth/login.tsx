"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/AuthForm";
import { authService } from "@/services/authService";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const { accessToken, refreshToken } = await authService.login(formData.email, formData.password);
      
      // Store tokens in local storage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      
      router.push("/dashboard"); // Redirect to home page
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <AuthForm type="login" onSubmit={handleLogin} />
    </>
  );
}
