import { FeatureGrid } from "@/components/features";
import { Hero } from "@/components/hero";
import { PricingGrid } from "@/components/pricing";
// import { stackServerApp } from "@/stack";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Activity,
  ComponentIcon,
  Database,
  MessageSquareText,
  Mic,
  Users,
} from "lucide-react";

export default async function IndexPage() {
  return (
    <>
      <Hero
        capsuleText="one time solution for event management"
        capsuleLink="https://stacktemplate.com"
        title="Vocalis - Event Feedback Manager"
        subtitle="Built for developers, by developers. Next.js + Shadcn UI + Stack Auth."
        primaryCtaText="Get Started"
        primaryCtaLink={""}
        secondaryCtaText="Documentation"
        secondaryCtaLink=""
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

      <div id="features" />
      <FeatureGrid
        title="Key Features"
        subtitle="Empowering event organizers with AI-driven voice & text feedback management."
        items={[
          {
            icon: <Mic className="h-12 w-12" />,
            title: "AI-Powered Voice Transcription",
            description:
              "Capture and transcribe event feedback in real-time using OpenAI Whisper.",
          },
          {
            icon: <MessageSquareText className="h-12 w-12" />,
            title: "Text Feedback Analysis",
            description:
              "Extract insights from attendee feedback with NLP-based sentiment analysis.",
          },
          {
            icon: <Activity className="h-12 w-12" />,
            title: "Real-time Event Insights",
            description:
              "Get instant metrics on audience sentiment and engagement trends.",
          },
          {
            icon: <Users className="h-12 w-12" />,
            title: "Multi-Tenancy & Access Control",
            description:
              "Enable event-specific feedback management with Role-Based Access Control (RBAC).",
          },
          {
            icon: <Database className="h-12 w-12" />,
            title: "Redis & MySQL",
            description:
              "Efficient message queuing and data storage for large-scale events.",
          },
          {
            icon: <ComponentIcon className="h-12 w-12" />,
            title: "Modular & Customizable",
            description:
              "Easily extend and adapt to various event types and audience needs.",
          },
        ]}
      />

      <div id="pricing" />
      <PricingGrid
        title="Pricing"
        subtitle="Flexible plans for every team."
        items={[
          {
            title: "Basic",
            price: "Free",
            description: "For individuals and small projects.",
            features: [
              "Full source code",
              "100% Open-source",
              "Community support",
              "Free forever",
              "No credit card required",
            ],
            buttonText: "Get Started",
            buttonHref: "https://google.com",
          },
          {
            title: "Pro",
            price: "$0.00",
            description: "Ideal for growing teams and businesses.",
            features: [
              "Full source code",
              "100% Open-source",
              "Community support",
              "Free forever",
              "No credit card required",
            ],
            buttonText: "Upgrade to Pro",
            isPopular: true,
            buttonHref: "https://google.com",
          },
          {
            title: "Enterprise",
            price: "Still Free",
            description: "For large organizations.",
            features: [
              "Full source code",
              "100% Open-source",
              "Community support",
              "Free forever",
              "No credit card required",
            ],
            buttonText: "Contact Us",
            buttonHref: "https://google.com",
          },
        ]}
      />
    </>
  );
}
