/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  user: { name?: string; email?: string } | null;
};

export default function UserMenu({ user }: Props) {
  const router = useRouter();
  async function signOut() {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw err;
      }
      router.push("/signin");
    } catch (err: any) {
      toast.error(err?.error || err?.message || "Sign out failed");
    }
  }

  if (!user) return null;

  return (
    <div className="ml-auto flex items-center gap-3 text-sm">
      <div className="text-right">
        <div className="font-medium">{user.name}</div>
        <div className="text-muted-foreground text-xs">{user.email}</div>
      </div>
      <Button variant="ghost" onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
}
