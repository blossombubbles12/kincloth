import { getProducts } from "@/app/actions";
import { ReelsView } from "@/components/ReelsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reels Mode | ScrollCommerce",
  description: "Experience products in an immersive, full-screen video feed.",
};

export default async function ReelsPage() {
  // Fetch a larger set for the reels experience
  const products = await getProducts(1, 50);

  return (
    <main style={{ backgroundColor: '#000', height: '100svh', overflow: 'hidden' }}>
      <ReelsView products={products} />
    </main>
  );
}
