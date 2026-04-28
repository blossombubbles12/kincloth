import { getProducts } from "@/app/actions";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scrollcommerce.store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts(1, 100);
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/products/${product.id}`,
      lastModified: new Date(product.created_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // If products fetch fails, just return static routes
  }

  return [...staticRoutes, ...productRoutes];
}
