"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState, useEffect } from "react";
import ApiSignIn from "@/app/api/auth/Signin";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useSearchParams } from "next/navigation";

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

        <Tabs defaultValue="root" className="w-full">
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const param_response = searchParams.get("response");
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setResponse("");
  }, [email, password]);

  useEffect(() => {
    if (param_response !== null) {
      setResponse(param_response);
    }
  }, [param_response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await ApiSignIn(email, password, role);
    console.log(response);
    if (response?.data) {
      setIsRedirecting(true);
      setTimeout(() => {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } else if (response?.error) {
      setResponse(response["error"]["response"]);
    } else {
      setResponse("internal server error");
    }
    setIsLoading(false);
  };
  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();

    window.location.href = `/api/auth/google?role=${role}`;
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
        {response && (
          <div className="text-sm font-medium text-red-500 text-center">
            {response}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark transition"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : isRedirecting ? (
            "Redirecting..."
          ) : (
            `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
          )}
        </Button>
      </form>
      <Button
        onClick={handleGoogleSignIn}
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
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      )}
    </CardContent>
  );
}
