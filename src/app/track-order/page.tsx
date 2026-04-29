import { Metadata } from "next";
import { TrackOrderView } from "@/components/TrackOrderView";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Kincloth order status and shipment updates.",
};

export default function TrackOrderPage() {
  return <TrackOrderView />;
}
