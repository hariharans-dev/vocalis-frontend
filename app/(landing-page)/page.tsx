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
        primaryCtaLink="/getStarted"
        secondaryCtaText="View on GitHub"
        secondaryCtaLink="https://github.com/hariharans-dev/vocalis-frontend"
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
    </>
  );
}
