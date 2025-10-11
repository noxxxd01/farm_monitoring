"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner"; // optional if you use sonner for notifications

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  return (
    <Card className="w-full max-w-md shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet className="space-y-0">
              <FieldLegend>Change Password</FieldLegend>
              <FieldDescription>
                Update your account password. Make sure to choose a strong
                password.
              </FieldDescription>

              <FieldGroup className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Current Password</FieldLabel>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="shadow-none"
                  />
                </Field>
                <Field className="mt-4">
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="shadow-none"
                  />
                </Field>
                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="shadow-none"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="shadow-none"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
