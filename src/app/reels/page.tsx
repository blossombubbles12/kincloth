import { getProducts } from "@/app/actions";
import { ReelsView } from "@/components/ReelsView";
import { MainLayout } from "@/components/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reels Mode | KinCloth",
  description: "Experience products in an immersive, full-screen video feed.",
};

export default async function ReelsPage() {
  const products = await getProducts(1, 50);

  return (
    <MainLayout hideHeader hideFooter products={products}>
      <ReelsView products={products} />
    </MainLayout>
  );
}
