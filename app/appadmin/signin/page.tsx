"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useSearchParams } from "next/navigation";

export default function SignInForm() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md border border-border bg-card shadow-lg p-6 rounded-lg">
        <CardHeader className="flex justify-between items-center">
          <div className="text-center w-full space-y-2">
            <h3 className="text-2xl font-semibold">Admin Sign In</h3>
            <p className="text-sm text-muted-foreground">
              Access your account securely
            </p>
          </div>
        </CardHeader>
        <SignInFormContent />
      </Card>
    </div>
  );
}

function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param_response = searchParams?.get("response");
  const redirect = searchParams?.get("redirect");

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setResponse("");
  }, [user, password]);

  useEffect(() => {
    if (param_response !== null) {
      setResponse(String(param_response));
    }
  }, [param_response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/authentication/appadmin/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });

    const response = await res.json();
    console.log(response);

    if (response && response?.data) {
      setIsRedirecting(true);
      setTimeout(() => {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/appadmin/dashboard");
        }
      }, 500);
    } else if (response?.error) {
      setResponse(response.error?.response ?? "Unknown error");
    } else {
      setResponse("internal server error");
    }

    setIsLoading(false);
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor={`user`} className="text-muted-foreground">
            User
          </Label>
          <Input
            id={`user`}
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
            required
          />
        </div>
        <div>
          <Label htmlFor={`password`} className="text-muted-foreground">
            Password
          </Label>
          <Input
            id={`password`}
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
            `Sign in`
          )}
        </Button>
      </form>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      )}
    </CardContent>
  );
}
