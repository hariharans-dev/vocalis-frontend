"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [accountDetails, setAccountDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const startEditing = () => {
    setIsEditing(true);
  };

  const submitChanges = () => {
    setIsEditing(false);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountDetails({
      ...accountDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });

    if (
      e.target.name === "confirmPassword" &&
      e.target.value === password.newPassword
    ) {
      setError("");
    }
  };

  const updatePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    alert("Password updated successfully!");
    setPassword({ newPassword: "", confirmPassword: "" });
  };
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Number of Events
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Number of Requests
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 p-4">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {" "}
                  {/* Increased spacing between input fields */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="account-name" className="w-24">
                      Name
                    </Label>
                    <Input
                      id="account-name"
                      type="text"
                      name="name"
                      value={accountDetails.name}
                      onChange={handleAccountChange}
                      placeholder="Name"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="account-phone" className="w-24">
                      Phone
                    </Label>
                    <Input
                      id="account-phone"
                      type="text"
                      name="phone"
                      value={accountDetails.phone}
                      onChange={handleAccountChange}
                      placeholder="Phone"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="account-email" className="w-24">
                      Email
                    </Label>
                    <Input
                      id="account-email"
                      type="email"
                      name="email"
                      value={accountDetails.email}
                      onChange={handleAccountChange}
                      placeholder="Email"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                  {/* Added margin-top to create distance */}
                  <div className="mt-6">
                    {!isEditing ? (
                      <Button onClick={startEditing}>Update</Button>
                    ) : (
                      <Button onClick={submitChanges}>Submit</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 p-4">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Enter new password and confirm.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <Input
                    type="password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                  />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm Password"
                  />

                  {/* Show error message if passwords don't match */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    onClick={updatePassword}
                    className="mt-2"
                    disabled={
                      !password.newPassword || !password.confirmPassword
                    }
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
