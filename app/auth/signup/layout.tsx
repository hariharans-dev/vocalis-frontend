import { Footer } from "@/components/footer";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{props.children}</main>
      <Footer
        builtBy="hariharans-dev"
        builtByLink="https://github.com/hariharans-dev"
        githubLink="https://github.com/hariharans-dev"
        twitterLink=""
        linkedinLink=""
      />
    </div>
  );
}
