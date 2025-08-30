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
import { motion } from "framer-motion";

export default function AppAdminLanding() {
  const router = useRouter();

  const features = [
    {
      icon: Activity,
      title: "Monitor the System",
      description:
        "Track system health, performance metrics, and ensure smooth operations in real-time.",
    },
    {
      icon: Layers,
      title: "Create Subscription Models",
      description:
        "Define new subscription plans with flexible limits, pricing, and features.",
    },
    {
      icon: FileEdit,
      title: "Maintain Subscriptions",
      description:
        "Update, edit, or retire existing subscription models to keep offerings current.",
    },
    {
      icon: CheckCircle,
      title: "Approve Pending Payments",
      description:
        "Verify and approve payment requests for customer subscriptions securely.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "Assist customers with issues related to subscriptions, payments, and account access.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="px-4 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium tracking-wide">
            AppAdmin Console
          </span>
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to the Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage system health, subscriptions, payments, and customer
            interactions from a single, secure dashboard.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Button size="lg" onClick={() => router.push("/appadmin/signin")}>
              Sign In to Continue
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Back to Landing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-bold">AppAdmin Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tools and controls available to AppAdmins for managing the platform.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="p-8 text-center flex flex-col items-center space-y-4 hover:shadow-xl rounded-2xl border border-muted">
                <div className="p-4 rounded-full bg-primary/10 text-primary w-fit">
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
