import { DesktopLayout } from "@/components/DesktopLayout";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

// Products are loaded client-side to avoid SSR hanging on localhost fetches.
export default function Home() {
  return (
    <main className="h-[100svh] w-full overflow-hidden" style={{ background: 'var(--background)' }}>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <DesktopLayout initialProducts={[]} />
    </main>
  );
}
