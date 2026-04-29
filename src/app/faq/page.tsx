import { Metadata } from "next";
import { FAQView } from "@/components/FAQView";

export const metadata: Metadata = {
  title: "FAQ | Kincloth",
  description: "Frequently asked questions about Kincloth shipping, returns, and products.",
};

export default function FAQPage() {
  return <FAQView />;
}
