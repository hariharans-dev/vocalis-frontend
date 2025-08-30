"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Layers,
  FileEdit,
  CheckCircle,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppAdminLanding() {
  const router = useRouter();

  const features = [
    {
      icon: <Activity className="h-12 w-12 text-primary" />,
      title: "Monitor the System",
      description:
        "Track system health, performance metrics, and ensure smooth operations in real-time.",
    },
    {
      icon: <Layers className="h-12 w-12 text-primary" />,
      title: "Create Subscription Models",
      description:
        "Define new subscription plans with flexible limits, pricing, and features.",
    },
    {
      icon: <FileEdit className="h-12 w-12 text-primary" />,
      title: "Maintain Subscriptions",
      description:
        "Update, edit, or retire existing subscription models to keep offerings current.",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Approve Pending Payments",
      description:
        "Verify and approve payment requests for customer subscriptions securely.",
    },
    {
      icon: <Headphones className="h-12 w-12 text-primary" />,
      title: "Customer Support",
      description:
        "Assist customers with issues related to subscriptions, payments, and account access.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to the AppAdmin Console
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage system health, subscriptions, payments, and customer
          interactions from a single, secure dashboard.
        </p>
        <Button
          size="lg"
          className="mt-4"
          onClick={() => router.push("/appadmin/signin")}
        >
          Sign In to Continue
        </Button>
      </section>

      {/* Features Grid */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          AppAdmin Capabilities
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Tools and controls available to AppAdmins for managing the platform.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center flex flex-col items-center space-y-4 hover:shadow-lg transition"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
