import { Footer } from "@/components/footer";
import { LandingPageHeader } from "@/components/landing-page-header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader
        items={[
          { title: "Home", href: "/" },
          { title: "Features", href: "/#features" },
        ]}
      />
      <main className="flex-1">{props.children}</main>
      <Footer
        builtBy="hariharans-dev"
        builtByLink="https://github.com/hariharans-dev"
        githubLink="https://github.com/hariharans-dev"
        twitterLink="https://x.com/hariharans_s"
        linkedinLink="https://www.linkedin.com/in/hariharan-s-562027226/"
      />
    </div>
  );
}
