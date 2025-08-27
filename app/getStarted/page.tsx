"use client";

import { Hero } from "@/components/hero";
import { FeatureGrid } from "@/components/features";
import { PricingGrid } from "@/components/pricing";
import {
  Mic,
  MessageSquareText,
  Activity,
  Users,
  Database,
  ComponentIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GetStartedPage() {
  return (
    <main className="scroll-smooth">
      {/* Hero Section */}
      <Hero
        capsuleText="Vocalis features"
        capsuleLink="#vocalis"
        title="Get Started with Vocalis"
        subtitle="Follow these simple steps to set up your first event and start collecting feedback."
        primaryCtaText="Sign Up Free"
        primaryCtaLink="/getStarted#steps"
        secondaryCtaText="Sign In"
        secondaryCtaLink="/auth/signin"
        credits={
          <>
            Crafted with ❤️ by{" "}
            <a
              href="https://github.com/hariharans-dev"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              hariharans-dev
            </a>
          </>
        }
      />

      {/* Getting Started Steps */}
      <section
        id="steps"
        className="px-4 py-20 max-w-3xl mx-auto space-y-8 scroll-mt-20"
      >
        <h2 className="text-3xl font-bold text-center">
          Get Started in 5 Steps
        </h2>
        <p className="text-center text-muted-foreground text-lg">
          Set up your first event in minutes. Start free, and{" "}
          <Link href="#pricing">upgrade</Link> anytime as your events grow.
        </p>

        <ol className="list-decimal list-inside space-y-4 text-lg">
          <li>
            <span className="font-semibold">Sign Up:</span> Create your free
            account as an organizer.
          </li>
          <li>
            <span className="font-semibold">Create an Event:</span> Set up your
            first event from the dashboard.
          </li>
          <li>
            <span className="font-semibold">Invite Your Team:</span> Add members
            and assign roles for smooth collaboration.
          </li>
          <li>
            <span className="font-semibold">Share Links or QR Codes:</span> Let
            your audience send feedback instantly.
          </li>
          <li>
            <span className="font-semibold">Collect & Analyze:</span> Track
            feedback live. Upgrade to unlock deeper insights and advanced
            reporting.
          </li>
        </ol>

        <div className="flex flex-col md:flex-row gap-3 justify-center mt-8">
          <Button asChild>
            <Link href="/auth/signup">Start Free</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#pricing">View Plans</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="vocalis" className="pt-0 py-20 px-4 scroll-mt-0">
        <FeatureGrid
          title="Why Use Vocalis?"
          subtitle="Built for event organizers who want instant feedback and actionable insights."
          items={[
            {
              icon: <Mic className="h-12 w-12" />,
              title: "AI-Powered Voice Transcription",
              description:
                "Capture feedback instantly with accurate speech-to-text.",
            },
            {
              icon: <MessageSquareText className="h-12 w-12" />,
              title: "Text Feedback Analysis",
              description:
                "Discover audience sentiment and key themes with NLP.",
            },
            {
              icon: <Activity className="h-12 w-12" />,
              title: "Real-time Insights",
              description:
                "Live dashboards that track sentiment, engagement, and issues.",
            },
            {
              icon: <Users className="h-12 w-12" />,
              title: "Multi-Tenant & Secure",
              description:
                "Role-based access control for teams and organizations.",
            },
            {
              icon: <Database className="h-12 w-12" />,
              title: "Scalable Infrastructure",
              description:
                "Optimized with Redis & MySQL for large-scale events.",
            },
            {
              icon: <ComponentIcon className="h-12 w-12" />,
              title: "Customizable & Modular",
              description:
                "Adaptable to conferences, concerts, expos, and more.",
            },
          ]}
        />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pt-0 pb-20 px-4 scroll-mt-0">
        <PricingGrid
          title="Start Free, Upgrade Anytime"
          subtitle="Choose the right plan for your events."
          items={[
            {
              title: "Starter",
              price: "Free",
              description: "Perfect for individuals and small events.",
              features: [
                "Unlimited text feedback",
                "Up to 50 voice transcriptions/month",
                "Basic sentiment analysis",
                "Community support",
              ],
              buttonText: "Get Started Free",
              buttonHref: "/auth/signup",
            },
            {
              title: "Pro",
              price: "$29/mo",
              description: "For professional organizers and growing teams.",
              features: [
                "Unlimited text & voice feedback",
                "Advanced sentiment & trend analysis",
                "Custom dashboards & exports",
                "Priority support",
              ],
              buttonText: "Upgrade to Pro",
              isPopular: true,
              buttonHref: "/auth/signup",
            },
            {
              title: "Enterprise",
              price: "Custom",
              description: "Tailored solutions for large organizations.",
              features: [
                "Dedicated infrastructure",
                "On-prem deployment options",
                "Custom integrations (API, SSO, CRM)",
                "24/7 premium support",
              ],
              buttonText: "Contact Sales",
              buttonHref: "#",
            },
          ]}
        />
      </section>
    </main>
  );
}
