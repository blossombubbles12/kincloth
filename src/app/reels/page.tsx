import { getProducts } from "@/app/actions";
import { ReelsView } from "@/components/ReelsView";
import { MainLayout } from "@/components/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reels Mode | KinCloth",
  description: "Experience products in an immersive, full-screen video feed.",
};

import { Suspense } from "react";

export default async function ReelsPage() {
  const products = await getProducts(1, 50);

  return (
    <MainLayout hideHeader hideFooter hideMobileNav products={products}>
      <Suspense fallback={<div className="h-full flex items-center justify-center bg-black text-[#ffff00] font-black uppercase tracking-widest">Loading Reels...</div>}>
        <ReelsView products={products} />
      </Suspense>
    </MainLayout>
  );
}
