"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from "next/link";
import { useState } from "react";
import ApiSignup from "@/app/_api/auth/Signup";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await ApiSignup(email, password);
    if (response.data) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setResponse(response["error"]["response"]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md border border-border bg-card shadow-lg p-6 rounded-lg">
        <CardHeader className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">Sign Up</h3>
          <p className="text-sm text-muted-foreground">
            Create your account securely
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                required
              />
              {response && (
                <div className={"text-sm font-medium text-center text-red-500"}>
                  {response}
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark transition"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : isRedirecting ? (
                "Redirecting..."
              ) : (
                `Sign up`
              )}
            </Button>
          </form>
          <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">
            Sign up with Google
          </Button>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold underline hover:text-primary-dark"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
