'use client';

import { Product } from "@/lib/types";

interface ProductJsonLdProps {
  product: Product & { images?: string[] };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scrollcommerce.store";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Premium ${product.name} available at Kincloth.`,
    image: product.thumbnail_url
      ? [product.thumbnail_url, ...(product.images || [])]
      : [],
    brand: {
      "@type": "Brand",
      name: product.brand || "Kincloth",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Kincloth",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Alex M." },
        reviewBody: "Absolutely premium quality. The packaging was immaculate and delivery was lightning fast.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scrollcommerce.store";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kincloth",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: "Discover curated premium products with a TikTok-style scroll feed.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@scrollcommerce.store",
    },
    sameAs: [
      "https://twitter.com/scrollcommerce",
      "https://instagram.com/scrollcommerce",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scrollcommerce.store";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kincloth",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
