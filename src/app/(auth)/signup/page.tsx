"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import { APP_NAME } from "@/lib/constants";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Signup failed");
        setLoading(false);
        return;
      }

      if (data.needsEmailConfirmation) {
        setSuccessMessage(
          "Account created! Check your email to confirm, then sign in."
        );
        setSuccess(true);
        setLoading(false);
        return;
      }

      setSuccessMessage("Account created! Redirecting to dashboard…");
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch {
      setError(
        "Could not reach the server. Make sure npm run dev is running and try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-forge">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start forging with {APP_NAME}
          </p>
        </div>

        <SupabaseSetupNotice />

        {success ? (
          <p className="text-center text-emerald-400 py-4">{successMessage}</p>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 rounded-lg bg-red-500/10 px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-forge-400 hover:text-forge-300">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
