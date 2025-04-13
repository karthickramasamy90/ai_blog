"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/AuthForm";
import { authService } from "@/services/authService";
import Navbar from "@/components/Navbar";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (formData: { email: string; password: string }) => {
    try {
      await authService.register(formData.email, formData.password);

    //   router.push("/"); // Redirect to home page
      router.push("/auth/login"); // Redirect to login after successful registration
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <AuthForm type="register" onSubmit={handleRegister} />
    </>
  );
}
