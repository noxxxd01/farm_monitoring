"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  mode: "signup" | "signin";
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  setName?: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setPasswordConfirm?: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
};

export default function AuthFormView({
  mode,
  name,
  email,
  password,
  passwordConfirm,
  setName,
  setEmail,
  setPassword,
  setPasswordConfirm,
  loading,
  onSubmit,
  className,
  ...props
}: Props) {
  const isSignup = mode === "signup";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="overflow-hidden p-0">
        <div className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {isSignup ? "Create an account" : "Welcome back"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {isSignup
                    ? "Sign up for your Farm Care account"
                    : "Login to your Farm Care account"}
                </p>
              </div>

              {isSignup && (
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={name}
                    onChange={(e) => setName?.(e.target.value)}
                  />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {!isSignup ? (
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  ) : null}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {isSignup && (
                <Field>
                  <FieldLabel htmlFor="passwordConfirm">
                    Confirm password
                  </FieldLabel>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm?.(e.target.value)}
                  />
                </Field>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? isSignup
                      ? "Please wait..."
                      : "Please wait..."
                    : isSignup
                    ? "Sign up"
                    : "Login"}
                </Button>
              </Field>

              <FieldSeparator />

              <FieldDescription className="text-center">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="underline-offset-2 hover:underline"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="underline-offset-2 hover:underline"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <Image
              src="/brand.svg"
              width={1000}
              height={600}
              alt="Image"
              className="h-90 w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      </div>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a className="underline-offset-2 hover:underline" href="#">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="underline-offset-2 hover:underline" href="#">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
