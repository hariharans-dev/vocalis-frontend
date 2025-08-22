"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const router = useRouter();

  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [accountDetails, setAccountDetails] = useState({
    name: "-",
    phone: "-",
    email: "-",
  });
  const [eventData, setEventData] = useState({
    total_count: "-",
  });
  const [voiceCount, setVoiceCount] = useState("-");
  const [voiceReportCount, setVoiceReportCount] = useState("-");
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState<React.ReactNode>(null);
  const [userDataError, setUserDataError] = useState("");

  const rootData = async () => {
    // const response = await GetRootData();
    const res = await fetch("/api/root", {
      method: "POST",
      headers: { "Content-Type": "application-json" },
      body: JSON.stringify({}),
    });
    const response = await res.json();

    if (response && "data" in response && response.data) {
      setAccountDetails({
        ...accountDetails,
        name: response.data?.name || accountDetails.name,
        phone: response.data?.phone || accountDetails.phone,
        email: response.data?.email || accountDetails.email,
      });
    }
  };

  const userEventData = async () => {
    var res = await fetch("/api/role/list", {
      method: "POST",
      body: JSON.stringify({ count: "true" }),
    });
    const response = await res.json();

    if (response?.status == "success" && response?.data) {
      setEventData({
        ...eventData,
        total_count: response.data.total_count,
      });
    }
  };

  const voiceFeedback = async () => {
    const res = await fetch("/api/reporter/data/get", {
      method: "POST",
      body: JSON.stringify({ count: "true" }),
    });
    const response = await res.json();
    if (response?.status == "success" && response?.data) {
      setVoiceCount(response.data.count);
    }
  };

  const voiceFeedbackReport = async () => {
    const res = await fetch("/api/reporter/report/get", {
      method: "POST",
      body: JSON.stringify({ count: "true" }),
    });
    const response = await res.json();
    if (response?.status == "success" && response?.data) {
      setVoiceReportCount(response.data.count);
    }
  };

  useEffect(() => {
    rootData();
    userEventData();
    voiceFeedback();
    voiceFeedbackReport();
  },[]);

  const startAccountEditing = () => {
    setIsEditing(true);
  };

  const updateAccount = async () => {
    const feilds = Object.keys(accountDetails);
    const placeholder = ["", "", ""];
    var data: Record<string, string> = {};

    feilds.forEach((element) => {
      if (
        !placeholder.includes(
          accountDetails[element as keyof typeof accountDetails]
        )
      ) {
        data[element] = accountDetails[element as keyof typeof accountDetails];
      }
    });
    const res = await fetch("/api/root", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response?.status == "error") {
      setUserDataError(response.error?.response ?? "error in updating");
    } else {
      setUserDataError("update successfull");
      router.refresh();
    }
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
      setPasswordError("");
    }
  };

  const updatePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      setPasswordError(
        <ul>
          <li>Passwords do not match!</li>
        </ul>
      );
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password.newPassword)) {
      setPasswordError(
        <ul>
          <li>At least one lowercase letter</li>
          <li>At least one uppercase letter</li>
          <li>At least one digit</li>
          <li>At least one special character: @$!%*?&</li>
        </ul>
      );
      return;
    }

    const res = await fetch("/api/root", {
      method: "PUT",
      body: JSON.stringify({ password: password.newPassword }),
    });
    const response = await res.json();

    if (response?.status == "success") {
      setPasswordError(
        <ul>
          <li>{response.data?.response}</li>
        </ul>
      );
    }

    setPassword({ newPassword: "", confirmPassword: "" });
  };

  const logout = async () => {
    const res = await fetch("/api/authentication/logout", { method: "DELETE" });
    const response = await res.json();

    if (response && response["status"] == "success") {
      router.push("/auth/signin?response=logout successfull");
    }
  };

  const closeAccount = async () => {
    // const response = await CloseRootAccount();
    const res = await fetch("/api/root", {
      method: "DELETE",
    });
    const response = await res.json();
    if (response && response["status"] == "success") {
      router.push("/auth/signin?response=root account closed");
    }
  };

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Type of Account
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
                <div className="text-2xl font-bold">Root</div>
                <p className="text-xs text-muted-foreground">
                  Access event functionalities
                </p>
              </CardContent>
            </Card>
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  <path d="M16 13h-1.5v2.5h-2V13H12v-2h2.5V8.5h2V11H16v2z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {eventData.total_count}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Number of Voice Feedbacks
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
                <div className="text-2xl font-bold">{voiceCount}</div>
                <p className="text-xs text-muted-foreground">
                  voice feedback gathered for audience
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Voice FeedBack Report Generations
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{voiceReportCount}</div>
                <p className="text-xs text-muted-foreground">
                  number of reports generated for voice feedback
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="sm:col-span-1 md:col-span-4 p-4">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                      placeholder={accountDetails.name}
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
                      placeholder={accountDetails.phone}
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
                      placeholder={accountDetails.email}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {userDataError && (
                      <p className="text-red-500 text-sm">{userDataError}</p>
                    )}
                  </div>
                  <div className="mt-6">
                    {!isEditing ? (
                      <Button onClick={startAccountEditing}>Update</Button>
                    ) : (
                      <Button onClick={updateAccount}>Submit</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-1 md:col-span-3 p-4">
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
                  {passwordError && (
                    <div className="text-red-500">{passwordError}</div>
                  )}
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

            <Card className="sm:col-span-1 md:col-span-3 p-4">
              <CardHeader>
                <CardTitle>Account Session</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={logout}>Logout</Button>
              </CardContent>
            </Card>

            <Card className="sm:col-span-1 md:col-span-3 p-4">
              <CardHeader>
                <CardTitle>Account Closing</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={closeAccount}
                  className="bg-red-600 text-white"
                >
                  Close Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
