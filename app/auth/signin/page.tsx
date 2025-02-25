"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md border border-border bg-card shadow-lg p-6 rounded-lg">
        <CardHeader className="flex justify-between items-center">
          <div className="text-center w-full space-y-2">
            <h3 className="text-2xl font-semibold">Sign In</h3>
            <p className="text-sm text-muted-foreground">
              Access your account securely
            </p>
          </div>
        </CardHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid grid-cols-2 bg-muted rounded-lg pb-4">
            <TabsTrigger
              value="root"
              className="px-4 rounded-md text-sm font-medium"
            >
              Root Sign-In
            </TabsTrigger>
            <TabsTrigger
              value="user"
              className="px-4 rounded-md text-sm font-medium"
            >
              User Sign-In
            </TabsTrigger>
          </TabsList>
          <TabsContent value="root">
            <SignInFormContent role="root" />
          </TabsContent>
          <TabsContent value="user">
            <SignInFormContent role="user" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function SignInFormContent({ role }: { role: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password, callbackUrl: "/", role });
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor={`email-${role}`} className="text-muted-foreground">
            Email
          </Label>
          <Input
            id={`email-${role}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
            required
          />
        </div>
        <div>
          <Label htmlFor={`password-${role}`} className="text-muted-foreground">
            Password
          </Label>
          <Input
            id={`password-${role}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark transition"
        >
          Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
        </Button>
      </form>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
      >
        Sign in with Google
      </Button>
      <p className="text-center text-sm mt-4 text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold underline hover:text-primary-dark"
        >
          Sign up
        </Link>{" "}
        for free.
      </p>
    </CardContent>
  );
}
