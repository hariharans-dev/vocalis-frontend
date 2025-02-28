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
import ApiForgetPassword from "@/app/api/auth/ForgetPassword";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  var key = searchParams.get("key");
  const role = searchParams.get("role");

  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    if (key == null || role == null) {
      setResponse("invalid request");
    } else {
      key = decodeURIComponent(key);
      console.log(key);
      const response = await ApiForgetPassword(null, role, key, password);
      console.log(response);

      if (response?.data) {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push("/auth/signin?response=password changed");
        }, 1000);
      } else if (response != null) {
        if (response.error) {
          setResponse(response.error);
        } else if (response.status && response.status >= 400) {
          setResponse(`server error, status code: ${response.status}`);
        } else {
          setResponse("API error");
        }
      } else {
        setResponse("internal server error");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md border border-border bg-card shadow-lg p-6 rounded-lg">
        <CardHeader className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">Password Update</h3>
          <p className="text-sm text-muted-foreground">
            Reset your account password securely
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="mt-4 text-sm font-medium text-red-500 text-center">
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
                `Update Password`
              )}
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-muted-foreground">
            Resend{" "}
            <Link
              href={`/auth/forgetpassword?role=${role}`}
              className="font-semibold underline hover:text-primary-dark"
            >
              Forget password ?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
