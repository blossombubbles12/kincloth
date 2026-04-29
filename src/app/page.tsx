import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { HomeView } from "@/components/HomeView";

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeView />
    </>
  );
}
