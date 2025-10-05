"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AuthFormView from "@/components/auth-form";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || data?.message || "Login failed");
      } else {
        toast.success("Signed in. Redirecting...");
        setTimeout(() => router.push("/dashboard"), 400);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <AuthFormView
          mode="signin"
          name=""
          email={email}
          password={password}
          passwordConfirm=""
          setEmail={setEmail}
          setPassword={setPassword}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
