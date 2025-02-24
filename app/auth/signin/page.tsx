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
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <Card className="w-full max-w-md border border-gray-700 bg-gray-800 bg-opacity-30 backdrop-blur-lg shadow-2xl text-white p-6 rounded-lg">
        <CardHeader className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-400">Access your account securely</p>
        </CardHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid grid-cols-2 bg-gray-700 rounded-lg pb-4">
            <TabsTrigger
              value="user"
              className="px-4 rounded-md text-sm font-medium transition-all"
            >
              User Sign-In
            </TabsTrigger>
            <TabsTrigger
              value="root"
              className="px-4 rounded-md text-sm font-medium transition-all"
            >
              Root Sign-In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <SignInFormContent role="user" />
          </TabsContent>
          <TabsContent value="root">
            <SignInFormContent role="root" />
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
          <Label htmlFor={`email-${role}`} className="text-gray-300">
            Email
          </Label>
          <Input
            id={`email-${role}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 bg-opacity-50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <Label htmlFor={`password-${role}`} className="text-gray-300">
            Password
          </Label>
          <Input
            id={`password-${role}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 bg-opacity-50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gray-300 hover:bg-gray-500 transition-all"
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
      <p className="text-center text-sm mt-4 text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold underline text-gray-300 hover:text-gray-500"
        >
          Sign up
        </Link>{" "}
        for free.
      </p>
    </CardContent>
  );
}
