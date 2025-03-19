"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ApiForgetPassword from "@/app/_api/auth/ForgetPassword";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role: string = searchParams.get("role") || "root";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const response: any = await ApiForgetPassword(email, role);

    if (response?.data) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/auth/signin?response=email sent");
      }, 1000);
    } else if (response != null) {
      if (response.error) {
        setResponse(response.error.response);
      }
    } else {
      setResponse("internal server error");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md border border-border bg-card shadow-lg p-6 rounded-lg">
        <CardHeader className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">Forget Password</h3>
          <p className="text-sm text-muted-foreground">
            Reset your account password securely
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
                `Forget Password`
              )}
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-muted-foreground">
            Wanna go{" "}
            <Link
              href="/auth/signin"
              className="font-semibold underline hover:text-primary-dark"
            >
              Back ?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
