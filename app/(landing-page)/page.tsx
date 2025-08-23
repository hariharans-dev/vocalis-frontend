import { FeatureGrid } from "@/components/features";
import { Hero } from "@/components/hero";
import { PricingGrid } from "@/components/pricing";
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
        capsuleText="Your all-in-one event feedback platform"
        capsuleLink="#features"
        title="Vocalis – Real-time Event Feedback Manager"
        subtitle="Transform voice and text feedback into actionable insights. Powered by AI, built for organizers who care about customer experience."
        primaryCtaText="Get Started Free"
        primaryCtaLink="#pricing"
        secondaryCtaText="View on GitHub"
        secondaryCtaLink="https://github.com/hariharans-dev"
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
        title="Why Choose Vocalis?"
        subtitle="Empowering event organizers with AI-driven voice & text feedback management."
        items={[
          {
            icon: <Mic className="h-12 w-12" />,
            title: "AI-Powered Voice Transcription",
            description:
              "Capture reporter feedback instantly with accurate speech-to-text technology.",
          },
          {
            icon: <MessageSquareText className="h-12 w-12" />,
            title: "Text Feedback Analysis",
            description:
              "Discover audience sentiment and key topics with advanced NLP algorithms.",
          },
          {
            icon: <Activity className="h-12 w-12" />,
            title: "Real-time Insights",
            description:
              "Live dashboards that track sentiment, engagement, and issues as they happen.",
          },
          {
            icon: <Users className="h-12 w-12" />,
            title: "Multi-Tenant & Secure",
            description:
              "Role-based access control for teams and organizations running multiple events.",
          },
          {
            icon: <Database className="h-12 w-12" />,
            title: "Scalable Infrastructure",
            description:
              "Optimized with Redis & MySQL to handle large-scale, high-volume events seamlessly.",
          },
          {
            icon: <ComponentIcon className="h-12 w-12" />,
            title: "Customizable & Modular",
            description:
              "Adapt Vocalis to fit conferences, concerts, expos, or any audience-driven event.",
          },
        ]}
      />

      <div id="pricing" />
      <PricingGrid
        title="Simple, Transparent Pricing"
        subtitle="Start free, scale as your events grow."
        items={[
          {
            title: "Starter",
            price: "Free",
            description: "Perfect for individuals and small community events.",
            features: [
              "Unlimited text feedback",
              "Up to 50 voice transcriptions/month",
              "Basic sentiment analysis",
              "Community support",
            ],
            buttonText: "Get Started Free",
            buttonHref: "#",
          },
          {
            title: "Pro",
            price: "$29/mo",
            description:
              "Best for professional event organizers and growing teams.",
            features: [
              "Unlimited text & voice feedback",
              "Advanced sentiment & trend analysis",
              "Custom dashboards & exports",
              "Priority email support",
            ],
            buttonText: "Upgrade to Pro",
            isPopular: true,
            buttonHref: "#",
          },
          {
            title: "Enterprise",
            price: "Custom",
            description:
              "Tailored solutions for large organizations and high-scale events.",
            features: [
              "Dedicated infrastructure",
              "On-premise deployment options",
              "Custom integrations (API, SSO, CRM)",
              "24/7 premium support",
            ],
            buttonText: "Contact Sales",
            buttonHref: "#",
          },
        ]}
      />
    </>
  );
}
